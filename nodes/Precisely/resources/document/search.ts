import type { INodeProperties } from 'n8n-workflow';
import { paginatedLimitField, paginatedReturnAllField } from '../../shared/descriptions';

const showOnlyForDocumentSearch = {
	resource: ['document'],
	operation: ['search'],
};

export const documentSearchDescription: INodeProperties[] = [
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'fixedCollection',
		placeholder: 'Add Filter',
		default: {},
		typeOptions: { multipleValues: true },
		displayOptions: { show: showOnlyForDocumentSearch },
		description: 'Filter documents by a document property',
		options: [
			{
				name: 'filter',
				displayName: 'Filter',
				values: [
					{
						displayName: 'Property',
						name: 'property',
						type: 'options',
						default: 'status',
						options: [
							{ name: 'Status', value: 'status' },
							{ name: 'Title', value: 'title' },
						],
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'e.g. signed',
						description: 'The value to match against',
					},
				],
			},
		],
	},
	{
		displayName: 'Metadata Filters',
		name: 'metadataFilters',
		type: 'fixedCollection',
		placeholder: 'Add Metadata Filter',
		default: {},
		typeOptions: { multipleValues: true },
		displayOptions: { show: showOnlyForDocumentSearch },
		description: 'Filter documents by a metadata key value',
		options: [
			{
				name: 'metadataFilter',
				displayName: 'Metadata Filter',
				values: [
					{
						displayName: 'Metadata Key ID',
						name: 'key',
						type: 'string',
						default: '',
						placeholder: 'e.g. 2896461f-ccfb-45ff-b587-87c47fe8aa90',
						description: 'The metadata key ID to match against',
					},
					{
						displayName: 'Operator',
						name: 'operator',
						type: 'options',
						default: 'string_equals',
						description: 'Matching operator. Use the one matching the metadata type.',
						options: [
							{ name: 'Date Equals', value: 'date_equals' },
							{ name: 'Date Maximum', value: 'date_maximum' },
							{ name: 'Date Minimum', value: 'date_minimum' },
							{ name: 'Integer Equals', value: 'integer_equals' },
							{ name: 'Integer Maximum', value: 'integer_maximum' },
							{ name: 'Integer Minimum', value: 'integer_minimum' },
							{ name: 'Number Choice Equals', value: 'number_choice_equals' },
							{ name: 'Number Equals', value: 'number_equals' },
							{ name: 'Number Maximum', value: 'number_maximum' },
							{ name: 'Number Minimum', value: 'number_minimum' },
							{ name: 'String Equals', value: 'string_equals' },
						],
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'The value to match against',
					},
				],
			},
		],
	},
	{
		...paginatedReturnAllField,
		displayOptions: { show: showOnlyForDocumentSearch },
	},
	{
		...paginatedLimitField,
		displayOptions: {
			show: { ...showOnlyForDocumentSearch, returnAll: [false] },
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showOnlyForDocumentSearch },
		options: [
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
