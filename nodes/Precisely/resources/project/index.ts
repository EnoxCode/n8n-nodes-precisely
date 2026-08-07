import type { INodeProperties } from 'n8n-workflow';
import { organizationIdField, projectIdField } from '../../shared/descriptions';
import { projectGetManyDescription } from './getAll';

const showOnlyForProjects = {
	resource: ['project'],
};

const singleProjectOperations = ['get', 'getApprovals', 'getDocuments'];

export const projectDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForProjects },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a project',
				description: 'Retrieve a single project by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/organizations/{{$parameter.organizationId}}/projects/{{$parameter.projectId}}',
					},
				},
			},
			{
				name: 'Get Approvals',
				value: 'getApprovals',
				action: 'Get project approvals',
				description: 'Retrieve the approval state of a project',
				routing: {
					request: {
						method: 'GET',
						url: '=/organizations/{{$parameter.organizationId}}/projects/{{$parameter.projectId}}/approvals',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many projects',
				description: 'Retrieve projects for an organization',
				routing: {
					request: {
						method: 'GET',
						url: '=/organizations/{{$parameter.organizationId}}/projects',
					},
				},
			},
			{
				name: 'Get Many Documents',
				value: 'getDocuments',
				action: 'Get many project documents',
				description: 'Retrieve the documents belonging to a project',
				routing: {
					request: {
						method: 'GET',
						url: '=/organizations/{{$parameter.organizationId}}/projects/{{$parameter.projectId}}/documents',
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		...organizationIdField,
		displayOptions: { show: showOnlyForProjects },
	},
	{
		...projectIdField,
		displayOptions: {
			show: { ...showOnlyForProjects, operation: singleProjectOperations },
		},
	},
	...projectGetManyDescription,
];
