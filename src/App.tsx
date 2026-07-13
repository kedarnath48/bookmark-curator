import { useState, useEffect, useRef } from "react";
import { register, unregisterAll } from '@tauri-apps/plugin-global-shortcut';
import MainHeader from "./components/mainheader";
import BookmarksContainer from "./components/bookmarks.tsx";
import {
	DuplicateSchema, TrashSchema, Folder, TagSchema
} from "./utils/interfaces.tsx";
import FolderTree from "./components/primarysidebar/folder_comp.tsx";
import FiltersTree from "./components/secondarysidebar/tree.filters.tsx";
import TagsTree from "./components/secondarysidebar/tree.tags.tsx";
import { customWriteToFile } from "./utils/helper_fuctions.ts";
import { MoveModel } from "./modals/movemodel.tsx";
import { allFiles, writeContent, generateGUID, checkAppDataDirExists } from "./utils/utilsfunc";
import { BookmarksSchema, FilterSchema, FolderSchema } from "./utils/schemas.tsx";
import { getAllFoldersRecursive } from "./utils/create_folder.ts";
import "./App.css";
import {
	SettingsCog,
	FolderTreeSvg,
	ExpandIcon,
	CollapseIcon,
} from "./assets/svg_icons.tsx";

import { useToggle } from "./hooks/hooks.tsx";

import AddModel from "./ui/components/addModel.tsx";

import PaletteModel from "./ui/components/paletteModel.tsx"

//import TestComp from './components/test.tsx';
//import LandingComponent from './pages/landing.tsx';

//import { appDataDir } from "@tauri-apps/api/path";
//import { getBase64Data } from "./utils/helper_fuctions.ts";

/*
type t1 = {
	bookmarkIndex: number;
	bookmarkFolder: string;
	bookmark: BookmarksSchema;
	bookmarkid: number
}
*/


function App() {
	const [toggles, toggle] = useToggle({
		PSActive: true,
		folderTree: true,
		showSettings: false,
		isSettingsVisible: false,
		SSActive: false,
		expandAll: false,
		moveBool: false,
		showDialog: false
	});

	const [bookmarksData, setBookmarksData] = useState<BookmarksSchema[]>([]);
	const [unsortedData, setUnsortedData] = useState<Folder[]>([]);
	const [duplicatesData, setDuplicatesData] = useState<DuplicateSchema[]>([]);
	const [trashData, setTrashData] = useState<TrashSchema[]>([]);

	const [folderData, setFolderData] = useState<FolderSchema[]>([]);
	const [filtersData, setFiltersData] = useState<FilterSchema[]>([]);
	const [tagsData, setTagsData] = useState<TagSchema[]>([]);

	const [activeCollObj, setActiveCollObj] = useState({
		guid: "0",
		label: "all bookmarks",
		type: "category",
	});
	useEffect(() => {
		console.log("[App]", activeCollObj)
	})
	const [activeSettingsTab, setActiveSettingsTab] = useState("Filters");

	const [activeFilter, setActiveFilter] = useState<string | null>(null);
	const [activeAlphabet, setActiveAlphabet] = useState<string | null>(null);

	useEffect(() => {
		toggle("PSActive");
	}, [toggle]);
	useEffect(() => {
		fetchData();
	}, []);

	const [activeDialog, setActiveDialog] = useState("")
	useEffect(() => {
		if (toggles.showDialog) {
			document.querySelector("dialog")?.showModal()
		}
		else {
			document.querySelector("dialog")?.close()
		}
	}, [toggles.showDialog]);


	const fetchData = async () => {
		try {
			const dataFromAppDir = await checkAppDataDirExists({
				setBookmarksData,
				setUnsortedData,
				setDuplicatesData,
				setTrashData,
				setFolderData,
				setFiltersData,
				setTagsData,
			});

			// You can optionally use the returned data here if needed
			console.log("Data from app directory:", dataFromAppDir);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const updateActiveCollObj = (guid: string, label: string, type: string) => {
		if (activeCollObj.guid !== guid) {
			setActiveCollObj({ guid, label, type });
		}
	};

	const changeSettingsTab = (tab: string) => {
		setActiveSettingsTab(tab);
	};

	// Function to add a new collection
	const createFolder = () => {
		const allFolders = getAllFoldersRecursive(folderData);
		const newCollection: FolderSchema = {
			id: allFolders.length,
			//title: "New Folder",
			label: "New Folder",
			children: [],
			guid: generateGUID(12),
			index: 0,
			tags: [],
			filters: [],
			createdOn: Date.now(),
			lastModified: Date.now(),
			isopened: false,
			icon: "",
			links: [],
			bookmarks: [],
			path: "/New Folder",
		};

		try {
			setFolderData((prevCollectionData: FolderSchema[]) => {
				const updatedCollectionData = [...prevCollectionData, newCollection];
				writeContent("collection.json", updatedCollectionData);
				return updatedCollectionData;
			});
		} catch (error) {
			console.error(error);
		}
	};

	const getDataLength = (data: string) => {
		switch (data) {
			case "all bookmarks":
				return bookmarksData.length;
			case "unsorted":
				return unsortedData.length;
			case "duplicates":
				return duplicatesData.length;
			case "trash":
				return trashData.length;
			case "collection":
				return folderData.length;
			case "filters":
				return filtersData.length;
			case "tags":
				return tagsData.length;
			default:
				return 0;
		}
	};

	const resetFiles = (selectedFileNames: string[]) => {
		selectedFileNames.map((file: string) => {
			customWriteToFile(allFiles[file], [], "replace");
			switch (file) {
				case "bookmarks":
					setBookmarksData([]);
					break;
				case "unsorted":
					setUnsortedData([]);
					break;
				case "duplicates":
					setDuplicatesData([]);
					break;
				case "trash":
					setTrashData([]);
					break;
				case "collection":
					setFolderData([]);
					break;
				case "filters":
					setFiltersData([]);
					break;
				case "tags":
					setTagsData([]);
					break;
			}
		});
	};
	const handleFilesSelection = (selectedFileNames: string[]) => {
		// Do something with the selected file names
		resetFiles(selectedFileNames);
		console.log("Selected Files:", selectedFileNames);
	};


	const [selectedBookmarks, setSelectedBookmarks] = useState<
		{
			bookmarkIndex: number;
			bookmarkFolder: string;
			bookmark: BookmarksSchema;
			bookmarkid: number
		}[]
	>([]);

	const handleBookmarkClick = (
		bookmark: BookmarksSchema | null,
		action: boolean
	) => {
		if (action && bookmark !== null) {
			// Check if the bookmark is already selected
			const isSelected = selectedBookmarks.some(
				(selected) => selected.bookmark === bookmark
			);

			if (isSelected) {
				// If already selected, remove it from the selection
				const updatedSelection = selectedBookmarks.filter(
					(selected) => selected.bookmark !== bookmark
				);
				setSelectedBookmarks(updatedSelection);
			} else {
				// If not selected, add it to the selection
				setSelectedBookmarks([
					...selectedBookmarks,
					{
						bookmarkIndex: bookmark.index,
						bookmarkFolder: "bookmark.folder",
						bookmark: bookmark,
						bookmarkid: bookmark.id
					},
				]);
			}
		} else {
			setSelectedBookmarks([]);
		}
	};


	function moveBookmark(folderId: number) {
		const timestamp = Date.now();
		console.log("Move To == ", folderId, timestamp, selectedBookmarks);

		let bookmarks: string[] = []
		Object.values(selectedBookmarks).forEach(value => {
			bookmarks.push(`${value.bookmark.guid}`)
		})

		//const newdata = structuredClone(folderData)
		//recurAdd(newdata)
		const newdata = recurAdd(folderData)

		function recurAdd(data: FolderSchema[]): FolderSchema[] {
			let changed = false

			return data.map((folder) => {
				if (changed) {
					return folder
				}
				if (folder.id === folderId) {
					changed = true
					return {
						...folder,
						bookmarks: [...new Set([...folder.bookmarks, ...bookmarks])]
					}
				}
				if (folder.children && folder.children.length > 0) {
					return {
						...folder,
						children: recurAdd(folder.children)
					}
				}
				return folder
			})
		}
		/* function recurAdd(data: FolderSchema[]): boolean {
			for (const folder of data) {
				if (folder.id === folderId) {
					folder.bookmarks = [...new Set([...folder.bookmarks, ...bookmarks])];
					return true;
				}
				
				// 2. Check children safely
				if (folder.children && folder.children.length > 0) {
					const foundInChildren = recurAdd(folder.children);
					if (foundInChildren) {
						return true;
					}
				}
			}
			return false;
		} */

		console.log("newdata", newdata, 'oldData', folderData)
		setFolderData(newdata)
		writeContent('collection.json', newdata)

		setSelectedBookmarks([]);
	}


	const handleToggleTree = () => {
		toggle("folderTree")
		console.log(toggles.folderTree);
	}
	const handleExpandAll = () => {
		toggle("expandAll");
		getAllFoldersRecursive(folderData).map(
			(folder) => {
				console.log(folder.label, folder.isopened);
				folder.isopened == toggles.expandAll;
				console.log(folder.label, folder.isopened);
			}
		);
	}

	useEffect(() => {
		console.log(selectedBookmarks);
	}, [selectedBookmarks]);

	const togglesRef = useRef(toggles);
	const lastTriggeredRef = useRef<number>(0);

	useEffect(() => {
		togglesRef.current = toggles;
	}, [toggles]);

	useEffect(() => {
		let isMounted = true;

		const setupShortcuts = async () => {
			try {
				await unregisterAll();
				if (!isMounted) return;

				const canTrigger = () => {
					const now = Date.now();
					if (now - lastTriggeredRef.current < 300) {
						return false;
					}
					lastTriggeredRef.current = now;
					return true;
				};

				await register('CommandOrControl+b', () => {
					if (!canTrigger()) return;
					toggle("PSActive");
					console.log('Shortcut triggered b', togglesRef.current.PSActive);
				});

				await register('CommandOrControl+Alt+B', () => {
					if (!canTrigger()) return;
					toggle("SSActive");
					console.log('Shortcut triggered Alt+B', togglesRef.current.SSActive);
				});

				await register('CommandOrControl+K', () => {
					if (!canTrigger()) return;
					setActiveDialog("palette")
					toggle("showDialog")
					console.log('Shortcut triggered K');
				});
			} catch (error) {
				console.error("Failed to register Tauri shortcuts:", error);
			}
		};

		setupShortcuts();

		return () => {
			isMounted = false;
			unregisterAll().catch((err) => console.error("Failed to cleanup shortcuts:", err));
		};
	}, []);
	return (
		<>
			<div
				id="primary-sidebar"
				className={`${toggles.PSActive ? " active" : ""}`}
			>
				{toggles.showSettings ? (
					<>
						<div
							className='"colls-header nested-tree wrapper'
							style={{ display: "flex", justifyContent: "space-between" }}
						>
							<h4 style={{ padding: "10px" }}>Settings</h4>
							<button
								onClick={() => toggle("showSettings")}
								style={{ margin: "10px" }}
							>
								<SettingsCog />
							</button>
						</div>
						<div className="settings-list">
							<ol id="settingsList">
								<li className={activeSettingsTab === "General" ? "active" : ""}>
									<button onClick={() => changeSettingsTab("General")}>
										<h4>General</h4>
									</button>
								</li>
								<li
									className={activeSettingsTab === "Bookmarks" ? "active" : ""}
								>
									<button onClick={() => changeSettingsTab("Bookmarks")}>
										<h4>Bookmarks</h4>
									</button>
								</li>
								<li
									className={activeSettingsTab === "Unsorted" ? "active" : ""}
								>
									<button onClick={() => changeSettingsTab("Unsorted")}>
										<h4>Unsorted</h4>
									</button>
								</li>
								<li
									className={activeSettingsTab === "Duplicates" ? "active" : ""}
								>
									<button onClick={() => changeSettingsTab("Duplicates")}>
										<h4>Duplicates</h4>
									</button>
								</li>
								<li className={activeSettingsTab === "Trash" ? "active" : ""}>
									<button onClick={() => changeSettingsTab("Trash")}>
										<h4>Trash</h4>
									</button>
								</li>
								<li className={activeSettingsTab === "Groups" ? "active" : ""}>
									<button onClick={() => changeSettingsTab("Groups")}>
										<h4>Groups</h4>
									</button>
								</li>
								<li
									className={
										activeSettingsTab === "Collections" ? "active" : ""
									}
								>
									<button onClick={() => changeSettingsTab("Collections")}>
										<h4>Collections</h4>
									</button>
								</li>
								<li className={activeSettingsTab === "Filters" ? "active" : ""}>
									<button onClick={() => changeSettingsTab("Filters")}>
										<h4>Filters</h4>
									</button>
								</li>
								<li className={activeSettingsTab === "Tags" ? "active" : ""}>
									<button onClick={() => changeSettingsTab("Tags")}>
										<h4>Tags</h4>
									</button>
								</li>
							</ol>
						</div>
					</>
				) : (
					<>
						{folderData.length > 0 ? (
							<div className="nested-tree wrapper">
								<div className="colls-header">
									<h3>Folders {folderData.length}</h3>
									{/*<button className='create-group'><i className="fa-regular fa-object-group"></i></button>*/}
									<button
										className="expand-collapse-all"
										onClick={() => handleToggleTree()}
									>
										<FolderTreeSvg />
									</button>
									<button
										className="expand-collapse-all"
										onClick={() => handleExpandAll()}
									>
										{toggles.expandAll ? <CollapseIcon /> : <ExpandIcon />}
									</button>
									<button className="create-folder" onClick={createFolder}>
										<i className="fa-solid fa-folder-plus"></i>
									</button>
									<button onClick={() => toggle("showSettings")}>
										<SettingsCog />
									</button>
								</div>
								<FolderTree
									activeObj={activeCollObj}
									activeObjFunc={updateActiveCollObj}
									folderData={folderData}
									setFolderData={setFolderData}
									folderTreeBool={toggles.folderTree}
								/>
							</div>
						) : (
							<div className="no-coll wrapper">
								<p>
									Create a collection <br /> to get started.
								</p>
								<button className="create-folder" onClick={createFolder}>
									<i className="fa-solid fa-folder-plus"></i>
								</button>
							</div>
						)}
					</>
				)}
			</div>
			{toggles.showSettings ? (
				<div className="settings-main">
					<div className="">
						<h1>{activeSettingsTab} Settings</h1>
					</div>
					<div className="section-info">
						{activeSettingsTab === "General" && (
							<div className="general-ctr">
								<h2>Advanced</h2>
								<FileSelector
									files={allFiles}
									onChange={handleFilesSelection}
								/>
							</div>
						)}
						{activeSettingsTab === "Filters" && (
							<>
								<div className="filters-ctr">
									{filtersData.map((filter, index) => {
										return (
											<div
												key={index}
												className="filters-card"
												style={{ display: "flex" }}
											>
												{filter.hosts.length > 1 && (
													<h4
														style={{
															marginRight: "12px",
															verticalAlign: "middle",
														}}
													>
														{filter.hosts.length}
													</h4>
												)}
												{filter.icons[0] && (
													<img
														src={filter.icons[0].icon}
														alt=""
														style={{ width: "32px", margin: "0 10px 0 0" }}
													/>
												)}
												<h3>{filter.maindomain}</h3>
												<div className=""></div>
											</div>
										);
									})}
								</div>
							</>
						)}
					</div>
				</div>
			) : (
				<>
					<div id="major-ctr">
						<MainHeader
							toggleBool={toggle}
							activeCatObj={activeCollObj}
							hACatObjChangeProp={updateActiveCollObj}
							isSettingsVisible
							bookmarksData={bookmarksData}
							setBookmarksData={setBookmarksData}
							setUnsortedData={setUnsortedData}
							setDuplicatesData={setDuplicatesData}
							filtersData={filtersData}
							setFiltersData={setFiltersData}
							getDataLength={getDataLength}
						/>
						<main>
							{/*<LandingComponent />*/}
							<BookmarksContainer
								activeAlphabet={activeAlphabet}
								activeFilter={activeFilter}
								activeCatObj={activeCollObj}
								bookmarksData={bookmarksData}
								unsortedData={unsortedData}
								duplicatesData={duplicatesData}
								folderData={folderData}
								setBookmarksData={setBookmarksData}
								setUnsortedData={setUnsortedData}
								setDuplicatesData={setDuplicatesData}
								filtersData={filtersData}
								setFiltersData={setFiltersData}
								toggleMove={toggle}
								selectedBookmarks={selectedBookmarks}
								handleBookmarkClick={handleBookmarkClick}
							/>
						</main>
						<footer style={{ display: "none" }}>
							{/*<MainFooter />*/}
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo ipsa
							maxime repudiandae necessitatibus blanditiis fugit possimus quod
							aliquam facere debitis eligendi incidunt, vel accusantium vero
							laboriosam amet exercitationem ex quibusdam!
						</footer>
					</div>
					<div
						id="secondary-sidebar"
						className={`wrapper${toggles.SSActive ? " active" : ""}`}
					>
						<div className="filters">
							<div className="filters-header">
								<button>
									<i className="fa-solid fa-filter"></i>
								</button>
								<h4>Filters</h4>
								<div className="">
									<button>
										<i className="fa-solid fa-bolt"></i>
									</button>
									<button>
										<i className="fa-solid fa-folder-tree"></i>
									</button>
								</div>
							</div>
							<FiltersTree
								activeAlphabet={activeAlphabet}
								setActiveAlphabet={setActiveAlphabet}
								activeFilter={activeFilter}
								setActiveFilter={setActiveFilter}
								filtersData={filtersData}
							/>
						</div>
						<div id="tags-ctr" className="tags">
							<div className="tags-header">
								<button>
									<i className="fa-solid fa-tags"></i>
								</button>
								<h4>Tags</h4>
								<div className="">
									<button>
										<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABdklEQVR4nO2Wy0oDUQyGP9dutSrUQkV9m6KCVaogLhUvDH0Fn0LEy0a8oKKgvou3vRfUjRvrZSQQ4TC2nvFMWlz0h8Awyck/ySQngTb+IQpABJwBN8CLyiVwDiwC/daEW0ANiD0iNmsWHzAOPDtOt4EKMAB0qgzqux3n4+RMKZS0D/hQR4cauQ9F4EDPfAJzIcQdwAowE3A2UuJ3YDSEPAuqGvkj0N1q8hMl3/AZllWsUNCCe/0talHcq1im5rvYokYG+04/yrMVKk5n/MBEncvAKuVD6u8qqegC7uoQPwA9GQjdDMYJ2fMZHGcgloBuGwSUSxpfq1LSY4GRtL/wSJWT2CFV0VabUNWp2jTnNHzekLycpks2NWpJe0uRA558t02zMKYjTUbbcsD5WR2pMlr/jHkljvW+lSHvQ1F7P9YlopdAlJy013S9mQKGE6vPNLALvDkzWNamTMgDqymXPemGdeOOQJwt6Hp7kVhvT4Ela8I2sMAXUBKRy27a3h0AAAAASUVORK5CYII="></img>
									</button>
									<button>
										<i className="fa-solid fa-bolt"></i>
									</button>
									<button>
										<i className="fa-solid fa-folder-tree"></i>
									</button>
								</div>
							</div>
							{<TagsTree tags={tagsData} />}
						</div>
					</div>
				</>
			)}

			{toggles.moveBool && (
				<MoveModel
					onClose={() => toggle("moveBool")}
					folderData={folderData}
					toggleMove={toggle}
					moveBookmark={moveBookmark}
				/>
			)}

			{toggles.showDialog && (
				<dialog id="my-dialog">
					{
						activeDialog === "add" && <AddModel toggles={toggle} />
					}
					{
						activeDialog === "palette" &&  <PaletteModel />
					}
				</dialog>
			)}
		</>
	);
}

export default App;

interface Props {
	files: { [key: string]: string };
	onChange: (selectedFileNames: string[]) => void;
}

const FileSelector: React.FC<Props> = ({ files, onChange }) => {
	const [selectedFiles, setSelectedFiles] = useState<{
		[key: string]: boolean;
	}>({});

	const toggleSelectAll = () => {
		const allSelected: { [key: string]: boolean } = {};
		for (const fileName in files) {
			if (Object.prototype.hasOwnProperty.call(files, fileName)) {
				allSelected[fileName] = !selectedFiles[fileName];
			}
		}
		setSelectedFiles(allSelected);
	};

	const handleCheckboxChange = (fileName: string) => {
		setSelectedFiles((prevState) => ({
			...prevState,
			[fileName]: !prevState[fileName],
		}));
	};

	const handleButtonClick = () => {
		const selectedFileNames = Object.keys(selectedFiles).filter(
			(fileName) => selectedFiles[fileName]
		);
		onChange(selectedFileNames);
	};
	const isAnyChecked = Object.values(selectedFiles).some((value) => value);

	return (
		<div className="">
			<div className="" style={{ display: "flex", alignItems: "center" }}>
				<button onClick={toggleSelectAll}>All</button>
				<h2>Manage DB</h2>
			</div>
			<div className="core-check">
				{Object.entries(files).map(([key]) => (
					<div key={key} className="">
						<input
							type="checkbox"
							id={key}
							checked={selectedFiles[key] || false}
							onChange={() => handleCheckboxChange(key)}
						/>
						<label htmlFor={key} className="txt">
							{key}
						</label>
					</div>
				))}
			</div>
			<button onClick={handleButtonClick} disabled={!isAnyChecked}>
				Delete Files Data
			</button>
		</div>
	);
};

/*



	const getAllIcons = (data: BookmarksSchema[]) => {
		const iconsSet = new Set(data.map((bookmark) => bookmark.iconBase64));
		return Array.from(iconsSet);
	};
	<div className="">
		{getAllIcons(bookmarksData).map((icon, index) => {
			if (icon) {
				return <img key={index} src={icon} alt="favicon" />;
			}
		})}
	</div>;



<div className="hosts-ctr">
	{filter.hosts?.map((host, index) => {
		return <h5 key={index}>{host}</h5>;
	})}
</div>
<div className="icons">
	{filter.icon && (
		<img
			src={`data:${
				getBase64Data(filter.icon)?.mimeType
			};base64,${
				getBase64Data(filter.icon)?.base64Data
			}`}
			alt="favicon"
		/>
	)}
	{filter.subdomains?.map((subdomain, index) => {
		return (
			<div key={index}>
				<h4>{subdomain.domain}</h4>
				{subdomain.icon && (
					<img src={subdomain.icon} alt="favicon" />
				)}
			</div>
		);
	})}
</div>
*/
