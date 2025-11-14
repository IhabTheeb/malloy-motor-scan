import React from 'react';
import type { NormalizedNameplate, SearchResult } from '../types';
import { Card } from '../components/Card';
import { ResultsList } from '../components/ResultsList';

interface Props {
  scan: NormalizedNameplate;
  results: SearchResult[];
  onBack: () => void;
  onApply: (updatedScan: NormalizedNameplate) => void;
}

// When user confirms "this is the motor", copy ID + spec fields from catalog
function applyMatch(
  scan: NormalizedNameplate,
  result: SearchResult
): NormalizedNameplate {
  return {
    ...scan,
    // PRIMARY ID FIELDS
    catalogNumber: result.catalogNumber ?? result.sku,
    partNumber: result.partNumber,
    specNumber: result.specNumber,
    modelNumber: result.modelNumber,
    buildNumber: result.buildNumber,
    modNumber: result.modNumber,

    // UNIVERSAL SPECS
    hp: result.hp != null ? String(result.hp) : scan.hp,
    rpm: result.rpm != null ? String(result.rpm) : scan.rpm,
    frame: result.frame ?? scan.frame,
    voltage: result.voltage ?? scan.voltage,
    enclosure: result.enclosure ?? scan.enclosure,
    manufacturer: result.manufacturer || scan.manufacturer,
  };
}

export const ResultsScreen: React.FC<Props> = ({
  scan,
  results,
  onBack,
  onApply,
}) => {
  const [selectedSku, setSelectedSku] = React.useState<string | null>(null);

  const selectedResult = selectedSku
    ? results.find(r => r.sku === selectedSku) ?? null
    : null;

  const handleApply = () => {
    if (!selectedResult) return;
    const updated = applyMatch(scan, selectedResult);
    onApply(updated); // App will move to Email step
  };

  return (
    <Card
      title="Search results"
      subtitle="Select the motor that best matches the nameplate. Its IDs and specs will replace the scan values for the email."
      right={<span className="badge">Step 3 of 4</span>}
    >
      <ResultsList
        results={results}
        selectedSku={selectedSku}
        onSelect={setSelectedSku}
      />

      <div className="flex gap-16 mt-16">
        <button className="btn btn-secondary" type="button" onClick={onBack}>
          Back
        </button>
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleApply}
          disabled={!selectedResult}
        >
          Use selected motor to update specs &amp; continue
        </button>
      </div>
    </Card>
  );
};
