import type { INodeProperties } from 'n8n-workflow';
import { documentIdField, organizationIdField } from '../../shared/descriptions';
import { buildSearchBody, handleDocumentPdf } from '../../shared/transforms';
import { documentGetManyDescription } from './getAll';
import { documentSearchDescription } from './search';
import { documentPdfDescription } from './pdf';

const showOnlyForDocuments = {
	resource: ['document'],
};

// Operations that act on a single document need the Document ID field.
const singleDocumentOperations = ['get', 'downloadPdf', 'getShareLink', 'getVersions'];

export const documentDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForDocuments },
		options: [
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
					output: {
						postReceive: [handleDocumentPdf],
					},
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
				name: 'Search',
				value: 'search',
				action: 'Search documents',
				description: 'Search documents by property or metadata filters',
				routing: {
					request: {
						method: 'POST',
						url: '=/organizations/{{$parameter.organizationId}}/documents/search',
					},
					send: {
						preSend: [buildSearchBody],
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
	// documentId is only needed by the single-document operations
	{
		...documentIdField,
		displayOptions: {
			show: { ...showOnlyForDocuments, operation: singleDocumentOperations },
		},
	},
	...documentGetManyDescription,
	...documentSearchDescription,
	...documentPdfDescription,
];
