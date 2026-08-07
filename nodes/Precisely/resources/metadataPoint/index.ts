import type { INodeProperties } from 'n8n-workflow';
import {
	clientLimitField,
	documentIdField,
	organizationIdField,
	returnAllField,
} from '../../shared/descriptions';
import { returnDeleted } from '../../shared/transforms';

const showOnlyForMetadataPoints = {
	resource: ['metadataPoint'],
};

// Operations that target a single metadata point by ID.
const singleMetadataPointOperations = ['update', 'delete'];
// Operations that write a metadata point body.
const writeMetadataPointOperations = ['create', 'update'];

export const metadataPointDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForMetadataPoints },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a metadata point',
				description: 'Add a metadata point to a document',
				routing: {
					request: {
						method: 'POST',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/metadata-points',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a metadata point',
				description: 'Remove a metadata point from a document',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/metadata-points/{{$parameter.metadataPointId}}',
					},
					output: { postReceive: [returnDeleted] },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many metadata points',
				description: 'Retrieve the metadata points of a document',
				routing: {
					request: {
						method: 'GET',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/metadata-points',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a metadata point',
				description: 'Update a metadata point on a document',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/metadata-points/{{$parameter.metadataPointId}}',
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		...organizationIdField,
		displayOptions: { show: showOnlyForMetadataPoints },
	},
	{
		...documentIdField,
		displayOptions: { show: showOnlyForMetadataPoints },
	},
	{
		displayName: 'Metadata Point ID',
		name: 'metadataPointId',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. 512',
		description: 'ID of the metadata point to operate on',
		displayOptions: {
			show: { ...showOnlyForMetadataPoints, operation: singleMetadataPointOperations },
		},
	},
	{
		displayName: 'Metadata Key ID',
		name: 'metadataKeyId',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. 2896461f-ccfb-45ff-b587-87c47fe8aa90',
		description: 'ID of the metadata key this point sets',
		displayOptions: {
			show: { ...showOnlyForMetadataPoints, operation: writeMetadataPointOperations },
		},
		routing: { send: { type: 'body', property: 'metadataKeyId' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { ...showOnlyForMetadataPoints, operation: writeMetadataPointOperations },
		},
		options: [
			{
				displayName: 'Metadata Choice ID',
				name: 'metadataChoiceId',
				type: 'string',
				default: '',
				description: 'ID of the metadata choice, for choice-type metadata keys',
				routing: { send: { type: 'body', property: 'metadataChoiceId' } },
			},
			{
				displayName: 'Value',
				name: 'value',
				type: 'string',
				default: '',
				description: 'The metadata value to set',
				routing: { send: { type: 'body', property: 'value' } },
			},
		],
	},
	// Get Many list controls
	{
		...returnAllField,
		displayOptions: { show: { ...showOnlyForMetadataPoints, operation: ['getAll'] } },
	},
	{
		...clientLimitField,
		displayOptions: {
			show: { ...showOnlyForMetadataPoints, operation: ['getAll'], returnAll: [false] },
		},
	},
];
