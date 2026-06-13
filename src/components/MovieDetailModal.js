import React, { useEffect, useState } from "react";
import {
  IMG,
  getMovieDetails,
  getTrailer,
  getWatchProviders,
  BOOKMYSHOW_SEARCH,
} from "../services/tmdb";
import "../styles/MovieDetailModal.css";

const PROVIDER_LOGO = (path) => `https://image.tmdb.org/t/p/w92${path}`;

const MovieDetailModal = ({ movieId, onClose, isFavorite, onToggleFavorite }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    getMovieDetails(movieId)
      .then((res) => !cancelled && setData(res))
      .catch(() => !cancelled && setError("Couldn't load movie details."))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [movieId]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const trailer = data ? getTrailer(data.videos) : null;
  const providers = data ? getWatchProviders(data["watch/providers"]) : null;

  // Release-date logic
  let releaseInfo = null;
  if (data?.release_date) {
    const releaseDate = new Date(data.release_date);
    const now = new Date();
    const daysUntil = Math.ceil((releaseDate - now) / (1000 * 60 * 60 * 24));

    if (daysUntil > 7) {
      releaseInfo = {
        type: "upcoming",
        text: `📅 Releases on ${releaseDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`,
      };
    } else if (daysUntil > 0 && daysUntil <= 7) {
      releaseInfo = { type: "soon" };
    }
    // else: already released → show streaming providers
  }

  const cast = data?.credits?.cast?.slice(0, 6) || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {loading && <div className="spinner" style={{ margin: "80px auto" }} />}
        {error && <div className="status-message">{error}</div>}

        {data && !loading && (
          <>
            <div className="modal-header">
              <img
                className="modal-poster"
                src={IMG(data.poster_path, "w300")}
                alt={data.title}
              />
              <div className="modal-header-info">
                <h2>{data.title}</h2>
                <p className="modal-meta">
                  {data.release_date?.slice(0, 4) || "TBA"}
                  {data.runtime ? ` · ${data.runtime} min` : ""}
                  {data.vote_average ? ` · ⭐ ${data.vote_average.toFixed(1)}` : ""}
                </p>
                <div className="genre-tags">
                  {data.genres?.map((g) => (
                    <span className="genre-tag" key={g.id}>{g.name}</span>
                  ))}
                </div>
                <p className="modal-overview">{data.overview || "No overview available."}</p>
                <button
                  className={`favorite-btn modal-fav-btn ${isFavorite ? "is-favorite" : ""}`}
                  onClick={() => onToggleFavorite(data)}
                >
                  {isFavorite ? "🗑 Remove from Favorites" : "💖 Add to Favorites"}
                </button>
              </div>
            </div>

            {/* Trailer */}
            {trailer && (
              <div className="modal-section">
                <h3>🎬 Trailer</h3>
                <div className="trailer-wrap">
                  <iframe
                    src={trailer}
                    title="Trailer"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Cast */}
            {cast.length > 0 && (
              <div className="modal-section">
                <h3>🎭 Top Cast</h3>
                <div className="cast-row">
                  {cast.map((c) => (
                    <div className="cast-item" key={c.id}>
                      <img
                        src={IMG(c.profile_path, "w185")}
                        alt={c.name}
                        className="cast-photo"
                      />
                      <p className="cast-name">{c.name}</p>
                      <p className="cast-character">{c.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Where to watch / release info */}
            <div className="modal-section">
              <h3>📽️ How to Watch</h3>

              {releaseInfo?.type === "upcoming" && (
                <p className="watch-info">{releaseInfo.text}</p>
              )}

              {releaseInfo?.type === "soon" && (
                <a
                  className="bookmyshow-btn"
                  href={BOOKMYSHOW_SEARCH(data.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🎟️ Book Tickets on BookMyShow
                </a>
              )}

              {!releaseInfo && (
                <>
                  {providers?.flatrate?.length > 0 && (
                    <>
                      <p className="watch-label">Streaming on:</p>
                      <div className="provider-row">
                        {providers.flatrate.map((p) => (
                          <a
                            key={p.provider_id}
                            href={providers.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={p.provider_name}
                          >
                            <img src={PROVIDER_LOGO(p.logo_path)} alt={p.provider_name} />
                          </a>
                        ))}
                      </div>
                    </>
                  )}

                  {providers?.rent?.length > 0 && (
                    <>
                      <p className="watch-label">Rent on:</p>
                      <div className="provider-row">
                        {providers.rent.map((p) => (
                          <a
                            key={p.provider_id}
                            href={providers.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={p.provider_name}
                          >
                            <img src={PROVIDER_LOGO(p.logo_path)} alt={p.provider_name} />
                          </a>
                        ))}
                      </div>
                    </>
                  )}

                  {!providers && (
                    <p className="watch-info">
                      No streaming info available.{" "}
                      <a
                        href={BOOKMYSHOW_SEARCH(data.title)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Search on BookMyShow
                      </a>
                    </p>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieDetailModal;
