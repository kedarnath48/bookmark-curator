import React, { useState, useEffect } from 'react';
import { TagSchema } from '../../utils/interfaces';

interface TagsTreeProps {
  tags: TagSchema[];
}

const TagsTree: React.FC<TagsTreeProps> = ({ tags }) => {
  const [expandedTags, setExpandedTags] = useState<string[]>([]);

  useEffect(() => {
    const tagsToExpand: string[] = [];
    const expandBasedOnStatus = (tag: TagSchema) => {
      if (tag.open) {
        tagsToExpand.push(tag.label);
      }
      tag.children.forEach(childTag => expandBasedOnStatus(childTag));
    };

    tags.forEach(tag => expandBasedOnStatus(tag));
    setExpandedTags(tagsToExpand);
  }, [tags]);

  const toggleTag = (tagName: string) => {
    if (expandedTags.includes(tagName)) {
      setExpandedTags(prevExpandedTags => prevExpandedTags.filter(tag => tag !== tagName));
    } else {
      setExpandedTags(prevExpandedTags => [...prevExpandedTags, tagName]);
    }
  };

  const renderTag = (tag: TagSchema) => (
    <li key={tag.label}>
      <button className='tag-btn' onClick={() => toggleTag(tag.label)}>
        {tag.label}
      </button>
      {tag.children.length > 0 && expandedTags.includes(tag.label) && (
        <ul>
          {tag.children.map(childTag => renderTag(childTag))}
        </ul>
      )}
    </li>
  );

  return (
    <ul className='tags-ul'>
      {tags.map(tag => renderTag(tag))}
    </ul>
  );
};

export default TagsTree;
