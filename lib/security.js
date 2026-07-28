import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";

export const keyPath = path.join(process.cwd(), "data", ".master-key");

mkdirSync(path.dirname(keyPath), { recursive: true });
if (!existsSync(keyPath)) {
  writeFileSync(keyPath, randomBytes(32), { mode: 0o600 });
}

const masterKey = readFileSync(keyPath);
if (masterKey.length !== 32) {
  throw new Error(`Invalid encryption key at ${keyPath}. Expected exactly 32 bytes.`);
}

export function encryptBuffer(value) {
  const plaintext = Buffer.isBuffer(value) ? value : Buffer.from(value);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", masterKey, iv, { authTagLength: 16 });
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([Buffer.from([1]), iv, tag, ciphertext]);
}

export function decryptBuffer(value) {
  const packed = Buffer.from(value);
  if (packed.length < 30 || packed[0] !== 1) throw new Error("Unsupported encrypted payload.");
  const iv = packed.subarray(1, 13);
  const tag = packed.subarray(13, 29);
  const ciphertext = packed.subarray(29);
  const decipher = createDecipheriv("aes-256-gcm", masterKey, iv, { authTagLength: 16 });
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

export function encryptText(value) {
  return encryptBuffer(Buffer.from(String(value), "utf8")).toString("base64");
}

export function decryptText(value) {
  return decryptBuffer(Buffer.from(value, "base64")).toString("utf8");
}

export function lookupHash(value) {
  return createHmac("sha256", masterKey).update(String(value).trim().toLowerCase()).digest("hex");
}
