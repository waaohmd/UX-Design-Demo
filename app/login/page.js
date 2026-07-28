"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { Brand, Icon } from "../icons";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const turnstileContainer = useRef(null);
  const turnstileWidget = useRef(null);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("demo-product-theme-v2");
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
  }, []);

  const renderTurnstile = () => {
    if (!window.turnstile || !turnstileContainer.current || turnstileWidget.current !== null) return;
    turnstileWidget.current = window.turnstile.render(turnstileContainer.current, {
      sitekey: turnstileSiteKey,
      theme,
      size: "flexible",
      callback: token => setTurnstileToken(token),
      "expired-callback": () => setTurnstileToken(""),
      "error-callback": () => {
        setTurnstileToken("");
        setError("Cloudflare verification could not load. Please refresh and try again.");
      },
    });
  };

  useEffect(() => {
    if (!window.turnstile) return;
    if (turnstileWidget.current !== null) {
      window.turnstile.remove(turnstileWidget.current);
      turnstileWidget.current = null;
      setTurnstileToken("");
    }
    renderTurnstile();
  }, [theme]);

  const toggleTheme = () => {
    setTheme(currentTheme => {
      const nextTheme = currentTheme === "light" ? "dark" : "light";
      window.localStorage.setItem("demo-product-theme-v2", nextTheme);
      return nextTheme;
    });
  };

  const resetVerification = () => {
    setTurnstileToken("");
    if (window.turnstile && turnstileWidget.current !== null) window.turnstile.reset(turnstileWidget.current);
  };

  const changeMode = nextMode => {
    setMode(nextMode);
    setError("");
    resetVerification();
  };

  const submit = async event => {
    event.preventDefault();
    if (!turnstileToken || loading) return;
    setLoading(true);
    setError("");

    const response = await fetch(`/api/auth/${mode === "register" ? "register" : "login"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName, username, password, turnstileToken }),
    });
    const result = await response.json();
    if (response.ok) {
      window.location.href = "/dashboard";
      return;
    }
    setError(result.error || "Unable to continue.");
    setLoading(false);
    resetVerification();
  };

  return (
    <main className="login-page" data-theme={theme}>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onLoad={renderTurnstile} />
      <section className="login-art">
        <Brand light={theme === "dark"} />
        <div className="login-quote">
          <div className="quote-mark">“</div>
          <h2>HR should feel<br/><span>this simple</span></h2>
          <p>Create a private demo workspace or return to your existing account. No external identity provider is required.</p>
        </div>
        <div className="login-shape shape-one"><Icon name="shield" size={32}/></div>
        <div className="login-shape shape-two"><Icon name="people" size={32}/></div>
      </section>
      <section className="login-form-wrap">
        <Link className="mobile-brand" href="/"><Brand light={theme === "dark"} /></Link>
        <div className="login-top-actions">
          <button
            className="theme-switch login-theme-switch"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "bright"} mode`}
            aria-pressed={theme === "dark"}
          >
            <Icon name={theme === "light" ? "moon" : "sun"} size={17}/>
            <span>{theme === "light" ? "Dark" : "Bright"}</span>
          </button>
          <Link className="back-link" href="/">Back to site</Link>
        </div>
        <form className="login-form" onSubmit={submit}>
          <div className="eyebrow eyebrow-light"><span/> SECURE WORKSPACE</div>
          <div className="auth-tabs" aria-label="Account action">
            <button type="button" className={mode === "login" ? "active" : ""} onClick={() => changeMode("login")}>Log in</button>
            <button type="button" className={mode === "register" ? "active" : ""} onClick={() => changeMode("register")}>Register</button>
          </div>
          <h1>{mode === "register" ? "Create account" : "Welcome back"}</h1>
          <p>{mode === "register" ? "Start with an empty demo workspace." : "Log in to continue to your workspace."}</p>
          {mode === "register" && <label>Full name
            <input value={displayName} onChange={event => setDisplayName(event.target.value)} autoComplete="name" required />
          </label>}
          <label>Username
            <input value={username} onChange={event => setUsername(event.target.value)} autoComplete="username" minLength={3} required />
          </label>
          <label>Password
            <input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete={mode === "register" ? "new-password" : "current-password"} minLength={8} required />
          </label>
          <div className="turnstile-wrap" aria-label="Cloudflare bot verification" ref={turnstileContainer}/>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="button button-lime login-submit" disabled={loading || !turnstileToken}>
            {loading ? "Checking…" : mode === "register" ? "Create account" : "Log in"} <Icon name="arrow" size={18}/>
          </button>
        </form>
      </section>
    </main>
  );
}
