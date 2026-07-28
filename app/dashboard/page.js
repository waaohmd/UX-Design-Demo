"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Brand, Icon } from "../icons";

const documentCategories = [
  "Personal information",
  "Identity / right to work",
  "Tax and payroll",
  "Employment document",
  "Training certificate",
  "Other",
];

function DownloadLink({ href, children }) {
  return <a className="record-download" href={href}><Icon name="file" size={16}/>{children}<span>↓</span></a>;
}

function HolidayCalendar({ holidays }) {
  const holidayByDay = new Map(holidays.map(holiday => [Number(holiday.date.slice(-2)), holiday]));
  return (
    <section className="holiday-panel">
      <div className="role-section-head">
        <div><small>SHARED CALENDAR</small><h2>August 2026</h2></div>
        <span className="calendar-month">HOLIDAYS</span>
      </div>
      <div className="calendar-grid calendar-weekdays">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(day => <span key={day}>{day}</span>)}
      </div>
      <div className="calendar-grid">
        {Array.from({ length: 6 }, (_, index) => <span className="calendar-day empty" key={`blank-${index}`}/>)}
        {Array.from({ length: 31 }, (_, index) => index + 1).map(day => {
          const holiday = holidayByDay.get(day);
          return <span className={`calendar-day ${holiday ? "holiday" : ""}`} key={day} title={holiday?.name || ""}>
            <b>{day}</b>{holiday && <small>{holiday.name}</small>}
          </span>;
        })}
      </div>
      <div className="holiday-legend">
        {holidays.map(holiday => <p key={holiday.id}><span className={holiday.scope}/><strong>{holiday.date}</strong>{holiday.name}</p>)}
      </div>
    </section>
  );
}

function getHrAction(employee) {
  if (employee.onboardingProgress >= 100) return "Archive onboarding and confirm payroll.";
  if (employee.onboardingProgress >= 80) return "Review documents and send the contract.";
  return "Collect missing personal information.";
}

function formatFileSize(size) {
  if (size < 1024) return `${size} B`;
  return `${(size / 1024).toFixed(1)} KB`;
}

function MyFilesView({ files, onPreview, onReplace, onUpload, viewer = "Employee", title = "My files" }) {
  return (
    <section className="role-dashboard my-files-dashboard">
      <div className="role-section-head">
        <div><small>{viewer.toUpperCase()} VIEW</small><h2>{title}</h2></div><span>{files.length} ENCRYPTED FILES</span>
      </div>
      <p className="my-files-intro">Preview your documents or update an existing record without creating a duplicate.</p>
      {files.length ? (
        <div className="my-file-grid">
          {files.map(file => (
            <article className="my-file-card" key={file.id}>
              <div className="my-file-icon"><Icon name="file" size={26}/><small>V{file.version}</small></div>
              <small>{file.category}</small>
              <h3>{file.filename}</h3>
              <div className="my-file-meta"><span>{formatFileSize(file.size)}</span><span>Updated {String(file.updatedAt).slice(0, 10)}</span></div>
              <div className="my-file-actions">
                <button onClick={() => onPreview(file)}>Preview</button>
                <button onClick={() => onReplace(file)}>Update file</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="my-files-empty">
          <Icon name="file" size={34}/><h3>No files yet.</h3><p>Upload your first personal document to see it here.</p>
          <button className="button button-lime" onClick={onUpload}>Upload file</button>
        </div>
      )}
    </section>
  );
}

function PayrollView({ statement, viewer }) {
  return (
    <section className="role-dashboard focused-record-dashboard">
      <div className="role-section-head">
        <div><small>{viewer.toUpperCase()} VIEW</small><h2>Payroll statements</h2></div><span>PRIVATE & ENCRYPTED</span>
      </div>
      <p className="my-files-intro">Review and download your latest payroll statement from one place.</p>
      <div className="focused-record-grid">
        <article className="record-card payroll-card">
          <small>LATEST PAYROLL STATEMENT</small><h3>{statement?.period || "July 2026"}</h3>
          {statement ? <>
            <div className="money-row"><span>Gross <b>{statement.gross}</b></span><span>Tax <b>{statement.tax}</b></span><span>Net <b>{statement.net}</b></span></div>
            <DownloadLink href={statement.downloadUrl}>Download statement</DownloadLink>
          </> : <p>No payroll statement is available yet.</p>}
        </article>
      </div>
    </section>
  );
}

function BenefitsView({ benefits }) {
  return (
    <section className="role-dashboard focused-record-dashboard">
      <div className="role-section-head">
        <div><small>EMPLOYEE VIEW</small><h2>Benefits</h2></div><span>{benefits.length} ACTIVE PLANS</span>
      </div>
      <p className="my-files-intro">Your current coverage, providers and policy details.</p>
      <div className="focused-record-grid">
        {benefits.map(benefit => (
          <article className="record-card benefit-card" key={benefit.id}>
            <small>BENEFIT PLAN</small><h3>{benefit.plan}</h3><p>{benefit.details}</p>
            <dl><div><dt>Provider</dt><dd>{benefit.provider}</dd></div><div><dt>Policy</dt><dd>{benefit.policyNumber}</dd></div></dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContractsView({ contracts, onPreview, onSign }) {
  const employeeContracts = contracts.filter(contract => !contract.employeeId);
  return (
    <section className="role-dashboard focused-record-dashboard">
      <div className="role-section-head">
        <div><small>EMPLOYEE VIEW</small><h2>Contracts</h2></div><span>{employeeContracts.length} DOCUMENTS</span>
      </div>
      <p className="my-files-intro">Open each agreement to review it, then sign when you are ready.</p>
      <div className="contract-card-grid">
        {employeeContracts.map(contract => (
          <article className="contract-view-card" key={contract.id}>
            <div className="contract-view-icon"><Icon name="file" size={28}/></div>
            <small>EMPLOYMENT AGREEMENT</small>
            <h3>{contract.title}</h3>
            <p className="contract-status">{contract.status}</p>
            <div className="contract-view-actions">
              <button onClick={() => onPreview({
                ...contract,
                filename: contract.title,
                category: "Employment contract",
                mimeType: "text/plain",
                version: 1,
                isContract: true,
              })}>View contract</button>
              <button className="sign-contract-button" onClick={() => onSign(contract)}>Sign contract</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CalendarWorkspace({ holidays, viewer }) {
  return (
    <section className="role-dashboard focused-record-dashboard">
      <div className="role-section-head">
        <div><small>{viewer.toUpperCase()} VIEW</small><h2>Calendar</h2></div><span>SHARED HOLIDAYS</span>
      </div>
      <p className="my-files-intro">Company and statutory holidays shared with your workspace.</p>
      <HolidayCalendar holidays={holidays}/>
    </section>
  );
}

const policyCountries = [
  {
    name: "Netherlands",
    code: "netherlands",
    policies: [
      ["Employment agreements", "Placeholder guidance for contract terms, probation and notice periods."],
      ["Holiday allowance", "Placeholder requirements for annual leave and statutory holiday pay."],
      ["Sickness reporting", "Placeholder workflow for absence reporting and employer follow-up."],
    ],
  },
  {
    name: "Spain",
    code: "spain",
    policies: [
      ["Working time & leave", "Placeholder rules for working hours, breaks and paid leave."],
      ["Payroll & social security", "Placeholder checklist for payroll reporting and contributions."],
      ["Employee data", "Placeholder standards for handling personnel records and privacy."],
    ],
  },
  {
    name: "Canada",
    code: "canada",
    policies: [
      ["Employment standards", "Placeholder overview of provincial employment requirements."],
      ["Payroll deductions", "Placeholder information for deductions and employee statements."],
      ["Workplace safety", "Placeholder training, reporting and safety responsibilities."],
    ],
  },
];

function PoliciesView({ canEdit, onEdit }) {
  const [selectedCountry, setSelectedCountry] = useState(policyCountries[0].name);
  const [expandedPolicy, setExpandedPolicy] = useState(policyCountries[0].policies[0][0]);
  const country = policyCountries.find(item => item.name === selectedCountry) || policyCountries[0];

  const chooseCountry = name => {
    const nextCountry = policyCountries.find(item => item.name === name);
    setSelectedCountry(name);
    setExpandedPolicy(nextCountry?.policies[0]?.[0] || "");
  };

  return (
    <section className="role-dashboard policies-dashboard">
      <div className="role-section-head">
        <div><small>POLICY LIBRARY</small><h2>Policies by country</h2></div><span>{canEdit ? "HR EDIT MODE" : "READ ONLY"}</span>
      </div>
      <p className="my-files-intro">Example policy packs organized by employee location. These entries are placeholders for future legal content.</p>
      <div className="policy-country-selector" aria-label="Choose a country">
        {policyCountries.map(country => (
          <button
            className={selectedCountry === country.name ? "active" : ""}
            onClick={() => chooseCountry(country.name)}
            aria-pressed={selectedCountry === country.name}
            key={country.name}
          >
            <span className={`country-flag country-flag-${country.code}`} aria-label={`Flag of ${country.name}`}/>
            <span><small>COUNTRY</small><strong>{country.name}</strong></span>
            <b>{country.policies.length}</b>
          </button>
        ))}
      </div>
      <article className="policy-detail-panel">
        <header>
          <span className={`country-flag country-flag-${country.code}`} aria-label={`Flag of ${country.name}`}/>
          <div><small>SELECTED POLICY PACK</small><h3>{country.name}</h3></div>
          <span>{country.policies.length} placeholder policies</span>
        </header>
        <div className="policy-accordion">
          {country.policies.map(policy => {
            const expanded = expandedPolicy === policy[0];
            return (
              <section className={expanded ? "expanded" : ""} key={policy[0]}>
                <button
                  className="policy-accordion-trigger"
                  onClick={() => setExpandedPolicy(expanded ? "" : policy[0])}
                  aria-expanded={expanded}
                >
                  <span><small>POLICY</small><strong>{policy[0]}</strong></span>
                  <b>{expanded ? "−" : "+"}</b>
                </button>
                {expanded && <div className="policy-accordion-content">
                  <p>{policy[1]}</p>
                  <div className="policy-placeholder">
                    <small>PLACEHOLDER DETAILS</small>
                    <p>This section will contain eligibility, required actions, deadlines, supporting documents and jurisdiction-specific guidance.</p>
                  </div>
                  {canEdit && <button className="policy-edit-button" onClick={() => onEdit(`${country.name}: ${policy[0]}`)}>Edit policy</button>}
                </div>}
              </section>
            );
          })}
        </div>
      </article>
    </section>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("Employer");
  const [toast, setToast] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [teamId, setTeamId] = useState("");
  const [workspace, setWorkspace] = useState({
    teams: [], files: [], employees: [], payroll: [], benefits: [], contracts: [], holidays: [],
  });
  const [uploading, setUploading] = useState(false);
  const [workspaceSection, setWorkspaceSection] = useState("dashboard");
  const [theme, setTheme] = useState("light");
  const [previewFile, setPreviewFile] = useState(null);
  const [replaceTarget, setReplaceTarget] = useState(null);
  const [replacementFile, setReplacementFile] = useState(null);
  const [replacing, setReplacing] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("demo-product-theme-v2");
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
    fetch("/api/auth/me", { cache: "no-store" }).then(async response => {
      if (!response.ok) {
        window.location.href = "/login";
        return;
      }
      const result = await response.json();
      setUser(result.user);
      const workspaceResponse = await fetch("/api/workspace", { cache: "no-store" });
      if (workspaceResponse.ok) {
        const data = await workspaceResponse.json();
        setWorkspace(data);
        setTeamId(data.teams[0] ? String(data.teams[0].id) : "");
      }
    });
  }, []);

  const notify = message => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };
  const toggleTheme = () => {
    setTheme(currentTheme => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      window.localStorage.setItem("demo-product-theme-v2", nextTheme);
      return nextTheme;
    });
  };
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };
  const submitUpload = async event => {
    event.preventDefault();
    if (!category || !selectedFile || uploading) return;
    setUploading(true);
    const form = new FormData();
    form.set("category", category);
    form.set("teamId", teamId);
    form.set("file", selectedFile);
    const response = await fetch("/api/files", { method: "POST", body: form });
    const result = await response.json();
    if (!response.ok) {
      setUploading(false);
      notify(result.error || "Unable to upload file.");
      return;
    }
    const workspaceResponse = await fetch("/api/workspace", { cache: "no-store" });
    if (workspaceResponse.ok) setWorkspace(await workspaceResponse.json());
    setUploadOpen(false);
    notify(`${category} file encrypted and stored.`);
    setCategory("");
    setSelectedFile(null);
    setUploading(false);
  };
  const submitReplacement = async event => {
    event.preventDefault();
    if (!replaceTarget || !replacementFile || replacing) return;
    setReplacing(true);
    const form = new FormData();
    form.set("file", replacementFile);
    const response = await fetch(`/api/files/${replaceTarget.id}`, { method: "PUT", body: form });
    const result = await response.json();
    if (!response.ok) {
      setReplacing(false);
      notify(result.error || "Unable to update this file.");
      return;
    }
    const workspaceResponse = await fetch("/api/workspace", { cache: "no-store" });
    if (workspaceResponse.ok) setWorkspace(await workspaceResponse.json());
    setReplaceTarget(null);
    setReplacementFile(null);
    setReplacing(false);
    notify("File updated. The previous record was replaced.");
  };

  const initials = (user?.displayName || "User").split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();
  const statement = workspace.payroll[0];
  const sectionTitles = {
    dashboard: "Dashboard",
    policies: "Policies",
    documents: "Documents",
    files: "My files",
    people: "People",
    contracts: "Contracts",
    payroll: "Payroll",
    benefits: "Benefits",
    calendar: "Calendar",
  };

  return (
    <main className="workspace-shell" data-theme={theme}>
      <aside className="workspace-sidebar">
        <Link href="/" className="workspace-logo"><Brand light /></Link>
        <div className="workspace-role">
          <small>VIEW AS</small>
          <div>
            <button className={role === "Employer" ? "active" : ""} onClick={() => { setRole("Employer"); setWorkspaceSection("dashboard"); }}><Icon name="building" size={17}/> Employer</button>
            <button className={role === "Employee" ? "active" : ""} onClick={() => { setRole("Employee"); setWorkspaceSection("dashboard"); }}><Icon name="people" size={17}/> Employee</button>
            <button className={role === "HR" ? "active" : ""} onClick={() => { setRole("HR"); setWorkspaceSection("dashboard"); }}><Icon name="shield" size={17}/> HR</button>
          </div>
        </div>
        <nav className="workspace-nav">
          <small>WORKSPACE</small>
          <button className={workspaceSection === "dashboard" ? "active" : ""} onClick={() => setWorkspaceSection("dashboard")}><Icon name="building" size={19}/> Dashboard</button>
          <button className={workspaceSection === "policies" ? "active" : ""} onClick={() => setWorkspaceSection("policies")}><Icon name="book" size={19}/> Policies <b>3</b></button>
          <button className={workspaceSection === "documents" ? "active" : ""} onClick={() => setWorkspaceSection("documents")}><Icon name="file" size={19}/> Documents <b>{role === "Employer" ? workspace.employees.length : workspace.files.length}</b></button>
          {role === "Employer" && <button onClick={() => setUploadOpen(true)}><Icon name="file" size={19}/> Upload files</button>}
          {role === "Employer" && <button className={workspaceSection === "files" ? "active" : ""} onClick={() => setWorkspaceSection("files")}><Icon name="payroll" size={19}/> My files <b>{workspace.files.length}</b></button>}
          {role === "Employee" && <button className={workspaceSection === "files" ? "active" : ""} onClick={() => setWorkspaceSection("files")}><Icon name="payroll" size={19}/> My files <b>{workspace.files.length}</b></button>}
          {role === "Employee" && <button className={workspaceSection === "contracts" ? "active" : ""} onClick={() => setWorkspaceSection("contracts")}><Icon name="file" size={19}/> Contracts <b>{workspace.contracts.filter(contract => !contract.employeeId).length}</b></button>}
          {(role === "Employer" || role === "Employee") && <button className={workspaceSection === "payroll" ? "active" : ""} onClick={() => setWorkspaceSection("payroll")}><Icon name="payroll" size={19}/> Payroll</button>}
          {role === "Employee" && <button className={workspaceSection === "benefits" ? "active" : ""} onClick={() => setWorkspaceSection("benefits")}><Icon name="heart" size={19}/> Benefits <b>{workspace.benefits.length}</b></button>}
          {role === "HR" && <button className={workspaceSection === "people" ? "active" : ""} onClick={() => setWorkspaceSection("people")}><Icon name="people" size={19}/> People <b>{workspace.employees.length}</b></button>}
          <button className={workspaceSection === "calendar" ? "active" : ""} onClick={() => setWorkspaceSection("calendar")}><Icon name="calendar" size={19}/> Calendar</button>
          <small>ACCOUNT</small>
          <button onClick={() => notify("Settings coming soon.")}><Icon name="settings" size={19}/> Settings</button>
          <button onClick={() => notify("Help center coming soon.")}><Icon name="heart" size={19}/> Help & support</button>
        </nav>
        <div className="workspace-side-user">
          <span>{initials}</span><div><strong>{user?.displayName || "Loading..."}</strong><small>{role}</small></div>
        </div>
      </aside>

      <section className="workspace-main">
        <header className="workspace-header">
          <div><small>{role.toUpperCase()} WORKSPACE</small><strong>{sectionTitles[workspaceSection] || "Dashboard"}</strong></div>
          <div className="workspace-user">
            <button
              className="theme-switch"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "bright" : "dark"} mode`}
              aria-pressed={theme === "light"}
              title={`Switch to ${theme === "dark" ? "bright" : "dark"} mode`}
            >
              <Icon name={theme === "dark" ? "sun" : "moon"} size={18}/>
              <span>{theme === "dark" ? "Bright" : "Dark"}</span>
            </button>
            {role === "Employer" && workspaceSection === "dashboard" && <button className="button button-lime workspace-primary" onClick={() => notify("Invite function coming soon.")}><Icon name="people" size={18}/> Invite</button>}
            {role === "Employer" && (workspaceSection === "documents" || workspaceSection === "files") && <button className="button button-lime workspace-primary" onClick={() => setUploadOpen(true)}><Icon name="file" size={18}/> Upload file</button>}
            {role === "Employee" && (workspaceSection === "dashboard" || workspaceSection === "documents" || workspaceSection === "files") && <button className="button button-lime workspace-primary" onClick={() => setUploadOpen(true)}><Icon name="file" size={18}/> Upload file</button>}
            {role === "HR" && workspaceSection === "policies" && <button className="button button-lime workspace-primary" onClick={() => notify("Choose a policy card to edit.")}><Icon name="book" size={18}/> Edit policy</button>}
            {role === "HR" && workspaceSection === "people" && <button className="button button-lime workspace-primary" onClick={() => notify("HR review queue opened.")}><Icon name="shield" size={18}/> Review queue</button>}
            <button className="signed-user" onClick={logout} title="Log out"><span>{initials}</span>{user?.displayName || "Loading..."}</button>
          </div>
        </header>

        {workspaceSection === "dashboard" && <section className="workspace-body">
          <div className="workspace-kicker"><span/> ALL CAUGHT UP</div>
          <div className="workspace-empty-icon"><Icon name="check" size={40}/></div>
          <h1>Nothing to do.</h1>
          <p>{role === "Employer"
            ? "There are no people tasks waiting for you."
            : role === "HR"
              ? "There are no HR actions waiting for your review."
              : "You have no pending onboarding, policy or document actions."}</p>
          <div className="workspace-actions">
            {role === "Employer" && <button className="button button-lime" onClick={() => notify("Invite function coming soon.")}><Icon name="people" size={19}/> Invite</button>}
            {role === "Employee" && <button className="button button-lime" onClick={() => setUploadOpen(true)}><Icon name="file" size={19}/> Upload file</button>}
            {role === "HR" && <button className="button button-lime" onClick={() => setWorkspaceSection("people")}><Icon name="people" size={19}/> View people</button>}
            <button className="workspace-action-secondary" onClick={() => setWorkspaceSection("policies")}><Icon name="book" size={19}/> View policies</button>
          </div>
        </section>}

        {workspaceSection === "policies" ? (
          <PoliciesView canEdit={role === "HR"} onEdit={policy => notify(`Editing ${policy}. Placeholder only.`)}/>
        ) : workspaceSection === "files" && (role === "Employer" || role === "Employee") ? (
          <MyFilesView
            files={workspace.files}
            onPreview={setPreviewFile}
            onReplace={file => { setReplaceTarget(file); setReplacementFile(null); }}
            onUpload={() => setUploadOpen(true)}
            viewer={role}
          />
        ) : workspaceSection === "documents" && role !== "Employer" ? (
          <MyFilesView
            files={workspace.files}
            onPreview={setPreviewFile}
            onReplace={file => { setReplaceTarget(file); setReplacementFile(null); }}
            onUpload={() => setUploadOpen(true)}
            viewer={role}
            title="Documents"
          />
        ) : workspaceSection === "calendar" ? (
          <CalendarWorkspace holidays={workspace.holidays} viewer={role}/>
        ) : workspaceSection === "payroll" && (role === "Employer" || role === "Employee") ? (
          <PayrollView statement={statement} viewer={role}/>
        ) : workspaceSection === "benefits" && role === "Employee" ? (
          <BenefitsView benefits={workspace.benefits}/>
        ) : workspaceSection === "contracts" && role === "Employee" ? (
          <ContractsView
            contracts={workspace.contracts}
            onPreview={setPreviewFile}
            onSign={contract => notify(`${contract.title} is ready for your signature.`)}
          />
        ) : role === "Employer" && workspaceSection === "documents" ? (
          <section className="role-dashboard employer-dashboard">
            <div className="role-section-head">
              <div><small>EMPLOYER VIEW</small><h2>People operations</h2></div><span>{workspace.employees.length} TEST EMPLOYEES</span>
            </div>
            <div className="employee-grid">
              {workspace.employees.map(employee => (
                <article className="employee-card" key={employee.id}>
                  <div className="employee-card-head">
                    <span>{employee.name.split(" ").map(part => part[0]).join("").slice(0, 2)}</span>
                    <div><h3>{employee.name}</h3><p>{employee.jobTitle}</p></div><b>{employee.onboardingProgress}%</b>
                  </div>
                  <div className="employee-progress"><span style={{ width: `${employee.onboardingProgress}%` }}/></div>
                  <div className="employee-meta">
                    <p><small>EMPLOYEE INFO</small>{employee.email}</p><p><small>ONBOARDING STATUS</small>{employee.hrStatus}</p>
                  </div>
                  <div className="employee-documents">
                    <small>UPLOADED DOCUMENTS</small>
                    {employee.documents.length
                      ? employee.documents.map(document => <DownloadLink href={document.downloadUrl} key={document.id}>{document.filename}</DownloadLink>)
                      : <p>No documents yet.</p>}
                  </div>
                  <div className="employee-buttons">
                    <button onClick={() => notify(`${employee.name}'s information sent to HR.`)}>Send info to HR</button>
                    <button onClick={() => notify(`Contract prepared for ${employee.name}.`)}>Send contract</button>
                  </div>
                </article>
              ))}
            </div>
            <div className="record-grid employer-handoff-grid">
              <article className="record-card action-card">
                <small>HR HANDOFF</small><h3>Send employee details securely.</h3>
                <p>Review each profile and hand the encrypted onboarding information to HR.</p>
                <button className="button button-lime" onClick={() => notify("All ready employee information sent to HR.")}>Send ready profiles</button>
              </article>
            </div>
          </section>
        ) : workspaceSection === "people" && role === "HR" ? (
          <section className="role-dashboard hr-dashboard">
            <div className="role-section-head">
              <div><small>HR VIEW</small><h2>Client people.</h2></div><span>{workspace.employees.length} PEOPLE · 3 COMPANIES</span>
            </div>
            <div className="employee-grid hr-people-grid">
              {workspace.employees.map(employee => (
                <article className="employee-card hr-person-card" key={employee.id}>
                  <div className="employee-card-head">
                    <span>{employee.name.split(" ").map(part => part[0]).join("").slice(0, 2)}</span>
                    <div><h3>{employee.name}</h3><p>{employee.jobTitle}</p></div><b>{employee.onboardingProgress}%</b>
                  </div>
                  <div className="employee-progress"><span style={{ width: `${employee.onboardingProgress}%` }}/></div>
                  <div className="employee-meta hr-person-meta">
                    <p><small>PEOPLE'S INFO</small>{employee.email}</p>
                    <p><small>COMPANY NAME</small>{employee.companyName}</p>
                    <p><small>ONBOARDING</small>{employee.hrStatus}</p>
                    <p><small>PAYROLL</small>{statement ? `${statement.period} · ${statement.net} net` : "Not available"}</p>
                  </div>
                  <div className="hr-next-action">
                    <small>WHAT TO DO</small>
                    <strong>{getHrAction(employee)}</strong>
                  </div>
                  <div className="employee-documents">
                    <small>EMPLOYEE DOCUMENTS</small>
                    {employee.documents.length
                      ? employee.documents.map(document => <DownloadLink href={document.downloadUrl} key={document.id}>{document.filename}</DownloadLink>)
                      : <p>No documents yet.</p>}
                  </div>
                  <div className="hr-card-footer">
                    <button onClick={() => notify(`${employee.name}'s HR action opened.`)}>Open HR action</button>
                    <div className="employee-country">
                      <span
                        className={`country-flag country-flag-${employee.countryName.toLowerCase().replaceAll(" ", "-")}`}
                        aria-label={`Flag of ${employee.countryName}`}
                      />
                      <strong>{employee.countryName}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="record-grid">
              <article className="record-card payroll-card">
                <small>CLIENT PAYROLL</small><h3>July 2026 payroll</h3>
                {statement && <>
                  <div className="money-row"><span>Gross <b>{statement.gross}</b></span><span>Tax <b>{statement.tax}</b></span><span>Net <b>{statement.net}</b></span></div>
                  <DownloadLink href={statement.downloadUrl}>Download payroll report</DownloadLink>
                </>}
              </article>
              <article className="record-card action-card">
                <small>HR OVERVIEW</small><h3>Three client companies.</h3>
                <p>Northstar Labs, Common Studio and Weave Systems are included as encrypted test data for this workspace.</p>
                <button className="button button-lime" onClick={() => notify("Client company overview opened.")}>View companies</button>
              </article>
            </div>
          </section>
        ) : null}
      </section>

      {uploadOpen && <div className="upload-overlay" role="presentation" onMouseDown={() => setUploadOpen(false)}>
        <form className="upload-dialog" role="dialog" aria-modal="true" aria-labelledby="upload-title" onSubmit={submitUpload} onMouseDown={event => event.stopPropagation()}>
          <button type="button" className="upload-close" aria-label="Close upload dialog" onClick={() => setUploadOpen(false)}>×</button>
          <div className="upload-symbol"><Icon name="file" size={28}/></div>
          <h2 id="upload-title">Upload a file</h2>
          <p>Choose what kind of employee document this is before selecting the file.</p>
          <label>Document category<select value={category} onChange={event => setCategory(event.target.value)} required>
            <option value="">Select a category</option>{documentCategories.map(item => <option key={item}>{item}</option>)}
          </select></label>
          <label>Team<select value={teamId} onChange={event => setTeamId(event.target.value)}>
            {workspace.teams.map(team => <option value={team.id} key={team.id}>{team.name}</option>)}
          </select></label>
          <label className="file-picker">File<input type="file" onChange={event => setSelectedFile(event.target.files?.[0] || null)} required />
            <span><Icon name="file" size={20}/>{selectedFile?.name || "Choose a file"}</span>
          </label>
          <button className="button button-lime upload-submit" disabled={!category || !selectedFile || uploading}>{uploading ? "Encrypting..." : "Encrypt & upload"}</button>
          <small>Files and metadata are encrypted before being written to local storage.</small>
        </form>
      </div>}

      {previewFile && <div className="upload-overlay" role="presentation" onMouseDown={() => setPreviewFile(null)}>
        <section className="file-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="preview-title" onMouseDown={event => event.stopPropagation()}>
          <header><div><small>{previewFile.category}</small><h2 id="preview-title">{previewFile.filename}</h2></div><button onClick={() => setPreviewFile(null)} aria-label="Close preview">×</button></header>
          <div className="file-preview-frame">
            {previewFile.mimeType.startsWith("image/")
              ? <img src={previewFile.previewUrl} alt={previewFile.filename}/>
              : <iframe src={previewFile.previewUrl} title={`Preview of ${previewFile.filename}`}/>}
          </div>
          <footer><span>Version {previewFile.version}</span><a href={previewFile.downloadUrl}>Download</a>{!previewFile.isContract && <button onClick={() => { setPreviewFile(null); setReplaceTarget(previewFile); }}>Update file</button>}</footer>
        </section>
      </div>}

      {replaceTarget && <div className="upload-overlay" role="presentation" onMouseDown={() => setReplaceTarget(null)}>
        <form className="upload-dialog replace-dialog" role="dialog" aria-modal="true" aria-labelledby="replace-title" onSubmit={submitReplacement} onMouseDown={event => event.stopPropagation()}>
          <button type="button" className="upload-close" aria-label="Close update dialog" onClick={() => setReplaceTarget(null)}>×</button>
          <div className="upload-symbol"><Icon name="file" size={28}/></div>
          <h2 id="replace-title">Update file</h2>
          <p>Replace <strong>{replaceTarget.filename}</strong> with its latest version. Its category stays the same.</p>
          <label className="file-picker">New version<input type="file" onChange={event => setReplacementFile(event.target.files?.[0] || null)} required/>
            <span><Icon name="file" size={20}/>{replacementFile?.name || "Choose newer file"}</span>
          </label>
          <button className="button button-lime upload-submit" disabled={!replacementFile || replacing}>{replacing ? "Updating..." : "Save new version"}</button>
          <small>The existing database record will be updated and re-encrypted.</small>
        </form>
      </div>}
      {toast && <div className="toast"><Icon name="check" size={18}/>{toast}</div>}
    </main>
  );
}
