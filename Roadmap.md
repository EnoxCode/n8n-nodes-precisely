# Roadmap

Actions the `n8n-nodes-precisely` node will support, in build order. Checked = implemented and passing the validation gates.

Legend: ✅ done · 🚧 in progress · ⬜ planned

## Phase 1 — Organizations

| Status | Resource | Operation | Endpoint |
|--------|----------|-----------|----------|
| ✅ | Organization | Get (Retrieve Organization) | `GET /organizations/{organizationId}` |
| ✅ | Organization | Get Many (Retrieve Organizations) | `GET /organizations` |

## Phase 2 — Documents (GET / read actions first)

| Status | Resource | Operation | Endpoint |
|--------|----------|-----------|----------|
| ✅ | Document | Get | `GET /organizations/{organizationId}/documents/{documentId}` |
| ✅ | Document | Get Many | `GET /organizations/{organizationId}/documents` |
| ✅ | Document | Search | `POST /organizations/{organizationId}/documents/search` |
| ✅ | Document | Download PDF | `GET /organizations/{organizationId}/documents/{documentId}/pdf` |
| ✅ | Document | Get Share Link (href) | `GET /organizations/{organizationId}/documents/{documentId}/href` |
| ✅ | Document | Get Many Versions | `GET /organizations/{organizationId}/documents/{documentId}/versions` |

> Note: there is no GET endpoint for a single version — `/documents/{documentId}/versions/{versionId}` is PATCH-only (update published state), so "Get Version" was dropped. It belongs in Phase 3 (write actions) instead.

## Phase 2b — Projects, Templates, Reminders, Reviewers (GET / read actions)

| Status | Resource | Operation | Endpoint |
|--------|----------|-----------|----------|
| ✅ | Project | Get | `GET /organizations/{organizationId}/projects/{projectId}` |
| ✅ | Project | Get Many | `GET /organizations/{organizationId}/projects` |
| ✅ | Project | Get Approvals | `GET /organizations/{organizationId}/projects/{projectId}/approvals` |
| ✅ | Project | Get Many Documents | `GET /organizations/{organizationId}/projects/{projectId}/documents` |
| ✅ | Template | Get | `GET /organizations/{organizationId}/templates/{templateId}` |
| ✅ | Template | Get Many | `GET /organizations/{organizationId}/templates` |
| ✅ | Template | Get Many References | `GET /organizations/{organizationId}/templates/{templateId}/references` |
| ✅ | Template | Get Reference | `GET /organizations/{organizationId}/templates/{templateId}/references/{referenceId}` |
| ✅ | Template | Get Reference Options | `GET /organizations/{organizationId}/templates/{templateId}/references/{referenceId}/options` |
| ✅ | Reminder | Get Many | `GET /organizations/{organizationId}/reminders` |
| ✅ | Reminder | Get Many for Document | `GET /organizations/{organizationId}/documents/{documentId}/reminders` |
| ✅ | Reviewer | Get Many | `GET /organizations/{organizationId}/documents/{documentId}/reviewers` |

> Reviewer and single-reminder have no GET-single endpoint (`.../reviewers/{reviewerId}` and `.../reminders/{reminderId}` are POST/DELETE only), so only Get Many is available for those.

## Phase 3 — Write actions (POST / PATCH / DELETE)

**Document**

| Status | Operation | Endpoint |
|--------|-----------|----------|
| ✅ | Create (import a file) | `POST /organizations/{organizationId}/documents/import` |
| ✅ | Update | `PATCH /organizations/{organizationId}/documents/{documentId}` |
| ✅ | Delete | `DELETE /organizations/{organizationId}/documents/{documentId}` |
| ✅ | Send Signature Request | `POST /organizations/{organizationId}/documents/{documentId}/signature-request` |
| ✅ | Cancel Signature Request | `DELETE /organizations/{organizationId}/documents/{documentId}/signature-request` |
| ✅ | Send Signature Reminder | `POST /organizations/{organizationId}/documents/{documentId}/signature-request/reminder` |

**Project**

| Status | Operation | Endpoint |
|--------|-----------|----------|
| ✅ | Update | `PATCH /organizations/{organizationId}/projects/{projectId}` |
| ✅ | Delete | `DELETE /organizations/{organizationId}/projects/{projectId}` |
| ✅ | Approve (Initial) | `POST /organizations/{organizationId}/projects/{projectId}/approvals/initial` |
| ✅ | Approve (Final) | `POST /organizations/{organizationId}/projects/{projectId}/approvals/final` |
| ✅ | Import Document | `POST /organizations/{organizationId}/projects/{projectId}/documents/import` |
| ✅ | Send Signature Request | `POST /organizations/{organizationId}/projects/{projectId}/signature-request` |

**Template**

| Status | Operation | Endpoint |
|--------|-----------|----------|
| ✅ | Create Project (draft) | `POST /organizations/{organizationId}/templates/{templateId}/projects` |
| ✅ | Update Project | `PATCH /organizations/{organizationId}/templates/{templateId}/projects/{projectId}` |
| ✅ | Set Reference Options | `PUT /organizations/{organizationId}/templates/{templateId}/references/{referenceId}/options` |

**Reminder / Reviewer**

| Status | Operation | Endpoint |
|--------|-----------|----------|
| ✅ | Reminder — Create | `POST /organizations/{organizationId}/documents/{documentId}/reminders` |
| ✅ | Reminder — Delete | `DELETE /organizations/{organizationId}/documents/{documentId}/reminders/{reminderId}` |
| ✅ | Reviewer — Create | `POST /organizations/{organizationId}/documents/{documentId}/reviewers` |
| ✅ | Reviewer — Delete | `DELETE /organizations/{organizationId}/documents/{documentId}/reviewers/{reviewerId}` |

> Delete/Cancel operations return `{ deleted: true }`. File imports read a file from an input binary field and base64-encode it. Template drafting `references` is passed as a JSON array (per-reference answer objects) — a structured UI for it is a future enhancement.

## Later / backlog

- **Trigger node** (programmatic) for Precisely resthooks — subscribe to events and receive webhook callbacks, verifying the `Precisely-Signature` header. See CLAUDE.md → "Resthooks / webhooks".
- Not yet wired: document sub-resources **Signees**, **Metadata Points**, **Links**; project **Signees**; template **references** structured input.
- Additional top-level resources: Folders, Teams, Users, Metadata Keys.
- Upgrade `organizationId` to a `resourceLocator` with a `listSearch` dropdown backed by `GET /organizations`.
