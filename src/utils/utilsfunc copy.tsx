import { SetStateAction } from "react";
import { appDataDir, BaseDirectory } from "@tauri-apps/api/path";
import {
  //BaseDirectory,
  createDir,
  exists,
  readTextFile,
  //writeBinaryFile,
  writeTextFile,
} from "@tauri-apps/plugin-fs";
import { path } from "@tauri-apps/api";
import { BookmarksSchema, Folder } from "./interfaces";



const allFiles = {
  bookmarks: "bookmarks.json",
  unsorted: "unsorted.json",
  duplicates: "duplicates.json",
  trash: "trash.json",
  collection: "collection.json",
  filters: "filters.json",
  tags: "tags.json",
}

export async function checkAppDataDirExists(
  setBookmarksData: (value: SetStateAction<BookmarksSchema[]>) => void,
  setUnsortedData: (value: SetStateAction<Folder[]>) => void,
  setDuplicatesData: (value: SetStateAction<Folder[]>) => void,
  setTrashData: (value: SetStateAction<Folder[]>) => void,
  setCollectionData: (value: SetStateAction<Folder[]>) => void,
  setFiltersData: (value: SetStateAction<Folder[]>) => void,
  setTagsData: (value: SetStateAction<Folder[]>) => void ){
  if (
  (await exists(await appDataDir())) &&
  (await exists(allFiles.bookmarks, { dir: BaseDirectory.AppData })) &&
  (await exists(allFiles.unsorted, { dir: BaseDirectory.AppData })) &&
  (await exists(allFiles.duplicates, { dir: BaseDirectory.AppData })) &&
  (await exists(allFiles.trash, { dir: BaseDirectory.AppData })) &&
  (await exists(allFiles.collection, { dir: BaseDirectory.AppData })) &&
  (await exists(allFiles.filters, { dir: BaseDirectory.AppData })) &&
  (await exists(allFiles.tags, { dir: BaseDirectory.AppData }))
  ) {
    setBookmarksFunc(setBookmarksData);
    setUnsortedFunc(setUnsortedData);
    setDuplicatesFunc(setDuplicatesData);
    setTrashFunc(setTrashData);

    setCollectionFunc(setCollectionData);
    setFiltersFunc(setFiltersData);
    setTagsFunc(setTagsData);
  } else {
    console.log("Ensuring all files exist");
    createAppDataFolder(setBookmarksData, setUnsortedData, setDuplicatesData, setTrashData, setCollectionData, setFiltersData, setTagsData);
  }

}
export async function createAppDataFolder(
  setBookmarksData: (value: SetStateAction<BookmarksSchema[]>) => void,
  setUnsortedData: (value: SetStateAction<Folder[]>) => void,
  setDuplicatesData: (value: SetStateAction<Folder[]>) => void,
  setTrashData: (value: SetStateAction<Folder[]>) => void,
  setCollectionData: (value: SetStateAction<Folder[]>) => void,
  setFiltersData: (value: SetStateAction<Folder[]>) => void,
  setTagsData: (value: SetStateAction<Folder[]>) => void
) {
  try {
    // Ensure the app data directory exists
    const appDataPath = await appDataDir();
    if (!(await exists(appDataPath))) {
      await createDir(appDataPath);
    }

    // Ensure all files exist
    await ensureAllFilesExist();

    // Set data for each category
    await setBookmarksFunc(setBookmarksData);
    await setUnsortedFunc(setUnsortedData);
    await setDuplicatesFunc(setDuplicatesData);
    await setTrashFunc(setTrashData);
    await setCollectionFunc(setCollectionData);
    await setFiltersFunc(setFiltersData);
    await setTagsFunc(setTagsData);
  } catch (error) {
    console.error("Error creating app data folder:", error);
  }
}


export async function ensureAllFilesExist() {
  try {
    const appDataFolderPath = await appDataDir();

    // Check if each file exists, and create it if it doesn't
    for (const fileKey in allFiles) {
      const fileName = allFiles[fileKey as keyof typeof allFiles]; // Add index signature to allow indexing with a string
      const filePath = await path.join(appDataFolderPath, fileName);

      if (!(await exists(filePath))) {
        await createFile(filePath, []);
      }
    }
  } catch (error) {
    console.error("Error ensuring all files exist:", error);
  }
}

async function createFile(filePath: string, contents: []) {
  await writeTextFile({
    path: filePath,
    contents: JSON.stringify(contents),
  });
}

export async function setBookmarksFunc(setBookmarksData: (value: SetStateAction<BookmarksSchema[]>) => void) {
  const bookmarksFilename = allFiles.bookmarks;
  if(await exists(bookmarksFilename, { dir: BaseDirectory.AppData })){
    const bookmarksData = await readTextFile(bookmarksFilename, {
      dir: BaseDirectory.AppData,
    });
    setBookmarksData(JSON.parse(bookmarksData));
  }
}
export async function setUnsortedFunc(setUnsortedData: (value: SetStateAction<Folder[]>) => void) {
  const unsortedFilename = allFiles.unsorted;
  if(await exists(unsortedFilename, { dir: BaseDirectory.AppData })){
    const unsortedData = await readTextFile(unsortedFilename, {
      dir: BaseDirectory.AppData,
    });
    console.log(JSON.parse(unsortedData));
    setUnsortedData(JSON.parse(unsortedData));
  }
}
export async function setDuplicatesFunc(setDuplicatesData: (value: SetStateAction<Folder[]>) => void) {
  const duplicatesFilename = allFiles.duplicates;
  if(await exists(duplicatesFilename, { dir: BaseDirectory.AppData })){
    const duplicatesData = await readTextFile(duplicatesFilename, {
      dir: BaseDirectory.AppData,
    });
    setDuplicatesData(JSON.parse(duplicatesData));
  }
}

export async function setTrashFunc(setTrashData: (value: SetStateAction<Folder[]>) => void) {
  const trashFilename = allFiles.trash;
  if(await exists(trashFilename, { dir: BaseDirectory.AppData })){
    const trashData = await readTextFile(trashFilename, {
      dir: BaseDirectory.AppData,
    });
    setTrashData(JSON.parse(trashData));
  }
}

export async function setCollectionFunc(setCollectionData: (value: SetStateAction<Folder[]>) => void) {
  const collectionFilename = allFiles.collection;
  if(await exists(collectionFilename, { dir: BaseDirectory.AppData })){
    const collectionData = await readTextFile(collectionFilename, {
      dir: BaseDirectory.AppData,
    });
    setCollectionData(JSON.parse(collectionData));
  }
}

export async function setFiltersFunc(setFiltersData: (value: SetStateAction<Folder[]>) => void) {
  const filtersFilename = allFiles.filters;
  if(await exists(filtersFilename, { dir: BaseDirectory.AppData })){
    const filtersData = await readTextFile(filtersFilename, {
      dir: BaseDirectory.AppData,
    });
    setFiltersData(JSON.parse(filtersData));
  }
}

export async function setTagsFunc(setTagsData: (value: SetStateAction<Folder[]>) => void) {
  const tagsFilename = allFiles.tags;
  if(await exists(tagsFilename, { dir: BaseDirectory.AppData })){
    const tagsData = await readTextFile(tagsFilename, {
      dir: BaseDirectory.AppData,
    });
    setTagsData(JSON.parse(tagsData));
  }
}





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


