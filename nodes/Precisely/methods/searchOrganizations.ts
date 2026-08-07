import type { ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';

interface OrganizationsResponse {
	id: number;
	name: string;
}

/**
 * Backs the "From List" mode of the Organization resourceLocator (GET
 * /organizations). Registered on the node as methods.listSearch.searchOrganizations.
 */
export async function searchOrganizations(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const organizations = (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'preciselyApi',
		{
			method: 'GET',
			url: 'https://api.precisely.se/organizations',
			json: true,
		},
	)) as OrganizationsResponse[];

	const term = filter?.toLowerCase();
	const results = organizations
		.filter((organization) => !term || organization.name.toLowerCase().includes(term))
		.map((organization) => ({
			name: organization.name,
			value: String(organization.id),
		}))
		.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

	return { results };
}
