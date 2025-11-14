import React from 'react';
import type { NormalizedNameplate } from '../types';

interface Props {
  value: NormalizedNameplate;
  onChange: (v: NormalizedNameplate) => void;
}

export const NameplateForm: React.FC<Props> = ({ value, onChange }) => {
  const update = (field: keyof NormalizedNameplate, v: string) => {
    onChange({ ...value, [field]: v });
  };

  return (
    <>
      <div className="form-grid">
        <div className="form-field">
          <label>Catalog #</label>
          <input
            value={value.catalogNumber ?? ''}
            onChange={e => update('catalogNumber', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Spec #</label>
          <input
            value={value.specNumber ?? ''}
            onChange={e => update('specNumber', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Horsepower (HP)</label>
          <input
            value={value.hp ?? ''}
            onChange={e => update('hp', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Speed (RPM)</label>
          <input
            value={value.rpm ?? ''}
            onChange={e => update('rpm', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Frame</label>
          <input
            value={value.frame ?? ''}
            onChange={e => update('frame', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Enclosure</label>
          <input
            value={value.enclosure ?? ''}
            onChange={e => update('enclosure', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Armature volts</label>
          <input
            value={value.armVolts ?? ''}
            onChange={e => update('armVolts', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Field volts</label>
          <input
            value={value.fieldVolts ?? ''}
            onChange={e => update('fieldVolts', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Serial #</label>
          <input
            value={value.serialNumber ?? ''}
            onChange={e => update('serialNumber', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Manufacturer</label>
          <input
            value={value.manufacturer ?? ''}
            onChange={e => update('manufacturer', e.target.value)}
          />
        </div>
      </div>
    </>
  );
};
