import type { INodeProperties } from 'n8n-workflow';
import {
	clientLimitField,
	documentIdField,
	organizationIdField,
	returnAllField,
	signeeBodyFields,
} from '../../shared/descriptions';
import { returnDeleted } from '../../shared/transforms';

const showOnlyForSignees = {
	resource: ['signee'],
};

// Operations that target a single signee by ID.
const singleSigneeOperations = ['get', 'delete'];

export const signeeDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForSignees },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a signee',
				description: 'Add a signee to a document',
				routing: {
					request: {
						method: 'POST',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/signees',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a signee',
				description: 'Remove a signee from a document',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/signees/{{$parameter.signeeId}}',
					},
					output: { postReceive: [returnDeleted] },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a signee',
				description: 'Retrieve a single signee by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/signees/{{$parameter.signeeId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many signees',
				description: 'Retrieve the signees of a document',
				routing: {
					request: {
						method: 'GET',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/signees',
					},
				},
			},
			{
				name: 'Reorder',
				value: 'reorder',
				action: 'Reorder a signee',
				description: 'Change the signing order position of a signee',
				routing: {
					request: {
						method: 'PUT',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/signees',
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		...organizationIdField,
		displayOptions: { show: showOnlyForSignees },
	},
	{
		...documentIdField,
		displayOptions: { show: showOnlyForSignees },
	},
	{
		displayName: 'Signee ID',
		name: 'signeeId',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. 204',
		description: 'ID of the signee to operate on',
		displayOptions: {
			show: { ...showOnlyForSignees, operation: singleSigneeOperations },
		},
	},
	// Create fields (SigneeRequest)
	...signeeBodyFields({ ...showOnlyForSignees, operation: ['create'] }),
	// Reorder fields
	{
		displayName: 'Signee ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. 204',
		description: 'ID of the signee to move',
		displayOptions: {
			show: { ...showOnlyForSignees, operation: ['reorder'] },
		},
		routing: { send: { type: 'body', property: 'id' } },
	},
	{
		displayName: 'Insert Before',
		name: 'insertBefore',
		type: 'number',
		default: 0,
		required: true,
		description: 'Zero-based position to insert the signee before',
		displayOptions: {
			show: { ...showOnlyForSignees, operation: ['reorder'] },
		},
		routing: { send: { type: 'body', property: 'insertBefore' } },
	},
	// Get Many list controls
	{
		...returnAllField,
		displayOptions: { show: { ...showOnlyForSignees, operation: ['getAll'] } },
	},
	{
		...clientLimitField,
		displayOptions: {
			show: { ...showOnlyForSignees, operation: ['getAll'], returnAll: [false] },
		},
	},
];
