import Chart from "chart.js/auto";

// Create a scatter chart for danceability
export function createScatterChart(data) {
  const ctx = document
    .getElementById("danceabilityScatterChart")
    .getContext("2d");

  // Destroy the old chart if it exists
  if (window.myScatterChart) {
    window.myScatterChart.destroy();
  }

  window.myScatterChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Danceability",
          data: data.map((song) => ({ x: song.id, y: song.danceability })),
          backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          title: {
            display: true,
            text: "Song ID",
          },
        },
        y: {
          min: 0,
          max: 1,
          title: {
            display: true,
            text: "Danceability",
          },
        },
      },
    },
  });
}

// Create a histogram for song duration
export function createHistogramChart(data) {
  const durations = data.map((song) => song.duration_ms / 1000); // Convert to seconds
  const ctx = document.getElementById("durationHistogram").getContext("2d");

  // Destroy the old chart if it exists
  if (window.myHistogramChart) {
    window.myHistogramChart.destroy();
  }

  window.myHistogramChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["0-2 min", "2-4 min", "4-6 min", "6-8 min", "8+ min"],
      datasets: [
        {
          label: "Duration (seconds)",
          data: [
            durations.filter((d) => d < 120).length,
            durations.filter((d) => d >= 120 && d < 240).length,
            durations.filter((d) => d >= 240 && d < 360).length,
            durations.filter((d) => d >= 360 && d < 480).length,
            durations.filter((d) => d >= 480).length,
          ],
          backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
      ],
    },
  });
}

// Create bar charts for acoustics and tempo
export function createBarCharts(data) {
  const ctxAcoustic = document
    .getElementById("acousticsBarChart")
    .getContext("2d");
  const ctxTempo = document.getElementById("tempoBarChart").getContext("2d");

  const acousticData = data.map((song) => song.acousticness);
  const tempoData = data.map((song) => song.tempo);

  // Destroy old charts if they exist
  if (window.myAcousticBarChart) {
    window.myAcousticBarChart.destroy();
  }
  if (window.myTempoBarChart) {
    window.myTempoBarChart.destroy();
  }

  window.myAcousticBarChart = new Chart(ctxAcoustic, {
    type: "bar",
    data: {
      labels: data.map((song) => song.title),
      datasets: [
        {
          label: "Acousticness",
          data: acousticData,
          backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
      ],
    },
  });

  window.myTempoBarChart = new Chart(ctxTempo, {
    type: "bar",
    data: {
      labels: data.map((song) => song.title),
      datasets: [
        {
          label: "Tempo",
          data: tempoData,
          backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
      ],
    },
  });
}
