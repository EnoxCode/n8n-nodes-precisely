import type { INodeProperties } from 'n8n-workflow';
import {
	clientLimitField,
	documentIdField,
	organizationIdField,
	returnAllField,
} from '../../shared/descriptions';
import { returnDeleted } from '../../shared/transforms';

const showOnlyForReminders = {
	resource: ['reminder'],
};

// Operations that target a specific document.
const documentScopedOperations = ['getAllForDocument', 'create', 'delete'];
// Operations that return a list.
const listOperations = ['getAll', 'getAllForDocument'];

export const reminderDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForReminders },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a reminder',
				description: 'Create a reminder on a document',
				routing: {
					request: {
						method: 'POST',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/reminders',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a reminder',
				description: 'Delete a reminder from a document',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/reminders/{{$parameter.reminderId}}',
					},
					output: { postReceive: [returnDeleted] },
				},
			},
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
			show: { ...showOnlyForReminders, operation: documentScopedOperations },
		},
	},
	{
		displayName: 'Reminder ID',
		name: 'reminderId',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. 91',
		description: 'ID of the reminder to delete',
		displayOptions: {
			show: { ...showOnlyForReminders, operation: ['delete'] },
		},
	},
	// Create fields
	{
		displayName: 'Remind At',
		name: 'remindAt',
		type: 'dateTime',
		default: '',
		required: true,
		description: 'When the reminder should be sent',
		displayOptions: {
			show: { ...showOnlyForReminders, operation: ['create'] },
		},
		routing: { send: { type: 'body', property: 'remindAt' } },
	},
	{
		displayName: 'Recipients',
		name: 'recipients',
		type: 'string',
		typeOptions: { multipleValues: true, multipleValueButtonText: 'Add Recipient' },
		default: [],
		placeholder: 'e.g. maria@example.com',
		description: 'Email addresses to send the reminder to',
		displayOptions: {
			show: { ...showOnlyForReminders, operation: ['create'] },
		},
		routing: { send: { type: 'body', property: 'recipients' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { ...showOnlyForReminders, operation: ['create'] },
		},
		options: [
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				default: '',
				description: 'Message included in the reminder',
				routing: { send: { type: 'body', property: 'message' } },
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the reminder',
				routing: { send: { type: 'body', property: 'name' } },
			},
		],
	},
	// Return All / Limit for the list operations
	{
		...returnAllField,
		displayOptions: { show: { ...showOnlyForReminders, operation: listOperations } },
	},
	{
		...clientLimitField,
		displayOptions: {
			show: { ...showOnlyForReminders, operation: listOperations, returnAll: [false] },
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { ...showOnlyForReminders, operation: listOperations } },
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
