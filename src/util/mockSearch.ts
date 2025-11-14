import type { NormalizedNameplate, SearchResult } from '../types';

const CATALOG: SearchResult[] = [
  {
    sku: 'CD6215-BALDOR',
    catalogNumber: 'CD6215',
    partNumber: '36-5257Z106',
    specNumber: '36-5257Z106',
    modelNumber: '3636D',
    buildNumber: '184C',
    modNumber: 'TEFC',
    hp: 1.5,
    rpm: 1750,
    frame: '184C',
    voltage: '180V ARM 200/100 FIELD',
    enclosure: 'TEFC',
    manufacturer: 'BALDOR RELIANCE',
    description: 'Baldor DC industrial motor 1.5HP 1750RPM 184C TEFC',
    price: 1234.5,
    matchScore: 0.96,
    stockByLocation: [
      { location: 'Sioux Falls', qty: 2 },
      { location: 'Cedar Rapids', qty: 1 },
    ],
  },
  {
    sku: 'CD6215-REMAN',
    catalogNumber: 'CD6215',
    partNumber: '36-5257Z106-R',
    specNumber: '36-5257Z106',
    modelNumber: '3636D',
    buildNumber: '184C',
    modNumber: 'REM',
    hp: 1.5,
    rpm: 1750,
    frame: '184C',
    voltage: '180V ARM 200/100 FIELD',
    enclosure: 'TEFC',
    manufacturer: 'BALDOR RELIANCE',
    description: 'CD6215 remanufactured DC motor',
    price: 890,
    matchScore: 0.88,
    stockByLocation: [{ location: 'Fargo', qty: 3 }],
  },
  {
    sku: 'WEG-CDF300',
    catalogNumber: 'CDF300',
    partNumber: 'CF-300-TEFC',
    specNumber: 'CF-300-01',
    modelNumber: 'CDF300-184T',
    buildNumber: '184T',
    modNumber: 'MOD01',
    hp: 300,
    rpm: 1785,
    frame: '449T',
    voltage: '460V',
    enclosure: 'TEFC',
    manufacturer: 'WEG',
    description: 'WEG 300HP 1785RPM 449T TEFC',
    price: 11800,
    matchScore: 0.72,
    stockByLocation: [
      { location: 'Fargo', qty: 2 },
      { location: 'Sioux Falls', qty: 1 },
    ],
  },
  {
    sku: 'ABB-M3BP-75KW',
    catalogNumber: 'M3BP315MLB',
    partNumber: '3GBA315410-ADA',
    specNumber: 'M3BP315',
    modelNumber: 'M3BP 315MLB 4',
    buildNumber: '315MLB',
    modNumber: 'IP55',
    hp: 100,
    rpm: 1480,
    frame: '315M',
    voltage: '400/690V',
    enclosure: 'IP55',
    manufacturer: 'ABB',
    description: 'ABB IEC motor 75kW 1480RPM 315M IP55',
    price: 7600,
    matchScore: 0.65,
    stockByLocation: [{ location: 'Cedar Rapids', qty: 1 }],
  },
  {
    sku: 'SIEMENS-1LE2-040',
    catalogNumber: '1LE2043-4AB52',
    partNumber: '1LE2043-4AB52-Z',
    specNumber: '1LE2',
    modelNumber: '1LE2043-4AB52',
    buildNumber: '284T',
    modNumber: 'XP',
    hp: 40,
    rpm: 1780,
    frame: '284T',
    voltage: '460V',
    enclosure: 'XP',
    manufacturer: 'SIEMENS',
    description: 'Siemens 40HP XP motor 284T 460V',
    price: 4200,
    matchScore: 0.6,
    stockByLocation: [{ location: 'Sioux Falls', qty: 1 }],
  },
  // add a bunch of extra dummy rows for testing
  ...Array.from({ length: 30 }).map((_, i) => ({
    sku: `TEST-${1000 + i}`,
    catalogNumber: `CAT${1000 + i}`,
    partNumber: `PRT${1000 + i}`,
    specNumber: `SPC${1000 + i}`,
    modelNumber: `MDL${1000 + i}`,
    buildNumber: `BLD${1000 + i}`,
    modNumber: `MOD${1000 + i}`,
    hp: 10 + (i % 5) * 5,
    rpm: 1750,
    frame: '184T',
    voltage: '460V',
    enclosure: 'TEFC',
    manufacturer: i % 2 === 0 ? 'BALDOR' : 'WEG',
    description: `Test motor ${1000 + i} for UI load testing`,
    price: 1000 + i * 10,
    matchScore: 0.3,
    stockByLocation: [{ location: 'Test', qty: i % 4 }],
  })),
];

function normalizedIncludes(haystack?: string, needle?: string) {
  if (!haystack || !needle) return false;
  const h = haystack.toUpperCase();
  const n = needle.toUpperCase();
  return h.includes(n);
}

/**
 * Simple mock search:
 * - priority match on catalog/part/spec/model/build/mod
 * - if nothing provided, returns first 10 rows
 */
export async function mockSearch(
  scan: NormalizedNameplate
): Promise<SearchResult[]> {
  const queryFields = [
    scan.catalogNumber,
    scan.partNumber,
    scan.specNumber,
    scan.modelNumber,
    scan.buildNumber,
    scan.modNumber,
  ].filter(Boolean) as string[];

  if (!queryFields.length) {
    return CATALOG.slice(0, 10);
  }

  const results: SearchResult[] = [];

  for (const item of CATALOG) {
    let scoreBoost = 0;

    for (const q of queryFields) {
      if (normalizedIncludes(item.catalogNumber, q)) scoreBoost += 0.4;
      if (normalizedIncludes(item.partNumber, q)) scoreBoost += 0.4;
      if (normalizedIncludes(item.specNumber, q)) scoreBoost += 0.3;
      if (normalizedIncludes(item.modelNumber, q)) scoreBoost += 0.3;
      if (normalizedIncludes(item.buildNumber, q)) scoreBoost += 0.2;
      if (normalizedIncludes(item.modNumber, q)) scoreBoost += 0.1;
    }

    if (scoreBoost > 0) {
      results.push({ ...item, matchScore: Math.min(1, item.matchScore + scoreBoost) });
    }
  }

  return results
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10);
}
