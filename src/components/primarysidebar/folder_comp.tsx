import React, { Children, useState } from "react";
import { FolderSchema } from "../../utils/schemas";
import { writeContent, generateGUID } from "../../utils/utilsfunc";
import { getAllFoldersRecursive } from "../../utils/create_folder";
import {
	AngleDownIcon,
	AngleUpIcon,
	AddFolderIcon,
	TrashBinIcon,
} from "../../assets/svg_icons";
//import { resolve } from "@tauri-apps/api/path";

interface FolderTreeProps {
	activeObjFunc: (guid: string, label: string, type: string) => void;
	activeObj: {
		guid: string;
		label: string;
		type: string;
	};
	folderData: FolderSchema[];
	setFolderData: React.Dispatch<React.SetStateAction<FolderSchema[]>>;
	folderTreeBool: boolean;
}

const FolderTree: React.FC<FolderTreeProps> = ({
	activeObjFunc,
	activeObj,
	folderData,
	folderTreeBool,
	setFolderData,
}) => {
	const folderList = getAllFoldersRecursive(folderData);
	return (
		<div>
			{/* Render existing children */}
			{folderTreeBool
				? (folderData.map((folder) => (
					<FolderComponent
						key={folder.guid}
						folder={folder}
						activeObj={activeObj}
						activeObjFunc={activeObjFunc}
						setFolderData={setFolderData}
						folderData={folderData}
					/>
				)))
				: (folderList.map((folder, index) => (
					<div key={folder.guid + index}>
						<button>{folder.label}</button>
					</div>
				)))}
			{/* Button to create a new folder
			<button onClick={createFolder}>Create Folder</button>
      */}
		</div>
	);
};
interface FolderComponentProps {
	folder: FolderSchema;
	activeObj: {
		guid: string;
		label: string;
		type: string;
	};
	activeObjFunc: (guid: string, label: string, type: string) => void;
	folderData: FolderSchema[];
	setFolderData: React.Dispatch<React.SetStateAction<FolderSchema[]>>;
}

const FolderComponent: React.FC<FolderComponentProps> = ({
	folder,
	activeObj,
	activeObjFunc,
	folderData,
	setFolderData,
}) => {
	const [label, setLabel] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [isExpanded, setIsExpanded] = useState(folder.isopened);

	const handleDoubleClick = () => {
		setIsEditing(true);
	};

	const handleBlur = () => {
		setIsEditing(false);
		if (label !== folder.label && label !== "") {
			const updatedFolder = { ...folder, label: label };

			// Recursively update nested folders
			const updatedCollectionData = folderData.map((rootFolder) => {
				return updateNestedFolders(rootFolder, updatedFolder);
			});

			// Update state with the updated collection data
			setFolderData(updatedCollectionData);

			// Write the updated collection data to file
			writeContent("collection.json", updatedCollectionData);
			activeObjFunc(folder.guid, label, "folder");
		}
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLabel(event.target.value);
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Enter") {
			handleBlur();
		}
	};

	const toggleExpand = () => {
		const updatedIsExpanded = !isExpanded;
		setIsExpanded(updatedIsExpanded);
		const updatedFolder = { ...folder, isopened: updatedIsExpanded };

		// Recursively update nested folders
		const updatedCollectionData = folderData.map((rootFolder) => {
			return updateNestedFolders(rootFolder, updatedFolder);
		});

		// Update state with the updated collection data
		setFolderData(updatedCollectionData);

		// Write the updated collection data to file
		writeContent("collection.json", updatedCollectionData);
	};

	// Recursive function to update nested folders
	const updateNestedFolders = (
		currentFolder: FolderSchema,
		updatedFolder: FolderSchema
	): FolderSchema => {
		if (currentFolder.guid === updatedFolder.guid) {
			return updatedFolder;
		}

		const updatedChildren = currentFolder.children.map((childFolder) => {
			return updateNestedFolders(childFolder, updatedFolder);
		});

		return { ...currentFolder, children: updatedChildren };
	};

	const createFolder = () => {
		const allFolders = getAllFoldersRecursive(folderData);
		if (!isExpanded) {
			toggleExpand();
		}
		const newFolder: FolderSchema = {
			guid: generateGUID(12),
			id: allFolders.length,
			index: folder.children.length,
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
			path: "",
		};

		const addFolderToHierarchy = (
			currentFolder: FolderSchema,
			targetGuid: string
		): boolean => {
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

		const updatedCollectionData = folderData.map((rootFolder) => {
			if (addFolderToHierarchy(rootFolder, folder.guid)) {
				return rootFolder;
			} else {
				return rootFolder;
			}
		});

		setFolderData(updatedCollectionData);
		writeContent("collection.json", updatedCollectionData);

		const idArray = [];
		const newAllFolders = getAllFoldersRecursive(folderData);
		for (const f of newAllFolders) {
			idArray.push(f.id);
		}
		console.log("All folder IDs: ", idArray);
	};

	const handleClick = () => {
		if (folder.guid !== activeObj.guid) {
			activeObjFunc(folder.guid, folder.label, "folder");
			console.log("Folder clicked: ", folder.label);
		}
	};

	const handleCreateFolderClick = () => {
		createFolder();
	};



	const handleDeleteFolder = async (folder: FolderSchema) => {
		const newFolderData = recurssiveDelete(folderData, folder.id)
		const prevData = folderData
		setFolderData(newFolderData)
		//note write file pending
		try {
			await writeContent("11.json", newFolderData);
			console.log("nodelay")
		} catch (err) {
			console.error(err)
			setTimeout(() => {
				console.log("delay")
				setFolderData(prevData)
				alert('error')
			}, 2000);
		}
	}

	function recurssiveDelete(folders: FolderSchema[], targetId: number): FolderSchema[] {
		let result: FolderSchema[] = []
		for (const folder of folders) {
			if (folder.id === targetId) continue
			if (folder.children && folder.children.length > 0) {
				result.push({ ...folder, children: recurssiveDelete(folder.children, targetId) })
			}
			else {
				result.push(folder)
			}
		}
		return result
	}


	return (
		<div
			className={`folder ${isExpanded ? "expanded" : "collapsed"}`}
			key={folder.guid}
		>
			<div className="header">
				{isEditing ? (
					<input
						type="text"
						value={label}
						onChange={handleChange}
						onBlur={handleBlur}
						onKeyDown={handleKeyDown}
						autoFocus
					/>
				) : (
					<>
						{folder.children.length > 0 && (
							<button className="expand-arrow" onClick={toggleExpand}>
								{isExpanded ? <AngleDownIcon /> : <AngleUpIcon />}
							</button>
						)}
						<button
							className="coll-btn"
							onClick={handleClick}
							onDoubleClick={handleDoubleClick}
						>
							{folder.label} {/*folder.id*/}
						</button>
						<div className="more-options">
							<span>{folder.bookmarks.length}</span>
							<button
								className="create-folder-btn"
								onClick={handleCreateFolderClick}
							>
								<AddFolderIcon />
							</button>
							<button title="delete folder" onClick={() => handleDeleteFolder(folder)}>
								<TrashBinIcon />
							</button>
						</div>
					</>
				)}
			</div>
			{isExpanded && (
				<div className="children-ctr">
					{folder.children &&
						folder.children.map((subFolder) => (
							<FolderComponent
								key={subFolder.guid}
								activeObj={activeObj}
								folder={subFolder}
								activeObjFunc={activeObjFunc}
								setFolderData={setFolderData}
								folderData={folderData}
							/>
						))}
				</div>
			)}
		</div>
	);
};

export default FolderTree;
