import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PreciselyApi implements ICredentialType {
	name = 'preciselyApi';

	displayName = 'Precisely API';

	icon: Icon = { light: 'file:../icons/precisely.svg', dark: 'file:../icons/precisely.dark.svg' };

	documentationUrl = 'https://help.precisely.se/en/articles/5733009-api-tokens-in-precisely';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Precisely API token, sent in the X-API-KEY header. Create one in the Precisely app under API tokens.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-KEY': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.precisely.se',
			url: '/organizations',
			method: 'GET',
		},
	};
}
