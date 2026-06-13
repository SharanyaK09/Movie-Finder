import React, { useState, useEffect } from "react";
import MovieCard, { MovieCardSkeleton } from "../components/MovieCard";
import MovieDetailModal from "../components/MovieDetailModal";
import { getUpcoming } from "../services/tmdb";

const UpcomingPage = ({ toggleFavorite, isFavorite }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  useEffect(() => {
    setLoading(true);
    getUpcoming(1)
      .then((data) => {
        // Only future releases, sorted by date
        const now = new Date();
        const upcoming = (data.results || [])
          .filter((m) => m.release_date && new Date(m.release_date) >= now)
          .sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
        setMovies(upcoming);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <h1>Upcoming Releases</h1>
        <p>Movies hitting theaters and streaming soon — book ahead on BookMyShow.</p>
      </section>

      <div className="movies-container">
        {loading && Array.from({ length: 8 }).map((_, i) => <MovieCardSkeleton key={`s${i}`} />)}

        {!loading && movies.length === 0 && (
          <div className="status-message">
            <span className="status-emoji">🎬</span>
            No upcoming releases found right now.
          </div>
        )}

        {!loading && movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            handleFavoriteClick={toggleFavorite}
            isFavorite={isFavorite(movie.id)}
            onClick={(m) => setSelectedMovieId(m.id)}
          />
        ))}
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

export default UpcomingPage;
