'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';

interface CompanyFormProps {
  profile: {
    companyName?: string | null;
    description?: string | null;
    logoUrl?: string | null;
    website?: string | null;
    address?: string | null;
  } | null;
  action: (formData: FormData) => Promise<void>;
}

export default function CompanyForm({ profile, action }: CompanyFormProps) {
  const [logoUrl, setLogoUrl] = useState(profile?.logoUrl || '');

  return (
    <form action={action}>
      <input type="hidden" name="logoUrl" value={logoUrl} />

      <div className="form-group">
        <FileUpload
          name="_logo"
          accept="image/jpeg,image/png"
          label="Logo Perusahaan"
          currentUrl={profile?.logoUrl}
          folder="uploads/logos"
          onUpload={(url) => setLogoUrl(url)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Nama Perusahaan</label>
        <input
          type="text" name="companyName" className="form-input"
          defaultValue={profile?.companyName || ''}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Deskripsi Perusahaan</label>
        <textarea
          name="description" className="form-input" rows={4}
          defaultValue={profile?.description || ''}
          placeholder="Ceritakan tentang perusahaan kamu..."
        />
      </div>

      <div className="form-group">
        <label className="form-label">Website</label>
        <input
          type="url" name="website" className="form-input"
          defaultValue={profile?.website || ''}
          placeholder="https://perusahaan.com"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Alamat</label>
        <input
          type="text" name="address" className="form-input"
          defaultValue={profile?.address || ''}
          placeholder="Jl. Contoh No. 1, Kota"
        />
      </div>

      <button type="submit" className="btn btn-primary" style={{ marginTop: '0.75rem' }}>
        Simpan Profil Perusahaan
      </button>
    </form>
  );
}
