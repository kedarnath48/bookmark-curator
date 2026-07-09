import React, { useState, useRef } from "react";


import { Folder, ImportedJson, DuplicateSchema } from "./../utils/interfaces";
import { BookmarksSchema, FilterSchema } from "../utils/schemas";
import { generateGUID } from "./../utils/utilsfunc";
import { getBase64Data } from "./../utils/helper_fuctions";
import { bookmarksToJSON } from "bookmarks-to-json";
import { parse as domain_parse } from "tldts";

import { getDomianFilter, customWriteToFile } from "./../utils/helper_fuctions";
interface ImportBtnProps {
	importTxt: string;

	bookmarksData: BookmarksSchema[] | null;
	setBookmarksData: React.Dispatch<React.SetStateAction<BookmarksSchema[]>>;

	setUnsortedData: React.Dispatch<React.SetStateAction<Folder[]>>;
	setDuplicatesData: React.Dispatch<React.SetStateAction<DuplicateSchema[]>>;

	filtersData: FilterSchema[] | null;
	setFiltersData: React.Dispatch<React.SetStateAction<FilterSchema[]>>;
}
const ImportBtn: React.FC<ImportBtnProps> = (props) => {
	const {
		importTxt,
		setBookmarksData,
		setUnsortedData,
		setDuplicatesData,
		filtersData,
		setFiltersData,
	} = props;

	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedFile(event.target.files?.[0] ?? null);
		event.target.files?.[0] && convertToJson(event.target.files[0]);
	};

	const handleButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const convertToJson = (file: File) => {
		const reader = new FileReader();
		reader.onload = () => {
			const content = reader.result as string;
			try {
				const options = {
					stringify: false,
					formatJSON: true,
					spaces: 1,
				};
				const importedJson = bookmarksToJSON(content, options);
				if (Array.isArray(importedJson)) {
					//customWriteToFile("jsontohtml.json", importedJson, 'bookmark');
					getUnsortedRoot(file.name, importedJson);
					processJson(file, importedJson);
				}
			} catch (error) {
				console.error("Error converting bookmarks to JSON:", error);
			}
		};
		reader.readAsText(file);
	};
	const processJson = (file: File, data: ImportedJson[]) => {
		if (importTxt == "0") {
			console.log(data, setDuplicatesData, setFiltersData);
		}
		if (file !== null) {
			const fileDetails = {
				title: file?.name,
				size: file?.size,
				type: file?.type,
				lastModified: file?.lastModified,
				text: file?.text,
			};
			console.log("process", fileDetails);
		} else {
			console.log("No file selected");
		}
		/*
	const processObject = (obj: ImportedJson) => {
	  console.log(obj.title = obj.title || "Untitled");
	}
	data.forEach((obj) => processObject(obj));
	*/
	};

	const getUnsortedRoot = (fileName: string, data: ImportedJson[]) => {
		const rootFolder: Folder = {
			guid: generateGUID(12),
			id: 0,
			index: 0,
			title: fileName,
			tags: [],
			filters: [],
			addDate: 0,
			lastModified: 0,
			links: [],
			children: [],
			path: `/${fileName}`,
		};

		const uniqueUrls: Set<string> = new Set();
		const allLinks: BookmarksSchema[] = [];
		let currentFolderId = 1;
		let currentLinkId = 0;

		//const duplicatesCollector: Folder[] = [];
		const mainfolder: Folder[] = [];
		const folders: Folder[] = [];
		//const links: Bookmarks[] = [];
		const duplicate: Folder = {
			guid: generateGUID(12),
			id: 0,
			index: 0,
			title: "Duplicates",
			tags: [],
			filters: [],
			addDate: Date.now(), // Convert Date object to number
			lastModified: Date.now(), // Convert Date object to number or default to 0
			links: [],
			children: [],
			path: "/Duplicates",
		};
		const processBookmark = (
			bookmark: ImportedJson,
			parentFolder?: Folder
		): Folder | BookmarksSchema => {
			let currentPath;
			if (parentFolder !== undefined) {
				currentPath = `${parentFolder?.path}/${bookmark.title}/`;
			} else {
				currentPath = `/${fileName}`;
			}
			if (bookmark.type === "folder") {
				const folder: Folder = {
					guid: generateGUID(12),
					id: currentFolderId++,
					index: 0,
					title: bookmark.title,
					tags: [],
					filters: [],
					addDate: bookmark.addDate || Date.now(), // Convert Date object to number
					lastModified: bookmark.lastModified || Date.now(), // Convert Date object to number or default to 0
					links: [],
					children: [],
					path: currentPath,
				};

				if (parentFolder) {
					parentFolder.children.push(folder); // Add folder to parent folder's children
				} else {
					mainfolder.push(folder); // Add top-level folder to main folder
				}

				if (bookmark.children && bookmark.children.length > 0) {
					bookmark.children.forEach((child) => {
						processBookmark(child, folder); // Recursively process children with current folder as parent
					});
				}
				return folder;
			} else if (bookmark.type === "link") {


				const link: BookmarksSchema = {
					guid: generateGUID(12),
					id: currentLinkId++,
					index: 0,
					title: bookmark.title,
					url: bookmark.url ? bookmark.url : "",
					addDate: bookmark.addDate || Date.now(),
					lastModified: bookmark.lastModified || Date.now(),
					path: currentPath,
					//iconBase64: "" as string | undefined,
					//iconBase64: bookmark.icon
					//	? `data:${base64Data?.mimeType};base64,${base64Data?.base64Data}`
					//	: "",
				};
				if (bookmark.icon) {
					const validBase64 = getBase64Data(bookmark.icon);
					const base64Data =
						"data:" +
						validBase64?.mimeType +
						";base64," +
						validBase64?.base64Data;
					link.iconBase64 = bookmark.icon && base64Data;
				}
				const parsedUrl = bookmark.url ? new URL(bookmark.url) : null;
				if (parsedUrl) {
					//const link: Partial<BookmarksSchema> = {};
					//link.url = parsedUrl ? parsedUrl.href : link.url;
					for (const key in parsedUrl) {
						const value = parsedUrl[key as keyof typeof parsedUrl];
						if (typeof value !== "function" && value !== "" && value !== "/") {
							link[key as keyof typeof link] = value;
						}
					}

					const urlDomains = parsedUrl.hostname
						? domain_parse(parsedUrl.hostname)
						: null;
					for (const key in urlDomains) {
						const value = urlDomains[key as keyof typeof urlDomains];
						if (typeof value !== "function" && value !== "" && value !== "/") {
							link[key as keyof typeof link] = value;
						}
					}


					//const hostWithoutWww = parsedUrl.hostname.replace(/^www\./, "");
					//const [tld, subDomain, mainDomain] = hostWithoutWww.split(".").reverse();
					if (urlDomains && filtersData) {
						getDomianFilter(link, filtersData)
					}
				}

				//link.filters = link.url ? [parsedUrl ? parsedUrl.host : ""] : [];
				allLinks.push(link); // Add link to allLinks array

				if (parentFolder) {
					parentFolder.links.push(link.guid);
				} else {
					rootFolder.links.push(link.guid);
				}

				const url = bookmark.url || "";
				if (!uniqueUrls.has(url)) {
					uniqueUrls.add(url);
				} else {
					console.log("Duplicate URL", url);
					duplicate.links.push(link.guid);
				}
				return link;
			}
			throw new Error("Invalid bookmark type");
		};

		data.forEach((bookmark) => processBookmark(bookmark));

		mainfolder.push(...folders);
		rootFolder.children.push(...mainfolder);
		//rootFolder.links.push(...links);

		const rootArray: Folder[] = [];
		rootArray.push(rootFolder);

		//writeToFileUnsorted("unsorted.json", rootArray);
		//writeToFile("bookmarks.json", allLinks);
		type Data = BookmarksSchema | Folder | DuplicateSchema | FilterSchema;
		customWriteToFile("unsorted.json", rootArray, "add").then((data) => {
			if (data) {
				const transformedData: Folder[] = data.map((item: Data) => {
					return item as Folder;
				})
				setUnsortedData(transformedData);
			}
		});
		customWriteToFile("bookmarks.json", allLinks, "add").then((data) => {
			if (data) {
				const transformedData: BookmarksSchema[] = data.map((item: Data) => {
					return item as BookmarksSchema;
				})
				setBookmarksData(transformedData);
			}
		});
		if (duplicate.links.length > 0) {
			customWriteToFile("duplicates.json", [duplicate], "replace");
		}
		if (filtersData) {
			const sortedFiltersData = filtersData.sort((a, b) => {
				if (
					"maindomain" in a &&
					"maindomain" in b &&
					typeof a.maindomain === "string" &&
					typeof b.maindomain === "string"
				) {
					return a.maindomain.localeCompare(b.maindomain);
				} else {
					return 0;
				}
			});
			if (sortedFiltersData && sortedFiltersData.length > 0) {
				console.log(sortedFiltersData)
				customWriteToFile("filters.json", sortedFiltersData, "update");
			}
		}

		return console.log("Imported bookmarks");
	};



	return (
		<>
			<input
				type="file"
				accept="text/html"
				ref={fileInputRef}
				style={{ display: "none" }}
				onChange={handleFileChange}
			/>
			<button id="headerImportBtn" onClick={handleButtonClick}>{importTxt}</button>
			{selectedFile && (
				<>
					{/*
            {console.log(
              selectedFile.name,
              selectedFile.size + " bytes",
              selectedFile.type,
              selectedFile.lastModified,
              selectedFile.webkitRelativePath,
              selectedFile.text,
              selectedFile.slice(0, 1000),
              selectedFile.arrayBuffer,
              selectedFile.stream
            )}
            <div id='file-info'>
              <p>Selected File: {selectedFile.name}</p>
              <p>File Size: {selectedFile.size} bytes</p>
            </div>
          */}
				</>
			)}
		</>
	);
};

export default ImportBtn;
