"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Brand, Icon } from "./icons";

const steps = [
  { n: "01", title: "Send the name.", text: "Share the employee’s basics. No forms, policy research or HR expertise required.", icon: "people", color: "lime" },
  { n: "02", title: "We run the playbook.", text: "PeoplePilot launches the right contracts, tax forms and statutory training.", icon: "spark", color: "purple" },
  { n: "03", title: "Watch it get done.", text: "Track every signature, task and deadline from one clear progress view.", icon: "check", color: "orange" },
];

const roles = [
  { label: "Employer", title: "Run your team, not the paperwork.", text: "Start onboarding in a click, see compliance at a glance, access employee files, time, payroll and every policy you need.", icon: "building" },
  { label: "Employee", title: "A first day that feels effortless.", text: "Follow a friendly onboarding guide, sign documents, finish training, and find leave, payslips and benefits anytime.", icon: "people" },
  { label: "HR Operations", title: "Expert control behind the scenes.", text: "Build location and industry-specific compliance packs, keep regulations current, and support every hire and exit.", icon: "shield" },
  { label: "Admin", title: "The right access for every role.", text: "Manage platform permissions, operational oversight and secure access across every client company.", icon: "settings" },
];

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [role, setRole] = useState(0);

  useEffect(() => {
    const items = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver((entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add("revealed")), { threshold: .16 });
    items.forEach(i => observer.observe(i));
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <nav className="nav">
        <Link href="/" aria-label="PeoplePilot home"><Brand /></Link>
        <div className={`nav-links ${menu ? "open" : ""}`}>
          <a href="#how" onClick={() => setMenu(false)}>How it works</a>
          <a href="#platform" onClick={() => setMenu(false)}>Platform</a>
          <a href="#roles" onClick={() => setMenu(false)}>For your team</a>
        </div>
        <div className="nav-actions">
          <Link className="text-link" href="/login">Log in</Link>
          <Link className="button button-dark button-small" href="/login">Start onboarding <Icon name="arrow" size={18}/></Link>
        </div>
        <button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Toggle navigation"><Icon name={menu ? "close" : "menu"}/></button>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse"/> Your virtual HR team</div>
          <h1>HR, handled.<br/><span>People, first.</span></h1>
          <p>We run onboarding, compliance and people ops for small businesses—so you can grow your team without becoming an HR expert.</p>
          <div className="hero-actions">
            <Link className="button button-dark" href="/login">Onboard your first hire <Icon name="arrow"/></Link>
            <a className="play-link" href="#how"><span className="play">↓</span> See how it works</a>
          </div>
          <div className="trust-row"><div className="avatars"><span>AK</span><span>MJ</span><span>TS</span></div><p><strong>500+ small teams</strong><br/>already breathe easier</p></div>
        </div>
        <div className="hero-visual" aria-label="Onboarding progress preview">
          <div className="orb orb-purple"><Icon name="file" size={34}/></div>
          <div className="orb orb-lime"><Icon name="check" size={38}/></div>
          <div className="orb orb-blue"><Icon name="people" size={34}/></div>
          <div className="dashboard-preview">
            <div className="preview-top"><span className="mini-brand">P</span><span>Onboarding</span><span className="dots">•••</span></div>
            <div className="welcome-row"><div><small>NEW HIRE</small><h3>Welcome, Maya!</h3><p>4 of 5 tasks complete</p></div><div className="avatar-big">MC</div></div>
            <div className="progress"><span style={{width:"80%"}}/></div>
            <div className="task done"><span><Icon name="check" size={16}/></span><div><strong>Personal details</strong><small>Completed today</small></div></div>
            <div className="task done"><span><Icon name="check" size={16}/></span><div><strong>Employment agreement</strong><small>Signed & secured</small></div></div>
            <div className="task active"><span>3</span><div><strong>Workplace training</strong><small>12 min remaining</small></div><Icon name="chevron" size={18}/></div>
          </div>
          <div className="floating-note"><span><Icon name="shield" size={20}/></span><div><strong>100% compliant</strong><small>We keep the rules current.</small></div></div>
        </div>
      </section>

      <section className="logo-strip"><span>Trusted by growing teams at</span><strong>northstar</strong><strong>COMMON.</strong><strong>WEAVE</strong><strong>Kindred</strong><strong>bramble</strong></section>

      <section className="statement">
        <div className="sticker sticker-a" data-reveal><Icon name="shield" size={42}/></div>
        <div className="sticker sticker-b" data-reveal><Icon name="heart" size={42}/></div>
        <p>Hiring should feel exciting.</p>
        <h2>Not like a legal<br/>obstacle course.</h2>
        <p className="statement-note">That’s why we combine smart software with real HR operations—configured and maintained for you.</p>
      </section>

      <section id="how" className="how">
        <div className="section-heading">
          <div><div className="eyebrow eyebrow-light"><span/> HOW IT WORKS</div><h2>One name in.<br/>Everything handled.</h2></div>
          <p>You tell us who’s joining. We take care of the right process for their location and role.</p>
        </div>
        <div className="steps">
          {steps.map((step, i) => <article className={`step-card ${step.color}`} key={step.n} data-reveal style={{transitionDelay:`${i*100}ms`}}>
            <span className="step-num">{step.n}</span><div className="step-icon"><Icon name={step.icon} size={38}/></div><h3>{step.title}</h3><p>{step.text}</p>
          </article>)}
        </div>
      </section>

      <section id="platform" className="platform">
        <div className="platform-copy">
          <div className="eyebrow"><span/> ONE CALM PLACE</div>
          <h2>Clarity for every people task.</h2>
          <p>Documents, deadlines and data stay together. Nothing gets buried in inboxes or spreadsheets.</p>
          <ul>
            <li><Icon name="check" size={17}/> Live compliance progress</li>
            <li><Icon name="check" size={17}/> Employee records and signed files</li>
            <li><Icon name="check" size={17}/> Time, leave and payroll statements</li>
            <li><Icon name="check" size={17}/> Policies and legal information</li>
          </ul>
          <Link className="inline-arrow" href="/login">Explore the dashboard <Icon name="arrow" size={20}/></Link>
        </div>
        <div className="platform-panel" data-reveal>
          <div className="panel-head"><div><small>TEAM OVERVIEW</small><h3>Good morning, Jamie.</h3></div><button><Icon name="plus" size={18}/> Add employee</button></div>
          <div className="mini-stats"><div><span>ACTIVE PEOPLE</span><b>24</b><small className="up">↑ 3 this month</small></div><div><span>COMPLIANCE</span><b>96%</b><small>2 actions left</small></div><div><span>ON LEAVE</span><b>03</b><small>View calendar</small></div></div>
          <div className="team-table">
            <div className="table-title"><strong>Onboarding</strong><span>View all →</span></div>
            {[["NL","Noah Lee","Product Designer","88%","purple"],["AO","Amelia Ortiz","Account Manager","64%","orange"],["IF","Isaac Flores","Engineer","100%","green"]].map(row => <div className="person-row" key={row[1]}><span className={`person-avatar ${row[4]}`}>{row[0]}</span><div><strong>{row[1]}</strong><small>{row[2]}</small></div><div className="bar"><i style={{width:row[3]}}/></div><b>{row[3]}</b></div>)}
          </div>
        </div>
      </section>

      <section id="roles" className="roles">
        <div className="role-tabs">{roles.map((r,i)=><button className={i===role?"active":""} onClick={()=>setRole(i)} key={r.label}>{r.label}</button>)}</div>
        <div className="role-content">
          <div className="role-icon"><Icon name={roles[role].icon} size={52}/></div>
          <div><p className="role-kicker">BUILT FOR {roles[role].label.toUpperCase()}</p><h2>{roles[role].title}</h2></div>
          <div><p>{roles[role].text}</p><Link href="/login">View the experience <Icon name="arrow" size={20}/></Link></div>
        </div>
      </section>

      <section className="cta">
        <div className="cta-icon cta-i1" data-reveal><Icon name="calendar" size={36}/></div>
        <div className="cta-icon cta-i2" data-reveal><Icon name="payroll" size={36}/></div>
        <div className="cta-icon cta-i3" data-reveal><Icon name="heart" size={36}/></div>
        <div className="eyebrow eyebrow-light"><span/> SMALL TEAM. SERIOUS SUPPORT.</div>
        <h2>Your people deserve<br/>a proper HR team.</h2>
        <p>Now your business can have one—without hiring one.</p>
        <Link className="button button-lime" href="/login">Get started free <Icon name="arrow"/></Link>
      </section>

      <footer>
        <div><Brand light/><p>Human support. Smart systems.<br/>HR that simply gets done.</p></div>
        <div className="footer-links"><div><strong>Platform</strong><a href="#how">How it works</a><a href="#platform">Features</a><Link href="/login">Log in</Link></div><div><strong>Company</strong><a href="#">About</a><a href="#">Careers</a><a href="#">Contact</a></div><div><strong>Legal</strong><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Security</a></div></div>
        <div className="footer-bottom"><span>© 2026 PeoplePilot, Inc.</span><span>HR, handled with care.</span></div>
      </footer>
    </main>
  );
}
