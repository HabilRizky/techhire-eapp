import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import ProfileForm from '@/components/ProfileForm';

export default async function EditProfilePage() {
  const user = await getSession();
  if (!user || user.role !== 'pelamar') redirect('/dashboard');

  const profile = user.pelamarProfile;

  async function handleUpdateProfile(formData: FormData) {
    'use server';
    const session = await getSession();
    if (!session || !session.pelamarProfile) throw new Error('Unauthorized');

    await prisma.pelamarProfile.update({
      where: { id: session.pelamarProfile.id },
      data: {
        photoUrl: (formData.get('photoUrl') as string) || null,
        cvUrl: (formData.get('cvUrl') as string) || null,
        portfolioUrl: (formData.get('portfolioUrl') as string) || null,
        githubLink: (formData.get('githubLink') as string) || null,
        skills: (formData.get('skills') as string) || null,
        education: (formData.get('education') as string) || null,
      }
    });

    redirect('/dashboard');
  }

  return (
    <div className="page-container">
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/dashboard" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>← Dashboard</Link>
        <h1 style={{ marginTop: '0.5rem', fontSize: '1.75rem' }}>Edit Profil</h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Lengkapi data berikut supaya rekruter bisa mengenal kamu lebih baik.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px' }}>
        <ProfileForm profile={profile} action={handleUpdateProfile} />
      </div>
    </div>
  );
}
