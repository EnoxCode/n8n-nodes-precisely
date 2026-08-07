import type { INodeProperties } from 'n8n-workflow';

/**
 * Almost every Precisely endpoint is scoped to an organization
 * (`/organizations/{organizationId}/...`). Spread this field into each
 * org-scoped operation and reference it in routing as `$parameter.organizationId`.
 *
 * Backed by the `getOrganizations` loadOptions method (GET /organizations), so
 * the user can pick an organization by name or supply an ID via an expression.
 */
export const organizationIdField: INodeProperties = {
	displayName: 'Organization Name or ID',
	name: 'organizationId',
	type: 'options',
	typeOptions: {
		loadOptionsMethod: 'getOrganizations',
	},
	default: '',
	required: true,
	description:
		'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
};

/** Standard Return All toggle for list operations. Pair with `limitField`. */
export const returnAllField: INodeProperties = {
	displayName: 'Return All',
	name: 'returnAll',
	type: 'boolean',
	default: false,
	description: 'Whether to return all results or only up to a given limit',
};

/** Standard Limit field, shown only when Return All is off. */
export const limitField: INodeProperties = {
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	default: 50,
	typeOptions: { minValue: 1 },
	description: 'Max number of results to return',
};

/** Identifies a single document. Reused across the single-document operations. */
export const documentIdField: INodeProperties = {
	displayName: 'Document ID',
	name: 'documentId',
	type: 'string',
	default: '',
	required: true,
	placeholder: 'e.g. yd8sqKy',
	description: 'ID of the document to operate on',
};

/** Identifies a single project. */
export const projectIdField: INodeProperties = {
	displayName: 'Project ID',
	name: 'projectId',
	type: 'string',
	default: '',
	required: true,
	placeholder: 'e.g. 3554',
	description: 'ID of the project to operate on',
};

/** Identifies a single template. */
export const templateIdField: INodeProperties = {
	displayName: 'Template ID',
	name: 'templateId',
	type: 'string',
	default: '',
	required: true,
	placeholder: 'e.g. 812',
	description: 'ID of the template to operate on',
};

/** Identifies a single template reference. */
export const referenceIdField: INodeProperties = {
	displayName: 'Reference ID',
	name: 'referenceId',
	type: 'string',
	default: '',
	required: true,
	placeholder: 'e.g. 42',
	description: 'ID of the template reference to operate on',
};

/**
 * Limit field for list endpoints that return the full array with no server-side
 * pagination — it just caps the result client-side. Pair with `returnAllField`.
 */
export const clientLimitField: INodeProperties = {
	...limitField,
	routing: {
		output: { maxResults: '={{$value}}' },
	},
};

type DisplayShow = Record<string, Array<boolean | string | number>>;

/**
 * Builds the Return All + Limit pair for a non-paginated list operation, both
 * gated on the given displayOptions.show condition. Keeps resources with several
 * list operations from repeating the same two field definitions.
 */
export function clientListPagination(show: DisplayShow): INodeProperties[] {
	return [
		{
			...returnAllField,
			displayOptions: { show },
		},
		{
			...clientLimitField,
			displayOptions: { show: { ...show, returnAll: [false] } },
		},
	];
}

const authMethodToViewOptions = [
	{ name: 'DK MitID', value: 'dk_mitid' },
	{ name: 'DK NemID', value: 'dk_nemid' },
	{ name: 'FI Tupas', value: 'fi_tupas' },
	{ name: 'NO BankID', value: 'no_bankid' },
	{ name: 'None', value: 'none' },
	{ name: 'SE BankID', value: 'se_bankid' },
	{ name: 'Smart ID', value: 'smartid' },
	{ name: 'SMS PIN', value: 'sms_pin' },
];

const authMethodToSignOptions = [
	{ name: 'DK MitID', value: 'dk_mitid' },
	{ name: 'DK NemID', value: 'dk_nemid' },
	{ name: 'FI Tupas', value: 'fi_tupas' },
	{ name: 'In Person', value: 'in_person' },
	{ name: 'NO BankID', value: 'no_bankid' },
	{ name: 'SE BankID', value: 'se_bankid' },
	{ name: 'Smart ID', value: 'smartid' },
	{ name: 'SMS PIN', value: 'sms_pin' },
	{ name: 'Standard', value: 'standard' },
];

/**
 * Builds the signee body fields (SigneeRequest). Reused by the document Signee
 * resource and the project Add Signee operation — same body, different
 * displayOptions. Email is the only required field; the rest go in a collection.
 */
export function signeeBodyFields(show: DisplayShow): INodeProperties[] {
	return [
		{
			displayName: 'Email',
			name: 'email',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'e.g. maria@example.com',
			description: 'Email address of the signee',
			displayOptions: { show },
			routing: { send: { type: 'body', property: 'email' } },
		},
		{
			displayName: 'Additional Fields',
			name: 'additionalFields',
			type: 'collection',
			placeholder: 'Add Field',
			default: {},
			displayOptions: { show },
			options: [
				{
					displayName: 'Authentication Method to Sign',
					name: 'authMethodToSign',
					type: 'options',
					default: 'standard',
					description: 'Authentication method required for the signee to sign',
					options: authMethodToSignOptions,
					routing: { send: { type: 'body', property: 'authMethodToSign' } },
				},
				{
					displayName: 'Authentication Method to View',
					name: 'authMethodToView',
					type: 'options',
					default: 'none',
					description: 'Authentication method required for the signee to view',
					options: authMethodToViewOptions,
					routing: { send: { type: 'body', property: 'authMethodToView' } },
				},
				{
					displayName: 'Final Email Notification Disabled',
					name: 'finalEmailNotificationDisabled',
					type: 'boolean',
					default: false,
					description: 'Whether to disable the final email notification. Defaults to false.',
					routing: { send: { type: 'body', property: 'finalEmailNotificationDisabled' } },
				},
				{
					displayName: 'Initial Email Notification Disabled',
					name: 'initialEmailNotificationDisabled',
					type: 'boolean',
					default: false,
					description: 'Whether to disable the initial email notification. Defaults to false.',
					routing: { send: { type: 'body', property: 'initialEmailNotificationDisabled' } },
				},
				{
					displayName: 'Mobile',
					name: 'mobile',
					type: 'string',
					default: '',
					description: 'Mobile phone number of the signee',
					routing: { send: { type: 'body', property: 'mobile' } },
				},
				{
					displayName: 'Name',
					name: 'name',
					type: 'string',
					default: '',
					description: 'Name of the signee',
					routing: { send: { type: 'body', property: 'name' } },
				},
				{
					displayName: 'National ID',
					name: 'nationalId',
					type: 'string',
					default: '',
					description: 'National ID number of the signee',
					routing: { send: { type: 'body', property: 'nationalId' } },
				},
				{
					displayName: 'Organization',
					name: 'organization',
					type: 'string',
					default: '',
					description: 'Organization the signee belongs to',
					routing: { send: { type: 'body', property: 'organization' } },
				},
				{
					displayName: 'Role',
					name: 'role',
					type: 'string',
					default: '',
					description: 'Free-text role of the signee',
					routing: { send: { type: 'body', property: 'role' } },
				},
				{
					displayName: 'Signing Role',
					name: 'signingRole',
					type: 'options',
					default: 'signer',
					description: 'The signing role of the signee',
					options: [
						{ name: 'Approver', value: 'approver' },
						{ name: 'Signer', value: 'signer' },
						{ name: 'Viewer', value: 'viewer' },
					],
					routing: { send: { type: 'body', property: 'signingRole' } },
				},
			],
		},
	];
}

/**
 * Return All toggle for the document list endpoints (Get Many, Search). Those
 * paginate via `page` + `limit` query params and report progress in the
 * Pagination-Page-Current / Pagination-Page-Count response headers. Spread this
 * in and add per-operation displayOptions; pair with `paginatedLimitField`.
 */
export const paginatedReturnAllField: INodeProperties = {
	...returnAllField,
	routing: {
		send: { paginate: '={{ $value }}' },
		operations: {
			pagination: {
				type: 'generic',
				properties: {
					continue:
						'={{ Number($response.headers?.["pagination-page-current"]) < Number($response.headers?.["pagination-page-count"]) }}',
					request: {
						qs: {
							page: '={{ Number($response.headers?.["pagination-page-current"] ?? 0) + 1 }}',
						},
					},
				},
			},
		},
	},
};

/** Limit field for the paginated document list endpoints. Shown when Return All is off. */
export const paginatedLimitField: INodeProperties = {
	...limitField,
	routing: {
		send: { type: 'query', property: 'limit' },
		output: { maxResults: '={{$value}}' },
	},
};
