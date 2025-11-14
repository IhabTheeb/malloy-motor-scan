import React from 'react';
import type { Step, NormalizedNameplate, SearchResult } from './types';
import { AppHeader } from './components/AppHeader';
import { StepBar } from './components/StepBar';

import { ScanScreen } from './screens/ScanScreen';
import { ReviewScreen } from './screens/ReviewScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { EmailPreviewScreen } from './screens/EmailPreviewScreen';
import { mockSearch } from './util/mockSearch';

const App: React.FC = () => {
  const [step, setStep] = React.useState<Step>('capture');
  const [scan, setScan] = React.useState<NormalizedNameplate | null>(null);
  const [results, setResults] = React.useState<SearchResult[]>([]);

  const resetAll = () => {
    setScan(null);
    setResults([]);
    setStep('capture');
  };

  const handleScanComplete = (normalized: NormalizedNameplate) => {
    setScan(normalized);
    setStep('ocr');
  };

  const handleOcrConfirm = async (updatedScan: NormalizedNameplate) => {
    setScan(updatedScan);
    const res = await mockSearch(updatedScan);
    setResults(res);
    setStep('search');
  };

  const handleApplyMatchAndGoEmail = (updatedScan: NormalizedNameplate) => {
    setScan(updatedScan);
    setStep('email');
  };

  return (
    <div className="app-root">
      
      {/* ⭐ CENTERED HEADER */}
      <div className="app-content-wrapper">
        <AppHeader onHistoryClick={() => alert('History not wired yet.')} />
      </div>

      {/* ⭐ CENTERED STEPPER */}
      <div className="app-content-wrapper">
        <StepBar step={step} />
      </div>

      {/* ⭐ MAIN CONTENT CENTERED */}
      <main className="app-main">
        <div className="app-main-inner">
          {step === 'capture' && (
            <ScanScreen onScanComplete={handleScanComplete} />
          )}

          {step === 'ocr' && scan && (
            <ReviewScreen
              scan={scan}
              onBack={() => setStep('capture')}
              onSearch={handleOcrConfirm}
            />
          )}

          {step === 'search' && scan && (
            <ResultsScreen
              scan={scan}
              results={results}
              onBack={() => setStep('ocr')}
              onApply={handleApplyMatchAndGoEmail}
            />
          )}

          {step === 'email' && scan && (
            <EmailPreviewScreen
              scan={scan}
              results={results}
              onBack={() => setStep('search')}
              onStartOver={resetAll}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
