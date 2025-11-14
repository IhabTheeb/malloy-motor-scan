import React from 'react';

interface AppHeaderProps {
  onHistoryClick?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onHistoryClick }) => {
  return (
    <header className="shell-header">
      <div className="shell-header-inner">
        {/* Top banner with your logo (replace src with your image) */}
        <div className="shell-banner">
          <img
            src="/malloy-header.svg"  // <- put your banner/logo here
            alt="Malloy"
            className="shell-banner-image"
          />
        </div>

        <div className="shell-header-text">
          <div className="shell-header-title">Document Scanner &amp; Lookup</div>
          <div className="shell-header-subtitle">
            Capture motor nameplates, extract text with OCR, and find matching motors.
          </div>
        </div>

        <button
          type="button"
          className="btn btn-secondary shell-history-btn"
          onClick={onHistoryClick}
        >
          View Scan History
        </button>
      </div>
    </header>
  );
};
