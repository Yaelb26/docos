import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";



function App() {
  const [title, setTitle] = useState('');
  const [movies, setMovies] = useState([]);

  const searchMovies = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/movies?title=${title}`);
      setMovies(res.data);
    } catch (err) {
      console.error(err.message);
      console.log(movies);
    }
  };


  return (
    <>
      <div>
      <h1>Movie Search</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Search for a movie..."
      />
      <button onClick={searchMovies}>Search</button>
     
        {movies.map((movie) => (
          <><div key={movie.id}>
            <p>{movie.name}</p>
            <a href={movie.link} target="_blank" rel="noopener noreferrer">
                 
            link
            </a>
          </div>
          
          
          </>
          // {/* <p key={movie.id}>
          //     <a href={movie.link} target="_blank" rel="noopener noreferrer">
          //       {movie.name}
          //     </a>
          //   </p></> */}
        ))}
    
    </div>
    </>
  );
  
}

export default App;