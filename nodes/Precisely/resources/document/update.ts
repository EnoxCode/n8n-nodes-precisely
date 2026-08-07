import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDocumentUpdate = {
	resource: ['document'],
	operation: ['update'],
};

export const documentUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: showOnlyForDocumentUpdate },
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'New document description',
				routing: { send: { type: 'body', property: 'description' } },
			},
			{
				displayName: 'Folder ID',
				name: 'folderId',
				type: 'string',
				default: '',
				description: 'ID of the folder to move the document into',
				routing: { send: { type: 'body', property: 'folderId' } },
			},
			{
				displayName: 'Require Signing in Order',
				name: 'requireSigningInOrder',
				type: 'boolean',
				default: false,
				description: 'Whether signees must sign in order. Defaults to false.',
				routing: { send: { type: 'body', property: 'requireSigningInOrder' } },
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'New document title',
				routing: { send: { type: 'body', property: 'title' } },
			},
		],
	},
];
