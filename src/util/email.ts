import type { NormalizedNameplate, SearchResult } from '../types';

function val(v: any) {
  return v ? String(v) : 'Unknown';
}

function buildSubject(scan: NormalizedNameplate) {
  const ids = [
    scan.catalogNumber,
    scan.partNumber,
    scan.specNumber,
    scan.modelNumber,
    scan.buildNumber,
    scan.modNumber,
  ].filter(Boolean);

  const parts: string[] = [];
  if (ids.length) parts.push(ids.join(' / '));
  if (scan.hp) parts.push(`${scan.hp} HP`);
  if (scan.rpm) parts.push(`${scan.rpm} RPM`);
  if (scan.frame) parts.push(`Frame ${scan.frame}`);

  return parts.length
    ? `Motor identification – ${parts.join(' · ')}`
    : 'Motor identification request';
}

function buildBody(scan: NormalizedNameplate, results: SearchResult[]) {
  const lines: string[] = [];

  lines.push('Hello,');
  lines.push('');
  lines.push(
    'Please help identify the motor shown in the attached nameplate photo. Below are the extracted details:'
  );
  lines.push('');
  lines.push('ID fields:');
  lines.push(`• Catalog #: ${val(scan.catalogNumber)}`);
  lines.push(`• Part #: ${val(scan.partNumber)}`);
  lines.push(`• Spec #: ${val(scan.specNumber)}`);
  lines.push(`• Model #: ${val(scan.modelNumber)}`);
  lines.push(`• Build #: ${val(scan.buildNumber)}`);
  lines.push(`• Mod #: ${val(scan.modNumber)}`);
  lines.push('');
  lines.push('General specs:');
  lines.push(`• HP: ${val(scan.hp)}`);
  lines.push(`• RPM: ${val(scan.rpm)}`);
  lines.push(`• Frame: ${val(scan.frame)}`);
  lines.push(`• Enclosure: ${val(scan.enclosure)}`);
  lines.push(`• Voltage: ${val(scan.voltage)}`);
  lines.push(`• Manufacturer: ${val(scan.manufacturer)}`);
  lines.push(`• Serial #: ${val(scan.serialNumber)}`);
  lines.push('');
  if (results.length) {
    lines.push('Possible catalog match(es):');
    results.forEach(r => {
      lines.push(`• ${r.sku} – ${r.manufacturer} – ${r.description}`);
    });
    lines.push('');
  }
  lines.push('Raw OCR text:');
  lines.push(scan.rawText || '(no OCR text captured)');
  lines.push('');
  lines.push('Thanks,');
  lines.push('(Your name here)');

  return lines.join('\n');
}

/** Used by the Email screen to prefill the form */
export function createEmailDraft(
  scan: NormalizedNameplate,
  results: SearchResult[]
) {
  return {
    subject: buildSubject(scan),
    body: buildBody(scan, results),
  };
}

/** Simple mailto fallback (no attachment) */
export function sendEmailWithScan(
  scan: NormalizedNameplate,
  results: SearchResult[]
) {
  const { subject, body } = createEmailDraft(scan, results);
  const subjectEnc = encodeURIComponent(subject);
  const bodyEnc = encodeURIComponent(body);
  window.location.href = `mailto:?subject=${subjectEnc}&body=${bodyEnc}`;
}

/** Create and download an .eml draft with optional attachment */
/** Create and download an .eml draft with optional attachment */
export function downloadEmlDraftRaw(
  subject: string,
  body: string,
  imageDataUrl?: string
) {
  let mimeType = 'image/jpeg';
  let base64Data: string | undefined;

  if (imageDataUrl && imageDataUrl.startsWith('data:')) {
    const match = imageDataUrl.match(
      /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/
    );
    if (match) {
      mimeType = match[1];
      base64Data = match[2];
    }
  }

  // Wrap base64 at 76 characters per line for better client compatibility
  function wrapBase64(input: string): string {
    const chunks: string[] = [];
    for (let i = 0; i < input.length; i += 76) {
      chunks.push(input.slice(i, i + 76));
    }
    return chunks.join('\r\n');
  }

  const boundary = '----=MalloyMotorScanBoundary';

  const parts: string[] = [];

  // Standard headers
  parts.push(`From: <>`);
  parts.push(`To: <>`);
  parts.push(`Subject: ${subject}`);
  parts.push(`Date: ${new Date().toUTCString()}`);
  parts.push('MIME-Version: 1.0');
  parts.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
  parts.push(''); // end headers

  // Text part
  parts.push(`--${boundary}`);
  parts.push('Content-Type: text/plain; charset="UTF-8"');
  parts.push('Content-Transfer-Encoding: 7bit');
  parts.push('');
  parts.push(body);
  parts.push('');

  // Attachment part (if we have image data)
  if (base64Data) {
    parts.push(`--${boundary}`);
    parts.push(
      `Content-Type: ${mimeType}; name="motor-nameplate.jpg"`
    );
    parts.push('Content-Transfer-Encoding: base64');
    parts.push(
      'Content-Disposition: attachment; filename="motor-nameplate.jpg"'
    );
    parts.push('');
    parts.push(wrapBase64(base64Data)); // 👈 wrapped base64
    parts.push('');
  }

  // Closing boundary
  parts.push(`--${boundary}--`);
  parts.push('');

  const eml = parts.join('\r\n');

  const blob = new Blob([eml], { type: 'message/rfc822' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'motor-scan.eml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Best-effort "open email with photo" using custom subject/body:
 * - Mobile / tablet: navigator.share → Mail with attachment and text.
 * - Desktop: download .eml draft with attachment and the same edited text.
 */
export async function openEmailWithAttachmentCustom(
  subject: string,
  body: string,
  imageDataUrl?: string
) {
  try {
    if (
      (navigator as any).canShare &&
      imageDataUrl &&
      imageDataUrl.startsWith('data:')
    ) {
      const match = imageDataUrl.match(
        /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/
      );
      if (match) {
        const mimeType = match[1];
        const base64Data = match[2];

        const byteChars = atob(base64Data);
        const byteNumbers = new Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
          byteNumbers[i] = byteChars.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        const file = new File([blob], 'motor-nameplate.jpg', { type: mimeType });

        await (navigator as any).share({
          title: subject,
          text: body,
          files: [file],
        });
        return;
      }
    }
  } catch (err) {
    console.warn('navigator.share failed, falling back to .eml:', err);
  }

  // Desktop or no share-with-files: .eml draft with the same edited contents.
  downloadEmlDraftRaw(subject, body, imageDataUrl);
}
