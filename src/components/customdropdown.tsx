import React, { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  options: Option[];
  onSelect: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onSelect }) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onSelect(value);
  };

  return (
    <select
      value={selectedValue || undefined} // set undefined to reset the select when selectedValue is null
      onChange={(e) => handleSelect(e.target.value)}
    >
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
