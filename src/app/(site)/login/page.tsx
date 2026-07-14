'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

type Language = 'en' | 'ru' | 'fr';

const translations: Record<Language, {
  username: string; password: string; captcha: string;
  login: string; registration: string; forgot: string;
  forgotLink: string; regStatus: string; regFee: string; open: string;
}> = {
  en: {
    username: 'Username *', password: 'Password *', captcha: 'Captcha *',
    login: 'Login', registration: 'Registration',
    forgot: 'Forgot your password use', forgotLink: 'this form',
    regStatus: 'Registration:', regFee: 'Registration Fee:', open: 'Open',
  },
  ru: {
    username: 'Имя пользователя *', password: 'Пароль *', captcha: 'Капча *',
    login: 'Войти', registration: 'Регистрация',
    forgot: 'Забыли пароль? Используйте', forgotLink: 'эту форму',
    regStatus: 'Регистрация:', regFee: 'Регистрационный взнос:', open: 'Открыта',
  },
  fr: {
    username: "Nom d'utilisateur *", password: 'Mot de passe *', captcha: 'Captcha *',
    login: 'Connexion', registration: "S'inscrire",
    forgot: 'Mot de passe oublié, utilisez', forgotLink: 'ce formulaire',
    regStatus: 'Inscription:', regFee: "Frais d'inscription:", open: 'Ouverte',
  },
};

const flagCode: Record<Language, string> = { en: 'us', ru: 'ru', fr: 'fr' };
const langLabel: Record<Language, string> = { en: 'English', ru: 'Русский', fr: 'Français' };

function FlagImg({ lang, size = 20 }: { lang: Language; size?: number }) {
  const code = flagCode[lang];
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      width={size * 1.5}
      height={size}
      alt={langLabel[lang]}
      style={{
        display: 'inline-block',
        borderRadius: '2px',
        objectFit: 'cover',
        verticalAlign: 'middle',
        boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
        flexShrink: 0,
      }}
    />
  );
}


function generateCaptchaValue() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function LoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Language>('en');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const t = translations[lang];

  // Init captcha
  useEffect(() => {
    setCaptchaValue(generateCaptchaValue());
  }, []);

  // Draw captcha on canvas whenever captchaValue changes
  useEffect(() => {
    const el = canvasRef.current;
    if (!el || !captchaValue) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    el.width = 100;
    el.height = 40;
    ctx.fillStyle = '#1a2a1a';
    ctx.fillRect(0, 0, 100, 40);
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.floor(Math.random()*80+80)},${Math.floor(Math.random()*150+50)},${Math.floor(Math.random()*80)},0.5)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * 100, Math.random() * 40);
      ctx.lineTo(Math.random() * 100, Math.random() * 40);
      ctx.stroke();
    }
    ctx.font = 'bold 20px monospace';
    ctx.fillStyle = '#aed1b2';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    captchaValue.split('').forEach((ch, i) => {
      ctx.save();
      ctx.translate(12 + i * 16, 20);
      ctx.rotate((Math.random() - 0.5) * 0.45);
      ctx.fillText(ch, 0, 0);
      ctx.restore();
    });
  }, [captchaValue]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Read lang from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const l = params.get('lang') as Language;
    if (l && translations[l]) setLang(l);
  }, []);

  const refreshCaptcha = () => {
    setCaptchaValue(generateCaptchaValue());
    setCaptchaInput('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (captchaInput.toUpperCase() !== captchaValue) {
      setError('Invalid captcha. Please try again.');
      refreshCaptcha();
      return;
    }
    setLoading(true);
    // Set session cookies on login
    document.cookie = `session=c7aidep0rr4rgubh3d0lglth0v; path=/; SameSite=Lax`;
    document.cookie = `YII_CSRF_TOKEN=958a9abeaec548bc30f689286276d960f6c5cc07s%3A88%3A%22WjhZSW11UFozUUF; path=/; SameSite=Lax`;
    document.cookie = `language=${lang}; path=/; SameSite=Lax`;
    setTimeout(() => {
      router.push('/dashboard');
    }, 600);
  };

  const selectLang = (l: Language) => {
    setLang(l);
    setDropdownOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', l);
    window.history.pushState({}, '', url.toString());
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.inner}>
        <div className="container">
          <div className="row" style={{ textAlign: 'center' }}>
            <div className="col-md-12">

              {/* Registration banner */}
              <div className={`text registration ${styles.regBanner}`}>
                {t.regStatus} <strong>{t.open}</strong>,&nbsp;
                {t.regFee} <strong>$50</strong>
              </div>

              {/* Login form */}
              <div className="form">
                <form id="yw0" action="/login" method="post" onSubmit={handleLogin} autoComplete="off">

                  {/* Username */}
                  <div className="fields">
                    <div className="fields-half">
                      <div className="form-group">
                        <label htmlFor="inputUsername">Username <span className="required">*</span></label>
                        <div className="controls">
                          <input
                            id="inputUsername"
                            className="form-control"
                            placeholder={t.username}
                            name="P_LoginForm[username]"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="fields">
                    <div className="fields-half">
                      <div className="form-group">
                        <label htmlFor="inputPassword">Password <span className="required">*</span></label>
                        <div className="controls">
                          <input
                            id="inputPassword"
                            className="form-control"
                            placeholder={t.password}
                            name="P_LoginForm[password]"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Captcha */}
                  <div className="control-group-inline">
                    <div className="form-group">
                      <label htmlFor="inputCaptcha">Captcha</label>
                      <div className="controls" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <input
                          id="inputCaptcha"
                          autoComplete="off"
                          style={{
                            border: '1px solid #aed1b2', background: 'none', borderRadius: '5px',
                            color: '#c8d2bf', width: '110px', height: '40px', fontSize: '16px',
                            fontWeight: 'bold', padding: '0 10px', outline: 'none', fontFamily: 'inherit'
                          }}
                          placeholder={t.captcha}
                          name="P_LoginForm[verifyCode]"
                          type="text"
                          value={captchaInput}
                          onChange={e => setCaptchaInput(e.target.value)}
                        />
                        <div
                          id="captcha"
                          className={styles.captchaBox}
                          onClick={refreshCaptcha}
                          title="Click to refresh captcha"
                        >
                          <canvas ref={canvasRef} id="yw1" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div style={{ color: '#c00', fontSize: '13px', marginBottom: '10px' }}>
                      {error}
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="fields">
                    <div className="fields-half">
                      <div className="form-actions">
                        <button className="green btn btn-secondary" type="submit" name="yt0" disabled={loading}>
                          {loading ? '...' : t.login}
                        </button>
                      </div>
                      <div className="form-actions">
                        <a href="/register">
                          <button style={{}} className="btn btn-secondary" name="yt1" type="button">
                            {t.registration}
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Forgot password */}
                  <div className="fields" style={{ marginTop: '10px', fontSize: '14px' }}>
                    {t.forgot} <a href="/restore">{t.forgotLink}</a>.
                  </div>

                </form>
              </div>

              {/* Language switcher */}
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '10px 0', fontSize: '20px' }}>
                <div className="dropdown show" ref={dropdownRef} style={{ position: 'relative' }}>
                  <a
                    className="btn dropdown-toggle"
                    href="#"
                    role="button"
                    id="dropdownMenuLink"
                    onClick={e => { e.preventDefault(); setDropdownOpen(!dropdownOpen); }}
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', border: '1px solid #282828', padding: '6px 14px', borderRadius: '4px', textDecoration: 'none' }}
                  >
                    <FlagImg lang={lang} size={22} />
                    <span style={{ fontSize: '15px', fontWeight: 600 }}>{langLabel[lang]}</span>
                    <span style={{ fontSize: '10px', opacity: 0.6 }}>▼</span>
                  </a>
                  <div className={`dropdown-menu${dropdownOpen ? ' show' : ''}`} aria-labelledby="dropdownMenuLink">
                    {(['en', 'ru', 'fr'] as Language[]).map(l => (
                      <a
                        key={l}
                        className="dropdown-item language-item"
                        data-id={l}
                        href="#"
                        onClick={e => { e.preventDefault(); selectLang(l); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        <FlagImg lang={l} size={18} />
                        <span style={{ fontSize: '14px' }}>{langLabel[l]}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
