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
