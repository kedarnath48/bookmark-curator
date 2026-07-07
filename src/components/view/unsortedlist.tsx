import React from 'react';
import { BookmarksSchema, Folder } from '../../utils/interfaces';
import FolderList from './bookmarksfolder';

interface Props {
  allBookmarks: BookmarksSchema[]; // Replace 'any' with the type of your data
  unsortedData: Folder[]; // Replace 'any' with the type of your data
}

const UnsortedList: React.FC<Props> = ({ allBookmarks, unsortedData }) => {
  console.log("UnsortedList", allBookmarks)

  return <div>
    <FolderList data={unsortedData} />
  </div>;
};

export default UnsortedList;