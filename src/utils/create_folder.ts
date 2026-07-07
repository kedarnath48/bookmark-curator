import { writeContent, generateGUID } from "../utils/utilsfunc";
import { FolderSchema } from "../utils/schemas";

// Placeholder for missing variables and functions
const isExpanded = false;
let folder: FolderSchema;
function toggleExpand() {
	// Implementation here
}

export function createFolder(
	folderData: FolderSchema[], // Replace 'any' with the correct type
	setFolderData: (data: FolderSchema[]) => void // Replace 'any' with the correct type
) {
	console.log("Creating folder");
	if (!isExpanded) {
		toggleExpand();
	}
	const newFolder: FolderSchema = {
		guid: generateGUID(12),
		id: folderData.length + 1,
		index: folderData.length,
		label: "New Folder",
		tags: [],
		filters: [],
		createdOn: Date.now(),
		lastModified: Date.now(),
		links: [],
		bookmarks: [],
		children: [],
		icon: "",
		isopened: false,
		path: "New Folder"
	};

	// Function to recursively add the new folder to the correct nesting level
	const addFolderToHierarchy = (
		currentFolder: FolderSchema,
		targetGuid: string
	) => {
		if (currentFolder.guid === targetGuid) {
			currentFolder.children.push(newFolder);
			return true;
		} else {
			for (const childFolder of currentFolder.children) {
				if (addFolderToHierarchy(childFolder, targetGuid)) {
					return true;
				}
			}
			return false;
		}
	};

	const updatedCollectionData = folderData.map((rootFolder: FolderSchema) => {
		if (addFolderToHierarchy(rootFolder, folder.guid)) {
			return rootFolder;
		} else {
			return rootFolder;
		}
	});

	setFolderData(updatedCollectionData);
	writeContent("collection.json", updatedCollectionData);
}



export function getAllFoldersRecursive(
	folders: FolderSchema[],
	allFolders: FolderSchema[] = []
): FolderSchema[] {
	folders.forEach((folder) => {
		allFolders.push(folder);

		if (folder.children && folder.children.length > 0) {
			getAllFoldersRecursive(folder.children, allFolders);
		}
	});

	return allFolders;
}

