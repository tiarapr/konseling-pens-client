import { useState } from "react";

const TabSwitcher = ({ options = [], defaultValue, onChange }) => {
  const [selected, setSelected] = useState(defaultValue || options[0]?.value);

  const handleSelect = (value) => {
    setSelected(value);
    onChange?.(value);
  };

  const getButtonClass = (value) =>
    selected === value
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      {options.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => handleSelect(value)}
          className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
            value
          )}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default TabSwitcher;
