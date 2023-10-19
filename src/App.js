import React, { useEffect, useState } from "react";
import { URL, PAGE_SIZE, ASC, DESC } from "./constants";
import "./App.css";
import StarRating from "./components/StarRating";
import {
  createBarCharts,
  createHistogramChart,
  createScatterChart,
} from "./utility/Chart";

function App() {
  const [songs, setSongs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [foundSongs, setFoundSongs] = useState(null);

  useEffect(() => {
    // Make an API request to get all songs using the fetch API
    fetch(`${URL}/songs?page=${page}&&page_size=${PAGE_SIZE}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setSongs(data.songs);
        setTotalPages(data.total_pages);
      })
      .catch((error) => console.error(error));
  }, [page]);

  useEffect(() => {
    // Create scatter chart for danceability
    if (songs.length > 0) {
      createScatterChart(songs);
    }
    // Create histogram for song duration
    if (songs.length > 0) {
      createHistogramChart(songs);
    }
    // Create bar charts for acoustics and tempo
    if (songs.length > 0) {
      createBarCharts(songs);
    }
  }, [songs]);

  const toggleSortOrder = (ev) => {
    if (ev.target.id === sortColumn) {
      setSortOrder(sortOrder === ASC ? DESC : ASC);
    } else {
      setSortColumn(ev.target.id);
      setSortOrder(ASC);
    }
  };

  const sortData = (data, column, order) => {
    if (column && order) {
      return data.slice().sort((a, b) => {
        if (order === ASC) {
          return a[column] > b[column] ? 1 : -1;
        } else {
          return b[column] > a[column] ? 1 : -1;
        }
      });
    }
    return data;
  };

  const downloadAsCSV = () => {
    // Create a CSV content string with column names
    const columnNames = Object.keys(songs[0]);
    const dataString = [
      columnNames.join(","),
      ...songs.map((song) =>
        columnNames.map((column) => song[column]).join(",")
      ),
    ].join("\n");

    // Create a CSV blob
    const blob = new Blob([dataString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    // Create a download link
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "songs.csv");

    // Simulate a click on the download link
    link.click();
  };

  const searchForSong = () => {
    if (searchTitle.trim() === "") {
      return;
    }

    fetch(`${URL}/songs/${searchTitle}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setFoundSongs(data))
      .catch((error) => {
        console.error(error);
        setFoundSongs(null);
      });
  };

  const rateSong = (songId, rating) => {
    // Make an API request to update the song's rating
    const data = { star_rating: rating };
    fetch(`${URL}/songs/${songId}/rate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        // Update the rating for the song in the frontend
        const updatedSongs = songs.map((song) =>
          song.id === songId ? { ...song, star_rating: rating } : song
        );
        setSongs(updatedSongs);
      })
      .catch((error) => console.error(error));
  };

  const getTotalPages = () => {
    let result = [];
    for (let i = 1; i <= totalPages; i++) {
      result.push(i);
    }
    return result;
  };

  // Render the table with data
  return (
    <div className="'song-dashboard">
      <h1>Song Dashboard</h1>
      <div className="charts-container">
        <canvas
          id="danceabilityScatterChart"
          className="chart"
          style={{ maxWidth: "50%", maxHeight: 200, marginBottom: "20px" }}
        ></canvas>
        <canvas
          id="durationHistogram"
          className="chart"
          style={{
            maxWidth: "50%",
            maxHeight: 200,
            marginBottom: "20px",
          }}
        ></canvas>
        <canvas
          id="acousticsBarChart"
          className="chart"
          style={{ maxWidth: "50%", maxHeight: 200, marginBottom: "20px" }}
        ></canvas>
        <canvas
          id="tempoBarChart"
          className="chart"
          style={{
            maxWidth: "50%",
            maxHeight: 200,
            marginBottom: "20px",
          }}
        ></canvas>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter song title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <button onClick={searchForSong}>Get Song</button>
        <button className="download" onClick={downloadAsCSV}>
          Download CSV
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th id="id" onClick={toggleSortOrder}>
              ID{" "}
              {sortColumn === "id" && sortOrder === "asc"
                ? "▲"
                : sortColumn === "id" && sortOrder === "desc"
                ? "▼"
                : "↔"}
            </th>
            <th id="title" onClick={toggleSortOrder}>
              Title{" "}
              {sortColumn === "title" && sortOrder === "asc"
                ? "▲"
                : sortColumn === "title" && sortOrder === "desc"
                ? "▼"
                : "↔"}
            </th>
            <th id="dance_ability" onClick={toggleSortOrder}>
              Dance Ability{" "}
              {sortColumn === "dance_ability" && sortOrder === "asc"
                ? "▲"
                : sortColumn === "dance_ability" && sortOrder === "desc"
                ? "▼"
                : "↔"}
            </th>
            <th id="energy" onClick={toggleSortOrder}>
              Energy{" "}
              {sortColumn === "energy" && sortOrder === "asc"
                ? "▲"
                : sortColumn === "energy" && sortOrder === "desc"
                ? "▼"
                : "↔"}
            </th>
            <th id="acousticness" onClick={toggleSortOrder}>
              Acousticness{" "}
              {sortColumn === "acousticness" && sortOrder === "asc"
                ? "▲"
                : sortColumn === "acousticness" && sortOrder === "desc"
                ? "▼"
                : "↔"}
            </th>
            <th id="tempo" onClick={toggleSortOrder}>
              Tempo{" "}
              {sortColumn === "tempo" && sortOrder === "asc"
                ? "▲"
                : sortColumn === "tempo" && sortOrder === "desc"
                ? "▼"
                : "↔"}
            </th>
            <th id="duration_ms" onClick={toggleSortOrder}>
              Duration in Millisecond{" "}
              {sortColumn === "duration_ms" && sortOrder === "asc"
                ? "▲"
                : sortColumn === "duration_ms" && sortOrder === "desc"
                ? "▼"
                : "↔"}
            </th>
            <th id="num_sections" onClick={toggleSortOrder}>
              Num Sections{" "}
              {sortColumn === "num_sections" && sortOrder === "asc"
                ? "▲"
                : sortColumn === "num_sections" && sortOrder === "desc"
                ? "▼"
                : "↔"}
            </th>
            <th id="num_segments" onClick={toggleSortOrder}>
              Num Segments{" "}
              {sortColumn === "num_segments" && sortOrder === "asc"
                ? "▲"
                : sortColumn === "num_segments" && sortOrder === "desc"
                ? "▼"
                : "↔"}
            </th>
            <th id="star_rating" onClick={toggleSortOrder}>
              Star Rating{" "}
              {sortColumn === "star_rating" && sortOrder === "asc"
                ? "▲"
                : sortColumn === "star_rating" && sortOrder === "desc"
                ? "▼"
                : "↔"}
            </th>
          </tr>
        </thead>
        <tbody>
          {foundSongs
            ? foundSongs.map((foundSong) => (
                <tr key={foundSong.id}>
                  <td>{foundSong.id}</td>
                  <td>{foundSong.title}</td>
                  <td>{foundSong.dance_ability}</td>
                  <td>{foundSong.engery}</td>
                  <td>{foundSong.acousticness}</td>
                  <td>{foundSong.tempo}</td>
                  <td>{foundSong.duration_ms}</td>
                  <td>{foundSong.num_sections}</td>
                  <td>{foundSong.num_segments}</td>
                  <td>
                    <StarRating
                      rating={foundSong.star_rating}
                      onRate={(rating) => rateSong(foundSong.id, rating)}
                    />
                  </td>
                </tr>
              ))
            : sortData(songs, sortColumn, sortOrder).map((song) => (
                <tr key={song.id}>
                  <td>{song.id}</td>
                  <td>{song.title}</td>
                  <td>{song.dance_ability}</td>
                  <td>{song.engery}</td>
                  <td>{song.acousticness}</td>
                  <td>{song.tempo}</td>
                  <td>{song.duration_ms}</td>
                  <td>{song.num_sections}</td>
                  <td>{song.num_segments}</td>
                  <td>
                    <StarRating
                      rating={song.star_rating}
                      onRate={(rating) => rateSong(song.id, rating)}
                    />
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        {totalPages > 1 &&
          getTotalPages().map((each) => (
            <button
              className={`pagination-button ${page === each ? "active" : ""}`}
              onClick={() => setPage(each)}
            >
              {each}
            </button>
          ))}
        <button
          disabled={totalPages === page}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
