import React from "react";
import type { NormalizedNameplate, SearchResult } from "../types";
import { Card } from "../components/Card";
import {
  createEmailDraft,
  openEmailWithAttachmentCustom,
} from "../util/email";

interface Props {
  scan: NormalizedNameplate;
  results: SearchResult[];
  onBack: () => void;
  onStartOver: () => void;
}

export const EmailPreviewScreen: React.FC<Props> = ({
  scan,
  results,
  onBack,
  onStartOver,
}) => {
  const initial = React.useMemo(
    () => createEmailDraft(scan, results ?? []),
    [scan, results]
  );

  const [subject, setSubject] = React.useState(initial.subject);
  const [body, setBody] = React.useState(initial.body);

  const handleSend = () => {
    openEmailWithAttachmentCustom(subject, body, scan.imageDataUrl);
  };

  const primaryMatch = results && results.length > 0 ? results[0] : null;

  return (
    <Card
      title="Email"
      subtitle="Review and edit the email before sending. We’ll open your mail app with the photo and text ready."
      right={<span className="badge">Step 4 of 4</span>}
    >
      <div className="email-layout">
        {/* LEFT: subject + body */}
        <section className="email-main">
          <div className="form-field">
            <label>Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Motor identification – catalog / spec / model"
            />
          </div>

          <div className="form-field mt-16">
            <label>Email body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              style={{ minHeight: 220 }}
            />
          </div>
        </section>

        {/* RIGHT: image + summary */}
        <aside className="email-side">
          <div className="preview-shell">
            <div className="preview-shell-inner">
              {scan.imageDataUrl ? (
                <img
                  src={scan.imageDataUrl}
                  alt="Nameplate"
                  className="preview-image"
                />
              ) : (
                <div className="preview-placeholder">
                  No image captured for this scan.
                </div>
              )}
            </div>
            <div className="preview-caption">
              This image will be attached to the email draft.
            </div>
          </div>

          {primaryMatch && (
            <div className="email-summary">
              <h3>Selected motor</h3>
              <p className="email-summary-primary">
                {primaryMatch.sku} – {primaryMatch.manufacturer}
              </p>
              <p className="email-summary-secondary">
                {primaryMatch.description}
              </p>
              {primaryMatch.location && (
                <p className="email-summary-meta">
                  Stock: {primaryMatch.location}
                </p>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* footer actions */}
      <div className="email-actions">
        <button
          className="btn btn-secondary"
          type="button"
          onClick={onBack}
        >
          Back
        </button>
        <button
          className="btn btn-ghost"
          type="button"
          onClick={onStartOver}
        >
          Start over
        </button>
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleSend}
        >
          Send via mail app
        </button>
      </div>
    </Card>
  );
};
