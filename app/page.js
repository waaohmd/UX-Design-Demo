"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Brand, Icon } from "./icons";

const steps = [
  { n: "01", title: "Send the name.", text: "Share the employee’s basics. No forms, policy research or HR expertise required.", icon: "people", color: "lime" },
  { n: "02", title: "We run the playbook.", text: "demo launches the right contracts, tax forms and statutory training.", icon: "spark", color: "purple" },
  { n: "03", title: "Watch it get done.", text: "Track every signature, task and deadline from one clear progress view.", icon: "check", color: "orange" },
];

const roles = [
  { label: "Employer", title: "Run your team, not the paperwork.", text: "Start onboarding in a click, see compliance at a glance, access employee files, time, payroll and every policy you need.", icon: "building" },
  { label: "Employee", title: "A first day that feels effortless.", text: "Follow a friendly onboarding guide, sign documents, finish training, and find leave, payslips and benefits anytime.", icon: "people" },
  { label: "HR Operations", title: "Expert control behind the scenes.", text: "Build location and industry-specific compliance packs, keep regulations current, and support every hire and exit.", icon: "shield" },
  { label: "Admin", title: "The right access for every role.", text: "Manage platform permissions, operational oversight and secure access across every client company.", icon: "settings" },
];

const locations = {
  Africa: [
    ["🇪🇬","Egypt"],["🇰🇪","Kenya"],["🇳🇬","Nigeria"],["🇿🇦","South Africa"],["🇹🇳","Tunisia"],
  ],
  America: [
    ["🇦🇷","Argentina"],["🇧🇷","Brazil"],["🇨🇦","Canada"],["🇨🇱","Chile"],["🇨🇴","Colombia"],["🇨🇷","Costa Rica"],["🇩🇴","Dominican Republic"],["🇸🇻","El Salvador"],["🇬🇱","Greenland"],["🇬🇹","Guatemala"],["🇲🇽","Mexico"],["🇵🇦","Panama"],["🇵🇪","Peru"],["🇹🇹","Trinidad and Tobago"],["🇺🇸","USA"],
  ],
  "Asia Pacific": [
    ["🇦🇺","Australia"],["🇧🇩","Bangladesh"],["🇰🇭","Cambodia"],["🇨🇳","China"],["🇭🇰","Hong Kong"],["🇮🇳","India"],["🇮🇩","Indonesia"],["🇯🇵","Japan"],["🇰🇿","Kazakhstan"],["🇰🇬","Kyrgyzstan"],["🇲🇴","Macau"],["🇲🇾","Malaysia"],["🇲🇳","Mongolia"],["🇳🇿","New Zealand"],["🇵🇰","Pakistan"],["🇵🇭","Philippines"],["🇶🇦","Qatar"],["🇸🇦","Saudi Arabia"],["🇸🇬","Singapore"],["🇰🇷","South Korea"],["🇱🇰","Sri Lanka"],["🇹🇼","Taiwan"],["🇹🇭","Thailand"],["🇦🇪","UAE"],["🇺🇿","Uzbekistan"],["🇻🇳","Vietnam"],
  ],
  Europe: [
    ["🇦🇹","Austria"],["🇧🇾","Belarus"],["🇧🇪","Belgium"],["🇧🇬","Bulgaria"],["🇭🇷","Croatia"],["🇨🇾","Cyprus"],["🇩🇰","Denmark"],["🇪🇪","Estonia"],["🇫🇴","Faroe Islands"],["🇫🇮","Finland"],["🇫🇷","France"],["🇩🇪","Germany"],["🇬🇷","Greece"],["🇭🇺","Hungary"],["🇮🇸","Iceland"],["🇮🇪","Ireland"],["🇮🇱","Israel"],["🇮🇹","Italy"],["🇱🇹","Lithuania"],["🇱🇺","Luxembourg"],["🇲🇰","Macedonia"],["🇲🇹","Malta"],["🇲🇩","Moldova"],["🇳🇱","Netherlands"],["🇳🇴","Norway"],["🇵🇱","Poland"],["🇵🇹","Portugal"],["🇷🇴","Romania"],["🏴","Scotland"],["🇷🇸","Serbia"],["🇪🇸","Spain"],["🇸🇪","Sweden"],["🇨🇭","Switzerland"],["🇹🇷","Turkey"],["🇬🇧","UK"],["🇺🇦","Ukraine"],
  ],
};

const flagCode = (flag, country) => country === "Scotland"
  ? "gb-sct"
  : [...flag].map(character => String.fromCharCode(character.codePointAt(0) - 127397)).join("").toLowerCase();

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
        <Link href="/" aria-label="demo home"><Brand light /></Link>
        <div className={`nav-links ${menu ? "open" : ""}`}>
          <a href="#how" onClick={() => setMenu(false)}>How it works</a>
          <a href="#platform" onClick={() => setMenu(false)}>Platform</a>
          <a href="#roles" onClick={() => setMenu(false)}>For your team</a>
          <a href="#about" onClick={() => setMenu(false)}>About us</a>
        </div>
        <div className="nav-actions">
          <Link className="button button-lime button-small" href="/dashboard">Open workspace <Icon name="arrow" size={18}/></Link>
        </div>
        <button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Toggle navigation"><Icon name={menu ? "close" : "menu"}/></button>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse"/> Your virtual HR team</div>
          <h1>HR, handled.<br/><span>People, first.</span></h1>
          <p>We run onboarding, compliance and people ops for small businesses—so you can grow your team without becoming an HR expert.</p>
          <div className="hero-actions">
            <button className="button button-lime button-static" type="button" disabled>Log in <Icon name="arrow"/></button>
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

      <section className="logo-strip"><span>Trusted by growing teams at</span><strong>company1</strong><strong>company2</strong><strong>company3</strong><strong>company4</strong><strong>company5</strong></section>

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
          <Link className="inline-arrow" href="/dashboard">Explore the dashboard <Icon name="arrow" size={20}/></Link>
        </div>
        <div className="platform-panel" data-reveal>
          <div className="panel-head"><div><small>TEAM OVERVIEW</small><h3>Good morning, Jamie.</h3></div></div>
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
          <div><p>{roles[role].text}</p><Link href="/dashboard">View the experience <Icon name="arrow" size={20}/></Link></div>
        </div>
      </section>

      <section className="audience-views">
        <div className="audience-heading">
          <div className="eyebrow eyebrow-light"><span/> TWO ROLES. ONE SYSTEM.</div>
          <h2>Different views.<br/>The same clear truth.</h2>
          <p>Each person sees only what matters to them, while every status and action stays perfectly in sync.</p>
        </div>
        <div className="view-grid">
          <article className="view-showcase employer-showcase" data-reveal>
            <div className="view-label"><span><Icon name="building" size={18}/></span><div><small>FOR THE BUSINESS OWNER</small><strong>Employer view</strong></div></div>
            <div className="view-window">
              <div className="view-window-head"><Brand light/><span>Employer workspace</span><div className="view-avatar">JM</div></div>
              <div className="view-welcome"><div><small>MONDAY, 27 JULY</small><h3>Good morning, Jamie.</h3><p>Your team is 96% compliant.</p></div></div>
              <div className="view-stats"><div><span>ACTIVE PEOPLE</span><b>24</b><small>↑ 3 this month</small></div><div><span>ONBOARDING</span><b>04</b><small>2 need attention</small></div><div><span>COMPLIANCE</span><b>96%</b><small>Up 4% this week</small></div></div>
              <div className="view-split">
                <div className="view-list"><div className="view-list-title"><strong>New hires</strong><span>View all →</span></div>{[["NL","Noah Lee","88%"],["AO","Amelia Ortiz","64%"],["IF","Isaac Flores","100%"]].map((p,i)=><div className="view-person" key={p[1]}><i className={`view-person-avatar a${i}`}>{p[0]}</i><span><strong>{p[1]}</strong><small>Onboarding</small></span><div><em style={{width:p[2]}}/></div><b>{p[2]}</b></div>)}</div>
                <div className="view-actions"><div className="view-list-title"><strong>Your actions</strong><span className="view-count">2</span></div><p><i className="orange-mark"><Icon name="building" size={15}/></i><span><b>Complete company details</b><small>Due today</small></span></p><p><i className="purple-mark"><Icon name="file" size={15}/></i><span><b>Review Amelia’s document</b><small>Due tomorrow</small></span></p></div>
              </div>
            </div>
            <p className="view-caption">Owners see company-level progress, risk and the few actions that need their attention.</p>
          </article>

          <article className="view-showcase employee-showcase" data-reveal>
            <div className="view-label"><span><Icon name="people" size={18}/></span><div><small>FOR EVERY TEAM MEMBER</small><strong>Employee view</strong></div></div>
            <div className="view-window">
              <div className="view-window-head"><Brand light/><span>My workspace</span><div className="view-avatar employee-avatar">MC</div></div>
              <div className="view-welcome employee-welcome"><div><small>WELCOME BACK</small><h3>Hi, Maya.</h3><p>You’re all set for the week.</p></div><div className="complete-pill"><Icon name="check" size={14}/> Onboarding complete</div></div>
              <div className="view-stats employee-stats"><div><span>LEAVE BALANCE</span><b>12.5</b><small>days available</small></div><div><span>NEXT PAYDAY</span><b>31</b><small>July 2026</small></div><div><span>BENEFITS</span><b>04</b><small>active plans</small></div></div>
              <div className="employee-content">
                <div className="leave-card"><div className="view-list-title"><strong>My time off</strong><span>View calendar →</span></div><div className="leave-visual"><div className="leave-ring"><b>12.5</b><small>days left</small></div><div><p><i className="purple-dot"/> Annual leave <b>20 days</b></p><p><i className="green-dot"/> Public holidays <b>8 days</b></p><p><i className="orange-dot"/> Used this year <b>7.5 days</b></p></div></div></div>
                <div className="employee-links"><button><i><Icon name="payroll" size={17}/></i><span><b>July payslip</b><small>Ready to view</small></span><Icon name="chevron" size={16}/></button><button><i><Icon name="heart" size={17}/></i><span><b>Health insurance</b><small>Plan details</small></span><Icon name="chevron" size={16}/></button><button><i><Icon name="book" size={17}/></i><span><b>Company handbook</b><small>Updated 2 days ago</small></span><Icon name="chevron" size={16}/></button></div>
              </div>
            </div>
            <p className="view-caption">Employees get a personal, private home for onboarding, leave, pay and benefits.</p>
          </article>
        </div>
      </section>

      <section className="cta">
        <div className="cta-icon cta-i1" data-reveal><Icon name="calendar" size={36}/></div>
        <div className="cta-icon cta-i2" data-reveal><Icon name="payroll" size={36}/></div>
        <div className="cta-icon cta-i3" data-reveal><Icon name="heart" size={36}/></div>
        <div className="eyebrow eyebrow-light"><span/> SMALL TEAM. SERIOUS SUPPORT.</div>
        <h2>Your people deserve<br/>a proper HR team.</h2>
        <p>Now your business can have one—without hiring one.</p>
        <Link className="button button-lime" href="/dashboard">Open workspace <Icon name="arrow"/></Link>
      </section>

      <section id="about" className="about">
        <div className="about-intro">
          <div className="eyebrow eyebrow-light"><span/> ABOUT US</div>
          <h2>Built for small teams.<br/>Backed by real people.</h2>
        </div>
        <div className="about-grid">
          <p className="about-lead">demo is a test company making everyday HR feel clear, calm and human.</p>
          <div className="about-copy">
            <p>We bring practical tools, thoughtful guidance and dependable support into one simple place.</p>
            <p>This is placeholder copy for testing the page layout. Replace it later with your company story, mission and values.</p>
          </div>
        </div>
        <div className="about-values">
          <article><span>01</span><h3>Clear by default</h3><p>Simple words, visible progress and fewer surprises.</p></article>
          <article><span>02</span><h3>Human when it matters</h3><p>Real support for the moments software cannot solve alone.</p></article>
          <article><span>03</span><h3>Built to grow</h3><p>A calm foundation for every new person and every next step.</p></article>
        </div>
      </section>

      <footer>
        <div><Brand light/><p>Human support. Smart systems.<br/>HR that simply gets done.</p></div>
        <div className="footer-links"><div><strong>Platform</strong><a href="#how">How it works</a><a href="#platform">Features</a><Link href="/dashboard">Workspace</Link></div><div><strong>Company</strong><a href="#">About</a><a href="#">Careers</a><a href="#">Contact</a></div><div><strong>Legal</strong><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Security</a></div></div>
        <div className="footer-bottom"><span>© 2026 demo, Inc.</span><span>HR, handled with care.</span></div>
      </footer>
    </main>
  );
}
