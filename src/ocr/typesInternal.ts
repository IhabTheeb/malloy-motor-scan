export interface OcrLine {
  text: string;
  confidence: number; // 0–1
}

export interface OcrBlock {
  rawText: string;
  lines: OcrLine[];
  avgConfidence: number; // 0–1
}
