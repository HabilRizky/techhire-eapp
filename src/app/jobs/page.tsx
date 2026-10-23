import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    include: { perusahaan: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link href="/" style={{ color: 'var(--muted)', fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>← Beranda</Link>
          <h1 style={{ fontSize: '2rem' }}>Lowongan Tersedia</h1>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--muted)', fontWeight: 500 }}>Belum ada lowongan saat ini.</h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Cek lagi nanti ya!</p>
        </div>
      ) : (
        <div className="card-grid">
          {jobs.map((job) => (
            <div key={job.id} className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.15rem' }}>{job.title}</h2>
                <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>{job.perusahaan.companyName}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: 'var(--muted)' }}>
                  📍 {job.location}
                </span>
                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: 'var(--muted)' }}>
                  ⏳ {new Date(job.deadline).toLocaleDateString('id-ID')}
                </span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.875rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>
                {job.description}
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
                <Link href={`/jobs/${job.id}`} className="btn btn-primary" style={{ width: '100%', fontSize: '0.9rem' }}>Lihat & Lamar</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
