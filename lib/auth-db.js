import { mkdirSync } from "node:fs";
import path from "node:path";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { decryptBuffer, decryptText, encryptBuffer, encryptText, lookupHash } from "./security.js";

export const databasePath = path.join(process.cwd(), "data", "users.sqlite");

mkdirSync(path.dirname(databasePath), { recursive: true });

const db = new DatabaseSync(databasePath);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

const userColumns = new Set(db.prepare("PRAGMA table_info(users)").all().map(column => column.name));
if (!userColumns.has("username_lookup")) db.exec("ALTER TABLE users ADD COLUMN username_lookup TEXT");
if (!userColumns.has("username_encrypted")) db.exec("ALTER TABLE users ADD COLUMN username_encrypted TEXT");
if (!userColumns.has("display_name_encrypted")) db.exec("ALTER TABLE users ADD COLUMN display_name_encrypted TEXT");

for (const user of db.prepare(`
  SELECT id, username, display_name
  FROM users
  WHERE username_lookup IS NULL OR username_encrypted IS NULL OR display_name_encrypted IS NULL
`).all()) {
  db.prepare(`
    UPDATE users
    SET username = ?, display_name = ?, username_lookup = ?,
        username_encrypted = ?, display_name_encrypted = ?
    WHERE id = ?
  `).run(
    `encrypted-user-${user.id}`,
    "encrypted",
    lookupHash(user.username),
    encryptText(user.username),
    encryptText(user.display_name),
    user.id
  );
}

db.exec(`
  CREATE UNIQUE INDEX IF NOT EXISTS users_username_lookup_unique ON users(username_lookup);
  CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_user_id INTEGER NOT NULL,
    name_encrypted TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('owner', 'employer', 'employee')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, user_id),
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS uploaded_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    team_id INTEGER,
    category_encrypted TEXT NOT NULL,
    filename_encrypted TEXT NOT NULL,
    mime_encrypted TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    contents_encrypted BLOB NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL
  );
  CREATE INDEX IF NOT EXISTS uploaded_files_user_id_index ON uploaded_files(user_id);
  CREATE INDEX IF NOT EXISTS team_members_user_id_index ON team_members(user_id);
  CREATE TABLE IF NOT EXISTS demo_employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_user_id INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    name_encrypted TEXT NOT NULL,
    email_encrypted TEXT NOT NULL,
    job_title_encrypted TEXT NOT NULL,
    onboarding_progress INTEGER NOT NULL,
    hr_status_encrypted TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS demo_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_user_id INTEGER NOT NULL,
    employee_id INTEGER,
    category_encrypted TEXT NOT NULL,
    filename_encrypted TEXT NOT NULL,
    mime_encrypted TEXT NOT NULL,
    contents_encrypted BLOB NOT NULL,
    size_bytes INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES demo_employees(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS demo_payroll (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_user_id INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    period TEXT NOT NULL,
    gross_encrypted TEXT NOT NULL,
    tax_encrypted TEXT NOT NULL,
    net_encrypted TEXT NOT NULL,
    filename_encrypted TEXT NOT NULL,
    contents_encrypted BLOB NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS demo_benefits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_user_id INTEGER NOT NULL,
    provider_encrypted TEXT NOT NULL,
    plan_encrypted TEXT NOT NULL,
    details_encrypted TEXT NOT NULL,
    policy_encrypted TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS demo_contracts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_user_id INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    employee_id INTEGER,
    title_encrypted TEXT NOT NULL,
    status_encrypted TEXT NOT NULL,
    filename_encrypted TEXT NOT NULL,
    contents_encrypted BLOB NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES demo_employees(id) ON DELETE SET NULL
  );
  CREATE TABLE IF NOT EXISTS demo_holidays (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_user_id INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    holiday_date TEXT NOT NULL,
    name_encrypted TEXT NOT NULL,
    scope TEXT NOT NULL CHECK(scope IN ('company', 'public')),
    FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
  );
`);

const employeeColumns = new Set(db.prepare("PRAGMA table_info(demo_employees)").all().map(column => column.name));
if (!employeeColumns.has("company_name_encrypted")) db.exec("ALTER TABLE demo_employees ADD COLUMN company_name_encrypted TEXT");
if (!employeeColumns.has("country_name_encrypted")) db.exec("ALTER TABLE demo_employees ADD COLUMN country_name_encrypted TEXT");
if (!employeeColumns.has("country_flag_encrypted")) db.exec("ALTER TABLE demo_employees ADD COLUMN country_flag_encrypted TEXT");

const employeeLocations = [
  ["Northstar Labs", "Netherlands", "🇳🇱"],
  ["Common Studio", "Spain", "🇪🇸"],
  ["Weave Systems", "Canada", "🇨🇦"],
];
for (const owner of db.prepare("SELECT DISTINCT owner_user_id FROM demo_employees ORDER BY owner_user_id").all()) {
  const rows = db.prepare(`
    SELECT id FROM demo_employees
    WHERE owner_user_id = ? AND (
      company_name_encrypted IS NULL OR country_name_encrypted IS NULL OR country_flag_encrypted IS NULL
    )
    ORDER BY id
  `).all(owner.owner_user_id);
  rows.forEach((employee, index) => {
    const location = employeeLocations[index % employeeLocations.length];
    db.prepare(`
      UPDATE demo_employees
      SET company_name_encrypted = ?, country_name_encrypted = ?, country_flag_encrypted = ?
      WHERE id = ?
    `).run(encryptText(location[0]), encryptText(location[1]), encryptText(location[2]), employee.id);
  });
}

const uploadedFileColumns = new Set(db.prepare("PRAGMA table_info(uploaded_files)").all().map(column => column.name));
if (!uploadedFileColumns.has("version_number")) db.exec("ALTER TABLE uploaded_files ADD COLUMN version_number INTEGER NOT NULL DEFAULT 1");
if (!uploadedFileColumns.has("updated_at")) db.exec("ALTER TABLE uploaded_files ADD COLUMN updated_at TEXT");
db.exec("UPDATE uploaded_files SET updated_at = created_at WHERE updated_at IS NULL");

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, savedHash] = stored.split(":");
  if (!salt || !savedHash) return false;
  const suppliedHash = scryptSync(password, salt, 64);
  const savedBuffer = Buffer.from(savedHash, "hex");
  return savedBuffer.length === suppliedHash.length && timingSafeEqual(savedBuffer, suppliedHash);
}

function ensureDefaultTeam(userId, displayName) {
  const membership = db.prepare("SELECT team_id FROM team_members WHERE user_id = ? LIMIT 1").get(userId);
  if (membership) return membership.team_id;
  const team = db.prepare("INSERT INTO teams (owner_user_id, name_encrypted) VALUES (?, ?)")
    .run(userId, encryptText(`${displayName}'s team`));
  const teamId = Number(team.lastInsertRowid);
  db.prepare("INSERT INTO team_members (team_id, user_id, role) VALUES (?, ?, 'owner')")
    .run(teamId, userId);
  return teamId;
}

function seedDemoRecords(userId, displayName, teamId) {
  const seeded = db.prepare("SELECT id FROM demo_employees WHERE owner_user_id = ? LIMIT 1").get(userId);
  if (seeded) return;

  const employeeRows = [
    ["Noah Lee", "noah.lee@example.test", "Product Designer", 88, "Ready for HR review", "Northstar Labs", "Netherlands", "🇳🇱"],
    ["Amelia Ortiz", "amelia.ortiz@example.test", "Account Manager", 64, "Waiting for personal information", "Common Studio", "Spain", "🇪🇸"],
    ["Isaac Flores", "isaac.flores@example.test", "Software Engineer", 100, "Onboarding complete", "Weave Systems", "Canada", "🇨🇦"],
  ];
  const employeeIds = employeeRows.map(employee => Number(db.prepare(`
    INSERT INTO demo_employees (
      owner_user_id, team_id, name_encrypted, email_encrypted,
      job_title_encrypted, onboarding_progress, hr_status_encrypted,
      company_name_encrypted, country_name_encrypted, country_flag_encrypted
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    userId,
    teamId,
    encryptText(employee[0]),
    encryptText(employee[1]),
    encryptText(employee[2]),
    employee[3],
    encryptText(employee[4]),
    encryptText(employee[5]),
    encryptText(employee[6]),
    encryptText(employee[7])
  ).lastInsertRowid));

  const demoDocuments = [
    [employeeIds[0], "Personal information", "noah-personal-information.txt", "Noah Lee personal information form\nAddress: 10 Demo Street\nEmergency contact: Taylor Lee"],
    [employeeIds[0], "Identity / right to work", "noah-right-to-work-check.txt", "Right-to-work verification placeholder for Noah Lee."],
    [employeeIds[1], "Employment document", "amelia-offer-letter.txt", "Offer letter placeholder for Amelia Ortiz, Account Manager."],
  ];
  for (const [employeeId, category, filename, contents] of demoDocuments) {
    const bytes = Buffer.from(contents, "utf8");
    db.prepare(`
      INSERT INTO demo_documents (
        owner_user_id, employee_id, category_encrypted, filename_encrypted,
        mime_encrypted, contents_encrypted, size_bytes
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      employeeId,
      encryptText(category),
      encryptText(filename),
      encryptText("text/plain"),
      encryptBuffer(bytes),
      bytes.length
    );
  }

  const payrollContents = Buffer.from(
    `Payroll statement\nEmployee: ${displayName}\nPeriod: July 2026\nGross: $6,250.00\nTax: $1,375.00\nNet: $4,875.00`,
    "utf8"
  );
  db.prepare(`
    INSERT INTO demo_payroll (
      owner_user_id, team_id, period, gross_encrypted, tax_encrypted,
      net_encrypted, filename_encrypted, contents_encrypted
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    userId,
    teamId,
    "2026-07",
    encryptText("$6,250.00"),
    encryptText("$1,375.00"),
    encryptText("$4,875.00"),
    encryptText("payroll-statement-july-2026.txt"),
    encryptBuffer(payrollContents)
  );

  db.prepare(`
    INSERT INTO demo_benefits (
      owner_user_id, provider_encrypted, plan_encrypted,
      details_encrypted, policy_encrypted
    ) VALUES (?, ?, ?, ?, ?)
  `).run(
    userId,
    encryptText("Demo Health"),
    encryptText("Premium Medical + Dental"),
    encryptText("Medical, dental and vision coverage. Employer contribution: 80%."),
    encryptText("DHI-2026-00482")
  );

  const selfContract = Buffer.from(
    `Employment agreement\nEmployee: ${displayName}\nStatus: Signed\nThis is an encrypted debugging document.`,
    "utf8"
  );
  const noahContract = Buffer.from(
    "Employment agreement\nEmployee: Noah Lee\nStatus: Ready to send\nThis is an encrypted debugging document.",
    "utf8"
  );
  for (const contract of [
    [null, "Your employment agreement", "Signed", "employment-agreement.txt", selfContract],
    [employeeIds[0], "Noah Lee employment agreement", "Ready to send", "noah-employment-agreement.txt", noahContract],
  ]) {
    db.prepare(`
      INSERT INTO demo_contracts (
        owner_user_id, team_id, employee_id, title_encrypted,
        status_encrypted, filename_encrypted, contents_encrypted
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      teamId,
      contract[0],
      encryptText(contract[1]),
      encryptText(contract[2]),
      encryptText(contract[3]),
      encryptBuffer(contract[4])
    );
  }

  for (const holiday of [
    ["2026-08-15", "Company Wellness Day", "company"],
    ["2026-08-31", "Summer Bank Holiday", "public"],
  ]) {
    db.prepare(`
      INSERT INTO demo_holidays (owner_user_id, team_id, holiday_date, name_encrypted, scope)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, teamId, holiday[0], encryptText(holiday[1]), holiday[2]);
  }
}

for (const row of db.prepare("SELECT id, display_name_encrypted FROM users").all()) {
  const displayName = decryptText(row.display_name_encrypted);
  const teamId = ensureDefaultTeam(row.id, displayName);
  seedDemoRecords(row.id, displayName, teamId);
}

export function createUser(username, displayName, password) {
  const normalizedUsername = username.trim();
  if (db.prepare("SELECT id FROM users WHERE username_lookup = ?").get(lookupHash(normalizedUsername))) return null;

  db.exec("BEGIN IMMEDIATE");
  try {
    const legacyIdentifier = `encrypted-user-${randomBytes(12).toString("hex")}`;
    const result = db.prepare(`
      INSERT INTO users (
        username, display_name, password_hash, username_lookup,
        username_encrypted, display_name_encrypted
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      legacyIdentifier,
      "encrypted",
      hashPassword(password),
      lookupHash(normalizedUsername),
      encryptText(normalizedUsername),
      encryptText(displayName.trim())
    );
    const userId = Number(result.lastInsertRowid);
    const teamId = ensureDefaultTeam(userId, displayName.trim());
    seedDemoRecords(userId, displayName.trim(), teamId);
    db.exec("COMMIT");
    return { id: userId, username: normalizedUsername, displayName: displayName.trim() };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function authenticate(username, password) {
  const user = db.prepare(`
    SELECT id, username_encrypted, display_name_encrypted, password_hash
    FROM users
    WHERE username_lookup = ?
  `).get(lookupHash(username));
  if (!user || !verifyPassword(password, user.password_hash)) return null;
  return {
    id: user.id,
    username: decryptText(user.username_encrypted),
    displayName: decryptText(user.display_name_encrypted),
  };
}

export function createSession(userId) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
  db.prepare("DELETE FROM sessions WHERE expires_at < ?").run(Date.now());
  db.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)")
    .run(token, userId, expiresAt);
  return { token, expiresAt };
}

export function getSessionUser(token) {
  if (!token) return null;
  const row = db.prepare(`
    SELECT users.id, users.username_encrypted, users.display_name_encrypted
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.token = ? AND sessions.expires_at > ?
  `).get(token, Date.now());
  if (!row) return null;
  return {
    id: row.id,
    username: decryptText(row.username_encrypted),
    displayName: decryptText(row.display_name_encrypted),
  };
}

export function deleteSession(token) {
  if (token) db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export function getCookie(request, name) {
  const cookieHeader = request.headers.get("cookie") || "";
  const item = cookieHeader.split(";").map(part => part.trim()).find(part => part.startsWith(`${name}=`));
  return item ? decodeURIComponent(item.slice(name.length + 1)) : "";
}

export function getWorkspaceData(userId) {
  const teams = db.prepare(`
    SELECT teams.id, teams.name_encrypted, team_members.role, teams.created_at
    FROM team_members
    JOIN teams ON teams.id = team_members.team_id
    WHERE team_members.user_id = ?
    ORDER BY teams.id
  `).all(userId).map(team => ({
    id: team.id,
    name: decryptText(team.name_encrypted),
    role: team.role,
    createdAt: team.created_at,
  }));

  const files = db.prepare(`
    SELECT id, team_id, category_encrypted, filename_encrypted, mime_encrypted,
           size_bytes, version_number, created_at, updated_at
    FROM uploaded_files
    WHERE user_id = ?
    ORDER BY id DESC
    LIMIT 20
  `).all(userId).map(file => ({
    id: file.id,
    teamId: file.team_id,
    category: decryptText(file.category_encrypted),
    filename: decryptText(file.filename_encrypted),
    mimeType: decryptText(file.mime_encrypted),
    size: file.size_bytes,
    version: file.version_number,
    createdAt: file.created_at,
    updatedAt: file.updated_at,
    previewUrl: `/api/files/${file.id}?mode=preview`,
    downloadUrl: `/api/files/${file.id}`,
  }));

  const employeeDocuments = db.prepare(`
    SELECT id, employee_id, category_encrypted, filename_encrypted, created_at
    FROM demo_documents WHERE owner_user_id = ? ORDER BY id
  `).all(userId).map(document => ({
    id: document.id,
    employeeId: document.employee_id,
    category: decryptText(document.category_encrypted),
    filename: decryptText(document.filename_encrypted),
    createdAt: document.created_at,
    downloadUrl: `/api/demo-files/document/${document.id}`,
  }));

  const employees = db.prepare(`
    SELECT id, name_encrypted, email_encrypted, job_title_encrypted,
           onboarding_progress, hr_status_encrypted, company_name_encrypted,
           country_name_encrypted, country_flag_encrypted
    FROM demo_employees WHERE owner_user_id = ? ORDER BY id
  `).all(userId).map(employee => ({
    id: employee.id,
    name: decryptText(employee.name_encrypted),
    email: decryptText(employee.email_encrypted),
    jobTitle: decryptText(employee.job_title_encrypted),
    onboardingProgress: employee.onboarding_progress,
    hrStatus: decryptText(employee.hr_status_encrypted),
    companyName: decryptText(employee.company_name_encrypted),
    countryName: decryptText(employee.country_name_encrypted),
    countryFlag: decryptText(employee.country_flag_encrypted),
    documents: employeeDocuments.filter(document => document.employeeId === employee.id),
  }));

  const payroll = db.prepare(`
    SELECT id, period, gross_encrypted, tax_encrypted, net_encrypted,
           filename_encrypted, created_at
    FROM demo_payroll WHERE owner_user_id = ? ORDER BY id DESC
  `).all(userId).map(statement => ({
    id: statement.id,
    period: statement.period,
    gross: decryptText(statement.gross_encrypted),
    tax: decryptText(statement.tax_encrypted),
    net: decryptText(statement.net_encrypted),
    filename: decryptText(statement.filename_encrypted),
    createdAt: statement.created_at,
    downloadUrl: `/api/demo-files/payroll/${statement.id}`,
  }));

  const benefits = db.prepare(`
    SELECT id, provider_encrypted, plan_encrypted, details_encrypted, policy_encrypted
    FROM demo_benefits WHERE owner_user_id = ? ORDER BY id
  `).all(userId).map(benefit => ({
    id: benefit.id,
    provider: decryptText(benefit.provider_encrypted),
    plan: decryptText(benefit.plan_encrypted),
    details: decryptText(benefit.details_encrypted),
    policyNumber: decryptText(benefit.policy_encrypted),
  }));

  const contracts = db.prepare(`
    SELECT id, employee_id, title_encrypted, status_encrypted, filename_encrypted, created_at
    FROM demo_contracts WHERE owner_user_id = ? ORDER BY id
  `).all(userId).map(contract => ({
    id: contract.id,
    employeeId: contract.employee_id,
    title: decryptText(contract.title_encrypted),
    status: decryptText(contract.status_encrypted),
    filename: decryptText(contract.filename_encrypted),
    createdAt: contract.created_at,
    downloadUrl: `/api/demo-files/contract/${contract.id}`,
    previewUrl: `/api/demo-files/contract/${contract.id}?mode=preview`,
  }));

  const holidays = db.prepare(`
    SELECT id, holiday_date, name_encrypted, scope
    FROM demo_holidays WHERE owner_user_id = ? ORDER BY holiday_date
  `).all(userId).map(holiday => ({
    id: holiday.id,
    date: holiday.holiday_date,
    name: decryptText(holiday.name_encrypted),
    scope: holiday.scope,
  }));

  return { teams, files, employees, payroll, benefits, contracts, holidays };
}

export function storeUploadedFile({ userId, teamId, category, filename, mimeType, contents }) {
  if (teamId) {
    const membership = db.prepare("SELECT id FROM team_members WHERE team_id = ? AND user_id = ?")
      .get(teamId, userId);
    if (!membership) throw new Error("Invalid team.");
  }
  const result = db.prepare(`
    INSERT INTO uploaded_files (
      user_id, team_id, category_encrypted, filename_encrypted,
      mime_encrypted, size_bytes, contents_encrypted
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    userId,
    teamId || null,
    encryptText(category),
    encryptText(filename),
    encryptText(mimeType || "application/octet-stream"),
    contents.length,
    encryptBuffer(contents)
  );
  return Number(result.lastInsertRowid);
}

export function getUploadedFile(userId, fileId) {
  const file = db.prepare(`
    SELECT category_encrypted, filename_encrypted, mime_encrypted,
           size_bytes, contents_encrypted
    FROM uploaded_files
    WHERE id = ? AND user_id = ?
  `).get(fileId, userId);
  if (!file) return null;
  return {
    category: decryptText(file.category_encrypted),
    filename: decryptText(file.filename_encrypted),
    mimeType: decryptText(file.mime_encrypted),
    size: file.size_bytes,
    contents: decryptBuffer(file.contents_encrypted),
  };
}

export function replaceUploadedFile({ userId, fileId, filename, mimeType, contents }) {
  const existing = db.prepare("SELECT id FROM uploaded_files WHERE id = ? AND user_id = ?").get(fileId, userId);
  if (!existing) return false;
  db.prepare(`
    UPDATE uploaded_files
    SET filename_encrypted = ?, mime_encrypted = ?, size_bytes = ?,
        contents_encrypted = ?, version_number = version_number + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `).run(
    encryptText(filename),
    encryptText(mimeType || "application/octet-stream"),
    contents.length,
    encryptBuffer(contents),
    fileId,
    userId
  );
  return true;
}

export function getDemoFile(userId, kind, fileId) {
  const definitions = {
    document: {
      table: "demo_documents",
      filename: "filename_encrypted",
      mime: "mime_encrypted",
      contents: "contents_encrypted",
    },
    payroll: {
      table: "demo_payroll",
      filename: "filename_encrypted",
      mime: null,
      contents: "contents_encrypted",
    },
    contract: {
      table: "demo_contracts",
      filename: "filename_encrypted",
      mime: null,
      contents: "contents_encrypted",
    },
  };
  const definition = definitions[kind];
  if (!definition) return null;
  const mimeSelection = definition.mime ? `, ${definition.mime}` : "";
  const row = db.prepare(`
    SELECT ${definition.filename}, ${definition.contents}${mimeSelection}
    FROM ${definition.table}
    WHERE id = ? AND owner_user_id = ?
  `).get(fileId, userId);
  if (!row) return null;
  return {
    filename: decryptText(row[definition.filename]),
    mimeType: definition.mime ? decryptText(row[definition.mime]) : "text/plain",
    contents: decryptBuffer(row[definition.contents]),
  };
}
