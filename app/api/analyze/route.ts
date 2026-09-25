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

    // Retry logic for rate limits
    let interaction;
    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        interaction = await ai.interactions.create({
          model: 'gemini-2.5-flash',
          input: prompt,
          response_format: {
            type: 'text',
            mime_type: 'application/json',
          },
        });
        break; // Success — exit retry loop
      } catch (err: any) {
        lastError = err;
        const errMsg = err.message || '';
        // If rate limited, wait and retry
        if (errMsg.includes('429') || errMsg.includes('rate limit')) {
          console.log(`Rate limited. Retry attempt ${attempt + 1}/3...`);
          await new Promise((r) => setTimeout(r, 15000)); // wait 15s
        } else {
          throw err; // Different error — fail fast
        }
      }
    }

        if (!interaction) {
      throw lastError || new Error('Analysis failed after retries');
    }

    const raw = interaction.output_text || '';