import React, { useState, useEffect, useRef, useCallback } from "react";
import SearchBar from "../components/SearchBar";
import GenreFilter from "../components/GenreFilter";
import MovieCard, { MovieCardSkeleton } from "../components/MovieCard";
import MovieDetailModal from "../components/MovieDetailModal";
import { searchMovies, getPopular, discoverByGenre } from "../services/tmdb";

const RECENT_KEY = "recentSearches";

const Home = ({ favorites, toggleFavorite, isFavorite }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [genre, setGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [recent, setRecent] = useState(() => {
    const stored = localStorage.getItem(RECENT_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const sentinelRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 450);
    return () => clearTimeout(t);
  }, [query]);

  // Save recent searches
  useEffect(() => {
    if (debouncedQuery) {
      setRecent((prev) => {
        const next = [debouncedQuery, ...prev.filter((q) => q !== debouncedQuery)].slice(0, 6);
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
        return next;
      });
    }
  }, [debouncedQuery]);

  // Fetch function
  const fetchPage = useCallback(async (pageNum, reset) => {
    setLoading(true);
    setError("");
    try {
      let data;
      if (debouncedQuery) {
        data = await searchMovies(debouncedQuery, pageNum);
      } else if (genre) {
        data = await discoverByGenre(genre, pageNum);
      } else {
        data = await getPopular(pageNum);
      }
      const results = data.results || [];
      setTotalPages(data.total_pages || 1);
      setMovies((prev) => (reset ? results : [...prev, ...results]));
      if (reset && results.length === 0 && debouncedQuery) {
        setError(`No results found for "${debouncedQuery}"`);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, genre]);

  // Reset + fetch when query or genre changes
  useEffect(() => {
    setPage(1);
    setMovies([]);
    fetchPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, genre]);

  // Infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < totalPages) {
          const next = page + 1;
          setPage(next);
          fetchPage(next, false);
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [page, totalPages, loading, fetchPage]);

  return (
    <>
      <section className="hero">
        <h1>Find your next favorite movie</h1>
        <p>Search thousands of titles, explore details, and build your watchlist.</p>
      </section>

      <SearchBar value={query} onChange={setQuery} onClear={() => setQuery("")} />

      {!query && (
        <GenreFilter selectedGenre={genre} onSelect={setGenre} />
      )}

      {!query && !genre && recent.length > 0 && (
        <div className="recent-searches">
          <span>Recent:</span>
          {recent.map((r) => (
            <button key={r} onClick={() => setQuery(r)} className="recent-chip">
              {r}
            </button>
          ))}
        </div>
      )}

      <div className="movies-container">
        {error && !loading && (
          <div className="status-message">
            <span className="status-emoji">😕</span>
            {error}
          </div>
        )}

        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            handleFavoriteClick={toggleFavorite}
            isFavorite={isFavorite(movie.id)}
            onClick={(m) => setSelectedMovieId(m.id)}
          />
        ))}

        {loading && Array.from({ length: 8 }).map((_, i) => <MovieCardSkeleton key={`s${i}`} />)}
      </div>

      <div ref={sentinelRef} style={{ height: 1 }} />

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

export default Home;
