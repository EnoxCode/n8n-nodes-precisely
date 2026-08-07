import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDocumentPdf = {
	resource: ['document'],
	operation: ['downloadPdf'],
};

export const documentPdfDescription: INodeProperties[] = [
	{
		displayName: 'Put Output File in Field',
		name: 'outputField',
		type: 'string',
		default: 'data',
		required: true,
		placeholder: 'e.g. data',
		hint: 'The name of the output binary field to put the PDF in',
		displayOptions: { show: showOnlyForDocumentPdf },
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showOnlyForDocumentPdf },
		options: [
			{
				displayName: 'Exclude Signatures',
				name: 'excludeSignatures',
				type: 'boolean',
				default: false,
				description: 'Whether to exclude signatures from the generated PDF. Defaults to false.',
				routing: { send: { type: 'query', property: 'excludeSignatures' } },
			},
		],
	},
];
