export interface ParsedFields {
  hp?: string;
  rpm?: string;
  frame?: string;
  catalogNumber?: string;
  specNumber?: string;
  typeCode?: string;
  enclosure?: string;
  armVolts?: string;
  armAmps?: string;
  fieldVolts?: string;
  fieldAmps?: string;
  voltage?: string;
  manufacturer?: string;
  serialNumber?: string;
  bearings?: string[];
  brushCode?: string;
  rawText: string;
  ocrConfidence: number;
}

function normalizeRaw(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[\|\[\]\(\)\/\\,:;“”"'=+©»—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function get(text: string, regex: RegExp): string | undefined {
  const m = text.match(regex);
  return m ? m[1].trim() : undefined;
}

export function parseMotorFields(ocr: any): ParsedFields {
  const raw = String(ocr.rawText || '');
  const text = normalizeRaw(raw);

  const fields: ParsedFields = {
    rawText: raw,
    ocrConfidence: Math.round((ocr.avgConfidence ?? 0) * 100),
  };

  // high-value identifiers
  fields.catalogNumber =
    get(text, /CAT\.?\s*NO\.?\s*([A-Z0-9\-]{3,})/) ||
    get(text, /CATALOG\.?\s*NO\.?\s*([A-Z0-9\-]{3,})/);

  fields.specNumber = get(text, /SPEC\.?\s*([A-Z0-9\-]+)/);

  fields.serialNumber =
    get(text, /SER\.?\s*#\s*([A-Z0-9\-]+)/) ||
    get(text, /SERIAL\.?\s*NO\.?\s*([A-Z0-9\-]+)/);

  const bearingMatches = [...text.matchAll(/\b(62[0-9]{2})\b/g)];
  if (bearingMatches.length) {
    fields.bearings = bearingMatches.map(m => m[1]);
  }

  if (text.includes('BALDOR')) fields.manufacturer = 'BALDOR-RELIANCE';
  else if (text.includes('RELIANCE')) fields.manufacturer = 'RELIANCE';
  else if (text.includes('WEG')) fields.manufacturer = 'WEG';
  else if (text.includes('SIEMENS')) fields.manufacturer = 'SIEMENS';

  // comfort fields (user can correct)
  fields.hp =
    get(text, /\bHP\.?\s*([0-9.]+)/) ||
    get(text, /\bH\.?P\.?\s*([0-9.]+)/);

  fields.rpm =
    get(text, /R\.?P\.?M\.?\s*([0-9]{3,5})/) ||
    get(text, /\bRPM\s*([0-9]{3,5})/);

  fields.frame = get(text, /FRAME\s*([0-9]{2,4}[A-Z]{0,2})/);

  fields.enclosure = get(text, /ENCL\.?\s*([A-Z0-9]+)/);
  fields.typeCode = get(text, /TYPE\s*([A-Z0-9]+)/);

  fields.armVolts =
    get(text, /ARM\s+VOLTS?\s*([0-9/]+)/) ||
    get(text, /\bARM\s+([0-9/]{3,})\b/);

  fields.armAmps =
    get(text, /ARM\s+AMPS?\s*([0-9.\/]+)/) ||
    get(text, /ARM\s+[0-9/]+\s+([0-9.\/]+)/);

  fields.fieldVolts =
    get(text, /FIELD\s+VOLTS?\s*([0-9/]+)/) ||
    get(text, /\bFIELD\s+([0-9/]{3,})\b/);

  fields.fieldAmps =
    get(text, /FIELD\s+AMPS?\s*([0-9.\/]+)/) ||
    get(text, /FIELD\s+[0-9/]+\s+([0-9.\/]+)/);

  fields.voltage = fields.fieldVolts || fields.armVolts;

  fields.brushCode = get(text, /BRUSH\s*([A-Z0-9\/]+)/);

  return fields;
}
