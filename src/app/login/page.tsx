import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { setSession } from '@/lib/auth';
import Link from 'next/link';

export default async function LoginPage() {
  async function handleLogin(formData: FormData) {
    'use server';
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      redirect('/login?error=Email+atau+password+salah');
    }

    await setSession(user.id);
    redirect('/dashboard');
  }

  return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.75rem' }}>Masuk ke akunmu</h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--muted)', fontSize: '0.9rem' }}>Selamat datang kembali 👋</p>
        
        <form action={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-input" required placeholder="nama@email.com" />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-input" required placeholder="••••••••" />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem' }}>
            Masuk
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
          Belum punya akun? <Link href="/register" className="text-accent">Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
}
