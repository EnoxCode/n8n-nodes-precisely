import type { INodeProperties } from 'n8n-workflow';
import {
	clientListPagination,
	organizationIdField,
	projectIdField,
	referenceIdField,
	templateIdField,
} from '../../shared/descriptions';

const showOnlyForTemplates = {
	resource: ['template'],
};

// Every template operation except the top-level list needs a Template ID.
const templateScopedOperations = [
	'get',
	'getReferences',
	'getReference',
	'getReferenceOptions',
	'createProject',
	'updateProject',
	'setReferenceOptions',
];
// Operations that drill into a single reference.
const referenceScopedOperations = ['getReference', 'getReferenceOptions', 'setReferenceOptions'];

const includeContentOption: INodeProperties = {
	displayName: 'Include Content',
	name: 'includeContent',
	type: 'boolean',
	default: false,
	description: 'Whether to include the template content in the response. Defaults to false.',
	routing: { send: { type: 'query', property: 'includeContent' } },
};

// Optional body fields shared by Create Project (draft) and Update Project.
// (References are a top-level fixedCollection field — see referencesField below.)
const projectBodyOptions: INodeProperties[] = [
	{
		displayName: 'Document Names',
		name: 'documentNames',
		type: 'string',
		typeOptions: { multipleValues: true, multipleValueButtonText: 'Add Document Name' },
		default: [],
		description: 'Names of the documents to create in the project',
		routing: { send: { type: 'body', property: 'documentNames' } },
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		description: 'Title of the project',
		routing: { send: { type: 'body', property: 'title' } },
	},
];

// Structured input for the template references (drafting answers): each entry is
// a { name, value } pair. Routed to the `references` body array.
const referencesField: INodeProperties = {
	displayName: 'References',
	name: 'references',
	type: 'fixedCollection',
	typeOptions: { multipleValues: true },
	placeholder: 'Add Reference',
	default: {},
	description: 'Answers to the template references (drafting questions)',
	displayOptions: {
		show: { resource: ['template'], operation: ['createProject', 'updateProject'] },
	},
	options: [
		{
			name: 'reference',
			displayName: 'Reference',
			values: [
				{
					displayName: 'Name',
					name: 'name',
					type: 'string',
					default: '',
					description: 'The name of the reference',
				},
				{
					displayName: 'Value',
					name: 'value',
					type: 'string',
					default: '',
					description: 'The value to insert',
				},
			],
		},
	],
	routing: { send: { type: 'body', property: 'references', value: '={{ $value.reference }}' } },
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
				name: 'Create Project',
				value: 'createProject',
				action: 'Create a project from a template',
				description: 'Draft a new project from a template',
				routing: {
					request: {
						method: 'POST',
						url: '=/organizations/{{$parameter.organizationId}}/templates/{{$parameter.templateId}}/projects',
					},
				},
			},
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
			{
				name: 'Set Reference Options',
				value: 'setReferenceOptions',
				action: 'Set template reference options',
				description: 'Replace the selectable options of a template reference',
				routing: {
					request: {
						method: 'PUT',
						url: '=/organizations/{{$parameter.organizationId}}/templates/{{$parameter.templateId}}/references/{{$parameter.referenceId}}/options',
					},
				},
			},
			{
				name: 'Update Project',
				value: 'updateProject',
				action: 'Update a project from a template',
				description: 'Update a project drafted from a template',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/organizations/{{$parameter.organizationId}}/templates/{{$parameter.templateId}}/projects/{{$parameter.projectId}}',
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
	{
		...projectIdField,
		displayOptions: {
			show: { ...showOnlyForTemplates, operation: ['updateProject'] },
		},
	},
	// Create Project (draft) fields
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { ...showOnlyForTemplates, operation: ['createProject'] },
		},
		options: [
			...projectBodyOptions,
			{
				displayName: 'Is Draft Incomplete',
				name: 'isDraftIncomplete',
				type: 'boolean',
				default: false,
				description: 'Whether the project should be considered an incomplete draft. Defaults to false.',
				routing: { send: { type: 'body', property: 'isDraftIncomplete' } },
			},
			{
				displayName: 'External Reference ID',
				name: 'externalReferenceId',
				type: 'string',
				default: '',
				description: 'An ID in the source system representing the entity',
				routing: { send: { type: 'body', property: 'externalReferenceId' } },
			},
			{
				displayName: 'External Reference Source',
				name: 'externalReferenceSource',
				type: 'string',
				default: '',
				description: 'An ID or name of the source system of the referenced entity',
				routing: { send: { type: 'body', property: 'externalReferenceSource' } },
			},
		],
	},
	// Update Project fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { ...showOnlyForTemplates, operation: ['updateProject'] },
		},
		options: [
			...projectBodyOptions,
			{
				displayName: 'Publish',
				name: 'publish',
				type: 'boolean',
				default: false,
				description: 'Whether new document versions should be published. Defaults to false.',
				routing: { send: { type: 'body', property: 'publish' } },
			},
		],
	},
	// References (structured) for Create/Update Project
	referencesField,
	// Set Reference Options fields
	{
		displayName: 'Options',
		name: 'referenceOptions',
		type: 'string',
		typeOptions: { multipleValues: true, multipleValueButtonText: 'Add Option' },
		default: [],
		required: true,
		placeholder: 'e.g. Yes',
		description: 'The choice values to set on the reference',
		displayOptions: {
			show: { ...showOnlyForTemplates, operation: ['setReferenceOptions'] },
		},
		routing: { send: { type: 'body', property: 'options' } },
	},
	{
		displayName: 'Default Value',
		name: 'defaultValue',
		type: 'string',
		default: '',
		description: 'The default/pre-selected choice',
		displayOptions: {
			show: { ...showOnlyForTemplates, operation: ['setReferenceOptions'] },
		},
		routing: { send: { type: 'body', property: 'defaultValue' } },
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
