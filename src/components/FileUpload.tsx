'use client';

import { useState } from 'react';

interface FileUploadProps {
  name: string;
  accept: string;
  label: string;
  currentUrl?: string | null;
  folder: string;
  onUpload: (url: string) => void;
}

export default function FileUpload({ name, accept, label, currentUrl, folder, onUpload }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', folder);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload gagal');
      setPreview(data.url);
      onUpload(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  const isImage = accept.includes('image');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label className="form-label">{label}</label>

      {preview && isImage && (
        <img
          src={preview}
          alt="Preview"
          style={{
            width: '80px', height: '80px', borderRadius: '50%',
            objectFit: 'cover', border: '2px solid var(--glass-border)', marginBottom: '0.25rem'
          }}
        />
      )}
      {preview && !isImage && (
        <a href={preview} target="_blank" style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>
          📄 Lihat file yang diupload
        </a>
      )}

      <label
        htmlFor={`upload-${name}`}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer',
          border: '1px dashed rgba(255,255,255,0.15)',
          background: 'rgba(255,255,255,0.02)',
          fontSize: '0.875rem', color: 'var(--muted)',
          transition: 'all 0.2s', width: 'fit-content',
          opacity: uploading ? 0.6 : 1,
          pointerEvents: uploading ? 'none' : 'auto',
        }}
      >
        {uploading ? '⏳ Mengupload...' : `📁 ${preview ? 'Ganti' : 'Pilih'} file`}
      </label>
      <input
        id={`upload-${name}`}
        type="file"
        accept={accept}
        onChange={handleChange}
        style={{ display: 'none' }}
        disabled={uploading}
      />
      {/* Hidden input to carry URL in form */}
      <input type="hidden" name={name} value={preview || ''} />

      {error && <p style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>❌ {error}</p>}
      <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
        {isImage ? 'JPG, PNG — max 5MB' : 'PDF — max 5MB'}
      </p>
    </div>
  );
}
