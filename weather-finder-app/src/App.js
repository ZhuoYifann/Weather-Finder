import { useState } from "react";
import "./index.css";

// put your OpenWeather API key here
const API_KEY = "4467dedbc677406c311fed9125b6e53d";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function getWeather() {
    // don't fetch if input is empty
    if (city.trim() === "") return;

    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);

      // city not found
      if (response.status === 404) {
        setError("City not found.");
        return;
      }

      if (!response.ok) {
        throw new Error("Something went wrong.");
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // run search when user presses Enter
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      getWeather();
    }
  }

  return (
    <div className="container">
      <h1 className="title">Weather Search</h1>

      <div className="search-box">
        <input
          className="input"
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn" onClick={getWeather}>
          Search
        </button>
      </div>

      {/* show loading text */}
      {loading && <p className="status">Loading...</p>}

      {/* show error if any */}
      {error && <p className="status error">{error}</p>}

      {/* show weather result */}
      {weather && (
        <div className="card">
          <h2 className="city-name">{weather.name}</h2>
          <p className="temp">{Math.round(weather.main.temp)}°C</p>
          <p className="condition">{weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default App;