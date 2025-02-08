import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import Navbar from "./Navbar";

function App() {
  const [title, setTitle] = useState("");
  const [movies, setMovies] = useState([]);
  const [randomMovie, setRandomMovie] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(10); // Number of movies per page

  const searchMovies = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/movies?title=${title}`
      );
      setMovies(res.data);
      setCurrentPage(1); // Reset to the first page on new search
      setRandomMovie(""); // Clear random movie results
    } catch (err) {
      console.error(err.message);
    }
  };

  const searchRandomMovie = async () => {
    try {
      const res = await axios.get("http://localhost:3000/random");
      setRandomMovie(res.data);
      setMovies([]); // Clear search results
      setTitle(""); // Clear search input
    } catch (err) {
      console.error(err.message);
    }
  };

  // Calculate the indices for the current page
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  // Calculate total pages
  const totalPages = Math.ceil(movies.length / moviesPerPage);

  // Change page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Determine the page numbers to display
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = () => {
    const maxPageNumbersToShow = 5;
    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxPageNumbersToShow / 2)
    );
    const endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

    const pageButtons = [];
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <li>
          <a
            key={i}
            onClick={() => paginate(i)}
            // className={currentPage === i ? "active" : ""}
            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            {i}
          </a>
        </li>
      );
    }

    if (endPage < totalPages) {
      pageButtons.push(
        <span className="ml-2" key="dots">
          ...
        </span>
      );
      pageButtons.push(
        <button
          key={totalPages}
          onClick={() => paginate(totalPages)}
          className={`mr-2 {currentPage === totalPages ? "active" : ""}`}
        >
          {totalPages}
        </button>
      );
    }

    return pageButtons;
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchMovies();
    }
  };

  return (
    <>
      <Navbar searchRandomMovie={searchRandomMovie} />

      {/* search bar */}
      <div className="search-bar inline-flex mt-10">
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            placeholder="Search..."
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            value={title}
            type="search"
            id="default-search"
            className="block w-80 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
          <button
            onClick={searchMovies}
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </div>

      {/* search results-random movie */}

      <div className="results">
        {randomMovie && (
          <div
            className="result p-3 block w-80 p-4 text-sm text-gray-900 border 
            border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 
            focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 
            dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <div className="text">
              <p>{randomMovie.name}</p>
            </div>
            <div className="links">
              <a
                href={randomMovie.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                <button className="text-white mx-8  end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  link
                </button>
              </a>

              <a
                href={randomMovie.link.slice(0, -4) + ".mkv"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
                  alternative link
                </button>
              </a>
            </div>
          </div>
        )}

        {/* search results */}
        {currentMovies.map((movie) => (
          <div
            className={`result ${currentMovies.indexOf(
              movie
            )} p-3 block w-80 p-4 text-sm text-gray-900 border 
            border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 
            focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 
            dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
            key={currentMovies.indexOf(movie)}
          >
            {console.log(currentMovies.indexOf(movie))}
            <div className="text">
              {" "}
              <p>{movie.name}</p>{" "}
            </div>
            <div className="links">
              <a href={movie.link} target="_blank" rel="noopener noreferrer">
                <button className="text-white mr-4 end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  link
                </button>
              </a>
              <a
                href={movie.link.slice(0, -4) + ".mkv"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
                  alternative link
                </button>
              </a>
            </div>
          </div>
        ))}
      </div>
      {/* Conditionally render pagination controls */}
      {movies.length > 0 && (
        <nav aria-label="Page navigation example" className="pagination">
          <ul className="flex items-center -space-x-px h-8 text-sm">
            <li>
              <a
                onClick={prevPage}
                disabled={currentPage === 1}
                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="w-2.5 h-2.5 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 1 1 5l4 4"
                  />
                </svg>
              </a>
            </li>

            {renderPageNumbers()}
            <li>
              <a
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Next</span>
                <svg
                  className="w-2.5 h-2.5 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}

export default App;
