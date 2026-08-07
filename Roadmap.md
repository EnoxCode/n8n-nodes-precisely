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

## Phase 3 — Documents (POST / PUT / write actions)

| Status | Resource | Operation | Endpoint |
|--------|----------|-----------|----------|
| ⬜ | Document | Import / Create | `POST /organizations/{organizationId}/documents/import` |
| ⬜ | Document | Update | `PUT /organizations/{organizationId}/documents/{documentId}` |
| ⬜ | Document | Delete | `DELETE /organizations/{organizationId}/documents/{documentId}` |
| ⬜ | Document | Send Signature Request | `POST /organizations/{organizationId}/documents/{documentId}/signature-request` |

## Phase 3b — Reminders & Reviewers (write actions)

| Status | Resource | Operation | Endpoint |
|--------|----------|-----------|----------|
| ⬜ | Reminder | Create (for Document) | `POST /organizations/{organizationId}/documents/{documentId}/reminders` |
| ⬜ | Reminder | Delete | `DELETE /organizations/{organizationId}/documents/{documentId}/reminders/{reminderId}` |
| ⬜ | Reviewer | Create | `POST /organizations/{organizationId}/documents/{documentId}/reviewers` |
| ⬜ | Reviewer | Delete | `DELETE /organizations/{organizationId}/documents/{documentId}/reviewers/{reviewerId}` |

> Reminders and reviewers have no GET-single or PUT endpoint — only list (GET), create (POST) and delete (DELETE). Read actions for both are already done in Phase 2b.

## Later / backlog

- **Trigger node** (programmatic) for Precisely resthooks — subscribe to events and receive webhook callbacks, verifying the `Precisely-Signature` header. See CLAUDE.md → "Resthooks / webhooks".
- Project write actions (drafting/import/signature-request), Template project creation, Approvals (final/initial), Signees.
- Additional resources: Signatures/Signees, Folders, Metadata, Teams, Users.
- Upgrade `organizationId` to a `resourceLocator` with a `listSearch` dropdown backed by `GET /organizations`.
