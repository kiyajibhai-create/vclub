'use client';

import styles from './page.module.css';

export default function GatePage() {
  function login() {
    // Set PCP cookie (session-scoped, like the original)
    document.cookie = 'PCP=2dbac1ec46be4d4e41c893c3c095e0e8; path=/; SameSite=Lax';

    // Set supporting cookies to mimic the real site
    document.cookie = `cf_clearance=52lRQ5fMQXibdU_AAGFaOeN72YoiHfdRoBPtqwb6Vug-1784010480-1.2.1.1; path=/; SameSite=None`;
    document.cookie = `language=11dc2f3d242b5baaa59bb45103c63bd0a53cff87s%3A2%3A%22en%22%3B; path=/; SameSite=Lax`;
    document.cookie = `YII_CSRF_TOKEN=958a9abeaec548bc30f689286276d960f6c5cc07s%3A88%3A%22WjhZSW11UFozUUF; path=/; SameSite=Lax`;

    // Navigate to login
    document.location.href = '/login';
  }

  return (
    <div className={styles.gateWrapper}>
      <input
        type="submit"
        value="LOGIN"
        onClick={login}
        className={styles.gateBtn}
        id="gate-login-btn"
      />
    </div>
  );
}
