import React from "react";
import { IMG } from "../services/tmdb";
import "../styles/MovieCard.css";

export const MovieCardSkeleton = () => (
  <div className="movie-card skeleton-card">
    <div className="poster-wrap skeleton-block" />
    <div className="movie-info">
      <div className="skeleton-line" style={{ width: "90%" }} />
      <div className="skeleton-line" style={{ width: "40%" }} />
      <div className="skeleton-line skeleton-btn" />
    </div>
  </div>
);

const MovieCard = ({ movie, handleFavoriteClick, isFavorite, onClick }) => {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";

  return (
    <div className="movie-card" onClick={() => onClick && onClick(movie)}>
      <div className="poster-wrap">
        <img
          src={IMG(movie.poster_path)}
          alt={movie.title}
          className="movie-poster"
          loading="lazy"
        />
        {movie.vote_average > 0 && (
          <span className="rating-badge">⭐ {movie.vote_average.toFixed(1)}</span>
        )}
      </div>
      <div className="movie-info">
        <h3 className="title">{movie.title}</h3>
        <p className="year">{year}</p>
        <button
          className={`favorite-btn ${isFavorite ? "is-favorite" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            handleFavoriteClick(movie);
          }}
        >
          {isFavorite ? "🗑 Remove" : "💖 Favorite"}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
