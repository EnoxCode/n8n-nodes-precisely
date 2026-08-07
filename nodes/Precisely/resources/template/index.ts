import type { INodeProperties } from 'n8n-workflow';
import {
	clientListPagination,
	organizationIdField,
	referenceIdField,
	templateIdField,
} from '../../shared/descriptions';

const showOnlyForTemplates = {
	resource: ['template'],
};

// Every template operation except the top-level list needs a Template ID.
const templateScopedOperations = ['get', 'getReferences', 'getReference', 'getReferenceOptions'];
// Operations that drill into a single reference.
const referenceScopedOperations = ['getReference', 'getReferenceOptions'];

const includeContentOption: INodeProperties = {
	displayName: 'Include Content',
	name: 'includeContent',
	type: 'boolean',
	default: false,
	description: 'Whether to include the template content in the response. Defaults to false.',
	routing: { send: { type: 'query', property: 'includeContent' } },
};

export const templateDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForTemplates },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a template',
				description: 'Retrieve a single template by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/organizations/{{$parameter.organizationId}}/templates/{{$parameter.templateId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many templates',
				description: 'Retrieve templates for an organization',
				routing: {
					request: {
						method: 'GET',
						url: '=/organizations/{{$parameter.organizationId}}/templates',
					},
				},
			},
			{
				name: 'Get Many References',
				value: 'getReferences',
				action: 'Get many template references',
				description: 'Retrieve the references (drafting questions) of a template',
				routing: {
					request: {
						method: 'GET',
						url: '=/organizations/{{$parameter.organizationId}}/templates/{{$parameter.templateId}}/references',
					},
				},
			},
			{
				name: 'Get Reference',
				value: 'getReference',
				action: 'Get a template reference',
				description: 'Retrieve a single template reference by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/organizations/{{$parameter.organizationId}}/templates/{{$parameter.templateId}}/references/{{$parameter.referenceId}}',
					},
				},
			},
			{
				name: 'Get Reference Options',
				value: 'getReferenceOptions',
				action: 'Get template reference options',
				description: 'Retrieve the selectable options of a template reference',
				routing: {
					request: {
						method: 'GET',
						url: '=/organizations/{{$parameter.organizationId}}/templates/{{$parameter.templateId}}/references/{{$parameter.referenceId}}/options',
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		...organizationIdField,
		displayOptions: { show: showOnlyForTemplates },
	},
	{
		...templateIdField,
		displayOptions: {
			show: { ...showOnlyForTemplates, operation: templateScopedOperations },
		},
	},
	{
		...referenceIdField,
		displayOptions: {
			show: { ...showOnlyForTemplates, operation: referenceScopedOperations },
		},
	},
	// Return All / Limit for each list operation
	...clientListPagination({ resource: ['template'], operation: ['getAll'] }),
	...clientListPagination({ resource: ['template'], operation: ['getReferences'] }),
	...clientListPagination({ resource: ['template'], operation: ['getReferenceOptions'] }),
	// Options: Get Many templates
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { ...showOnlyForTemplates, operation: ['getAll'] } },
		options: [
			includeContentOption,
			{
				displayName: 'Include Deactivated',
				name: 'includeDeactivated',
				type: 'boolean',
				default: false,
				description: 'Whether to include deactivated templates. Defaults to false.',
				routing: { send: { type: 'query', property: 'includeDeactivated' } },
			},
		],
	},
	// Options: Get single template
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { ...showOnlyForTemplates, operation: ['get'] } },
		options: [includeContentOption],
	},
];
