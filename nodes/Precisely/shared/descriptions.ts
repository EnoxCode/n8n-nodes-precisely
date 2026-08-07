import type { INodeProperties } from 'n8n-workflow';

/**
 * Almost every Precisely endpoint is scoped to an organization
 * (`/organizations/{organizationId}/...`). Spread this field into each
 * org-scoped operation and reference it in routing as `$parameter.organizationId`
 * — n8n resolves the resourceLocator to its value inside routing expressions.
 *
 * The "From List" mode is backed by the `searchOrganizations` listSearch method
 * (GET /organizations); users can also type an ID directly.
 */
export const organizationIdField: INodeProperties = {
	displayName: 'Organization',
	name: 'organizationId',
	type: 'resourceLocator',
	default: { mode: 'list', value: '' },
	required: true,
	description: 'The organization the request is scoped to',
	modes: [
		{
			displayName: 'From List',
			name: 'list',
			type: 'list',
			placeholder: 'Select an organization...',
			typeOptions: {
				searchListMethod: 'searchOrganizations',
				searchable: true,
			},
		},
		{
			displayName: 'By ID',
			name: 'id',
			type: 'string',
			placeholder: 'e.g. 15',
			validation: [
				{
					type: 'regex',
					properties: {
						regex: '^[0-9]+$',
						errorMessage: 'Not a valid organization ID',
					},
				},
			],
		},
	],
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
 * Plain SigneeRequest fields (no routing, no displayOptions). Email is first and
 * required; the rest are alphabetical. Used directly as `fixedCollection` values
 * for signee arrays, and as the basis for `signeeBodyFields` below.
 */
export const signeeValueFields: INodeProperties[] = [
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. maria@example.com',
		description: 'Email address of the signee',
	},
	{
		displayName: 'Authentication Method to Sign',
		name: 'authMethodToSign',
		type: 'options',
		default: 'standard',
		description: 'Authentication method required for the signee to sign',
		options: authMethodToSignOptions,
	},
	{
		displayName: 'Authentication Method to View',
		name: 'authMethodToView',
		type: 'options',
		default: 'none',
		description: 'Authentication method required for the signee to view',
		options: authMethodToViewOptions,
	},
	{
		displayName: 'Final Email Notification Disabled',
		name: 'finalEmailNotificationDisabled',
		type: 'boolean',
		default: false,
		description: 'Whether to disable the final email notification. Defaults to false.',
	},
	{
		displayName: 'Initial Email Notification Disabled',
		name: 'initialEmailNotificationDisabled',
		type: 'boolean',
		default: false,
		description: 'Whether to disable the initial email notification. Defaults to false.',
	},
	{
		displayName: 'Mobile',
		name: 'mobile',
		type: 'string',
		default: '',
		description: 'Mobile phone number of the signee',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Name of the signee',
	},
	{
		displayName: 'National ID',
		name: 'nationalId',
		type: 'string',
		default: '',
		description: 'National ID number of the signee',
	},
	{
		displayName: 'Organization',
		name: 'organization',
		type: 'string',
		default: '',
		description: 'Organization the signee belongs to',
	},
	{
		displayName: 'Role',
		name: 'role',
		type: 'string',
		default: '',
		description: 'Free-text role of the signee',
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
	},
];

/**
 * Builds the single-signee body fields (SigneeRequest) for the document Signee
 * Create and project Add Signee operations — Email as a required field, the rest
 * in an Additional Fields collection, each routed to the request body.
 */
export function signeeBodyFields(show: DisplayShow): INodeProperties[] {
	const [email, ...rest] = signeeValueFields;
	return [
		{
			...email,
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
			options: rest.map((field) => ({
				...field,
				routing: { send: { type: 'body', property: field.name } },
			})),
		},
	];
}

/**
 * Builds a `fixedCollection` for an array of signees (e.g. project Create
 * Document `signees`), routed to the given body property as a plain array.
 */
export function signeeArrayField(show: DisplayShow, bodyProperty: string): INodeProperties {
	return {
		displayName: 'Signees',
		name: 'signees',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		placeholder: 'Add Signee',
		default: {},
		description: 'Signees to add to the document',
		displayOptions: { show },
		options: [
			{
				name: 'signee',
				displayName: 'Signee',
				values: signeeValueFields,
			},
		],
		routing: { send: { type: 'body', property: bodyProperty, value: '={{ $value.signee }}' } },
	};
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
