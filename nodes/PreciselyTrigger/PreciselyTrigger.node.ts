import { createHmac, timingSafeEqual } from 'node:crypto';
import {
	NodeConnectionTypes,
	type IDataObject,
	type IHookFunctions,
	type INodeParameterResourceLocator,
	type INodeType,
	type INodeTypeDescription,
	type IWebhookFunctions,
	type IWebhookResponseData,
} from 'n8n-workflow';
import { organizationIdField } from '../Precisely/shared/descriptions';
import { searchOrganizations } from '../Precisely/methods/searchOrganizations';
import { preciselyApiRequest, statusOf } from './GenericFunctions';

/** Read the resourceLocator organization value regardless of list/id mode. */
function organizationIdFrom(ctx: IHookFunctions): string {
	const raw = ctx.getNodeParameter('organizationId') as INodeParameterResourceLocator | string;
	return (typeof raw === 'string' ? raw : ((raw?.value as string) ?? '')) as string;
}

function timingSafeStrEqual(a: string, b: string): boolean {
	const ab = Buffer.from(a, 'utf8');
	const bb = Buffer.from(b, 'utf8');
	if (ab.length !== bb.length) return false;
	return timingSafeEqual(ab, bb);
}

/**
 * Verify Precisely's `Precisely-Signature: t=<unix>,s=<base64>` header. The
 * signature is base64( HMAC-SHA256( endpointSecret, `${t}.${rawBody}\n` ) ).
 */
function isValidSignature(secret: string, header: string, rawBody: Buffer): boolean {
	const parts: Record<string, string> = {};
	for (const segment of header.split(',')) {
		const eq = segment.indexOf('=');
		if (eq === -1) continue;
		parts[segment.slice(0, eq).trim()] = segment.slice(eq + 1);
	}
	const t = parts.t;
	const provided = parts.s;
	if (!t || !provided) return false;

	const message = Buffer.concat([Buffer.from(`${t}.`, 'utf8'), rawBody, Buffer.from('\n', 'utf8')]);
	const digest = createHmac('sha256', secret).update(message).digest('base64');
	return timingSafeStrEqual(provided, digest);
}

export class PreciselyTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Precisely Trigger',
		name: 'preciselyTrigger',
		icon: {
			light: 'file:../../icons/precisely.svg',
			dark: 'file:../../icons/precisely.dark.svg',
		},
		iconColor: 'blue',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Starts the workflow when events happen in Precisely',
		defaults: {
			name: 'Precisely Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		// Triggers can't be attached as AI tools (no inputs), but the linter requires
		// this property and the types only accept `true`.
		usableAsTool: true,
		credentials: [
			{
				name: 'preciselyApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				...organizationIdField,
				description: 'The organization whose events to listen for',
			},
			{
				displayName: 'Trigger On',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				options: [
					{ name: 'Document Signed', value: 'events.document.signed' },
					{ name: 'Document Status Changed', value: 'events.document.status_changed' },
					{ name: 'User Has a Document to Review', value: 'events.user.document_to_review' },
					{ name: 'User Has a Document to Sign', value: 'events.user.document_to_sign' },
					{ name: 'User Has a Project to Approve', value: 'events.user.project_to_approve' },
				],
			},
			{
				displayName: 'Verify Signature',
				name: 'verifySignature',
				type: 'boolean',
				default: false,
				description:
					'Whether to verify each delivery\'s Precisely-Signature header against the endpoint secret and reject any that do not match. Defaults to false; enable it once you have confirmed deliveries verify against your endpoint.',
			},
		],
	};

	methods = {
		listSearch: {
			searchOrganizations,
		},
	};

	webhookMethods = {
		default: {
			// No single-subscription GET endpoint exists, so confirm existence by
			// listing the organization's subscriptions and matching our stored ID.
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node');
				if (!staticData.subscriptionId) return false;

				const organizationId = organizationIdFrom(this);
				try {
					const subscriptions = (await preciselyApiRequest.call(
						this,
						'GET',
						`/organizations/${organizationId}/subscriptions`,
					)) as unknown as Array<{ id: string }>;

					const exists = subscriptions.some((s) => s.id === staticData.subscriptionId);
					if (!exists) {
						delete staticData.subscriptionId;
						delete staticData.endpointSecret;
					}
					return exists;
				} catch (error) {
					// Transient error: assume the subscription still exists so create()
					// does NOT register a duplicate.
					this.logger.warn(
						`Precisely Trigger: could not confirm subscription ${staticData.subscriptionId as string}: ${(error as Error).message}`,
					);
					return true;
				}
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node');
				const organizationId = organizationIdFrom(this);
				const events = this.getNodeParameter('events') as string[];
				const webhookUrl = this.getNodeWebhookUrl('default');

				const response = await preciselyApiRequest.call(
					this,
					'POST',
					`/organizations/${organizationId}/subscriptions`,
					{
						name: 'n8n',
						callback: webhookUrl,
						events,
					},
				);

				staticData.subscriptionId = response.id;
				staticData.endpointSecret = response.endpointSecret;
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node');
				const organizationId = organizationIdFrom(this);
				const subscriptionId = staticData.subscriptionId as string | undefined;

				if (subscriptionId) {
					try {
						await preciselyApiRequest.call(
							this,
							'DELETE',
							`/organizations/${organizationId}/subscriptions/${subscriptionId}`,
						);
					} catch (error) {
						if (statusOf(error) !== 404) {
							this.logger.warn(
								`Precisely Trigger: could not delete subscription ${subscriptionId}: ${(error as Error).message}`,
							);
						}
					}
					delete staticData.subscriptionId;
					delete staticData.endpointSecret;
				}
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData();
		const verify = this.getNodeParameter('verifySignature', false) as boolean;

		if (verify) {
			const staticData = this.getWorkflowStaticData('node');
			const secret = staticData.endpointSecret as string | undefined;
			const headers = this.getHeaderData() as IDataObject;
			const signature = headers['precisely-signature'] as string | undefined;

			// Read the ORIGINAL bytes — re-serializing getBodyData() would not
			// byte-match Precisely's signed payload.
			const request = this.getRequestObject() as unknown as {
				rawBody?: Buffer;
				readRawBody?: () => Promise<void>;
			};
			if (!(request.rawBody instanceof Buffer) && typeof request.readRawBody === 'function') {
				await request.readRawBody();
			}
			const payload = request.rawBody instanceof Buffer ? request.rawBody : undefined;

			// Fail closed: reject unless we can positively verify the signature.
			if (!secret || !signature || !payload || !isValidSignature(secret, signature, payload)) {
				return { webhookResponse: { statusCode: 401 } };
			}
		}

		return {
			workflowData: [this.helpers.returnJsonArray(body as IDataObject)],
		};
	}
}
