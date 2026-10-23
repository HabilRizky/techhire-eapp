import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ReviewApplicationsPage({ params }: { params: { jobId: string } }) {
  const user = await getSession();
  if (!user || user.role !== 'perusahaan') redirect('/dashboard');

  const jobId = parseInt((await params).jobId);
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      perusahaan: true,
      applications: {
        include: {
          pelamar: {
            include: { user: true }
          }
        },
        orderBy: { appliedAt: 'desc' }
      }
    }
  });

  if (!job || job.perusahaan.userId !== user.id) {
    redirect('/dashboard');
  }

  async function handleUpdateStatus(formData: FormData) {
    'use server';
    const applicationId = parseInt(formData.get('applicationId') as string);
    const newStatus = formData.get('status') as string;
    const interviewDate = formData.get('interviewDate') as string;
    const interviewNote = formData.get('interviewNote') as string;

    const session = await getSession();
    if (!session || session.role !== 'perusahaan') throw new Error('Unauthorized');

    const updateData: any = { status: newStatus };
    if (newStatus === 'interview' && interviewDate) {
      updateData.interviewDate = new Date(interviewDate);
    }
    if (interviewNote) {
      updateData.interviewNote = interviewNote;
    }

    await prisma.application.update({
      where: { id: applicationId },
      data: updateData,
    });

    redirect(`/dashboard/jobs/${jobId}/applicants`);
  }

  const statusColors: Record<string, string> = {
    dilamar: 'var(--warning)',
    dilihat: 'var(--secondary)',
    interview: '#a78bfa',
    diterima: 'var(--success)',
    ditolak: 'var(--danger)',
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>← Dashboard</Link>
        <h1 style={{ marginTop: '0.5rem', fontSize: '1.75rem' }}>Pelamar: {job.title}</h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          {job.applications.length} orang sudah melamar posisi ini
        </p>
      </div>

      {job.applications.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)' }}>Belum ada yang melamar posisi ini.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {job.applications.map(app => (
            <div key={app.id} className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                {/* Applicant Info */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {app.pelamar.photoUrl ? (
                    <img
                      src={app.pelamar.photoUrl}
                      alt="Foto"
                      style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }}
                    />
                  ) : (
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                      👤
                    </div>
                  )}
                  <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.15rem' }}>{app.pelamar.user.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{app.pelamar.user.email}</p>
                    {app.pelamar.education && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.15rem' }}>🎓 {app.pelamar.education}</p>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <span style={{
                  padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700,
                  textTransform: 'capitalize',
                  color: statusColors[app.status] || 'var(--muted)',
                  background: `color-mix(in srgb, ${statusColors[app.status] || 'var(--muted)'} 15%, transparent)`,
                }}>
                  {app.status}
                </span>
              </div>

              {/* Skills & Links */}
              <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {app.pelamar.skills && app.pelamar.skills.split(',').map((skill, i) => (
                  <span key={i} style={{
                    padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem',
                    background: 'rgba(255,255,255,0.05)', color: 'var(--muted)'
                  }}>
                    {skill.trim()}
                  </span>
                ))}
              </div>

              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                {app.pelamar.cvUrl && (
                  <a href={app.pelamar.cvUrl} target="_blank" style={{ color: 'var(--accent)' }}>📄 Lihat CV</a>
                )}
                {app.pelamar.portfolioUrl && (
                  <a href={app.pelamar.portfolioUrl} target="_blank" style={{ color: 'var(--accent)' }}>🌐 Portofolio</a>
                )}
                {app.pelamar.githubLink && (
                  <a href={app.pelamar.githubLink} target="_blank" style={{ color: 'var(--accent)' }}>💻 GitHub</a>
                )}
              </div>

              {/* Interview info if exists */}
              {app.status === 'interview' && app.interviewDate && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(167,139,250,0.08)', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <p>📅 Interview: <strong>{new Date(app.interviewDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
                  {app.interviewNote && <p style={{ marginTop: '0.25rem', color: 'var(--muted)' }}>📝 {app.interviewNote}</p>}
                </div>
              )}

              {/* Action Form */}
              <form action={handleUpdateStatus} style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                <input type="hidden" name="applicationId" value={app.id} />
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <div className="form-group" style={{ marginBottom: 0, flex: '1 1 140px' }}>
                    <label className="form-label">Ubah Status</label>
                    <select name="status" className="form-input" defaultValue={app.status}
                      style={{ padding: '0.6rem 0.75rem' }}>
                      <option value="dilamar">Dilamar</option>
                      <option value="dilihat">Dilihat</option>
                      <option value="interview">Interview</option>
                      <option value="diterima">Diterima</option>
                      <option value="ditolak">Ditolak</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0, flex: '1 1 160px' }}>
                    <label className="form-label">Tanggal Interview</label>
                    <input type="datetime-local" name="interviewDate" className="form-input"
                      defaultValue={app.interviewDate ? new Date(app.interviewDate).toISOString().slice(0,16) : ''}
                      style={{ padding: '0.6rem 0.75rem' }} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0, flex: '2 1 200px' }}>
                    <label className="form-label">Catatan</label>
                    <input type="text" name="interviewNote" className="form-input"
                      defaultValue={app.interviewNote || ''}
                      placeholder="Catatan untuk pelamar..."
                      style={{ padding: '0.6rem 0.75rem' }} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.6rem 1.25rem' }}>
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
