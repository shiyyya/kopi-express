import SearchIcon from "/src/assets/icons/search.svg?react";
import Input from "/src/components/elements/input/input";
import "./search-bar.css";

function SearchBar({
    value,
    onChange,
    placeholder = "Search menu...",
    className = "",
}) {
    return (
        <div className={`search-bar ${className}`}>
            <SearchIcon className="search-bar-icon" />

            <Input
                type="text"
                name="menu-search"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="search-bar-input"
            />
        </div>
    );
}

export default SearchBar;