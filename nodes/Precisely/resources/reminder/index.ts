import type { INodeProperties } from 'n8n-workflow';
import {
	clientLimitField,
	documentIdField,
	organizationIdField,
	returnAllField,
} from '../../shared/descriptions';

const showOnlyForReminders = {
	resource: ['reminder'],
};

export const reminderDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForReminders },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many reminders',
				description: 'Retrieve many reminders for an organization',
				routing: {
					request: {
						method: 'GET',
						url: '=/organizations/{{$parameter.organizationId}}/reminders',
					},
				},
			},
			{
				name: 'Get Many for Document',
				value: 'getAllForDocument',
				action: 'Get many reminders for a document',
				description: 'Retrieve the reminders attached to a document',
				routing: {
					request: {
						method: 'GET',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/reminders',
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		...organizationIdField,
		displayOptions: { show: showOnlyForReminders },
	},
	{
		...documentIdField,
		displayOptions: {
			show: { ...showOnlyForReminders, operation: ['getAllForDocument'] },
		},
	},
	{
		...returnAllField,
		displayOptions: { show: showOnlyForReminders },
	},
	{
		...clientLimitField,
		displayOptions: {
			show: { ...showOnlyForReminders, returnAll: [false] },
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showOnlyForReminders },
		options: [
			{
				displayName: 'Only Active',
				name: 'onlyActive',
				type: 'boolean',
				default: false,
				description: 'Whether to return only active reminders. Defaults to false.',
				routing: { send: { type: 'query', property: 'onlyActive' } },
			},
		],
	},
];
