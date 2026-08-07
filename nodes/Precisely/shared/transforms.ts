import type {
	IDataObject,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	IN8nHttpFullResponse,
	INodeExecutionData,
	PostReceiveAction,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * Declarative postReceive that replaces a Delete/Cancel response body with
 * `{ deleted: true }` (per n8n's UX convention, so the following node triggers).
 */
export const returnDeleted: PostReceiveAction = {
	type: 'set',
	properties: { value: '={{ { "deleted": true } }}' },
};

/**
 * preSend for Document: Create (Import). Reads the PDF/DOCX from the named input
 * binary field, base64-encodes it into the `file` body property, and adds the
 * optional folder / link fields.
 */
export const buildDocumentImportBody = async function (
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const inputField = this.getNodeParameter('inputField', 'data') as string;
	const options = this.getNodeParameter('options', {}) as IDataObject;

	const buffer = await this.helpers.getBinaryDataBuffer(inputField);
	const body: IDataObject = { file: buffer.toString('base64') };

	if (options.folderId) body.folderId = options.folderId;
	if (options.linkDocumentId) body.linkDocumentId = options.linkDocumentId;
	if (options.linkDocumentRelation) body.linkDocumentRelation = options.linkDocumentRelation;

	requestOptions.body = body;
	return requestOptions;
};

/**
 * preSend for Project: Import Document. Same as document import but scoped to a
 * project (no document-link fields on this endpoint).
 */
export const buildProjectImportBody = async function (
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const inputField = this.getNodeParameter('inputField', 'data') as string;
	const options = this.getNodeParameter('options', {}) as IDataObject;

	const buffer = await this.helpers.getBinaryDataBuffer(inputField);
	const body: IDataObject = { file: buffer.toString('base64') };

	if (options.folderId) body.folderId = options.folderId;

	requestOptions.body = body;
	return requestOptions;
};

interface DocumentFilterEntry {
	property: string;
	value: string;
}

interface MetadataFilterEntry {
	key: string;
	operator: string;
	value: string;
}

/**
 * preSend for Document: Search. Builds the SearchDocumentRequest body from the
 * `filters` and `metadataFilters` fixedCollections. The API requires at least
 * one filter to be present.
 */
export const buildSearchBody = async function (
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const filters = this.getNodeParameter('filters', {}) as {
		filter?: DocumentFilterEntry[];
	};
	const metadataFilters = this.getNodeParameter('metadataFilters', {}) as {
		metadataFilter?: MetadataFilterEntry[];
	};

	const body: IDataObject = {};

	if (filters.filter?.length) {
		body.filters = filters.filter.map((entry) => ({ k: entry.property, v: entry.value }));
	}

	if (metadataFilters.metadataFilter?.length) {
		body.metadataFilters = metadataFilters.metadataFilter.map((entry) => ({
			k: entry.key,
			op: entry.operator,
			v: entry.value,
		}));
	}

	if (!body.filters && !body.metadataFilters) {
		throw new NodeOperationError(
			this.getNode(),
			'Add at least one entry to Filters or Metadata Filters before searching',
		);
	}

	requestOptions.body = body;
	return requestOptions;
};

/**
 * postReceive for Document: Download PDF. Converts the raw PDF response (fetched
 * with encoding: 'arraybuffer') into an n8n binary item.
 */
export const handleDocumentPdf = async function (
	this: IExecuteSingleFunctions,
	items: INodeExecutionData[],
	response: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
	const documentId = this.getNodeParameter('documentId') as string;
	const outputField = this.getNodeParameter('outputField', 'data') as string;
	const fileName = `document-${documentId}.pdf`;

	const data =
		response.body instanceof Buffer ? response.body : Buffer.from(response.body as ArrayBuffer);

	const result: INodeExecutionData[] = [];
	for (let i = 0; i < items.length; i++) {
		const newItem: INodeExecutionData = {
			json: {},
			binary: {},
			pairedItem: { item: i },
		};

		if (items[i].binary !== undefined && newItem.binary !== undefined) {
			Object.assign(newItem.binary, items[i].binary);
		}

		newItem.binary![outputField] = await this.helpers.prepareBinaryData(
			data,
			fileName,
			'application/pdf',
		);

		result.push(newItem);
	}

	return result;
};
