import React, {
	useState,
	useEffect,
	useRef,
	Suspense,
	useCallback,
	useMemo,
} from "react";
import ImportFunc from "./importfunc";
import { BookmarksSchema, FilterSchema, FolderSchema } from "../utils/schemas";
import {
	Folder,
	DuplicateSchema,
} from "./../utils/interfaces"
//import removeDuplicates from "./categories/scan_for_duplicates";
import { findDuplicates } from "../utils/helper_fuctions";


import { getBase64Data } from "./../utils/helper_fuctions";
import { SelectAllSvg, SelectionSvg } from "./../assets/svg_icons";

interface BookmarksContainerProps {
	activeCatObj: {
		guid: string;
		label: string;
		type: string;
	};

	activeFilter: string | null;
	activeAlphabet: string | null;

	bookmarksData: BookmarksSchema[];
	unsortedData: Folder[];
	duplicatesData: DuplicateSchema[];
	folderData: FolderSchema[];

	setBookmarksData: React.Dispatch<React.SetStateAction<BookmarksSchema[]>>;
	setUnsortedData: React.Dispatch<React.SetStateAction<Folder[]>>;
	setDuplicatesData: React.Dispatch<React.SetStateAction<DuplicateSchema[]>>;
	filtersData: FilterSchema[];
	setFiltersData: React.Dispatch<React.SetStateAction<FilterSchema[]>>;
	toggleMove: (key: string) => void;
	handleBookmarkClick: (bookmark: BookmarksSchema | null, action: boolean) => void;
	selectedBookmarks: {
		bookmarkIndex: number;
		bookmarkFolder: string;
		bookmark: BookmarksSchema;
		//folderIndex: number;
	}[];
}

const BookmarksContainer: React.FC<BookmarksContainerProps> = (props) => {

	const {
		activeCatObj,
		bookmarksData,
		unsortedData,
		duplicatesData,
		folderData,
		setBookmarksData,
		setUnsortedData,
		setDuplicatesData,
		filtersData,
		setFiltersData,
		toggleMove,
		activeFilter,
		activeAlphabet,
		selectedBookmarks,
		handleBookmarkClick,
	} = props;

	const [loadedBookmarksCount, setLoadedBookmarksCount] = useState(500);
	//const [showCover, setshowCover] = useState(false);
	//const [showTitle, setshowTitle] = useState(false);
	//const [showNote, setshowNote] = useState(false);
	//const [showDescription, setshowDescription] = useState(false);
	const [showTagsBool, setShowTagsBool] = useState(false);
	const [showMoreBool, setShowMoreBool] = useState(false);
	const [showUrlBool, setShowUrlBool] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		console.log(activeAlphabet, activeFilter);
	}, [activeAlphabet, activeFilter]);
	useEffect(() => {
		const handleScroll = () => {
			const container = containerRef.current;
			if (container) {
				const scrollHeight = container.scrollHeight;
				const scrollTop = container.scrollTop;
				const clientHeight = container.clientHeight;
				const scrollPercentage =
					(scrollTop / (scrollHeight - clientHeight)) * 100;
				if (scrollPercentage >= 80) {
					setLoadedBookmarksCount((prevCount) => prevCount + 100);
				}
			}
		};


		const debouncedHandleScroll = debounce(handleScroll, 100);

		const container = containerRef.current;
		if (container) {
			container.addEventListener("scroll", debouncedHandleScroll);
		}

		return () => {
			if (container) {
				container.removeEventListener("scroll", debouncedHandleScroll);
			}
		};
	}, []);

	function debounce<F extends (...args: never[]) => unknown>(
		func: F,
		delay: number
	): (...args: Parameters<F>) => void {
		let timeoutId: ReturnType<typeof setTimeout> | null = null;
		return (...args: Parameters<F>): void => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			timeoutId = setTimeout(() => func(...args), delay);
		};
	}

	const getAllLinks = useCallback((bookmarks: Folder[]): string[] => {
		const allLinks: string[] = [];

		function extractLinks(bookmark: Folder) {
			allLinks.push(...bookmark.links);
			bookmark.children.forEach((child) => extractLinks(child));
		}

		bookmarks.forEach((bookmark) => extractLinks(bookmark));

		return allLinks;
	}, []);



	//const uniqueBookmarks = removeDuplicates(bookmarksData);

	const filteredBookmarks = useMemo(() => {
		let filtered: BookmarksSchema[] = [];
		let folderName: string | null = null;
		console.log("activeCatObj", activeCatObj)
		if (activeCatObj.type === "category") {
			switch (activeCatObj.label) {
				case "all bookmarks":
					filtered = bookmarksData.slice(0, loadedBookmarksCount);
					filtered = filtered.slice().reverse();
					break;
				case "unsorted":
					folderName = "Unsorted";
					filtered = bookmarksData.filter((bookmark) =>
						getAllLinks(unsortedData).includes(bookmark.guid)
					);
					break;
				case "duplicates":
					//folderName = "Duplicates";
					//filtered = bookmarksData.filter((bookmark) =>
					//	getAllLinks(duplicatesData).includes(bookmark.guid)
					//);
					console.log("duplicates: ", findDuplicates(bookmarksData));
					break;
				case "trash":
					console.log("trash");
					break;
				default:
					break;
			}
		} else if (activeCatObj.type === "folder") {
			const folderBookmarkIds = getFolder(activeCatObj.guid);
			filtered = bookmarksData.filter((bookmark) =>
				folderBookmarkIds.includes(bookmark.guid)
			);
		} else if (activeCatObj.type === "collection") {
			// Handle collection filtering
		} else if (activeCatObj.type === "filter") {
			// Handle filter filtering
		} else if (activeCatObj.type === "tag") {
			// Handle tag filtering
		}
		if (activeAlphabet) {
			filtered = bookmarksData.filter((bookmark) =>
				bookmark.domainWithoutSuffix?.startsWith(activeAlphabet)
			);
		}
		if (activeFilter) {
			filtered = bookmarksData.filter((bookmark) =>
				bookmark.domainWithoutSuffix?.includes(activeFilter)
			);
		}
		return { filtered, folderName };
	}, [
		activeAlphabet,
		activeFilter,
		activeCatObj,
		bookmarksData,
		loadedBookmarksCount,
		unsortedData,
		getAllLinks,
		//duplicatesData,
	]);
	function getFolder(guid: string): string[] {
		const folder = getFolderRecurssive(guid, folderData)
		return folder ? folder.bookmarks : []
	}
	function getFolderRecurssive(guid: string, data: FolderSchema[]): FolderSchema | null {
		for (const folder of data) {
			if (folder.guid === guid) return folder
			if (folder.children && folder.children.length > 0) {
				const childResult = getFolderRecurssive(guid, folder.children)
				if (childResult !== null) {
					return childResult
				}

			}
		}
		return null
	}
	return (
		<div
			ref={containerRef}
			className={`bookmarks-ctr ${filteredBookmarks.filtered.length === 0 ? "no-bookmarks" : ""
				}`}
			style={{ overflowY: "auto", height: "calc(100vh - 90px)" }}
		>
			{filteredBookmarks.filtered.length === 0 &&
				activeCatObj.label !== "unsorted" &&
				activeCatObj.label !== "duplicates" && activeCatObj.type !== 'folder' ? (
				<>
					<h2 className="title">
						<span title={activeCatObj.guid} style={{ cursor: "pointer" }}># </span>
						{activeCatObj.label}
					</h2>
					<div className="empty-bookmarks">
						<h2>No bookmarks</h2>
						<p>Add link or drop file</p>
						<button>Install browser extension</button>
						<ImportFunc
							importTxt="import bookmarks"
							bookmarksData={bookmarksData}
							setBookmarksData={setBookmarksData}
							setUnsortedData={setUnsortedData}
							setDuplicatesData={setDuplicatesData}
							filtersData={filtersData}
							setFiltersData={setFiltersData}
						/>
					</div>
				</>
			) : (
				<div className="bookmarks-activeCatObj.label">
					<div className="collection-header">
						<div className="section-info" style={{ flex: "1" }}>
							<button className="hor-bar">
								{selectedBookmarks.length > 0 ? (
									<SelectAllSvg />
								) : (
									<SelectionSvg />
								)}
							</button>
							<h2 className="title">
								{selectedBookmarks.length > 0 && (
									<>
										{selectedBookmarks.length}
										{" in "}
									</>
								)}
								{activeCatObj.label}{" "}
								<span className="txt">
									{filteredBookmarks.filtered.length} / {bookmarksData.length}
								</span>
							</h2>
						</div>
						{selectedBookmarks.length > 0 && (
							<div className="">
								<button id="moveDialogBtn" onClick={() => toggleMove("moveBool")}>Move</button>
								<button>Add tags</button>
								<button>Remove</button>
								<button>Export</button>
							</div>
						)}
						<div className="" style={{ display: "flex", flex: "1" }}>
							{selectedBookmarks.length > 0 ? (
								<>
									<button
										onClick={() => handleBookmarkClick(null, false)}
										style={{ marginLeft: "auto" }}
									>
										Cancel
									</button>
								</>
							) : (
								<>
									<div className="" style={{ marginLeft: "auto" }}>
										<div className="sort-dropdown" style={{ display: "none" }}>
											<select>
												<option value="newest">Newest</option>
												<option value="oldest">Oldest</option>
												<option value="title">Title</option>
												<option value="url">URL</option>
											</select>
											<button>Sort</button>
										</div>
										<div className="group-dropdown" style={{ display: "none" }}>
											<select>
												<option value="none">None</option>
												<option value="folder">Folder</option>
												<option value="date">Date</option>
												<option value="tag">Tag</option>
											</select>
											<button>Group</button>
										</div>
										<div className="view-dropdown" style={{ display: "none" }}>
											<select>
												<option value="list">List</option>
												<option value="card">Card</option>
												<option value="headlines">Headlines</option>
												<option value="moodboard">Moodboard</option>
											</select>
											<button>Apply to all</button>
											<div className="" style={{ display: "flex" }}>
												<button>Cover</button>
												<button>Title</button>
												<button onClick={() => setShowUrlBool(!showUrlBool)}>
													URL
												</button>
												<button>Description</button>
												<button>Note</button>
												<button onClick={() => setShowTagsBool(!showTagsBool)}>
													Tags
												</button>

												<button onClick={() => setShowMoreBool(!showMoreBool)}>
													More
												</button>
												<input type="range" min="1" max="100"></input>
											</div>
										</div>
										<button>Export</button>
									</div>
								</>
							)}
						</div>
					</div>
					{activeCatObj.label === "all bookmarks" && (
						<div className={activeCatObj.label}>
							{filteredBookmarks.filtered && (
								<LoadBookmarks
									filteredBookmarks={filteredBookmarks.filtered}
									showTagsBool={showTagsBool}
									showMoreBool={showMoreBool}
									showUrlBool={showUrlBool}
									selectedBookmarks={selectedBookmarks}
									handleBookmarkClick={handleBookmarkClick}
								/>
							)}
						</div>
					)}
					{activeCatObj.label === "unsorted" && (
						<div className={activeCatObj.label}>
							<div className="folders">
								{unsortedData.map((folder) => (
									<div>
										{folder.children.map((child) => (
											<button className="bookmarks-folder" key={child.guid}>
												{child.title}
											</button>
										))}
									</div>
								))}
							</div>
							<div className="bookmarks">
								<LoadBookmarks
									filteredBookmarks={filteredBookmarks.filtered}
									showTagsBool={showTagsBool}
									showMoreBool={showMoreBool}
									showUrlBool={showUrlBool}
									selectedBookmarks={selectedBookmarks}
									handleBookmarkClick={handleBookmarkClick}
								/>
							</div>
							{/*activeCatObj.label === "all bookmark" && (
								<FolderList
									data={unsortedData}
									bookmarksData={bookmarksData}
									handleBookmarkClick={handleBookmarkClick}
								/>
							)*/}
						</div>
					)}
					{activeCatObj.label === "duplicates" && (
						<div className={activeCatObj.label}>
							{duplicatesData.map((duplicate) => (
								<div>
									{duplicate.links.map((link) => (
										<div key={link}>{link}</div>
									))}
								</div>
							))}
							{filteredBookmarks.folderName && (
								<h3>{filteredBookmarks.folderName}</h3>
							)}
						</div>
					)}
					{activeCatObj.label === "trash" && (
						<div className={activeCatObj.label}>
							<Suspense fallback={<div>Loading...</div>}>
								{filteredBookmarks.folderName && (
									<h3>{filteredBookmarks.folderName}</h3>
								)}
							</Suspense>
						</div>
					)}
					{activeCatObj.type === "collection" && (
						<div className={activeCatObj.label}>
							<h1>asdasd</h1>
						</div>
					)}
					{activeCatObj.type === "folder" && (
						<div className={activeCatObj.label}>
							{filteredBookmarks.filtered ? (
								<LoadBookmarks
									filteredBookmarks={filteredBookmarks.filtered}
									showTagsBool={showTagsBool}
									showMoreBool={showMoreBool}
									showUrlBool={showUrlBool}
									selectedBookmarks={selectedBookmarks}
									handleBookmarkClick={handleBookmarkClick}
								/>
							) : (
								"no bookmarks"

							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
};



interface FolderListProps {
	data: Folder[];
	bookmarksData: BookmarksSchema[];
	handleBookmarkClick: (
		bookmark: BookmarksSchema | null,
		action: boolean
	) => void;
}

export const FolderList: React.FC<FolderListProps> = ({
	data,
	bookmarksData,
	handleBookmarkClick,
}) => {
	const allFoldersArray: Folder[] = [];

	const allFolders = (folders: Folder[]) => {
		folders.forEach((folder: Folder) => {
			allFoldersArray.push(folder);
			if (folder.children) {
				allFolders(folder.children);
			}
		});
	};

	allFolders(data);
	console.log(allFoldersArray);

	const getFilteredBookmarks = () => {
		const filtered = bookmarksData.filter((bookmark) =>
			allFoldersArray
				.map((folder) => folder.links)
				.flat()
				.includes(bookmark.guid)
		);
		return filtered;
	};

	return (
		<>
			{allFoldersArray.map((folder, index) => (
				<div
					key={folder.guid}
					className={`folder-div ${index === 0 ? "root" : ""}`}
				>
					<LoadBookmarks
						filteredBookmarks={getFilteredBookmarks()}
						showMoreBool={false}
						showTagsBool={false}
						showUrlBool={true}
						selectedBookmarks={[]}
						handleBookmarkClick={handleBookmarkClick}
					/>
				</div>
			))}
		</>
	);
};

// ActionBar

//LoadFolders

interface LoadBookmarksProps {
	filteredBookmarks: BookmarksSchema[]; // Replace 'any' with the type of your data
	showTagsBool: boolean;
	showMoreBool: boolean;
	showUrlBool: boolean;
	handleBookmarkClick: (
		bookmark: BookmarksSchema | null,
		action: boolean
	) => void;
	selectedBookmarks: {
		bookmarkIndex: number;
		bookmarkFolder: string;
		bookmark: BookmarksSchema;
		//folderIndex: number;
	}[];
}

export const LoadBookmarks: React.FC<LoadBookmarksProps> = ({
	filteredBookmarks,
	showTagsBool,
	showMoreBool,
	showUrlBool,
	selectedBookmarks,
	handleBookmarkClick,
}) => {
	return (
		<ol className="view-ol">
			{filteredBookmarks.reverse().map((bookmark) => (
				<li
					key={bookmark.guid}
					className={
						selectedBookmarks.some(
							(selected) =>
								Array.isArray(selected.bookmark) &&
								selected.bookmark &&
								selected.bookmark.includes(bookmark)
						)
							? "selected"
							: ""
					}
					onClick={() => handleBookmarkClick(bookmark, true)}
				>
					<div className="img-wrapper"></div>
					<div className="bookmarks-info">
						{showUrlBool && (
							<div className="site-name">{bookmark.hostname}</div>
						)}
						<div className="site-title">
							{bookmark.iconBase64 && (
								<img
									src={`data:${getBase64Data(bookmark.iconBase64)?.mimeType
										};base64,${getBase64Data(bookmark.iconBase64)?.base64Data}`}
									alt="favicon"
								/>
							)}
							<a href={bookmark.href} target="_blank" rel="noopener noreferrer">
								<span>{bookmark.title}</span>
							</a>
						</div>
						{/* Render tags if showTagsBool is true */}
						{showTagsBool && bookmark.tags && (
							<div className="tags-wrapper">
								{bookmark.tags &&
									bookmark.tags.map((tag, index) => (
										<span key={index} className="txt tag">
											{tag}
										</span>
									))}
							</div>
						)}
						{/* Render additional info if showMoreBool is true */}
						{showMoreBool && (
							<div className="more-info">
								{bookmark.favourite && (
									<div className="favourite-div">
										<i className="fa-solid fa-heart"></i>
									</div>
								)}
								{bookmark.duplicate && (
									<div className="duplicate-div">
										<i className="fa-solid fa-clone"></i>
									</div>
								)}
								{bookmark.broken && (
									<div className="broken-div">
										<i className="fa-solid fa-link-slash"></i>
									</div>
								)}
								<div className="date-added">
									{new Date((bookmark.addDate as number) * 1000).toLocaleString(
										undefined,
										{
											day: "numeric",
											month: "short",
											year: "2-digit",
										}
									)}
								</div>
							</div>
						)}
					</div>
				</li>
			))}
		</ol>
	);
};

// LoadAllBookmarks
// LoadUnsortedBookmarks
// LoadDuplicatesBookmarks
// LoadTrashBookmarks

// NoBookmarks

export default BookmarksContainer;
