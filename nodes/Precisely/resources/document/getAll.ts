import type { INodeProperties } from 'n8n-workflow';
import { paginatedLimitField, paginatedReturnAllField } from '../../shared/descriptions';

const showOnlyForDocumentGetMany = {
	resource: ['document'],
	operation: ['getAll'],
};

export const documentGetManyDescription: INodeProperties[] = [
	{
		...paginatedReturnAllField,
		displayOptions: { show: showOnlyForDocumentGetMany },
	},
	{
		...paginatedLimitField,
		displayOptions: {
			show: { ...showOnlyForDocumentGetMany, returnAll: [false] },
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showOnlyForDocumentGetMany },
		options: [
			{
				displayName: 'Include Content',
				name: 'includeContent',
				type: 'boolean',
				default: false,
				description: 'Whether to include the document content in the response. Defaults to false.',
				routing: { send: { type: 'query', property: 'includeContent' } },
			},
			{
				displayName: 'Only Signed Documents',
				name: 'onlySignedDocuments',
				type: 'boolean',
				default: false,
				description: 'Whether to return only signed documents. Defaults to false.',
				routing: { send: { type: 'query', property: 'onlySignedDocuments' } },
			},
			{
				displayName: 'Order',
				name: 'order',
				type: 'options',
				default: 'desc',
				description: 'Sort direction',
				options: [
					{ name: 'Ascending', value: 'asc' },
					{ name: 'Descending', value: 'desc' },
				],
				routing: { send: { type: 'query', property: 'order' } },
			},
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'options',
				default: 'updatedAt',
				description: 'Property to sort the result set by',
				options: [
					{ name: 'Created At', value: 'createdAt' },
					{ name: 'Updated At', value: 'updatedAt' },
				],
				routing: { send: { type: 'query', property: 'sortBy' } },
			},
		],
	},
];
