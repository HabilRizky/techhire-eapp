'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';

interface ProfileFormProps {
  profile: {
    photoUrl?: string | null;
    cvUrl?: string | null;
    portfolioUrl?: string | null;
    githubLink?: string | null;
    skills?: string | null;
    education?: string | null;
  } | null;
  action: (formData: FormData) => Promise<void>;
}

export default function ProfileForm({ profile, action }: ProfileFormProps) {
  const [photoUrl, setPhotoUrl] = useState(profile?.photoUrl || '');
  const [cvUrl, setCvUrl] = useState(profile?.cvUrl || '');

  return (
    <form action={action}>
      {/* Hidden fields updated by upload component */}
      <input type="hidden" name="photoUrl" value={photoUrl} />
      <input type="hidden" name="cvUrl" value={cvUrl} />

      <div className="form-group">
        <FileUpload
          name="_photo"
          accept="image/jpeg,image/png"
          label="Foto Profil"
          currentUrl={profile?.photoUrl}
          folder="uploads/photos"
          onUpload={(url) => setPhotoUrl(url)}
        />
      </div>

      <div className="form-group">
        <FileUpload
          name="_cv"
          accept="application/pdf"
          label="Upload CV (PDF)"
          currentUrl={profile?.cvUrl}
          folder="uploads/cv"
          onUpload={(url) => setCvUrl(url)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Website Portofolio</label>
        <input
          type="url" name="portfolioUrl" className="form-input"
          defaultValue={profile?.portfolioUrl || ''}
          placeholder="https://portofolio-kamu.com"
        />
      </div>

      <div className="form-group">
        <label className="form-label">GitHub</label>
        <input
          type="url" name="githubLink" className="form-input"
          defaultValue={profile?.githubLink || ''}
          placeholder="https://github.com/username"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Keahlian / Skills</label>
        <input
          type="text" name="skills" className="form-input"
          defaultValue={profile?.skills || ''}
          placeholder="React, Node.js, Python, MySQL, ..."
        />
        <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Pisahkan dengan koma</p>
      </div>

      <div className="form-group">
        <label className="form-label">Pendidikan Terakhir</label>
        <input
          type="text" name="education" className="form-input"
          defaultValue={profile?.education || ''}
          placeholder="D3 Teknik Informatika, Universitas ..."
        />
      </div>

      <button type="submit" className="btn btn-primary" style={{ marginTop: '0.75rem' }}>
        Simpan Profil
      </button>
    </form>
  );
}
