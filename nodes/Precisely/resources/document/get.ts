import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDocumentGet = {
	resource: ['document'],
	operation: ['get'],
};

export const documentGetDescription: INodeProperties[] = [
	{
		displayName: 'Document ID',
		name: 'documentId',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. yd8sqKy',
		description: 'ID of the document to retrieve',
		displayOptions: { show: showOnlyForDocumentGet },
	},
];
