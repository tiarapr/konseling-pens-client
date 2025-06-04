import Select from "../../form/Select";

const LimitSelector = ({ itemsPerPage, onChange, options }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">Show:</span>
      <Select
        value={itemsPerPage.toString()}
        onChange={onChange}
        options={options.map(option => ({
          value: option.toString(),
          label: option.toString()
        }))}
        className="w-fit"
      />
      <span className="text-sm text-gray-600 dark:text-gray-400">entries</span>
    </div>
  );
};

export default LimitSelector;