import type { INodeProperties } from 'n8n-workflow';
import { organizationGetManyDescription } from './getAll';
import { organizationGetDescription } from './get';

const showOnlyForOrganizations = {
	resource: ['organization'],
};

export const organizationDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForOrganizations },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get an organization',
				description: 'Retrieve a single organization by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/organizations/{{$parameter.organizationId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many organizations',
				description: 'Retrieve many organizations the API key can access',
				routing: {
					request: {
						method: 'GET',
						url: '/organizations',
					},
				},
			},
		],
		default: 'getAll',
	},
	...organizationGetDescription,
	...organizationGetManyDescription,
];
