import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  right,
  children,
}) => {
  return (
    <section className="card">
      {(title || subtitle || right) && (
        <div className="card-header">
          <div>
            {title && <div className="card-title">{title}</div>}
            {subtitle && <div className="card-subtitle">{subtitle}</div>}
          </div>
          {right}
        </div>
      )}
      {children}
    </section>
  );
};
