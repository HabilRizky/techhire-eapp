import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>
          tech<span style={{ color: 'var(--primary)' }}>hire</span>
        </div>
        <div className={styles.navLinks}>
          <Link href="/jobs" className={styles.navLink}>Lowongan</Link>
          <Link href="/login" className="btn btn-glass">Masuk</Link>
          <Link href="/register" className="btn btn-primary">Daftar</Link>
        </div>
      </nav>

      <div className={styles.hero}>
        <div className={`${styles.heroContent} animate-fade-in-up`}>
          <div className={styles.badge}>khusus lulusan D3 TI</div>
          <h1 className={styles.title}>
            Temukan pekerjaan
            <br />
            <span className="text-gradient">yang cocok buat kamu.</span>
          </h1>
          <p className={styles.subtitle}>
            Upload portofolio GitHub-mu, lamar langsung ke perusahaan IT, 
            dan pantau progres lamaran — semua dalam satu tempat.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/jobs" className="btn btn-primary">
              Lihat Lowongan
            </Link>
            <Link href="/register?role=perusahaan" className="btn btn-glass">
              Saya Perusahaan
            </Link>
          </div>
        </div>
      </div>

      <section className={styles.featuresSection}>
        <div className={`${styles.sectionHeader} animate-fade-in-up delay-100`}>
          <h2 className={styles.sectionTitle}>Kenapa pakai TechHire?</h2>
          <p className={styles.subtitle} style={{ margin: "0 auto" }}>
            Dibuat khusus buat kamu yang mau mulai karier di dunia IT.
          </p>
        </div>

        <div className={`${styles.grid} animate-fade-in-up delay-200`}>
          <div className={`${styles.card} glass-panel`}>
            <div className={styles.cardIcon}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Showcase Portofolio</h3>
            <p className={styles.cardDesc}>
              Tautkan repository GitHub dan website portofolio langsung ke profilmu. Rekruter bisa langsung lihat kemampuan coding-mu.
            </p>
          </div>

          <div className={`${styles.card} glass-panel`}>
            <div className={styles.cardIcon}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Pantau Lamaran</h3>
            <p className={styles.cardDesc}>
              Cek status lamaranmu kapan saja — dari "dilamar" sampai "diterima". Gak perlu nunggu email satu-satu.
            </p>
          </div>

          <div className={`${styles.card} glass-panel`}>
            <div className={styles.cardIcon}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Jadwal Interview</h3>
            <p className={styles.cardDesc}>
              Perusahaan bisa langsung set jadwal wawancara online. Kamu tinggal terima notifikasi dan siap-siap.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
