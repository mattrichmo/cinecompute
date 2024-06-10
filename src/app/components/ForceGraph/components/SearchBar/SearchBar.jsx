"use client";

import React, { useState } from 'react';

const SearchBar = ({ nodeNames, onNodeSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const filterItems = (term) => {
        const filtered = nodeNames.filter(node => node.name.toLowerCase().includes(term.toLowerCase()));
        setFilteredItems(filtered);
    };

    const handleSelect = (item) => {
        onNodeSelect(item);
        setIsOpen(false);
    };
    

    return (
        <div className="w-full">
            <button onClick={toggleDropdown} id="dropdown-button" className="w-full px-4 py-2 text-white bg-transparent border border-white rounded-md focus:outline-none flex justify-between items-center">
                <span><p>Search Connections</p></span>
            </button>
            {isOpen && (
                <div id="dropdown-menu" className="absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white bg-opacity-50 ring-1 ring-white ring-opacity-50 p-1 space-y-1">
                    <input
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            filterItems(e.target.value);
                        }}
                        id="search-input"
                        className="block w-full px-4 py-2 text-gray-800 border border-white rounded-md bg-opacity-50 focus:outline-none"
                        type="text"
                        placeholder="Search items"
                        autoComplete="off"
                    />
                    {filteredItems.map((item, index) => (
                        <a key={index} onClick={() => handleSelect(item)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md">
                            <p>{item.name}</p>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
