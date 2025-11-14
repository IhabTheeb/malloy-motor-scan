import React from 'react';
import type { Step } from '../types';

interface StepBarProps {
  step: Step;
}

const steps: { id: Step; label: string; index: number }[] = [
  { id: 'capture', label: 'Capture', index: 1 },
  { id: 'ocr', label: 'OCR', index: 2 },
  { id: 'search', label: 'Search', index: 3 },
  { id: 'email', label: 'Email', index: 4 },
];

export const StepBar: React.FC<StepBarProps> = ({ step }) => {
  return (
    <div className="shell-stepper">
      <div className="shell-stepper-inner">
        {steps.map((s, i) => {
          const isActive = s.id === step;
          return (
            <React.Fragment key={s.id}>
              <div
                className={
                  'shell-step-pill' + (isActive ? ' shell-step-pill-active' : '')
                }
              >
                <span className="shell-step-index">{s.index}.</span>
                <span className="shell-step-label">{s.label}</span>
              </div>
              {i < steps.length - 1 && <span className="shell-step-arrow">→</span>}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
