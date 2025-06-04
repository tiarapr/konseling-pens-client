import Input from "../../form/input/InputField";

const SearchInput = ({ value, onChange }) => {
  return (
    <div className="w-full sm:w-64">
      <Input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchInput;