import { Search } from "lucide-react";
import React from "react";

const SearchBar = () => {
  return (
    <div>
      <Search className="w-5 h-5 text-muted-foreground hover:text-foreground hoverEffect" />
    </div>
  );
};

export default SearchBar;
