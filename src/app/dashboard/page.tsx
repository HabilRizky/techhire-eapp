import { redirect } from 'next/navigation';
import { getSession, clearSession } from '@/lib/auth';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) redirect('/login');

  async function handleLogout() {
    'use server';
    await clearSession();
    redirect('/');
  }

  const roleLabel = user.role === 'perusahaan' ? '🏢 Perusahaan' : user.role === 'admin' ? '⚙️ Admin' : '👤 Pelamar';

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Profile Photo */}
          {user.role === 'pelamar' && user.pelamarProfile?.photoUrl ? (
            <img src={user.pelamarProfile.photoUrl} alt="Foto" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
          ) : user.role === 'perusahaan' && user.perusahaanProfile?.logoUrl ? (
            <img src={user.perusahaanProfile.logoUrl} alt="Logo" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
          ) : (
            <div style={{ width: '48px', height: '48px', borderRadius: user.role === 'perusahaan' ? '8px' : '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
              {user.role === 'perusahaan' ? '🏢' : '👤'}
            </div>
          )}
          <div>
            <Link href="/" style={{ color: 'var(--muted)', fontSize: '0.8rem', display: 'block', marginBottom: '0.15rem' }}>← techhire</Link>
            <h1 style={{ fontSize: '1.75rem' }}>Hai, {user.name}!</h1>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)', padding: '0.35rem 0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '6px' }}>{roleLabel}</span>
          <form action={handleLogout}>
            <button type="submit" className="btn btn-glass" style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}>Keluar</button>
          </form>
        </div>
      </div>

      {user.role === 'admin' && <AdminDashboard />}
      {user.role === 'perusahaan' && <PerusahaanDashboard user={user} />}
      {user.role === 'pelamar' && <PelamarDashboard user={user} />}
    </div>
  );
}

async function AdminDashboard() {
  const { prisma } = await import('@/lib/prisma');
  const userCount = await prisma.user.count();
  const jobCount = await prisma.job.count();
  const appCount = await prisma.application.count();

  return (
    <div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Statistik Sistem</h3>
      <div className="card-grid">
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Pengguna</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.25rem' }}>{userCount}</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Lowongan</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)', marginTop: '0.25rem' }}>{jobCount}</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Lamaran</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--secondary)', marginTop: '0.25rem' }}>{appCount}</p>
        </div>
      </div>
    </div>
  );
}

async function PerusahaanDashboard({ user }: { user: any }) {
  const { prisma } = await import('@/lib/prisma');
  const jobs = await prisma.job.findMany({
    where: { perusahaanId: user.perusahaanProfile.id },
    include: { applications: { include: { pelamar: { include: { user: true } } } } },
    orderBy: { createdAt: 'desc' }
  });

  const totalApplicants = jobs.reduce((sum, j) => sum + j.applications.length, 0);

  return (
    <div>
      {/* Quick Stats */}
      <div className="card-grid" style={{ marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Lowongan Aktif</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>{jobs.length}</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Total Pelamar</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent)' }}>{totalApplicants}</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Link href="/dashboard/company" className="btn btn-glass" style={{ fontSize: '0.85rem', width: '100%' }}>Edit Profil Perusahaan</Link>
        </div>
      </div>

      {/* Jobs List */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.25rem' }}>Lowongan kamu</h3>
        <Link href="/dashboard/jobs/create" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>+ Buat Lowongan</Link>
      </div>
      
      {jobs.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)' }}>Belum ada lowongan. Yuk buat yang pertama!</p>
        </div>
      ) : (
        <div className="card-grid">
          {jobs.map(job => (
            <div key={job.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{job.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>📍 {job.location} · ⏳ {new Date(job.deadline).toLocaleDateString('id-ID')}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--accent)', marginTop: '0.5rem', fontWeight: 600 }}>
                {job.applications.length} pelamar masuk
              </p>
              
              {job.applications.length > 0 && (
                <div style={{ marginTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {job.applications.slice(0, 3).map(app => (
                    <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span>{app.pelamar.user.name}</span>
                      <span style={{
                        fontWeight: 600, textTransform: 'capitalize',
                        color: app.status === 'dilamar' ? 'var(--warning)' : app.status === 'diterima' ? 'var(--success)' : app.status === 'ditolak' ? 'var(--danger)' : app.status === 'interview' ? '#a78bfa' : 'var(--muted)',
                      }}>{app.status}</span>
                    </div>
                  ))}
                  {job.applications.length > 3 && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>+{job.applications.length - 3} lainnya</p>
                  )}
                </div>
              )}

              <Link
                href={`/dashboard/jobs/${job.id}/applicants`}
                className="btn btn-glass"
                style={{ fontSize: '0.8rem', marginTop: 'auto', paddingTop: '0.75rem', width: '100%', marginBlockStart: '1rem' }}
              >
                Review Pelamar →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

async function PelamarDashboard({ user }: { user: any }) {
  const { prisma } = await import('@/lib/prisma');
  const profile = user.pelamarProfile;
  const applications = await prisma.application.findMany({
    where: { pelamarId: profile.id },
    include: { job: { include: { perusahaan: true } } },
    orderBy: { appliedAt: 'desc' }
  });

  const statusColors: Record<string, string> = {
    dilamar: 'var(--warning)',
    dilihat: 'var(--secondary)',
    interview: '#a78bfa',
    diterima: 'var(--success)',
    ditolak: 'var(--danger)',
  };

  return (
    <div className="card-grid">
      {/* Profile Card */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Profil & Portofolio</h3>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          {profile?.photoUrl ? (
            <img src={profile.photoUrl} alt="Foto" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
          ) : (
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👤</div>
          )}
          <div style={{ fontSize: '0.85rem' }}>
            <p style={{ fontWeight: 600 }}>{user.name}</p>
            {profile?.education && <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>🎓 {profile.education}</p>}
          </div>
        </div>

        {/* Skills */}
        {profile?.skills && (
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Skills</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {profile.skills.split(',').map((s: string, i: number) => (
                <span key={i} style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', background: 'rgba(232,133,59,0.1)', color: 'var(--primary)' }}>{s.trim()}</span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
          {profile?.cvUrl ? (
            <p>📄 <a href={profile.cvUrl} target="_blank" className="text-accent">Lihat CV</a></p>
          ) : (
            <p style={{ color: 'var(--muted)' }}>📄 CV belum diupload</p>
          )}
          {profile?.githubLink ? (
            <p>💻 <a href={profile.githubLink} target="_blank" className="text-accent">GitHub</a></p>
          ) : (
            <p style={{ color: 'var(--muted)' }}>💻 GitHub belum ditambahkan</p>
          )}
          {profile?.portfolioUrl ? (
            <p>🌐 <a href={profile.portfolioUrl} target="_blank" className="text-accent">Portofolio</a></p>
          ) : (
            <p style={{ color: 'var(--muted)' }}>🌐 Portofolio belum ditambahkan</p>
          )}
        </div>
        <Link href="/dashboard/profile" className="btn btn-glass" style={{ marginTop: '1rem', fontSize: '0.85rem', width: '100%' }}>Edit Profil</Link>
      </div>
      
      {/* Applications Card */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Lamaran kamu ({applications.length})</h3>
        {applications.length === 0 ? (
          <>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Belum ada lamaran.</p>
            <Link href="/jobs" className="btn btn-primary" style={{ marginTop: '1rem', fontSize: '0.85rem' }}>Cari Lowongan</Link>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {applications.map(app => (
              <div key={app.id} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '0.95rem' }}>{app.job.title}</h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{app.job.perusahaan.companyName}</p>
                <div style={{ marginTop: '0.4rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span>Status</span>
                  <span style={{ color: statusColors[app.status] || 'var(--muted)', fontWeight: 700, textTransform: 'capitalize' }}>{app.status}</span>
                </div>
                {/* Interview info */}
                {app.status === 'interview' && app.interviewDate && (
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(167,139,250,0.08)', borderRadius: '6px', fontSize: '0.8rem' }}>
                    <p>📅 {new Date(app.interviewDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    {app.interviewNote && <p style={{ color: 'var(--muted)', marginTop: '0.15rem' }}>📝 {app.interviewNote}</p>}
                  </div>
                )}
                {app.status === 'diterima' && (
                  <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--success)' }}>🎉 Selamat! Kamu diterima!</p>
                )}
              </div>
            ))}
            <Link href="/jobs" className="btn btn-glass" style={{ marginTop: '0.5rem', fontSize: '0.85rem', width: 'fit-content' }}>Cari lagi</Link>
          </div>
        )}
      </div>
    </div>
  );
}
