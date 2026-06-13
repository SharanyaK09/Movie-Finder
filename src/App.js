import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FavoritesPage from "./pages/FavoritesPage";
import UpcomingPage from "./pages/UpcomingPage";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import "./styles/App.css";

const App = () => {
  // Dark/Light mode (persisted)
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored ? JSON.parse(stored) : true;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Favorites (persisted)
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Toast state
  const [toast, setToast] = useState({ show: false, message: "" });
  const showToast = (message) => setToast({ show: true, message });
  const hideToast = useCallback(() => setToast((t) => ({ ...t, show: false })), []);

  const isFavorite = useCallback(
    (id) => favorites.some((fav) => fav.id === id),
    [favorites]
  );

  const toggleFavorite = (movie) => {
    if (isFavorite(movie.id)) {
      setFavorites((prev) => prev.filter((fav) => fav.id !== movie.id));
      showToast(`Removed "${movie.title}" from favorites`);
    } else {
      setFavorites((prev) => [...prev, movie]);
      showToast(`Added "${movie.title}" to favorites`);
    }
  };

  return (
    <div className={darkMode ? "dark-mode app-container" : "light-mode app-container"}>
      <Navbar />

      <div className="theme-toggle-wrap">
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <main className="app-content">
        <Routes>
          <Route
            path="/"
            element={
              <Home favorites={favorites} toggleFavorite={toggleFavorite} isFavorite={isFavorite} />
            }
          />
          <Route
            path="/upcoming"
            element={
              <UpcomingPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />
            }
          />
          <Route
            path="/favorites"
            element={
              <FavoritesPage favorites={favorites} toggleFavorite={toggleFavorite} isFavorite={isFavorite} />
            }
          />
        </Routes>
      </main>

      <footer className="app-footer">
        Built with <span>MovieFinder</span> — powered by TMDB
      </footer>

      <Toast message={toast.message} show={toast.show} onDone={hideToast} />
    </div>
  );
};

export default App;
