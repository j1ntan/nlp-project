import React from "react";
import SearchBar from "./searchbar";

interface Props {
  sessions: { id: string; content: string }[];
  onSelect: (s: any) => void;
  onSearch: (term: string) => void;
}

const Sidebar = ({ sessions, onSelect, onSearch }: Props) => {
  return (
    <aside className="w-64 bg-white border-r p-4 overflow-auto">
      <SearchBar onChange={onSearch} />
      <ul className="mt-4 space-y-2">
        {sessions.map(s => (
          <li key={s.id} className="cursor-pointer text-sm" onClick={() => onSelect(s)}>
            <div className="p-2 bg-gray-100 rounded hover:bg-gray-200">
              {s.content.slice(0, 60)}...
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
