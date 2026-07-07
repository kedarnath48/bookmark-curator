import React from 'react';
//import { bookmarksctxt } from "./../../contexts/bookmarksctxt";

interface TestCompProps {
}
const TestComp: React.FC<TestCompProps> = () => {
  //const bookmarksDataContextValue = React.useContext(bookmarksctxt);
  //const { bookmarksData, setBookmarksData } = bookmarksDataContextValue || {};
  const updateBookmarksData = () => {
    //setBookmarksData && setBookmarksData([
    //  {
    //    guid: '123',
    //    id: 1,
    //    index: 1,
    //    title: 'test',
    //    url: 'test',
    //    favourite: false,
    //    tags: [],
    //    filters: [],
    //    duplicate: false,
    //    broken: false,
    //    coverImage: 'test',
    //    note: 'test',
    //    description: 'test',
    //    addDate: 1704578850,
    //    lastModified: 1704578850,
    //    iconBase64: 'test'
    //  }
    //]);
  };
  return (
    <div>
      <h1>{/*bookmarksData?.[0]?.title*/}, Eon</h1>
      <button onClick={updateBookmarksData}>Update Bookmarks</button>
    </div>
  );
}

export default TestComp;