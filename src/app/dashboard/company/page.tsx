import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import CompanyForm from '@/components/CompanyForm';

export default async function EditCompanyPage() {
  const user = await getSession();
  if (!user || user.role !== 'perusahaan') redirect('/dashboard');

  const profile = user.perusahaanProfile;

  async function handleUpdate(formData: FormData) {
    'use server';
    const session = await getSession();
    if (!session || !session.perusahaanProfile) throw new Error('Unauthorized');

    await prisma.perusahaanProfile.update({
      where: { id: session.perusahaanProfile.id },
      data: {
        companyName: (formData.get('companyName') as string) || session.perusahaanProfile.companyName,
        description: (formData.get('description') as string) || null,
        logoUrl: (formData.get('logoUrl') as string) || null,
        website: (formData.get('website') as string) || null,
        address: (formData.get('address') as string) || null,
      }
    });

    redirect('/dashboard');
  }

  return (
    <div className="page-container">
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/dashboard" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>← Dashboard</Link>
        <h1 style={{ marginTop: '0.5rem', fontSize: '1.75rem' }}>Profil Perusahaan</h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Lengkapi profil perusahaan agar pelamar lebih percaya dan tertarik melamar.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px' }}>
        <CompanyForm profile={profile} action={handleUpdate} />
      </div>
    </div>
  );
}
