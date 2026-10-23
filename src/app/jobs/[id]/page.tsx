import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const jobId = parseInt((await params).id);
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { perusahaan: true }
  });

  if (!job) {
    return <div className="page-container"><p>Lowongan tidak ditemukan.</p></div>;
  }

  const user = await getSession();
  
  let hasApplied = false;
  if (user && user.role === 'pelamar' && user.pelamarProfile) {
    const application = await prisma.application.findFirst({
      where: { jobId: job.id, pelamarId: user.pelamarProfile.id }
    });
    hasApplied = !!application;
  }

  async function handleApply() {
    'use server';
    const session = await getSession();
    if (!session || session.role !== 'pelamar' || !session.pelamarProfile) {
      redirect('/login');
    }
    await prisma.application.create({
      data: { jobId: job!.id, pelamarId: session.pelamarProfile.id, status: 'dilamar' }
    });
    redirect(`/dashboard`);
  }

  return (
    <div className="page-container">
      <Link href="/jobs" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>← Kembali ke daftar lowongan</Link>
      
      <div className="glass-panel" style={{ padding: '2.5rem', marginTop: '1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{job.title}</h1>
          <h2 style={{ color: 'var(--primary)', fontSize: '1.1rem', fontWeight: 600 }}>{job.perusahaan.companyName}</h2>
          
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <span style={{ padding: '0.35rem 0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--muted)' }}>📍 {job.location}</span>
            <span style={{ padding: '0.35rem 0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--muted)' }}>⏳ Deadline: {new Date(job.deadline).toLocaleDateString('id-ID')}</span>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Deskripsi</h3>
          <p style={{ color: 'var(--muted)', lineHeight: 1.75, whiteSpace: 'pre-line', fontSize: '0.95rem' }}>{job.description}</p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Persyaratan</h3>
          <p style={{ color: 'var(--muted)', lineHeight: 1.75, whiteSpace: 'pre-line', fontSize: '0.95rem' }}>{job.requirements}</p>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
          {!user ? (
            <Link href="/login" className="btn btn-primary">Masuk untuk Melamar</Link>
          ) : user.role === 'pelamar' ? (
            hasApplied ? (
              <button className="btn btn-glass" disabled style={{ opacity: 0.6 }}>✓ Sudah dilamar</button>
            ) : (
              <form action={handleApply}>
                <button type="submit" className="btn btn-primary">Kirim Lamaran</button>
              </form>
            )
          ) : (
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Masuk sebagai Pelamar untuk melamar.</p>
          )}
        </div>
      </div>
    </div>
  );
}
