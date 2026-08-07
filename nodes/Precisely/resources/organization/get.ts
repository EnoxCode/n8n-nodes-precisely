import type { INodeProperties } from 'n8n-workflow';
import { organizationIdField } from '../../shared/descriptions';

const showOnlyForOrganizationGet = {
	resource: ['organization'],
	operation: ['get'],
};

export const organizationGetDescription: INodeProperties[] = [
	{
		...organizationIdField,
		displayOptions: { show: showOnlyForOrganizationGet },
	},
];
