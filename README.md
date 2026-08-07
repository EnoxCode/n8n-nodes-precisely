# n8n-nodes-precisely

This is an n8n community node. It lets you use [Precisely](https://preciselycontracts.com/) — a contract automation and e-signature platform — in your n8n workflows.

With it you can automate contract lifecycles: draft projects from templates, import and send documents for signing, manage signees, reviewers, reminders and metadata, and read everything back out again.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Credentials](#credentials)
[Operations](#operations)
[Usage notes](#usage-notes)
[Compatibility](#compatibility)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

In short, on self-hosted n8n: **Settings → Community Nodes → Install**, then enter `n8n-nodes-precisely`.

## Credentials

The node authenticates with a **Precisely API key**, sent in the `X-API-KEY` request header.

1. Sign in to Precisely.
2. Create an API token — see [API tokens in Precisely](https://help.precisely.se/en/articles/5733009-api-tokens-in-precisely).
3. In n8n, create a new **Precisely API** credential and paste the token into the **API Key** field.

When you save the credential, n8n validates it by calling `GET /organizations`. All requests go to `https://api.precisely.se` and are rate-limited to **30 requests/minute per organization**.

> The API also supports JWT bearer auth via `/authenticate`; this node uses the API-key method only.

## Operations

Nearly every operation is scoped to an **Organization**. The Organization field is a searchable dropdown (backed by `GET /organizations`); you can also switch it to **By ID** and enter or map an organization ID directly.

<details>
<summary><b>Organization</b></summary>

- Get
- Get Many
</details>

<details>
<summary><b>Document</b></summary>

- Create (import a file from a binary field)
- Get / Get Many
- Search (filter by document property or metadata)
- Update / Delete
- Download PDF (returns a binary file)
- Get Share Link
- Get Many Versions / Update Version (set published state)
- Get / Send / Cancel Signature Request
- Send Signature Reminder
</details>

<details>
<summary><b>Project</b></summary>

- Get / Get Many
- Update / Delete
- Get Approvals · Approve (Initial) · Approve (Final) · Approve (By ID) · Delete Approval
- Get Many Documents · Create Document · Import Document
- Send / Cancel Signature Request
- Add Signee · Remove Signee
</details>

<details>
<summary><b>Template</b></summary>

- Get / Get Many
- Get Many References · Get Reference · Get Reference Options · Set Reference Options
- Create Project (draft a project from the template)
- Update Project
</details>

<details>
<summary><b>Signee</b> (document signees)</summary>

- Get / Get Many
- Create · Reorder · Delete
</details>

<details>
<summary><b>Reviewer</b> (document reviewers)</summary>

- Get Many
- Create · Delete
</details>

<details>
<summary><b>Reminder</b></summary>

- Get Many (organization) · Get Many for Document
- Create · Delete
</details>

<details>
<summary><b>Metadata Point</b> (document metadata)</summary>

- Get Many
- Create · Update · Delete
</details>

<details>
<summary><b>Link</b> (document links)</summary>

- Get Many
- Create · Delete
</details>

The node covers every endpoint in these resource areas of the Precisely public API.

## Usage notes

- **Selecting an organization** — use the **From List** mode to pick by name, or **By ID** to type/expression an ID.
- **List operations** — every *Get Many* offers a **Return All** toggle and a **Limit**. Document and Project lists paginate server-side; the others cap the returned array client-side.
- **Importing documents** — *Document → Create* and *Project → Import Document* read the file from an **input binary field** (default `data`) and upload it. Put a Read/Binary node (e.g. HTTP Request, Read Binary File) upstream.
- **Download PDF** — returns the document as binary data in the field you name (default `data`); attach a Write Binary File or upload node downstream.
- **Delete / Cancel** operations return `{ "deleted": true }` on success.
- **Search** — add **Filters** (document `status` or `title`) and/or **Metadata Filters** (metadata key + operator + value). At least one filter is required.
- **Signees, References** — provided as structured, repeatable fields (add one row per signee / reference). The project *Create Document* **Content** is a free-form object, so it is entered as JSON.

## Compatibility

Requires n8n **1.60.0** or later.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Precisely Contract Automation API](https://help.precisely.se/en/articles/4135833-precisely-s-contract-automation-api)
- [Precisely API tokens](https://help.precisely.se/en/articles/5733009-api-tokens-in-precisely)
