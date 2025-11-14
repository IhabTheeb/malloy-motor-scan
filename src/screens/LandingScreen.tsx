import React from 'react';

interface Props {
  onStart: () => void;
}

export const LandingScreen: React.FC<Props> = ({ onStart }) => {
  return (
    <div>
      <section className="hero">
        <h1 className="hero-title">Scan any motor nameplate in seconds.</h1>
        <p className="hero-subtitle">
          Point, capture, and let AI extract HP, RPM, frame, catalog, bearings,
          and more. Designed for Malloy reps on ladders, in plants, and on the
          road.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={onStart}>
            Scan a motor
          </button>
        </div>
      </section>
    </div>
  );
};
