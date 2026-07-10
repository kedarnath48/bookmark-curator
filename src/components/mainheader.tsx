import React from "react";
//import FileSelector from './importfunc';
import ImportBtn from "./importfunc";
import {
	Folder,
	DuplicateSchema,
} from "./../utils/interfaces";
import { BookmarksSchema, FilterSchema } from "../utils/schemas";

interface MainHeaderProps {
	toggleBool: (key: string) => void;
	hACatObjChangeProp: (guid: string, label: string, type: string) => void;
	activeCatObj: {
		guid: string;
		label: string;
		type: string;
	};
	isSettingsVisible: boolean;
	getDataLength: (type: string) => number | null;
	bookmarksData: BookmarksSchema[];
	setBookmarksData: React.Dispatch<React.SetStateAction<BookmarksSchema[]>>;
	setUnsortedData: React.Dispatch<React.SetStateAction<Folder[]>>;
	setDuplicatesData: React.Dispatch<React.SetStateAction<DuplicateSchema[]>>;
	filtersData: FilterSchema[];
	setFiltersData: React.Dispatch<React.SetStateAction<FilterSchema[]>>;
}

const MainHeader: React.FC<MainHeaderProps> = (props) => {
	const {
		toggleBool,
		activeCatObj,
		hACatObjChangeProp,
		isSettingsVisible,
		//getDataLength,
		bookmarksData,
		setBookmarksData,
		setUnsortedData,
		setDuplicatesData,
		filtersData,
		setFiltersData,
	} = props;

	const createButton = (
		obj: { guid: string; label: string; type: string },
		label: string
	) => (
		<button
			key={label} // Assigning the label as the key
			className={`ctg-btn ${activeCatObj.label === label ? "active" : ""}`}
			onClick={() => hACatObjChangeProp(obj.guid, obj.label, obj.type)}
		>
			{label.charAt(0).toUpperCase() + label.slice(1)}
		</button>
	);
	const bookmarkCategories: [
		string,
		{ guid: string; label: string; type: string }
	][] = Object.entries({
		"all bookmarks": { guid: "0", label: "all bookmarks", type: "category" },
		unsorted: { guid: "0", label: "unsorted", type: "category" },
		duplicates: { guid: "0", label: "duplicates", type: "category" },
		trash: { guid: "0", label: "trash", type: "category" },
	});

	return (
		<header>
			<div className="left-ctr">
				<button
					className="btn sb-toggle"
					onClick={() => toggleBool("PSActive")}
				>
					<i className="fa-solid fa-table-columns"></i>
				</button>
				<input id="searchBar" />
				<span id="index"></span>
			</div>
			{/*Object.values(bookmarkCategories).some(
				([, obj]) => getDataLength(obj.label) > 0
			) && (
				<nav className="main-categories">
					{bookmarkCategories.map(([label, obj]) => {
						if (getDataLength(obj.label) > 0) {
							return createButton(obj, label);
						}
						return null;
					})}
				</nav>
			)*/}
			<nav className="main-categories">
				{bookmarkCategories.map(([label, obj]) => {
					return createButton(obj, label);
				})}
			</nav>
			<div className="right-ctr">
				<button
					className="btn sb-toggle"
					onClick={() => toggleBool("SSActive")}
				>
					<i className="fa-solid fa-table-columns"></i>
				</button>
				<button id="add-btn" type="button">
					<i className="fa-solid fa-star"></i>
					<span className="txt">Add</span>
				</button>
				<ImportBtn
					importTxt="Import"
					bookmarksData={bookmarksData}
					setBookmarksData={setBookmarksData}
					setUnsortedData={setUnsortedData}
					setDuplicatesData={setDuplicatesData}
					filtersData={filtersData}
					setFiltersData={setFiltersData}
				/>
				<div
					id="profile-div"
					onClick={() => toggleBool("settingsVisible")}
					style={{ display: "none" }}
				>
					<span style={{ display: "none" }}>
						{isSettingsVisible ? "Hide Settings" : "Show Settings"}
					</span>
				</div>
			</div>
		</header>
	);
};

export default MainHeader;
