export interface NormalizedNameplate {
  // PRIMARY ID FIELDS (used for search)
  catalogNumber?: string;  // catalog #
  partNumber?: string;     // part #
  specNumber?: string;     // spec #
  modelNumber?: string;    // model #
  buildNumber?: string;    // build #
  modNumber?: string;      // mod #

  // UNIVERSAL SPECS (for context)
  hp?: string;
  rpm?: string;
  frame?: string;
  enclosure?: string;
  voltage?: string;
  manufacturer?: string;

  // Extra DC details if you ever want them
  typeCode?: string;
  armVolts?: string;
  armAmps?: string;
  fieldVolts?: string;
  fieldAmps?: string;

  serialNumber?: string;
  bearings?: string[];
  brushCode?: string;

  rawText?: string;
  confidence?: number;
  imageDataUrl?: string;
}

export interface SearchResult {
  sku: string;

  // ID fields we can map back into the scan
  catalogNumber?: string;
  partNumber?: string;
  specNumber?: string;
  modelNumber?: string;
  buildNumber?: string;
  modNumber?: string;

  // universal specs
  hp?: number;
  rpm?: number;
  frame?: string;
  voltage?: string;
  manufacturer: string;
  enclosure?: string;

  description: string;
  price: number;
  matchScore: number;

  stockByLocation: {
    location: string;
    qty: number;
  }[];
}

export type Step = 'capture' | 'ocr' | 'search' | 'email';



export type OcrStatus =
  | 'idle'
  | 'detecting-plate'
  | 'capturing'
  | 'processing'
  | 'done'
  | 'error';
