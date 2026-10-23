import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { setSession } from '@/lib/auth';
import Link from 'next/link';

export default async function RegisterPage({ searchParams }: { searchParams: { role?: string } }) {
  const role = (await searchParams).role === 'perusahaan' ? 'perusahaan' : 'pelamar';

  async function handleRegister(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const inputRole = formData.get('role') as string;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      redirect('/register?error=Email+sudah+terdaftar');
    }

    const newUser = await prisma.user.create({
      data: { name, email, password, role: inputRole }
    });

    if (inputRole === 'perusahaan') {
      await prisma.perusahaanProfile.create({
        data: { userId: newUser.id, companyName: name }
      });
    } else {
      await prisma.pelamarProfile.create({
        data: { userId: newUser.id }
      });
    }

    await setSession(newUser.id);
    redirect('/dashboard');
  }

  return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.75rem' }}>Buat akun baru</h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--muted)', fontSize: '0.9rem' }}>Pilih peran kamu di bawah ini</p>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '8px' }}>
          <Link
            href="/register?role=pelamar"
            style={{
              flex: 1, textAlign: 'center', padding: '0.6rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600,
              background: role === 'pelamar' ? 'var(--primary)' : 'transparent',
              color: role === 'pelamar' ? '#111318' : 'var(--muted)',
              transition: 'all 0.2s',
              fontFamily: "'Space Grotesk', sans-serif"
            }}
          >
            Pelamar
          </Link>
          <Link
            href="/register?role=perusahaan"
            style={{
              flex: 1, textAlign: 'center', padding: '0.6rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600,
              background: role === 'perusahaan' ? 'var(--primary)' : 'transparent',
              color: role === 'perusahaan' ? '#111318' : 'var(--muted)',
              transition: 'all 0.2s',
              fontFamily: "'Space Grotesk', sans-serif"
            }}
          >
            Perusahaan
          </Link>
        </div>
        
        <form action={handleRegister}>
          <input type="hidden" name="role" value={role} />
          
          <div className="form-group">
            <label className="form-label">{role === 'perusahaan' ? 'Nama Perusahaan' : 'Nama Lengkap'}</label>
            <input type="text" name="name" className="form-input" required placeholder={role === 'perusahaan' ? 'PT Contoh Jaya' : 'Nama kamu'} />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-input" required placeholder="nama@email.com" />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-input" required minLength={6} placeholder="Min. 6 karakter" />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem' }}>
            Daftar sebagai {role === 'perusahaan' ? 'Perusahaan' : 'Pelamar'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
          Sudah punya akun? <Link href="/login" className="text-accent">Masuk</Link>
        </p>
      </div>
    </div>
  );
}
