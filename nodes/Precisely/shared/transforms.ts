import type {
	IDataObject,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	IN8nHttpFullResponse,
	INodeExecutionData,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

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
