import React from "react";

interface AppHeaderProps {
  onHistoryClick?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onHistoryClick }) => {
  // Vite sets BASE_URL to "/" in dev and "/malloy-motor-scan/" on GitHub Pages
  const logoUrl = `${import.meta.env.BASE_URL}malloy-header.svg`;

  return (
    <header className="shell-header">
      <div className="shell-header-inner">
        <div className="shell-banner">
          <img
            src={logoUrl}
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
