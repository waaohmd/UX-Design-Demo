import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { authenticate, databasePath } from "../lib/auth-db.js";
import { decryptBuffer, decryptText, encryptBuffer, encryptText, keyPath } from "../lib/security.js";

const injectionPayloads = [
  "' OR '1'='1",
  "admin' --",
  "\" OR 1=1 --",
  "'; DROP TABLE users; --",
  "') OR ('1'='1",
];

for (const payload of injectionPayloads) {
  assert.equal(authenticate(payload, payload), null, `Injection payload authenticated: ${payload}`);
}

const encryptedText = encryptText("Sensitive employee record");
assert.equal(encryptedText.includes("Sensitive employee record"), false);
assert.equal(decryptText(encryptedText), "Sensitive employee record");

const encryptedFile = encryptBuffer(Buffer.from("private-file-contents"));
assert.equal(encryptedFile.includes(Buffer.from("private-file-contents")), false);
assert.equal(decryptBuffer(encryptedFile).toString(), "private-file-contents");

const tampered = Buffer.from(encryptedFile);
tampered[tampered.length - 1] ^= 1;
assert.throws(() => decryptBuffer(tampered), /auth|decrypt|Unsupported|bad/i);

const db = new DatabaseSync(databasePath, { readOnly: true });
const userTable = db.prepare("SELECT name FROM sqlite_master WHERE type = ? AND name = ?")
  .get("table", "users");
assert.equal(userTable?.name, "users", "Users table disappeared after injection tests.");

for (const user of db.prepare(`
  SELECT username, display_name, username_encrypted, display_name_encrypted
  FROM users
`).all()) {
  assert.match(user.username, /^encrypted-user-/);
  assert.equal(user.display_name, "encrypted");
  assert.ok(user.username_encrypted);
  assert.ok(user.display_name_encrypted);
}

console.log("PASS: SQL injection payloads did not authenticate or alter schema.");
console.log("PASS: AES-256-GCM ciphertext hides plaintext and rejects tampering.");
console.log("PASS: Legacy plaintext user columns contain only encrypted placeholders.");
console.log(`Database: ${databasePath}`);
console.log(`Master key: ${keyPath}`);
