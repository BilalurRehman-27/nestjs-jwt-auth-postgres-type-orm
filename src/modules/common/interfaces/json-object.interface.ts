export type JsonValue = string | number | boolean;

export interface JsonObject {
	[k: string]: JsonValue | JsonValue[] | JsonObject;
}

export interface OrganizationNode {
	id: string;
	name: string;
	level?: string;
	children?: OrganizationNode[];
}
