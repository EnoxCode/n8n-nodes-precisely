import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDocumentCreate = {
	resource: ['document'],
	operation: ['create'],
};

const relationOptions = [
	{ name: 'Amended By', value: 'amended_by' },
	{ name: 'Amendment To', value: 'amendment_to' },
	{ name: 'Appendix To', value: 'appendix_to' },
	{ name: 'Appendixed By', value: 'appendixed_by' },
	{ name: 'Relates To', value: 'relates_to' },
	{ name: 'Renewal Of', value: 'renewal_of' },
	{ name: 'Renewed By', value: 'renewed_by' },
	{ name: 'Replaced By', value: 'replaced_by' },
	{ name: 'Replacement For', value: 'replacement_for' },
	{ name: 'Supplement To', value: 'supplement_to' },
	{ name: 'Supplemented By', value: 'supplemented_by' },
];

export const documentCreateDescription: INodeProperties[] = [
	{
		displayName: 'Input Data Field Name',
		name: 'inputField',
		type: 'string',
		default: 'data',
		required: true,
		placeholder: 'e.g. data',
		hint: 'The name of the input binary field containing the file to import',
		displayOptions: { show: showOnlyForDocumentCreate },
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showOnlyForDocumentCreate },
		options: [
			{
				displayName: 'Folder ID',
				name: 'folderId',
				type: 'string',
				default: '',
				description: 'ID of the folder to place the document in',
			},
			{
				displayName: 'Link to Document ID',
				name: 'linkDocumentId',
				type: 'string',
				default: '',
				description: 'ID of an existing document to link the imported document to',
			},
			{
				displayName: 'Link Relation',
				name: 'linkDocumentRelation',
				type: 'options',
				default: 'relates_to',
				description: 'Relation to the linked document. Required when Link to Document ID is set.',
				options: relationOptions,
			},
		],
	},
];
