import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Link from 'next/link';

export default async function CreateJobPage() {
  const user = await getSession();
  if (!user || user.role !== 'perusahaan') redirect('/dashboard');

  async function handleCreateJob(formData: FormData) {
    'use server';
    const title = formData.get('title') as string;
    const location = formData.get('location') as string;
    const deadlineStr = formData.get('deadline') as string;
    const description = formData.get('description') as string;
    const requirements = formData.get('requirements') as string;
    const salary = formData.get('salary') as string;
    const jobType = formData.get('jobType') as string;
    
    const session = await getSession();
    if (!session || !session.perusahaanProfile) throw new Error('Unauthorized');

    await prisma.job.create({
      data: {
        perusahaanId: session.perusahaanProfile.id,
        title, location,
        deadline: new Date(deadlineStr),
        description, requirements,
        salary: salary || null,
        jobType: jobType || null,
      }
    });

    redirect('/dashboard');
  }

  return (
    <div className="page-container">
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/dashboard" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>← Dashboard</Link>
        <h1 style={{ marginTop: '0.5rem', fontSize: '1.75rem' }}>Buat Lowongan Baru</h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Isi detail posisi yang kamu buka.</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '700px' }}>
        <form action={handleCreateJob}>
          <div className="form-group">
            <label className="form-label">Posisi</label>
            <input type="text" name="title" className="form-input" required placeholder="Contoh: Frontend Developer" />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Lokasi</label>
              <input type="text" name="location" className="form-input" required placeholder="Remote / Jakarta" />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Tipe Kerja</label>
              <select name="jobType" className="form-input" style={{ padding: '0.6rem 0.75rem' }}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Magang">Magang</option>
                <option value="Remote">Remote</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Gaji (opsional)</label>
              <input type="text" name="salary" className="form-input" placeholder="Contoh: Rp 5.000.000 - 8.000.000" />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Deadline</label>
              <input type="date" name="deadline" className="form-input" required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi Pekerjaan</label>
            <textarea name="description" className="form-input" rows={4} required placeholder="Jelaskan tugas dan tanggung jawab..."></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Persyaratan</label>
            <textarea name="requirements" className="form-input" rows={4} required placeholder="Keahlian yang dibutuhkan..."></textarea>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.75rem' }}>Posting Lowongan</button>
        </form>
      </div>
    </div>
  );
}
