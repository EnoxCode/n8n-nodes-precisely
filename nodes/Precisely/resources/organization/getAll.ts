import type { INodeProperties } from 'n8n-workflow';
import { clientLimitField, returnAllField } from '../../shared/descriptions';

const showOnlyForOrganizationGetMany = {
	resource: ['organization'],
	operation: ['getAll'],
};

// GET /organizations returns every organization the API key can access as a
// plain array (no server-side pagination), so Return All / Limit only caps the
// result client-side via output.maxResults.
export const organizationGetManyDescription: INodeProperties[] = [
	{
		...returnAllField,
		displayOptions: { show: showOnlyForOrganizationGetMany },
	},
	{
		...clientLimitField,
		displayOptions: {
			show: { ...showOnlyForOrganizationGetMany, returnAll: [false] },
		},
	},
];
