import React from 'react';
import type { NormalizedNameplate } from '../types';
import { Card } from '../components/Card';
import { NameplateForm } from '../components/NameplateForm';

interface Props {
  scan: NormalizedNameplate;
  onBack: () => void;
  onSearch: (scan: NormalizedNameplate) => void;
}


export const ReviewScreen: React.FC<Props> = ({ scan, onBack, onSearch }) => {
  const [local, setLocal] = React.useState<NormalizedNameplate>(scan);

  const update = (field: keyof NormalizedNameplate, value: string) => {
    setLocal(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => onSearch(local);

  return (
    <Card
      title="Confirm motor details"
      subtitle="Edit anything that looks off. ID fields are used to search for the exact motor."
      right={<span className="badge">Step 2 of 4</span>}
    >
      {/* main ID fields */}
      <div className="form-grid">
        <div className="form-field">
          <label>Catalog #</label>
          <input
            value={local.catalogNumber ?? ''}
            onChange={e => update('catalogNumber', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Part #</label>
          <input
            value={local.partNumber ?? ''}
            onChange={e => update('partNumber', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Spec #</label>
          <input
            value={local.specNumber ?? ''}
            onChange={e => update('specNumber', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Model #</label>
          <input
            value={local.modelNumber ?? ''}
            onChange={e => update('modelNumber', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Build #</label>
          <input
            value={local.buildNumber ?? ''}
            onChange={e => update('buildNumber', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Mod #</label>
          <input
            value={local.modNumber ?? ''}
            onChange={e => update('modNumber', e.target.value)}
          />
        </div>
      </div>

      {/* universal specs (secondary) */}
      <div className="form-grid mt-16">
        <div className="form-field">
          <label>Horsepower (HP)</label>
          <input
            value={local.hp ?? ''}
            onChange={e => update('hp', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Speed (RPM)</label>
          <input
            value={local.rpm ?? ''}
            onChange={e => update('rpm', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Frame</label>
          <input
            value={local.frame ?? ''}
            onChange={e => update('frame', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Enclosure</label>
          <input
            value={local.enclosure ?? ''}
            onChange={e => update('enclosure', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Voltage</label>
          <input
            value={local.voltage ?? ''}
            onChange={e => update('voltage', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Manufacturer</label>
          <input
            value={local.manufacturer ?? ''}
            onChange={e => update('manufacturer', e.target.value)}
          />
        </div>
      </div>

      {/* raw OCR text etc as you already had */}

      <div className="flex gap-16 mt-16">
        <button className="btn btn-secondary" type="button" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-primary" type="button" onClick={handleContinue}>
          Search motors
        </button>
      </div>
    </Card>
  );
};

