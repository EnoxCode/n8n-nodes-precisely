import type { INodeProperties } from 'n8n-workflow';
import {
	clientLimitField,
	documentIdField,
	organizationIdField,
	returnAllField,
} from '../../shared/descriptions';

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
		...returnAllField,
		displayOptions: { show: showOnlyForReviewers },
	},
	{
		...clientLimitField,
		displayOptions: {
			show: { ...showOnlyForReviewers, returnAll: [false] },
		},
	},
];
