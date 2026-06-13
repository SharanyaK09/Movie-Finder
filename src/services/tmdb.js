const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";

export const IMG = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "https://via.placeholder.com/500x750?text=No+Image";

const get = async (endpoint, params = {}) => {
  const url = new URL(BASE + endpoint);
  url.searchParams.set("api_key", API_KEY);
  Object.entries(params).forEach(([k, v]) => v !== undefined && url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("TMDB request failed");
  return res.json();
};

// Search movies by title (paginated)
export const searchMovies = (query, page = 1) =>
  get("/search/movie", { query, page, include_adult: false });

// Popular movies (used as default home feed)
export const getPopular = (page = 1) => get("/movie/popular", { page });

// Trending this week
export const getTrending = (page = 1) => get("/trending/movie/week", { page });

// Upcoming releases
export const getUpcoming = (page = 1) => get("/movie/upcoming", { page, region: "IN" });

// Genre list
export const getGenres = () => get("/genre/movie/list");

// Discover by genre
export const discoverByGenre = (genreId, page = 1) =>
  get("/discover/movie", { with_genres: genreId, page, sort_by: "popularity.desc" });

// Full details: details + credits + videos + watch providers in one go
export const getMovieDetails = async (id) => {
  const data = await get(`/movie/${id}`, {
    append_to_response: "credits,videos,watch/providers,release_dates",
  });
  return data;
};

// Helper: find the best YouTube trailer
export const getTrailer = (videos) => {
  if (!videos?.results?.length) return null;
  const trailer =
    videos.results.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
    videos.results.find((v) => v.site === "YouTube");
  return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
};

// Helper: get watch providers for India (fallback to US, then any)
export const getWatchProviders = (providers) => {
  const results = providers?.results;
  if (!results) return null;
  return results.IN || results.US || Object.values(results)[0] || null;
};

export const BOOKMYSHOW_SEARCH = (title) =>
  `https://in.bookmyshow.com/explore/movies-bengaluru?q=${encodeURIComponent(title)}`;
