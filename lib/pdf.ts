import { extractText, getDocumentProxy } from 'unpdf';

export async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  return text;
}

export async function extractTextFromFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();

  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    return await extractPdfText(buffer);
  }

  if (
    file.type === 'text/plain' ||
    file.name.endsWith('.txt') ||
    file.name.endsWith('.md')
  ) {
    return new TextDecoder().decode(buffer);
  }

  throw new Error('Please upload a PDF or TXT file. DOCX support coming soon.');
}