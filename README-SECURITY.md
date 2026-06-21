# NEXORA TECH Security & SEO Strategy

## Security Architecture

Our full-stack application incorporates multiple layers of security to adhere to enterprise standard practices:

### 1- Infrastructure & Network
- **HTTPS Enforcement:** Traffic automatically redirects to HTTPS via \`x-forwarded-proto\` checks for cloud load balancers.
- **Helmet Headers:** Strict \`helmet\` configuration restricts Cross-Origin requests, disables \`X-Powered-By\`, and sets Content Security Policies allowing only identified domains.

### 2- Rate Limiting
- **Global AP Limiter:** (500 req / 15m) applied via \`express-rate-limit\` to prevent basic DoS.
- **Auth Endpoint Limiter:** Strict limit (20 req / 15m) on \`/api/auth/*\` to mitigate credential stuffing and brute force.

### 3- Application Defense
- **Audit Logging System:** Sensitive operations write strictly to the \`audit_logs\` table mapping \`userId\`, \`action\`, \`ipAddress\`.
- **Validation Pipeline:** \`zod\` middleware integrated for Strict Input Whitelisting via \`req.body\` rejecting extra fields explicitly mitigating NoSQL/SQL injection patterns alongside the parameterized Drizzle ORM.
- **XSS & CSRF:** Prevented naturally via React Context escaping, JWT stateless authentication, and Helmet header protection.

## SEO Optimization System

### On-Page SEO
- **Dynamic Head Metadata:** Every view operates via React-Helmet-Async injecting localized Meta Tags, Canonical URIs, OpenGraph, and Twitter card schemas.
- **Lighthouse Targets:** Media uses fast, caching CDNs (Cloudinary), standard sizes, reducing Cumulative Layout Shifts (CLS).

### Technical SEO & Crawling
- **Server Utilities Node:**
  - \`/catsitemap.xml\`: Dynamically mapped against \`cms_pages\` fetching active content.
  - \`/robots.txt\`: Excludes Admin/Portal paths, optimizing crawl budgets.
- **Structured Data / JSON-LD:**
  - Organization JSON-LD implemented globally contextually signaling search engines.
  - Article schemas dynamically map for individual Blog routing (Future hook placement ready).

## Production Security Deployment Checklist

- [ ] Ensure \`process.env.NODE_ENV\` matches "production".
- [ ] Connect production PostgreSQL strictly via SSL strings.
- [ ] Ensure external dependencies (Redis, SMTP) are provisioned behind identical VPC boundaries and firewalled.
- [ ] Setup Datadog/Sentry log streaming capturing error limits before Cloud Run autoscaling hits critical loads.
- [ ] Vault manage CI/CD Secrets including \`CLOUDINARY_API_SECRET\` and \`DATABASE_URL\`.
