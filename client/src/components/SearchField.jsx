import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const baseUrl = import.meta.env.VITE_API_URL;

const SearchField = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const searchContainerRef = useRef(null); // Ref for detecting outside clicks

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }
    
    const delaySearch = setTimeout(async () => {
      setIsLoading(true);
      try {
        
        const response = await fetch(`https://emma-burgers-twze.onrender.com/api/product/products/search?query=${searchTerm}`);
        const data = await response.json();
        setSearchResults(data.products || []);
      } catch (error) {
        toast.error("No result found");
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 2000);

    return () => clearTimeout(delaySearch);
  }, [searchTerm, baseUrl]);

  // Handle clicks outside of search dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSearchResults([]); // Close dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <form className="w-full wrapper" onSubmit={(e) => e.preventDefault()} ref={searchContainerRef}>
        <input
          type="text"
          placeholder="Search"
          className="w-full h-[56px] rounded-[32px] bg-[#F0F0F0] outline-none placeholder:text-[#100101] px-8 border font-medium text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isLoading && <p className='text-white px-8'>Searching...</p>}
        
        {/* Search suggestions dropdown */}
        {searchResult.length > 0 && (
          <div className='relative'>
            <ul className='absolute w-full bg-[#100101] text-white shadow-lg rounded-md mt-1 z-10 max-h-[300px] overflow-y-auto'>
              {searchResult.map((item) => (
                <li key={item._id} 
                    className='p-3 border-b cursor-pointer flex items-center gap-4'
                    onClick={() => navigate(`/product/${item._id}`)}>
                  <img src={item.image} alt={item.title} className='object-cover rounded-md w-12 h-12'/>
                  <div>
                    <p className='font-medium'>{item.title}</p>
                    <p className='text-sm'>&#8358; {item.price}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </>
  );
};

export default SearchField;
