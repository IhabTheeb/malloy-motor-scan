import React from 'react';
import type { SearchResult } from '../types';

interface Props {
  results: SearchResult[];
  selectedSku?: string | null;
  onSelect: (sku: string | null) => void;
}

export const ResultsList: React.FC<Props> = ({
  results,
  selectedSku,
  onSelect,
}) => {
  if (!results.length) {
    return (
      <div style={{ marginTop: 12, fontSize: 13, color: '#b0b0b0' }}>
        No matches found. You can still e-mail the specs and photo for manual
        identification.
      </div>
    );
  }

  return (
    <div className="results-list">
      {results.map(r => {
        const isSelected = r.sku === selectedSku;
        const handleToggle = () => {
          onSelect(isSelected ? null : r.sku);
        };

        return (
          <div
            key={r.sku}
            className="result-item"
            style={{
              borderColor: isSelected ? '#c93950' : undefined,
              boxShadow: isSelected
                ? '0 0 0 1px rgba(201,57,80,0.7)'
                : undefined,
              background: isSelected ? '#4a2a32' : undefined,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                flex: 1,
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'pointer',
                  paddingTop: 2,
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={handleToggle}
                  style={{ accentColor: '#c93950', width: 16, height: 16 }}
                />
              </label>

              <div className="result-main">
                <div className="result-title">
                  {r.sku} – {r.manufacturer}
                </div>
                <div className="result-meta">{r.description}</div>
                <div className="result-meta">
                  {r.catalogNumber && `Cat: ${r.catalogNumber} · `}
                  {r.partNumber && `Part: ${r.partNumber} · `}
                  {r.specNumber && `Spec: ${r.specNumber}`}
                </div>
                <div className="result-meta">
                  {r.hp && `${r.hp} HP · `}
                  {r.rpm && `${r.rpm} RPM · `}
                  {r.frame && `Frame ${r.frame} · `}
                  {r.voltage && `${r.voltage}`}
                  {r.enclosure && ` · ${r.enclosure}`}
                </div>
                <div className="result-meta">
                  Stock:{' '}
                  {r.stockByLocation
                    .map(s => `${s.location}: ${s.qty}`)
                    .join(', ')}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right', fontSize: 13 }}>
              <div>${r.price.toFixed(2)}</div>
              <div style={{ color: '#b0b0b0', marginTop: 4 }}>
                Score: {Math.round(r.matchScore * 100)}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
