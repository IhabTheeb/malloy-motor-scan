import React from 'react';
import type { Step } from '../types';

interface SubnavTabsProps {
  step: Step;
}

const labels: Record<Step, string> = {
  capture: 'Capture',
  ocr: 'OCR',
  search: 'Search',
  email: 'Email',
};

export const SubnavTabs: React.FC<SubnavTabsProps> = ({ step }) => {
  const steps: Step[] = ['capture', 'ocr', 'search', 'email'];

  return (
    <div className="shell-subnav">
      {steps.map(s => (
        <div
          key={s}
          className={
            'shell-subnav-tab' + (s === step ? ' shell-subnav-tab-active' : '')
          }
        >
          {labels[s]}
        </div>
      ))}
    </div>
  );
};
