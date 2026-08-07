import type {
	IDataObject,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	IWebhookFunctions,
} from 'n8n-workflow';

const BASE_URL = 'https://api.precisely.se';

/** Authenticated request helper for the trigger's subscription lifecycle calls. */
export async function preciselyApiRequest(
	this: IHookFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	path: string,
	body?: IDataObject,
): Promise<IDataObject> {
	const options: IHttpRequestOptions = {
		method,
		url: `${BASE_URL}${path}`,
		json: true,
	};

	if (body && Object.keys(body).length > 0) {
		options.body = body;
	}

	return (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'preciselyApi',
		options,
	)) as IDataObject;
}

/** Best-effort HTTP status extraction from an httpRequest error. */
export function statusOf(error: unknown): number | undefined {
	const e = error as {
		httpCode?: string | number;
		statusCode?: number;
		response?: { statusCode?: number };
	};
	const raw = e?.httpCode ?? e?.statusCode ?? e?.response?.statusCode;
	const num = typeof raw === 'string' ? Number.parseInt(raw, 10) : raw;
	return typeof num === 'number' && Number.isFinite(num) ? num : undefined;
}
