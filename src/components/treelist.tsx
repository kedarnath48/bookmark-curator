
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';

const TreeList = () => {
  const treeData = [
    { title: 'Node 1', children: [{ title: 'Child 1' }, { title: 'Child 2' }] },
    { title: 'Node 2', children: [{ title: 'Child 3' }, { title: 'Child 4' }] },
  ];

  return (
    <div style={{ height: 400 }}>
      <SortableTree
        treeData={treeData}
        onChange={(treeData) => console.log(treeData)}
      />
    </div>
  );
};

export default TreeList;