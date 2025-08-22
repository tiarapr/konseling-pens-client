const LimitSelector = ({ itemsPerPage, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">Show:</span>
      <input
        type="number"
        min={1}
        value={itemsPerPage}
        onChange={(e) => onChange(e.target.value)}
        className="w-16 px-2 py-1 border rounded-md text-sm text-gray-700 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
      />
      <span className="text-sm text-gray-600 dark:text-gray-400">entries</span>
    </div>
  );
};

export default LimitSelector;