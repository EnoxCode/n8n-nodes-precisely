import type { INodeProperties } from 'n8n-workflow';
import {
	clientLimitField,
	documentIdField,
	organizationIdField,
	returnAllField,
} from '../../shared/descriptions';
import { returnDeleted } from '../../shared/transforms';

const showOnlyForLinks = {
	resource: ['link'],
};

const relationOptions = [
	{ name: 'Amended By', value: 'amended_by' },
	{ name: 'Amendment To', value: 'amendment_to' },
	{ name: 'Appendix To', value: 'appendix_to' },
	{ name: 'Appendixed By', value: 'appendixed_by' },
	{ name: 'Relates To', value: 'relates_to' },
	{ name: 'Renewal Of', value: 'renewal_of' },
	{ name: 'Renewed By', value: 'renewed_by' },
	{ name: 'Replaced By', value: 'replaced_by' },
	{ name: 'Replacement For', value: 'replacement_for' },
	{ name: 'Supplement To', value: 'supplement_to' },
	{ name: 'Supplemented By', value: 'supplemented_by' },
];

export const linkDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForLinks },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a link',
				description: 'Link a document to another document',
				routing: {
					request: {
						method: 'POST',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/links',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a link',
				description: 'Remove a link from a document',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/links/{{$parameter.linkId}}',
					},
					output: { postReceive: [returnDeleted] },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many links',
				description: 'Retrieve the links of a document',
				routing: {
					request: {
						method: 'GET',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/links',
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		...organizationIdField,
		displayOptions: { show: showOnlyForLinks },
	},
	{
		...documentIdField,
		displayOptions: { show: showOnlyForLinks },
	},
	{
		displayName: 'Link ID',
		name: 'linkId',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. 88',
		description: 'ID of the link to delete',
		displayOptions: {
			show: { ...showOnlyForLinks, operation: ['delete'] },
		},
	},
	// Create fields (DocumentLinkRequest)
	{
		displayName: 'Target Document ID',
		name: 'objectId',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. yd8sqKy',
		description: 'ID of the document to link to',
		displayOptions: {
			show: { ...showOnlyForLinks, operation: ['create'] },
		},
		routing: { send: { type: 'body', property: 'objectId' } },
	},
	{
		displayName: 'Relation',
		name: 'objectRelation',
		type: 'options',
		default: 'relates_to',
		description: 'Relation of the current document to the target document',
		options: relationOptions,
		displayOptions: {
			show: { ...showOnlyForLinks, operation: ['create'] },
		},
		routing: { send: { type: 'body', property: 'objectRelation' } },
	},
	// Get Many list controls
	{
		...returnAllField,
		displayOptions: { show: { ...showOnlyForLinks, operation: ['getAll'] } },
	},
	{
		...clientLimitField,
		displayOptions: {
			show: { ...showOnlyForLinks, operation: ['getAll'], returnAll: [false] },
		},
	},
];
