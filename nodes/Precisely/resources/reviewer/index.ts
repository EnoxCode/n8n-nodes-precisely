import type { INodeProperties } from 'n8n-workflow';
import {
	clientLimitField,
	documentIdField,
	organizationIdField,
	returnAllField,
} from '../../shared/descriptions';
import { returnDeleted } from '../../shared/transforms';

const showOnlyForReviewers = {
	resource: ['reviewer'],
};

export const reviewerDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForReviewers },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a reviewer',
				description: 'Add a reviewer to a document',
				routing: {
					request: {
						method: 'POST',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/reviewers',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a reviewer',
				description: 'Remove a reviewer from a document',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/reviewers/{{$parameter.reviewerId}}',
					},
					output: { postReceive: [returnDeleted] },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many reviewers',
				description: 'Retrieve the reviewers assigned to a document',
				routing: {
					request: {
						method: 'GET',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/reviewers',
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		...organizationIdField,
		displayOptions: { show: showOnlyForReviewers },
	},
	{
		...documentIdField,
		displayOptions: { show: showOnlyForReviewers },
	},
	{
		displayName: 'Reviewer ID',
		name: 'reviewerId',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. 77',
		description: 'ID of the reviewer to delete',
		displayOptions: {
			show: { ...showOnlyForReviewers, operation: ['delete'] },
		},
	},
	// Create fields
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. Maria Andersson',
		description: 'Name of the reviewer',
		displayOptions: {
			show: { ...showOnlyForReviewers, operation: ['create'] },
		},
		routing: { send: { type: 'body', property: 'name' } },
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. maria@example.com',
		description: 'Email address of the reviewer',
		displayOptions: {
			show: { ...showOnlyForReviewers, operation: ['create'] },
		},
		routing: { send: { type: 'body', property: 'email' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { ...showOnlyForReviewers, operation: ['create'] },
		},
		options: [
			{
				displayName: 'Attachment Kind',
				name: 'attachmentKind',
				type: 'options',
				default: 'pdf',
				description: 'File format of the review attachment',
				options: [
					{ name: 'DOCX', value: 'docx' },
					{ name: 'PDF', value: 'pdf' },
				],
				routing: { send: { type: 'body', property: 'attachmentKind' } },
			},
			{
				displayName: 'Enable Collaboration',
				name: 'enableCollaboration',
				type: 'boolean',
				default: false,
				description: 'Whether the reviewer can collaborate on the document. Defaults to false.',
				routing: { send: { type: 'body', property: 'enableCollaboration' } },
			},
			{
				displayName: 'Enable PDF Attachments',
				name: 'enablePdfAttachments',
				type: 'boolean',
				default: false,
				description: 'Whether to attach the document as a PDF. Defaults to false.',
				routing: { send: { type: 'body', property: 'enablePdfAttachments' } },
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				default: '',
				description: 'Message included in the review request',
				routing: { send: { type: 'body', property: 'message' } },
			},
		],
	},
	// Get Many list controls
	{
		...returnAllField,
		displayOptions: { show: { ...showOnlyForReviewers, operation: ['getAll'] } },
	},
	{
		...clientLimitField,
		displayOptions: {
			show: { ...showOnlyForReviewers, operation: ['getAll'], returnAll: [false] },
		},
	},
];
