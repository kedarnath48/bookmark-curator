import { readTextFile, writeTextFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import { BookmarksSchema, FilterSchema } from "./schemas";
import { Folder, DuplicateSchema } from "./../utils/interfaces";
//import parseUri from "parse-uri";

export function findDuplicates(bookmarks: BookmarksSchema[]) {
	return bookmarks.filter(
		(bookmark, index, self) =>
			index !== self.findIndex((t) => t.url === bookmark.url)
	);
}

export function getDomianFilter(link: BookmarksSchema, filtersData: FilterSchema[]) {
	const mainDomain = link.domainWithoutSuffix;

	/*
		if (mainDomain == "localhost") {
			console.log("MainDomain", mainDomain);
			//Checking Main Domian
			const checkIcon = (filter: FilterSchema) => {
				const iconExists = filter.icons.find(
					(icon) => icon.iconid === filter.hosts.length - 1
				);
				if (!iconExists && link.iconBase64) {
					filter.icons.push({
						icon: link.iconBase64 || "",
						iconid: filter.icons.length - 1,
					});
				} else {
					console.log(
						filter.hosts.find((host) => host.hostname === link.hostname)
					);
					filter.hosts[
						filter.icons.findIndex(
							(icondata) => icondata.icon === link.iconBase64
						)
					];
				}
			};
			if (filtersData.some((filter) => filter.maindomain === mainDomain)) {
				const filterIndex = filtersData.findIndex(
					(filter) => filter.maindomain === mainDomain
				);
				if (filterIndex !== -1) {
					const filter = filtersData[filterIndex];
					const hostExits = filter.hosts.find(
						(host) => host.hostname === link.hostname
					);
					if (!hostExits) {
						filter.hosts.push({
							hostname: link.hostname ? link.hostname : "",
							activeicon: filter.icons.length + 1,
						});
						checkIcon(filter);
					} else {
						//console.log("Host exists");
					}
				}
			} else {
				const filter = {
					maindomain: mainDomain as string,
					hosts: [] as { hostname: string; activeicon: number; icons: string[] }[],
					icons: [] as { icon: string; iconid: number }[],
					defaulticon: 0 as number,
				};
				filter.maindomain = mainDomain;
				filter.hosts.push({
					hostname: link.hostname ? link.hostname : "",
					activeicon: 0,
				});
				if (link.iconBase64){
					filter.icons.push({
						icon: link.iconBase64,
						iconid: 0,
					});
				}
				filtersData.push(filter);
			}
		}
	*/

	if (mainDomain) {

		const checkMainDomain = (mainDomain: string) => {
			const filterIndex = filtersData.findIndex(
				(filter) => filter.maindomain === mainDomain
			);
			return filterIndex !== -1
				? { filterIndex, filterData: filtersData[filterIndex] }
				: null;
		};

		const processHost = (filter: FilterSchema, link: BookmarksSchema) => {
			const hostname = link.hostname?.replace("www.", "") ?? "";
			const hostExists = filter.hosts.some((host) => host.hostname === hostname);
			if (!hostExists) {
				const activeicon = hostname === link.domain && link.iconBase64 ? 0 : null;
				filter.hosts.push({ hostname, activeicon, icons: [] });
				filter.hosts.sort((a, b) => a.hostname.length - b.hostname.length);
			}
		};

		const processIcon = (filter: FilterSchema, link: BookmarksSchema) => {
			if (link.iconBase64) {
				const iconExists = filter.icons.some(
					(icon) => icon.icon === link.iconBase64
				);
				if (!iconExists) {
					filter.icons.push({
						icon: link.iconBase64,
						iconid: filter.hosts.length - 1,
					});
				}
			}
		};

		const defaulticon = () => { };

		const processFilter = (
			mainDomain: string,
			filterData: FilterSchema | undefined
		) => {
			if (!filterData) {
				const filter: FilterSchema = {
					maindomain: mainDomain,
					hosts: [],
					defaulticon: null,
					icons: [],
				};
				processHost(filter, link);
				processIcon(filter, link);
				filtersData.push(filter);
			} else {
				processIcon(filterData, link);
				processHost(filterData, link);
				defaulticon();
				console.log(filterData);
			}
		};
		const existingFilter = checkMainDomain(mainDomain);
		processFilter(mainDomain, existingFilter?.filterData);
	}

}

export function writeDataToFile() {
	console.log("WriteDataToFile");
}

type Data = BookmarksSchema | Folder | DuplicateSchema | FilterSchema;
export const customWriteToFile = async (
	title: string,
	data: Data[],
	command: "add" | "remove" | "update" | "replace"
) => {
	try {
		let existingData: Data[] = [];
		const existingContent = await readTextFile(title, {
			baseDir: BaseDirectory.AppData,
		});
		existingData = existingContent ? JSON.parse(existingContent) : [];
		let dataToWrite: Data[] | [];
		switch (command) {
			case "add":
				dataToWrite = existingData.length > 0 ? [...existingData, ...data] : data;
				break;
			case "remove":
				dataToWrite = [];
				break;
			case "update":
				dataToWrite = data;
				break;
			case "replace":
				dataToWrite = [];
				break;
		}

		await writeTextFile(
			title,
			JSON.stringify(dataToWrite, null, 4),
			{
				baseDir: BaseDirectory.AppData,
			}
		);

		return dataToWrite;

	} catch (error) {
		console.error("Error writing to file:", error);
	}
};

export const getBase64Data = (
	str: string
): { base64Data: string; mimeType: string; extension: string } | undefined => {
	try {
		const parts = str.split(",");
		const mimeParts = parts[0].match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*/);
		if (!mimeParts) {
			console.error("Invalid MIME type", str);
			return undefined;
		}
		let mimeType = mimeParts[1];
		let extension = mimeType.split("/")[1];
		let base64Data = parts[1];
		if (base64Data.includes('" TAGS=')) {
			base64Data = base64Data.split('" TAGS=')[0];
		}
		switch (base64Data.charAt(0)) {
			case "i":
				extension = "png";
				break;
			case "/":
				extension = "jpg";
				break;
			case "P":
				mimeType = "image/svg+xml";
				extension = "svg";
				break;
			// Add more cases as needed...
			default:
				extension = "unknown";
		}
		return { base64Data, mimeType, extension };
	} catch (err) {
		console.error("Error parsing base64 data:", str, err);
		return undefined;
	}
};
