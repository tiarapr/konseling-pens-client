import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";

const Select = ({
  options,
  onChange,
  className = "",
  defaultValue = "",
  placeholder = "Select an option",
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (defaultValue) {
      const defaultOption = options.find((opt) => opt.value === defaultValue);
      setSelectedOption(defaultOption);
    }
  }, [defaultValue, options]);

  const handleChange = (selected) => {
    setSelectedOption(selected);
    onChange?.(selected?.value);
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "2.75rem",
      borderRadius: "0.5rem",
      borderColor: state.isFocused ? "#60A5FA" : "var(--tw-border-color, #D1D5DB)",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(59,130,246,0.1)" : "none",
      backgroundColor: "transparent",
      color: "inherit",
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: 14,
      paddingLeft: 4,
      color: "var(--tw-placeholder-color, #9CA3AF)",
    }),
    input: (provided) => ({
      ...provided,
      color: "var(--tw-placeholder-color, #9CA3AF)", // Sama seperti placeholder
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "var(--tw-text-color, #111827)",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 20,
      backgroundColor: "var(--tw-bg-color, white)",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "rgba(59,130,246,0.1)"
        : "transparent",
      color: "var(--tw-text-color, #111827)",
    }),
  };

  return (
    <div
      className={`relative ${className} 
      dark:[--tw-text-color:#F3F4F6] 
      dark:[--tw-bg-color:#374151] 
      dark:[--tw-placeholder-color:#9CA3AF] 
      dark:[--tw-border-color:#374151]`}
    >
      <ReactSelect
        options={options}
        value={selectedOption}
        onChange={handleChange}
        placeholder={placeholder}
        styles={customStyles}
        classNamePrefix="react-select"
      />
    </div>
  );
};

export default Select;
