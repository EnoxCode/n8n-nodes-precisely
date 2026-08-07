import type { INodeProperties } from 'n8n-workflow';
import { paginatedLimitField, paginatedReturnAllField } from '../../shared/descriptions';

const showOnlyForProjectGetMany = {
	resource: ['project'],
	operation: ['getAll'],
};

export const projectGetManyDescription: INodeProperties[] = [
	{
		...paginatedReturnAllField,
		displayOptions: { show: showOnlyForProjectGetMany },
	},
	{
		...paginatedLimitField,
		displayOptions: {
			show: { ...showOnlyForProjectGetMany, returnAll: [false] },
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showOnlyForProjectGetMany },
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
