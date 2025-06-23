const SearchBar = ({ onChange }: { onChange: (t: string) => void }) => {
    return (
      <input
        type="text"
        placeholder="Search history..."
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-1"
      />
    );
  };
  
  export default SearchBar;
  