import { cookies } from 'next/headers';
import { prisma } from './prisma';

export async function getSession() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    include: {
      perusahaanProfile: true,
      pelamarProfile: true
    }
  });

  return user;
}

export async function setSession(userId: number) {
  const cookieStore = await cookies();
  cookieStore.set('userId', userId.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('userId');
}
