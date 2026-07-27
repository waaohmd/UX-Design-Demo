"use client";

import Link from "next/link";
import { useState } from "react";
import { Brand, Icon } from "../icons";

const roleData = {
  Employer: { greeting: "Good morning, Jamie.", sub: "Your team is 96% compliant. Two small actions need you.", stats: [["24","Active people","↑ 3 this month"],["4","Onboarding","2 need attention"],["96%","Compliance","↑ 4% this week"],["3","On leave","View calendar"]] },
  Employee: { greeting: "Good morning, Maya.", sub: "You’re all set. Here’s what’s happening at Northstar.", stats: [["12.5","Leave days","Available"],["100%","Onboarding","All complete"],["1","Payslip","Ready to view"],["4","Benefits","Active plans"]] },
  "HR Operations": { greeting: "Operations overview.", sub: "Eight client companies have active people tasks today.", stats: [["18","Open tasks","5 high priority"],["8","Active clients","All regions"],["42","Onboardings","12 this week"],["98%","SLA met","↑ 2% this month"]] },
  Admin: { greeting: "Platform control center.", sub: "Systems are healthy. One access review is due.", stats: [["132","Users","Across 4 roles"],["8","Companies","All active"],["99.9%","Uptime","Last 30 days"],["1","Access review","Due Friday"]] },
};

const team = [
  { initials:"NL", name:"Noah Lee", role:"Product Designer", start:"Aug 04", progress:88, status:"In progress", color:"purple" },
  { initials:"AO", name:"Amelia Ortiz", role:"Account Manager", start:"Aug 11", progress:64, status:"Action needed", color:"orange" },
  { initials:"IF", name:"Isaac Flores", role:"Software Engineer", start:"Jul 21", progress:100, status:"Complete", color:"green" },
  { initials:"SK", name:"Sofia Kim", role:"Operations Lead", start:"Jul 14", progress:100, status:"Complete", color:"blue" },
];

export default function Dashboard(){
  const [role,setRole]=useState("Employer");
  const [modal,setModal]=useState(false);
  const [toast,setToast]=useState("");
  const data=roleData[role];
  const notify=(msg)=>{setToast(msg); setTimeout(()=>setToast(""),2500)};
  return <main className="app-shell">
    <aside className="sidebar">
      <Link href="/"><Brand light/></Link>
      <nav>
        <span className="side-label">WORKSPACE</span>
        <a className="active"><Icon name="building" size={19}/> Overview</a><a><Icon name="people" size={19}/> People <b>24</b></a><a><Icon name="spark" size={19}/> Onboarding <b>4</b></a><a><Icon name="clock" size={19}/> Time & leave</a><a><Icon name="payroll" size={19}/> Payroll</a><a><Icon name="heart" size={19}/> Benefits</a>
        <span className="side-label">COMPLIANCE</span>
        <a><Icon name="shield" size={19}/> Compliance</a><a><Icon name="file" size={19}/> Documents</a><a><Icon name="book" size={19}/> Policies</a>
      </nav>
      <div className="sidebar-bottom"><a><Icon name="settings" size={19}/> Settings</a><Link href="/login"><Icon name="logout" size={19}/> Log out</Link><div className="user-chip"><span>JM</span><div><strong>Jamie Morgan</strong><small>Northstar Studio</small></div></div></div>
    </aside>
    <section className="dashboard-main">
      <header><div><small>Northstar Studio <b>●</b> London, UK</small></div><div className="dash-actions"><button className="icon-button" onClick={()=>notify("You’re all caught up!")}><Icon name="bell" size={19}/><i/></button><select value={role} onChange={e=>setRole(e.target.value)} aria-label="Preview role">{Object.keys(roleData).map(r=><option key={r}>{r}</option>)}</select><button className="button button-dark button-small" onClick={()=>setModal(true)}><Icon name="plus" size={18}/> Add employee</button></div></header>
      <div className="dash-content">
        <div className="dash-title"><div><h1>{data.greeting}</h1><p>{data.sub}</p></div><span>MONDAY, 27 JULY</span></div>
        <div className="stat-grid">{data.stats.map((s,i)=><article key={s[1]}><div className={`stat-symbol stat-${i}`}><Icon name={["people","spark","shield","calendar"][i]} size={20}/></div><span>{s[1]}</span><b>{s[0]}</b><small>{s[2]}</small></article>)}</div>
        <div className="dash-grid">
          <section className="dash-card onboarding-card">
            <div className="card-title"><div><h2>Onboarding</h2><p>Keep every new hire moving.</p></div><button>View all <Icon name="arrow" size={16}/></button></div>
            <div className="team-head"><span>EMPLOYEE</span><span>START DATE</span><span>PROGRESS</span><span>STATUS</span><span/></div>
            {team.map(p=><div className="team-line" key={p.name}><div className="team-name"><span className={`person-avatar ${p.color}`}>{p.initials}</span><div><strong>{p.name}</strong><small>{p.role}</small></div></div><span>{p.start}</span><div className="progress-cell"><div><i style={{width:`${p.progress}%`}}/></div><b>{p.progress}%</b></div><span className={`status ${p.progress===100?"complete":p.progress<70?"attention":"working"}`}>{p.status}</span><button>•••</button></div>)}
          </section>
          <aside className="dash-card action-card"><div className="card-title"><div><h2>Your actions</h2><p>Two things need you.</p></div><span className="count">2</span></div>
            <button className="action-item" onClick={()=>notify("Company details opened")}><span className="action-icon orange"><Icon name="building" size={20}/></span><div><strong>Complete company details</strong><small>Needed for tax registration</small><em>Due today</em></div><Icon name="chevron" size={18}/></button>
            <button className="action-item" onClick={()=>notify("Document review opened")}><span className="action-icon purple"><Icon name="file" size={20}/></span><div><strong>Review Amelia’s document</strong><small>Right to work verification</small><em>Due tomorrow</em></div><Icon name="chevron" size={18}/></button>
            <div className="all-good"><Icon name="shield" size={22}/><p><strong>Everything else is covered.</strong><br/>Our HR team is handling 12 background tasks.</p></div>
          </aside>
          <section className="dash-card compliance-card"><div className="compliance-score"><div className="ring"><strong>96</strong><span>%</span></div><div><span>COMPLIANCE SCORE</span><h2>Your company is in great shape.</h2><p>Up 4% since last week.</p></div></div><div className="compliance-items"><span><i className="green-dot"/> Employment docs <b>100%</b></span><span><i className="purple-dot"/> Statutory training <b>92%</b></span><span><i className="orange-dot"/> Company details <b>84%</b></span></div></section>
          <section className="dash-card activity-card"><div className="card-title"><div><h2>Recent activity</h2><p>Updates from your team.</p></div></div>{[["check","Isaac completed onboarding","8 min ago"],["file","Noah signed Employment Agreement","2 hrs ago"],["calendar","Sofia requested annual leave","Yesterday"]].map(a=><div className="activity" key={a[1]}><span><Icon name={a[0]} size={17}/></span><p><strong>{a[1]}</strong><small>{a[2]}</small></p></div>)}</section>
        </div>
      </div>
    </section>
    {modal&&<div className="modal-backdrop" onMouseDown={()=>setModal(false)}><form className="modal" onMouseDown={e=>e.stopPropagation()} onSubmit={e=>{e.preventDefault();setModal(false);notify("Onboarding invite sent")}}><button type="button" className="modal-close" onClick={()=>setModal(false)}><Icon name="close"/></button><div className="modal-icon"><Icon name="people" size={30}/></div><p className="role-kicker">START ONBOARDING</p><h2>Add a new employee</h2><p>Just the basics. Our HR team will take it from here.</p><label>Full name<input placeholder="e.g. Taylor Reid" required/></label><label>Work email<input type="email" placeholder="taylor@company.com" required/></label><div className="form-row"><label>Start date<input type="date" required/></label><label>Work location<select><option>United Kingdom</option><option>United States</option><option>Canada</option></select></label></div><button className="button button-dark">Send to HR <Icon name="arrow"/></button></form></div>}
    {toast&&<div className="toast"><Icon name="check" size={18}/>{toast}</div>}
  </main>
}
