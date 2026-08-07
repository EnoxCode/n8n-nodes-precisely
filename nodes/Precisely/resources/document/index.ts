import type { INodeProperties } from 'n8n-workflow';
import { documentIdField, organizationIdField } from '../../shared/descriptions';
import {
	buildDocumentImportBody,
	buildSearchBody,
	handleDocumentPdf,
	returnDeleted,
} from '../../shared/transforms';
import { documentGetManyDescription } from './getAll';
import { documentSearchDescription } from './search';
import { documentPdfDescription } from './pdf';
import { documentCreateDescription } from './create';
import { documentUpdateDescription } from './update';

const showOnlyForDocuments = {
	resource: ['document'],
};

// Operations that act on a single, existing document (need the Document ID).
const singleDocumentOperations = [
	'get',
	'update',
	'delete',
	'downloadPdf',
	'getShareLink',
	'getSignatureRequest',
	'getVersions',
	'updateVersion',
	'sendSignatureRequest',
	'cancelSignatureRequest',
	'sendSignatureReminder',
];

export const documentDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForDocuments },
		options: [
			{
				name: 'Cancel Signature Request',
				value: 'cancelSignatureRequest',
				action: 'Cancel a signature request',
				description: 'Withdraw a pending signature request',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/signature-request',
					},
					output: { postReceive: [returnDeleted] },
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a document',
				description: 'Import a file as a new document',
				routing: {
					request: {
						method: 'POST',
						url: '=/organizations/{{$parameter.organizationId}}/documents/import',
					},
					send: { preSend: [buildDocumentImportBody] },
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a document',
				description: 'Delete a document',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}',
					},
					output: { postReceive: [returnDeleted] },
				},
			},
			{
				name: 'Download PDF',
				value: 'downloadPdf',
				action: 'Download a document as PDF',
				description: 'Retrieve a document rendered as a PDF file',
				routing: {
					request: {
						method: 'GET',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/pdf',
						encoding: 'arraybuffer',
					},
					output: { postReceive: [handleDocumentPdf] },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a document',
				description: 'Retrieve a single document by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many documents',
				description: 'Retrieve documents for an organization',
				routing: {
					request: {
						method: 'GET',
						url: '=/organizations/{{$parameter.organizationId}}/documents',
					},
				},
			},
			{
				name: 'Get Many Versions',
				value: 'getVersions',
				action: 'Get many document versions',
				description: 'Retrieve the version history of a document',
				routing: {
					request: {
						method: 'GET',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/versions',
					},
				},
			},
			{
				name: 'Get Share Link',
				value: 'getShareLink',
				action: 'Get a document share link',
				description: 'Retrieve the app link to view a document',
				routing: {
					request: {
						method: 'GET',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/href',
					},
				},
			},
			{
				name: 'Get Signature Request',
				value: 'getSignatureRequest',
				action: 'Get a signature request',
				description: 'Retrieve the current signature request status of a document',
				routing: {
					request: {
						method: 'GET',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/signature-request',
					},
				},
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search documents',
				description: 'Search documents by property or metadata filters',
				routing: {
					request: {
						method: 'POST',
						url: '=/organizations/{{$parameter.organizationId}}/documents/search',
					},
					send: { preSend: [buildSearchBody] },
				},
			},
			{
				name: 'Send Signature Reminder',
				value: 'sendSignatureReminder',
				action: 'Send a signature reminder',
				description: 'Send a reminder to pending signees',
				routing: {
					request: {
						method: 'POST',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/signature-request/reminder',
					},
				},
			},
			{
				name: 'Send Signature Request',
				value: 'sendSignatureRequest',
				action: 'Send a signature request',
				description: 'Send the document to its signees for signing',
				routing: {
					request: {
						method: 'POST',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/signature-request',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a document',
				description: 'Update the details of a document',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}',
					},
				},
			},
			{
				name: 'Update Version',
				value: 'updateVersion',
				action: 'Update a document version',
				description: 'Set the published state of a document version',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/organizations/{{$parameter.organizationId}}/documents/{{$parameter.documentId}}/versions/{{$parameter.versionId}}',
					},
				},
			},
		],
		default: 'getAll',
	},
	// organizationId scopes every document operation
	{
		...organizationIdField,
		displayOptions: { show: showOnlyForDocuments },
	},
	// documentId is only needed by single-document operations
	{
		...documentIdField,
		displayOptions: {
			show: { ...showOnlyForDocuments, operation: singleDocumentOperations },
		},
	},
	// Message for Send Signature Request
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		default: '',
		description: 'Optional message included with the signature request',
		displayOptions: {
			show: { ...showOnlyForDocuments, operation: ['sendSignatureRequest'] },
		},
		routing: { send: { type: 'body', property: 'message' } },
	},
	// Update Version fields
	{
		displayName: 'Version ID',
		name: 'versionId',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. 3',
		description: 'ID of the version to update',
		displayOptions: {
			show: { ...showOnlyForDocuments, operation: ['updateVersion'] },
		},
	},
	{
		displayName: 'Published',
		name: 'published',
		type: 'boolean',
		default: false,
		description: 'Whether the version should be published',
		displayOptions: {
			show: { ...showOnlyForDocuments, operation: ['updateVersion'] },
		},
		routing: { send: { type: 'body', property: 'published' } },
	},
	...documentCreateDescription,
	...documentUpdateDescription,
	...documentGetManyDescription,
	...documentSearchDescription,
	...documentPdfDescription,
];
