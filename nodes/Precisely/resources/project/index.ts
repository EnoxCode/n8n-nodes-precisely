import type { INodeProperties } from 'n8n-workflow';
import {
	organizationIdField,
	projectIdField,
	signeeBodyFields,
} from '../../shared/descriptions';
import { buildProjectImportBody, returnDeleted } from '../../shared/transforms';
import { projectGetManyDescription } from './getAll';

const showOnlyForProjects = {
	resource: ['project'],
};

const singleProjectOperations = [
	'get',
	'update',
	'delete',
	'getApprovals',
	'getDocuments',
	'approveInitial',
	'approveFinal',
	'approveById',
	'deleteApproval',
	'importDocument',
	'createDocument',
	'sendSignatureRequest',
	'cancelSignatureRequest',
	'addSignee',
	'removeSignee',
];
const approvalIdOperations = ['approveById', 'deleteApproval'];

export const projectDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForProjects },
		options: [
			{
				name: 'Add Signee',
				value: 'addSignee',
				action: 'Add a signee to a project',
				description: 'Add a signee to a project',
				routing: {
					request: {
						method: 'POST',
						url: '=/organizations/{{$parameter.organizationId}}/projects/{{$parameter.projectId}}/signees',
					},
				},
			},
			{
				name: 'Approve (By ID)',
				value: 'approveById',
				action: 'Approve a specific project approval',
				description: 'Approve a specific pending approval on a project',
				routing: {
					request: {
						method: 'POST',
						url: '=/organizations/{{$parameter.organizationId}}/projects/{{$parameter.projectId}}/approvals/{{$parameter.approvalId}}',
					},
				},
			},
			{
				name: 'Approve (Final)',
				value: 'approveFinal',
				action: 'Approve a project finally',
				description: 'Give final approval on a project',
				routing: {
					request: {
						method: 'POST',
						url: '=/organizations/{{$parameter.organizationId}}/projects/{{$parameter.projectId}}/approvals/final',
					},
				},
			},
			{
				name: 'Approve (Initial)',
				value: 'approveInitial',
				action: 'Approve a project initially',
				description: 'Give initial approval on a project',
				routing: {
					request: {
						method: 'POST',
						url: '=/organizations/{{$parameter.organizationId}}/projects/{{$parameter.projectId}}/approvals/initial',
					},
				},
			},
			{
				name: 'Cancel Signature Request',
				value: 'cancelSignatureRequest',
				action: 'Cancel a project signature request',
				description: 'Withdraw a pending project signature request',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/organizations/{{$parameter.organizationId}}/projects/{{$parameter.projectId}}/signature-request',
					},
					output: { postReceive: [returnDeleted] },
				},
			},
			{
				name: 'Create Document',
				value: 'createDocument',
				action: 'Create a document in a project',
				description: 'Create a document from content in a project',
				routing: {
					request: {
						method: 'POST',
						url: '=/organizations/{{$parameter.organizationId}}/projects/{{$parameter.projectId}}/documents',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a project',
				description: 'Delete a project',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/organizations/{{$parameter.organizationId}}/projects/{{$parameter.projectId}}',
					},
					output: { postReceive: [returnDeleted] },
				},
			},
			{
				name: 'Delete Approval',
				value: 'deleteApproval',
				action: 'Delete a project approval',
				description: 'Remove a specific approval from a project',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/organizations/{{$parameter.organizationId}}/projects/{{$parameter.projectId}}/approvals/{{$parameter.approvalId}}',
					},
					output: { postReceive: [returnDeleted] },
				},
			},
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
			{
				name: 'Import Document',
				value: 'importDocument',
				action: 'Import a document into a project',
				description: 'Import a file as a document in a project',
				routing: {
					request: {
						method: 'POST',
						url: '=/organizations/{{$parameter.organizationId}}/projects/{{$parameter.projectId}}/documents/import',
					},
					send: { preSend: [buildProjectImportBody] },
				},
			},
			{
				name: 'Remove Signee',
				value: 'removeSignee',
				action: 'Remove a signee from a project',
				description: 'Remove a signee from a project by email',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/organizations/{{$parameter.organizationId}}/projects/{{$parameter.projectId}}/signees/{{encodeURIComponent($parameter.signeeEmail)}}',
					},
					output: { postReceive: [returnDeleted] },
				},
			},
			{
				name: 'Send Signature Request',
				value: 'sendSignatureRequest',
				action: 'Send a project signature request',
				description: 'Send the project documents to their signees for signing',
				routing: {
					request: {
						method: 'POST',
						url: '=/organizations/{{$parameter.organizationId}}/projects/{{$parameter.projectId}}/signature-request',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a project',
				description: 'Update the details of a project',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/organizations/{{$parameter.organizationId}}/projects/{{$parameter.projectId}}',
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
	// Approval ID
	{
		displayName: 'Approval ID',
		name: 'approvalId',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. 33',
		description: 'ID of the approval to operate on',
		displayOptions: {
			show: { ...showOnlyForProjects, operation: approvalIdOperations },
		},
	},
	// Remove Signee email
	{
		displayName: 'Signee Email',
		name: 'signeeEmail',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. maria@example.com',
		description: 'Email of the signee to remove',
		displayOptions: {
			show: { ...showOnlyForProjects, operation: ['removeSignee'] },
		},
	},
	// Approval user (initial/final)
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. gLdYiOg',
		description: 'ID of the user, manager or administrator giving the approval',
		displayOptions: {
			show: { ...showOnlyForProjects, operation: ['approveInitial', 'approveFinal'] },
		},
		routing: { send: { type: 'body', property: 'userId' } },
	},
	// Add Signee body (SigneeRequest)
	...signeeBodyFields({ ...showOnlyForProjects, operation: ['addSignee'] }),
	// Signature request message
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		default: '',
		description: 'Optional message included with the signature request',
		displayOptions: {
			show: { ...showOnlyForProjects, operation: ['sendSignatureRequest'] },
		},
		routing: { send: { type: 'body', property: 'message' } },
	},
	// Import document input
	{
		displayName: 'Input Data Field Name',
		name: 'inputField',
		type: 'string',
		default: 'data',
		required: true,
		placeholder: 'e.g. data',
		hint: 'The name of the input binary field containing the file to import',
		displayOptions: {
			show: { ...showOnlyForProjects, operation: ['importDocument'] },
		},
	},
	// Create Document (from content)
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		description: 'Title of the document to create',
		displayOptions: {
			show: { ...showOnlyForProjects, operation: ['createDocument'] },
		},
		routing: { send: { type: 'body', property: 'title' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { ...showOnlyForProjects, operation: ['createDocument'] },
		},
		options: [
			{
				displayName: 'Content (JSON)',
				name: 'content',
				type: 'json',
				default: '{}',
				description: 'The document content object',
				routing: {
					send: {
						type: 'body',
						property: 'content',
						value: '={{ typeof $value === "string" ? JSON.parse($value) : $value }}',
					},
				},
			},
			{
				displayName: 'Signees (JSON)',
				name: 'signees',
				type: 'json',
				default: '[]',
				description: 'A JSON array of signee objects to add to the document',
				routing: {
					send: {
						type: 'body',
						property: 'signees',
						value: '={{ typeof $value === "string" ? JSON.parse($value) : $value }}',
					},
				},
			},
		],
	},
	// Update fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { ...showOnlyForProjects, operation: ['update'] },
		},
		options: [
			{
				displayName: 'Folder ID',
				name: 'folderId',
				type: 'string',
				default: '',
				description: 'ID of the folder to move the project into',
				routing: { send: { type: 'body', property: 'folderId' } },
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'New project title',
				routing: { send: { type: 'body', property: 'title' } },
			},
		],
	},
	// Options for Import Document
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: { ...showOnlyForProjects, operation: ['importDocument'] },
		},
		options: [
			{
				displayName: 'Folder ID',
				name: 'folderId',
				type: 'string',
				default: '',
				description: 'ID of the folder to place the document in',
			},
		],
	},
	...projectGetManyDescription,
];
