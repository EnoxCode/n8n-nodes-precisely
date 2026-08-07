import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { organizationDescription } from './resources/organization';
import { documentDescription } from './resources/document';
import { projectDescription } from './resources/project';
import { reminderDescription } from './resources/reminder';
import { reviewerDescription } from './resources/reviewer';
import { templateDescription } from './resources/template';
import { getOrganizations } from './methods/getOrganizations';

export class Precisely implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Precisely',
		name: 'precisely',
		icon: {
			light: 'file:../../icons/precisely.svg',
			dark: 'file:../../icons/precisely.dark.svg',
		},
		iconColor: 'blue',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage contracts, documents and signatures with the Precisely API',
		defaults: {
			name: 'Precisely',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'preciselyApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.precisely.se',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Document',
						value: 'document',
					},
					{
						name: 'Organization',
						value: 'organization',
					},
					{
						name: 'Project',
						value: 'project',
					},
					{
						name: 'Reminder',
						value: 'reminder',
					},
					{
						name: 'Reviewer',
						value: 'reviewer',
					},
					{
						name: 'Template',
						value: 'template',
					},
				],
				default: 'document',
			},
			...organizationDescription,
			...documentDescription,
			...projectDescription,
			...reminderDescription,
			...reviewerDescription,
			...templateDescription,
		],
	};

	methods = {
		loadOptions: {
			getOrganizations,
		},
	};
}
