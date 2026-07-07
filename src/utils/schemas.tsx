export interface FileSchema {
	name: string;
	size: number;
	type: string;
	source: string;
	data: UnsortedSchema[];
}
export interface UrlSchema {
	href?: string;
	origin?: string;
	protocol?: string;
	username?: string;
	password?: string;
	host?: string;
	hostname?: string;
	port?: string;
	pathname?: string;
	search?: string;
	searchParams?: URLSearchParams;
	hash?: string;
}
export interface UrlDomainsScheme {
	domain?: string;
	domainWithoutSuffix?: string;
	hostname?: string;
	isIcann?: boolean;
	isIp?: boolean;
	isPrivate?: boolean;
	publicSuffix?: string;
	subdomain?: string;
}
export interface UnsortedSchema {
	guid: string;
	id: number;
	index: number;
	title: string;
	filters: string[];
	tags: string[];
	addDate: Date;
	lastModified: Date;
	links: string[];
	children: FolderSchema[];
}

export interface BookmarksSchema extends UrlSchema, UrlDomainsScheme {
	guid: string;
	id: number;
	index: number;
	title: string;
	favourite?: boolean;
	tags?: string[];
	filters?: string[];
	duplicate?: boolean;
	broken?: boolean;
	coverImage?: string;
	note?: string;
	description?: string;
	addDate: Date | number;
	lastModified: Date | number;
	iconBase64?: string;
	path: string
	[key: string]:
		| string
		| string[]
		| boolean
		| number
		| Date
		| URLSearchParams
		| null
		| undefined;
}

export interface DuplicateSchema {
	id: number;
	bookmarkIds: number[];
}

export interface TrashSchema {}

export interface GroupSchema {}

export interface FolderSchema {
	guid: string;
	id: number;
	index: number;

	//title: string;
	label: string;

	path: string;

	tags: string[];
	filters: string[];

	createdOn: number;
	lastModified: number;

	links: string[];
	bookmarks: string[];

	children: FolderSchema[];

	icon: string;
	isopened: boolean;
} // CollectionSchema
export interface FolderTreeSchema {}

export interface FilterSchema extends DomainFilterSchema {}

// Filter Host Schema
export interface DomainFilterSchema {
	maindomain: string;
	hosts: HostSchema[];
	icons: IconSchema[];
	defaulticon: number | null;
}

export interface HostSchema {
	hostname: string;
	activeicon: number | null;
	icons: number[]
}
export interface IconSchema {
	icon: string;
	iconid: number;
}
// Filter Host Schema
export interface DomainSchema {
	hosts?: string[];
	maindomain: string;
	icon: string | undefined;
	subdomains?: SubDomainSchema[];
	tlds: TLDSchema[];
}
export interface SubDomainSchema {
	domain: string;
	icon?: string | undefined;
}

export interface TLDSchema {
	domain: string;
	icon?: string | undefined;
}

export interface TagSchema {
	tagName: string;
	tagDescription?: string;
	bookmarkCount?: number;
	//children: TagSchema[];
}





export interface URIFragment {
	anchor?: string;
}

export interface URIQuery {
	query?: string;
	queryKey?: Record<string, string>;
}

export interface URIPath {
	file?: string;
	directory?: string;
	path?: string;
	relative?: string;
}

export interface URIComponents {
	port?: string;
	host?: string;
	password?: string;
	user?: string;
	userInfo?: string;
	authority?: string;
	protocol?: string;
}

export interface URISource {
	source?: string;
}

export interface URIInfoSchema
	extends URIFragment,
		URIQuery,
		URIPath,
		URIComponents,
		URISource {}
