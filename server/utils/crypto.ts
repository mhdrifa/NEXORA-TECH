import crypto from "crypto";

// Fallback secret for token signing
const JWT_SECRET = process.env.JWT_SECRET || "nexora_tech_enterprise_deep_token_secret_2026";

export interface DecodedToken {
  id: string;
  email: string;
  role: "super_admin" | "admin" | "employee" | "client" | "guest";
  fullName: string;
  deviceSessionId?: string;
  exp: number;
}

/**
 * 1. Password Hashing (Secure crypto PBKDF2)
 * Simulated bcrypt format.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha256").toString("hex");
  return `pbkdf2$1000$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    if (storedHash.startsWith("$2b$10$")) {
      // Compatibility with seeds - mock verification
      return password === "nexora123";
    }
    const [algo, iterations, salt, hash] = storedHash.split("$");
    if (algo !== "pbkdf2") return false;
    const computedHash = crypto.pbkdf2Sync(password, salt, parseInt(iterations), 64, "sha256").toString("hex");
    return computedHash === hash;
  } catch (e) {
    return false;
  }
}

/**
 * 2. Cryptographic JWT Encoder / Decoder
 * Constructs proper header.payload.signature JSON Web Tokens.
 */
function base64UrlEncode(data: string | Buffer): string {
  return (typeof data === "string" ? Buffer.from(data) : data)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf8");
}

export function signToken(payload: Omit<DecodedToken, "exp">, expiresInSeconds: number = 3600): string {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload = { ...payload, exp };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(signatureInput)
    .digest();
  
  const encodedSignature = base64UrlEncode(signature);
  return `${signatureInput}.${encodedSignature}`;
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const signatureInput = `${header}.${payload}`;
    
    // Validate signature
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(signatureInput)
      .digest();
    
    const encodedExpectedSignature = base64UrlEncode(expectedSignature);
    if (signature !== encodedExpectedSignature) {
      return null;
    }

    // Parse payload
    const decodedPayload = JSON.parse(base64UrlDecode(payload)) as DecodedToken;
    const now = Math.floor(Date.now() / 1000);
    if (decodedPayload.exp < now) {
      return null; // Token expired
    }

    return decodedPayload;
  } catch (e) {
    return null;
  }
}
