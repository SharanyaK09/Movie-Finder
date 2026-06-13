import React, { useState } from "react";
import MovieCard from "../components/MovieCard";
import MovieDetailModal from "../components/MovieDetailModal";

const FavoritesPage = ({ favorites, toggleFavorite, isFavorite }) => {
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  return (
    <>
      <section className="hero">
        <h1>Your Favorites</h1>
        <p>All the movies you've saved, in one place.</p>
      </section>

      <div className="movies-container">
        {favorites.length > 0 ? (
          favorites.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              handleFavoriteClick={toggleFavorite}
              isFavorite={true}
              onClick={(m) => setSelectedMovieId(m.id)}
            />
          ))
        ) : (
          <div className="status-message">
            <span className="status-emoji">💔</span>
            No favorites yet — go find some movies you love!
          </div>
        )}
      </div>

      {selectedMovieId && (
        <MovieDetailModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
          isFavorite={isFavorite(selectedMovieId)}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </>
  );
};

export default FavoritesPage;
