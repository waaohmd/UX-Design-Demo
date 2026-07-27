"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Brand, Icon } from "../icons";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("jamie@northstar.co");
  const [password, setPassword] = useState("peoplepilot");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setTimeout(()=>router.push("/dashboard"), 700);
  };
  return <main className="login-page">
    <section className="login-art">
      <Link href="/"><Brand light/></Link>
      <div className="login-quote"><div className="quote-mark">“</div><h2>I hired a person.<br/><span>PeoplePilot handled</span><br/>the rest.</h2><p>Everything was signed, compliant and ready before Monday.</p><div className="quote-person"><span>JM</span><div><strong>Jamie Morgan</strong><small>Founder, Northstar Studio</small></div></div></div>
      <div className="login-shape shape-one"><Icon name="shield" size={34}/></div><div className="login-shape shape-two"><Icon name="spark" size={38}/></div>
    </section>
    <section className="login-form-wrap">
      <div className="mobile-brand"><Brand/></div>
      <Link className="back-link" href="/">← Back to home</Link>
      <form className="login-form" onSubmit={submit}>
        <div className="eyebrow"><span/> WELCOME BACK</div>
        <h1>Good to see you.</h1>
        <p>Log in to keep your people moving.</p>
        <label>Work email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" required/></label>
        <label>Password <Link href="#">Forgot password?</Link><div className="password-field"><input type={show?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} required/><button type="button" onClick={()=>setShow(!show)} aria-label="Show password"><Icon name="eye" size={19}/></button></div></label>
        <button className="button button-dark login-submit" disabled={loading}>{loading ? "Taking you in…" : <>Log in <Icon name="arrow"/></>}</button>
        <div className="login-divider"><span>or</span></div>
        <button type="button" className="sso-button"><span className="google-g">G</span> Continue with Google</button>
        <p className="signup-note">New to PeoplePilot? <a href="mailto:hello@peoplepilot.co">Talk to our team</a></p>
        <div className="secure-note"><Icon name="lock" size={15}/> Your data is encrypted and protected.</div>
      </form>
    </section>
  </main>
}
