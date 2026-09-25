import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { extractTextFromFile } from '@/lib/pdf';
import { ATS_PROMPT } from '@/lib/prompts';

export const runtime = 'nodejs';
export const maxDuration = 60;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  vertexai: false,
});

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('resume') as File | null;
    const jd = form.get('jd') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'Resume file is required' }, { status: 400 });
    }
    if (!jd || jd.trim().length < 50) {
      return NextResponse.json(
        { error: 'Job description must be at least 50 characters' },
        { status: 400 }
      );
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    const resumeText = await extractTextFromFile(file);
    if (resumeText.trim().length < 100) {
      return NextResponse.json(
        { error: 'Could not extract text. Is this a scanned PDF?' },
        { status: 400 }
      );
    }

    const prompt = ATS_PROMPT
      .replace('{{RESUME}}', resumeText.slice(0, 12000))
      .replace('{{JD}}', jd.slice(0, 6000));

    // Fallback model chain — try each model 2x before moving to the next
    const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    let interaction;
    let lastError;

    for (const modelName of MODELS) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          console.log(`Trying model: ${modelName} (attempt ${attempt + 1})`);
          interaction = await ai.interactions.create({
            model: modelName,
            input: prompt,
            response_format: {
              type: 'text',
              mime_type: 'application/json',
            },
          });
          console.log(`✓ Success with model: ${modelName}`);
          break;
        } catch (err: any) {
          lastError = err;
          const errMsg = err.message || '';
          console.log(`✗ Model ${modelName} failed: ${errMsg.slice(0, 150)}`);

          if (errMsg.includes('429') || errMsg.includes('rate limit')) {
            await new Promise((r) => setTimeout(r, 5000));
          } else {
            break; // Non-rate-limit error → try next model
          }
        }
      }
      if (interaction) break; // Success → stop trying models
    }

    if (!interaction) {
      throw lastError || new Error('All Gemini models failed. Please try again in a minute.');
    }

    const raw = interaction.output_text || '';

    console.log('=== RESPONSE LENGTH ===', raw.length);
    console.log('=== RAW RESPONSE (first 500 chars) ===');
    console.log(raw.slice(0, 500));
    console.log('=== END RAW ===');

    let cleaned = raw.trim();
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      const lastBrace = cleaned.lastIndexOf('}');
      if (lastBrace > 0) {
        parsed = JSON.parse(cleaned.slice(0, lastBrace + 1));
      } else {
        console.error('Raw that failed to parse:', cleaned);
        throw new Error('AI returned malformed JSON. Please try again.');
      }
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error('Analyze error:', err);
    return NextResponse.json(
      { error: err.message || 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}