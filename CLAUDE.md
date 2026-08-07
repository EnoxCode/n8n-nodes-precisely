# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An n8n community node package (`n8n-nodes-precisely`) that wraps the **Precisely Contract Automation API** — a signature and contract management platform. The node exposes Precisely's REST resources (templates, projects, documents, signatures, etc.) as n8n operations so users can automate contract workflows.

**Current state:** scaffolded (declarative node, from the `declarative/github-issues` template, then rewritten for Precisely). The `Precisely` node covers **every endpoint (59/59)** under nine resources — **Organization**, **Document**, **Project**, **Template**, **Reminder**, **Reviewer**, **Signee**, **Metadata Point**, **Link** — plus the `PreciselyApi` credential (X-API-KEY). `Roadmap.md` is the authoritative per-operation status list; keep it in sync as operations land. There is also a **`PreciselyTrigger`** node (`nodes/PreciselyTrigger/`) — a programmatic webhook trigger that auto-registers a Precisely resthook subscription on activation (`POST /organizations/{id}/subscriptions`), removes it on deactivation, confirms existence by listing (no single-subscription GET exists), and optionally verifies the `Precisely-Signature` HMAC-SHA256 header. Test webhooks locally with `npm run dev:tunnel` (Cloudflare quick tunnel; `scripts/dev-tunnel.sh`). What remains (backlog): more top-level resources (Folders, Teams, Users, Metadata Keys) and subscription-management action operations. `organizationId` is a **resourceLocator** (From List backed by the `searchOrganizations` listSearch method, or By ID) — n8n resolves it to its value in routing URLs. Structured `fixedCollection` inputs are used for Search filters, template references (`{name,value}`), and signee arrays (`signeeArrayField`); only the project Create Document `content` (a schema-less object) remains a JSON field.

Write-action conventions in this node: Delete/Cancel ops return `{ deleted: true }` via the shared `returnDeleted` postReceive; file imports read an input binary field and base64-encode it in a `preSend` (`buildDocumentImportBody` / `buildProjectImportBody` in `shared/transforms.ts`); optional body fields are grouped in `Additional Fields`/`Update Fields` collections and routed with `routing.send.type: 'body'`. What's built vs. planned is tracked in `Roadmap.md` — keep it updated as resources land. The OpenAPI spec at `docs/bundle-api-swagger.yaml` (Precisely Public API v1.0.0) is the source of truth for endpoints/schemas.

### Layout & conventions

- `nodes/Precisely/Precisely.node.ts` — node entry; assembles the Resource dropdown + spreads each resource's properties.
- `nodes/Precisely/resources/<resource>/` — one dir per resource: `index.ts` (operations + routing), then one file per operation (`get.ts`, `getAll.ts`, …).
- `nodes/Precisely/shared/descriptions.ts` — reusable fields (`organizationIdField`, `returnAllField`, `limitField`).
- `credentials/PreciselyApi.credentials.ts`, `icons/precisely.svg`, `nodes/Precisely/Precisely.node.json` (codex).
- Purely **declarative** — requests come from `routing` on each operation/field; there is no `execute()` and no `shared/transport.ts`. (The future resthook **trigger** will be a separate programmatic node.)
- `AGENTS.md` + `.agents/` hold the scaffold's generic n8n reference docs; this file holds the Precisely-specific facts.

## Building n8n nodes — use the skill

**Always invoke the `building-n8n-nodes` skill before writing or scaffolding any node code.** It is the authoritative source for the `n8n-node` CLI toolchain, file layout, lint rules, credential/auth patterns, and the validation gate protocol. Do not reinvent conventions this repo's tooling already enforces. Key points that follow from it:

- **Style: declarative.** Precisely is a plain REST API with no triggers and no multi-call chaining, so the action node should be declarative (`routing`-based, no `execute()`). The one exception is resthooks/webhooks (see below) — a *trigger* node for those must be programmatic.
- **No unit-test framework exists** in the n8n-node toolchain. CI runs exactly lint + build; runtime validation is done by launching local n8n. Don't add jest/vitest.
- **Validation gates** (run in order, stop on first failure):
  ```bash
  npm run lint:fix && npm run lint      # Gate 1 — zero errors; never edit eslint.config.mjs, never inline eslint-disable
  npm run build                         # Gate 2 — strict tsc + asset copy
  npx n8n-node cloud-support            # Gate 3 — must print "Cloud support is ENABLED"
  npm run dev                           # Gate 4 — local n8n at http://localhost:5678; smoke-test node + credential + operations
  ```
- **Scaffold** with: `npm create @n8n/node@latest n8n-nodes-precisely -- --template declarative/custom` (prompts for base URL + auth), or start from `declarative/github-issues` and adapt.

## Precisely API specifics (from docs/bundle-api-swagger.yaml)

These are the facts that shape the node's design; read the spec for full request/response schemas.

- **Base URL:** `https://api.precisely.se`
- **Auth: API key.** This project uses `apiKeyAuth` — the key is sent in the `X-API-KEY` header. (The API also supports `bearerAuth` via a JWT from `/authenticate`, but we are **not** using it.) The credential should be a generic-header-auth credential injecting `X-API-KEY`. API tokens are created in the Precisely UI (help.precisely.se → "API tokens in Precisely").
- **Rate limit:** 30 requests/minute per organization. Responses carry `X-Ratelimit-Limit`/`-Remaining`/`-Reset` headers.
- **Almost every endpoint is organization-scoped:** paths are `/organizations/{organizationId}/...`. `organizationId` is a required leading parameter on nearly all operations. The only non-scoped endpoints are the bootstrap ones: `/authenticate`, `/organizations` (list orgs the key can access), and `/metadata-keys`. Consider a `loadOptions`/`listSearch` dropdown backed by `GET /organizations` so users pick the org instead of pasting an ID.

### Domain model (Template → Project → Document)

Understanding this hierarchy is essential for mapping resources to operations:

- **Template** — the blueprint. Contains `documentTemplates`, `references` (drafting questions), approval rules. Endpoints under `/templates`.
- **Project** — the result of "drafting" a template (answering its references). Holds one or more documents; approvals apply at this level. Endpoints under `/projects`.
- **Document** — the actual contract, sent for signing. Richest resource: has sub-collections for `signees`, `signature-request`, `reviewers`, `reminders`, `metadata-points`, `versions`, `links`, plus `pdf`/`href` exports and `import`/`search`.

### API resource groups (OpenAPI tags → candidate n8n resources)

Templates, Projects, Documents, Signature/SignatureRequest/Signees, Reviewers, Approvals (initial/final), Folders, Metadata (keys/points/choices), Reminders, Teams, Organizations, Users, and **Experimental** (resthook subscriptions). ~53 paths total. Map these to the Resource → Operation UI pattern; use "Get Many" (not "Get All") for list operations with the `returnAll`/`limit` pair.

### Resthooks / webhooks (Experimental — for a future trigger node)

Precisely supports event subscriptions (`/organizations/{organizationId}/subscriptions`) that POST webhook callbacks. This is marked experimental and "might change." If building a trigger:

- List subscribable events via `GET .../subscriptions/events`; manage subscriptions via the `subscriptions` CRUD paths.
- Callbacks carry a `Precisely-Signature: t=<unix>,s=<base64>` header. Verify it as: `base64( HMAC-SHA256( key=<endpoint secret>, msg="t" + "." + <raw json payload> + "\n" ) )`. The endpoint secret is returned when the subscription is created. (Worked examples in the spec's `info.description`.)
- Delivery is retried 3×; a subscription is auto-disabled after 10 consecutive failures and must be re-enabled via PATCH.
