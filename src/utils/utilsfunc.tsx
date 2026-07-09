import { SetStateAction } from "react";
import { appDataDir, BaseDirectory, join } from "@tauri-apps/api/path";
import {
  //BaseDirectory,
  mkdir,
  exists,
  readTextFile,
  //writeBinaryFile,
  writeTextFile,
} from "@tauri-apps/plugin-fs";
import { path } from "@tauri-apps/api";
import { Folder, DuplicateSchema, TrashSchema } from "./interfaces";
import { BookmarksSchema, FilterSchema } from "./schemas";
import { TagSchema } from "./interfaces";
import { FolderSchema } from "./schemas";



export const allFiles: { [key: string]: string } = {
  bookmarks: "bookmarks.json",
  unsorted: "unsorted.json",
  unsortedTree: "unsorted tree.json",
  duplicates: "duplicates.json",
  trash: "trash.json",
  collection: "collection.json",
  collectiontree: "collection tree.json",
  filters: "filters.json",
  tags: "tags.json",
};
interface SetterFunctions {
  setBookmarksData: (value: SetStateAction<BookmarksSchema[]>) => void;
  setUnsortedData: (value: SetStateAction<Folder[]>) => void;
  setDuplicatesData: (value: SetStateAction<DuplicateSchema[]>) => void;
  setTrashData: (value: SetStateAction<TrashSchema[]>) => void;
  setFolderData: (value: SetStateAction<FolderSchema[]>) => void;
  setFiltersData: (value: SetStateAction<FilterSchema[]>) => void;
  setTagsData: (value: SetStateAction<TagSchema[]>) => void;
}


export async function checkAppDataDirExists(setters: SetterFunctions) {
  const folderName = "bookmarks curator";
  try {
    const appDataPath = await appDataDir();
    console.log(appDataPath)

    if (!(await exists(folderName, { baseDir: BaseDirectory.AppData }))) {
      await mkdir(folderName, { baseDir: BaseDirectory.AppData });
    }

    await ensureAllFiles(appDataPath);

    const {
      setBookmarksData,
      setUnsortedData,
      setDuplicatesData,
      setTrashData,
      setFolderData,
      setFiltersData,
      setTagsData,
    } = setters;

    setBookmarksFunc(setBookmarksData);
    setUnsortedFunc(setUnsortedData);
    setDuplicatesFunc(setDuplicatesData);
    setTrashFunc(setTrashData);
    setCollectionFunc(setFolderData);
    setFiltersFunc(setFiltersData);
    setTagsFunc(setTagsData);


  } catch (error) {
    console.error("Error in checkAppDataDirExists:", error);
  }
  return "AppDataDirExists";
}


async function ensureAllFiles(appDataPath: string) {
  console.log("[path]", appDataPath)
  try {
    for (const fileName of Object.values(allFiles)) {
      const filePath = await path.join(appDataPath, fileName);

      if (!(await exists(filePath))) {
        await createFile(filePath, []);
      }
    }
  } catch (error) {
    console.error("Error ensuring all files exist:", error);
  }
}

export async function setDataFromFilename<T>(filename: string, setState: (value: SetStateAction<T[]>) => void) {
  try {
    const appDataPath = await appDataDir(); // Gets C:\Users\...\AppData\Roaming\your-app
    const fullPath = await join(appDataPath, filename);

    console.log("Checking for file at:", fullPath);

    // Use the absolute path directly without baseDir
    const fileExists = await exists(fullPath);

    if (fileExists) {
      const fileData = await readTextFile(fullPath);
      console.log(fileData)
      setState(JSON.parse(fileData));
    } else {
      console.warn("File does not exist at:", fullPath);
    }
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
  }
}

export async function setBookmarksFunc(setBookmarksData: (value: SetStateAction<BookmarksSchema[]>) => void) {
  await setDataFromFilename<BookmarksSchema>(allFiles.bookmarks, setBookmarksData);
}
export async function setUnsortedFunc(setUnsortedData: (value: SetStateAction<Folder[]>) => void) {
  await setDataFromFilename<Folder>(allFiles.unsorted, setUnsortedData);
}
export async function setDuplicatesFunc(setDuplicatesData: (value: SetStateAction<DuplicateSchema[]>) => void) {
  await setDataFromFilename<DuplicateSchema>(allFiles.duplicates, setDuplicatesData);
}
export async function setTrashFunc(setTrashData: (value: SetStateAction<TrashSchema[]>) => void) {
  await setDataFromFilename<TrashSchema>(allFiles.trash, setTrashData);
}

export async function setCollectionFunc(setFolderData: (value: SetStateAction<FolderSchema[]>) => void) {
  await setDataFromFilename<FolderSchema>(allFiles.collection, setFolderData);
}
export async function setFiltersFunc(setFiltersData: (value: SetStateAction<FilterSchema[]>) => void) {
  await setDataFromFilename<FilterSchema>(allFiles.filters, setFiltersData);
}
export async function setTagsFunc(setTagsData: (value: SetStateAction<TagSchema[]>) => void) {
  await setDataFromFilename<TagSchema>(allFiles.tags, setTagsData);
}

export async function writeContent(fileName: string, contents: FolderSchema[]) {
  const appDataPath = await appDataDir();
  let filePath = null;
  for (const file of Object.values(allFiles)) {
    if (file === fileName) {
      filePath = await path.join(appDataPath, file);
      break
    }
  }
  if (filePath !== null) {
    try {
      await writeTextFile(filePath, JSON.stringify(contents));
      //console.log("Data written to file successfully.", fileName, contents);
    } catch (err) {
      return err
      //throw console.error('file is not part of the app', fileName);
    }
  }
}

//Note: Review
async function createFile(filePath: string, contents: []) {
  await writeTextFile(filePath, JSON.stringify(contents));
}
/*
  const guids = [
    '5d63b1e7-65fc-4f33-84be-7b23966e0d39',
    'a3f65c18-3a67-4b82-aa95-540548b5a73f',
    'f9ef8a8b-d92f-46d8-8d6c-8e88b44a1ed3',
];
*/
export function generateGUID(length: number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/*
export async function getAppData(setAppDataDirPath: { (value: SetStateAction<string>): void; (arg0: string): void; }) {
  setAppDataDirPath(await appDataDir());
}
*/


