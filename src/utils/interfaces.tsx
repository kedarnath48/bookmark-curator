import React, { Dispatch, SetStateAction } from "react";

export interface BookmarksSchema {
  guid: string;
  id: number;
  index: number;
  title: string;
  url: string;
  favourite: boolean;
  tags: string[];
  filters: string[];
  duplicate: boolean;
  broken: boolean;
  coverImage: string;
  note: string;
  description: string;
  addDate: Date | number;
  lastModified: Date | number;
  iconBase64: string;
}
export interface BookmarksDataContextValue {
  bookmarksData: BookmarksSchema[];
  setBookmarksData: Dispatch<SetStateAction<BookmarksSchema[]>>;
}
export const bookmarksctxt = React.createContext<BookmarksDataContextValue | undefined>(undefined);

export interface Folder {
	guid: string;
	id: number;
	index: number;
	title: string;
	tags: string[];
	filters: string[];
	addDate: Date | number;
	lastModified: Date | number;
	links: string[];
	children: Folder[];
	path: string;
}
export interface UnsortedDataContextValue {
  unsortedData: Folder[];
  setUnsortedData: Dispatch<SetStateAction<Folder[]>>;
}
export const unsortedctxt = React.createContext<UnsortedDataContextValue | undefined>(undefined);

export interface DuplicateSchema {
	guid: string;
	id: number;
	title: string;
	url: string;
	originalBookmarkGuid: string | null;
	links: string[];
}
export interface DuplicatesDataContextValue {
  duplicatesData: DuplicateSchema[];
  setDuplicatesData: Dispatch<SetStateAction<DuplicateSchema[]>>;
}
export const duplicatesctxt = React.createContext<DuplicatesDataContextValue | undefined>(undefined);

export interface TrashSchema {
  guid: string;
  id: number;
  title: string;
  url: string;
  deletedDate: number;
}
export interface TrashDataContextValue {
  trashData: TrashSchema[];
  setTrashData: Dispatch<SetStateAction<TrashSchema[]>>;
}
export const trashctxt = React.createContext<TrashDataContextValue | undefined>(undefined);




export interface ImportedJson {
  type: 'folder' | 'link';
  addDate: Date;
  lastModified?: Date;
  title: string;
  icon?: string;
  url?: string;
  children?: ImportedJson[];
}



//interface Collection {
//  id: number;
//  index: number;
//  label: string;
//  isopened: boolean;
//  type: string;
//  folders: Folder[];
//}
export interface CollectionSchema{
  guid: string;
  id: number;
  index: number;
  tags: string[];
  filters: string[];
  addDate: number;
  lastModified: number;
  title: string;
  icon: string;
  label: string;
  bookmarks: string[];
  folders?: CollectionSchema[];
  isopened: boolean;
}
export interface CollectionDataContextValue {
  folderData: CollectionSchema[];
  setFolderData: Dispatch<SetStateAction<CollectionSchema[]>>;
}
export const collectionctxt = React.createContext<CollectionDataContextValue | undefined>(undefined);

export interface FilterSchema {

}
export interface FiltersDataContextValue {
  filtersData: FilterSchema[];
  setFiltersData: Dispatch<SetStateAction<FilterSchema[]>>;
}
export const filtersctxt = React.createContext<FiltersDataContextValue | undefined>(undefined);

export interface TagSchema {
  label: string;
  children: TagSchema[];
  open: boolean;
}
export interface TagsDataContextValue {
  tagsData: TagSchema[];
  setTagsData: Dispatch<SetStateAction<TagSchema[]>>;
}
export const tagsctxt = React.createContext<TagsDataContextValue | undefined>(undefined);