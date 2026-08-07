import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';

interface OrganizationsResponse {
	id: number;
	name: string;
}

/**
 * Populates the "Organization Name or ID" dropdown from GET /organizations.
 * Registered on the node as methods.loadOptions.getOrganizations.
 */
export async function getOrganizations(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const organizations = (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'preciselyApi',
		{
			method: 'GET',
			url: 'https://api.precisely.se/organizations',
			json: true,
		},
	)) as OrganizationsResponse[];

	return organizations
		.map((organization) => ({
			name: organization.name,
			value: organization.id,
		}))
		.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
}
