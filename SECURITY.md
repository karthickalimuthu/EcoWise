# Security Architecture

EcoWise AI implements a Defense-in-Depth strategy designed to protect user data from the browser to the database.

## 1. Authentication & Session Management
- **NextAuth.js (v5):** All authentication is handled by the industry-standard NextAuth library.
- **Edge Validation:** Custom middleware explicitly wraps NextAuth (`export default auth(...)`) to intercept requests at the edge. It verifies the cryptographic signature of the JWT session cookie before any request reaches the core API handlers.
- **Role-Based Access Control (RBAC):** Administrative routes strictly verify that `session.user.role === "ADMIN"` before permitting access.
- **Bcrypt Hashing:** Passwords are never stored in plaintext. All credentials utilize the Blowfish cipher (bcrypt) with a high cost factor.

## 2. Brute Force Protection
- **Sliding-Window Rate Limiting:** A custom rate limiter monitors login attempts by email footprint.
- **Audit Logging:** Every failed authentication attempt triggers an immediate `SECURITY_FAILURE` audit log, allowing administrators to monitor distributed brute-force or credential stuffing attacks.

## 3. Data Integrity & Validation
- **Zod API Boundaries:** Every single API endpoint utilizes strict `zod` schemas to parse incoming JSON payloads. Unrecognized or malicious fields are automatically stripped (`safeParse`), preventing Prototype Pollution and NoSQL injection attacks.
- **XSS Defense:** A mathematical sanitization utility (`sanitize.ts`) actively intercepts free-form text inputs, stripping out generic `<script>` tags, `javascript:` URIs, and dangerous `onEvent` DOM attributes.

## 4. HTTP Security Headers
All responses strictly enforce OWASP-recommended security headers:
- `Content-Security-Policy`: Restricts script execution to the same origin.
- `X-Frame-Options: DENY`: Prevents Clickjacking attacks.
- `Strict-Transport-Security`: Enforces TLS encryption for all traffic.
- `X-Content-Type-Options: nosniff`: Prevents MIME-sniffing bypasses.
