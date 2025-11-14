import Tesseract from 'tesseract.js';
import type { OcrBlock } from './typesInternal';

export async function runOcrOnImage(imageDataUrl: string): Promise<OcrBlock> {
  const { data } = await Tesseract.recognize(imageDataUrl, 'eng', {
    tessedit_char_whitelist:
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz./-:()# ',
    logger: m => {
      if (m.status === 'recognizing text') {
        console.log(
          `OCR progress: ${Math.round((m.progress || 0) * 100)}%`
        );
      }
    },
  });

  console.log('OCR RAW TEXT:', data.text);

  const rawText = (data.text || '').toUpperCase();

  const lines =
    data.lines?.map((ln: any) => ({
      text: (ln.text || '').toUpperCase(),
      confidence: ((ln.confidence ?? data.confidence ?? 70) as number) / 100,
    })) ?? [];

  const avgConfidence =
    lines.length === 0
      ? ((data.confidence ?? 70) as number) / 100
      : lines.reduce((sum, l) => sum + (l.confidence ?? 0.7), 0) /
        lines.length;

  return {
    rawText,
    lines,
    avgConfidence,
  };
}
