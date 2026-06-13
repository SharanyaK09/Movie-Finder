import React, { useEffect, useState } from "react";
import { getGenres } from "../services/tmdb";
import "../styles/GenreFilter.css";

const GenreFilter = ({ selectedGenre, onSelect }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    getGenres().then((data) => setGenres(data.genres || [])).catch(() => {});
  }, []);

  return (
    <div className="genre-filter">
      <button
        className={`genre-chip ${!selectedGenre ? "active" : ""}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {genres.map((g) => (
        <button
          key={g.id}
          className={`genre-chip ${selectedGenre === g.id ? "active" : ""}`}
          onClick={() => onSelect(g.id)}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;
