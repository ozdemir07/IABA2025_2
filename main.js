let groups = {};
let index = 0;
let interval;
let timer = null;
let isPlaying = true; // slideshow starts running

const grid = document.getElementById("image-grid");
const glitch = document.getElementById("glitch-overlay");

// sliders & controls
const freqSlider = document.getElementById("freq-slider");
const freqValue = document.getElementById("freq-value");
const glitchSlider = document.getElementById("glitch-slider");
const glitchValue = document.getElementById("glitch-value");
const playPauseBtn = document.getElementById("play-pause");

// Load manifest.json
fetch("data/manifest.json")
  .then(res => res.json())
  .then(data => {
    groups = data;
    renderGrid();
    showPanel();

    // initialize frequency from slider
    const hz = parseInt(freqSlider.value, 10);
    interval = 1000 / hz;
    freqValue.textContent = hz + " Hz";

    startSlideshow();
  })
  .catch(err => console.error("Error loading manifest.json:", err));

// Start slideshow
function startSlideshow() {
  if (timer) clearInterval(timer);
  if (isPlaying) {
    timer = setInterval(() => {
      index++;
      updateImages();
    }, interval);
    playPauseBtn.textContent = "⏸ Pause";
  }
}

// Stop slideshow
function stopSlideshow() {
  clearInterval(timer);
  timer = null;
  playPauseBtn.textContent = "▶ Play";
}

// Render layout dynamically
function renderGrid() {
  const selected = [...document.querySelectorAll(".group-toggle:checked")]
    .map(cb => cb.value);

  grid.innerHTML = "";

  if (selected.length === 1) {
    grid.style.gridTemplateColumns = "1fr";
    grid.style.gridTemplateRows = "1fr";
  } else if (selected.length === 2) {
    grid.style.gridTemplateColumns = "1fr 1fr";
    grid.style.gridTemplateRows = "1fr";
  } else if (selected.length === 3) {
    grid.style.gridTemplateColumns = "1fr 1fr 1fr";
    grid.style.gridTemplateRows = "1fr";
  } else if (selected.length === 4) {
    grid.style.gridTemplateColumns = "1fr 1fr";
    grid.style.gridTemplateRows = "1fr 1fr";   // ensures 2x2
  }

  selected.forEach(group => {
    const cell = document.createElement("div");
    cell.className = "cell";

    const img = document.createElement("img");
    img.dataset.group = group;

    cell.appendChild(img);
    grid.appendChild(cell);
  });

  updateImages();
}

// Update images with looping index
function updateImages() {
  document.querySelectorAll("#image-grid img").forEach(img => {
    const group = img.dataset.group;
    const arr = groups[group];
    if (arr && arr.length > 0) {
      img.src = arr[index % arr.length];
    }
  });
}

// Checkbox listeners
document.querySelectorAll(".group-toggle").forEach(cb =>
  cb.addEventListener("change", renderGrid)
);

// Glitch toggle
document.getElementById("toggle-glitch").addEventListener("change", e => {
  glitch.style.display = e.target.checked ? "block" : "none";
});

// Frequency slider
freqSlider.addEventListener("input", () => {
  const hz = parseInt(freqSlider.value, 10);
  interval = 1000 / hz; // convert Hz to ms
  freqValue.textContent = hz + " Hz";
  if (isPlaying) startSlideshow();
});

// Glitch intensity slider
glitchSlider.addEventListener("input", () => {
  const intensity = glitchSlider.value;
  glitch.style.opacity = intensity;
  glitchValue.textContent = intensity;
});

// Play/Pause button
playPauseBtn.addEventListener("click", () => {
  if (isPlaying) {
    stopSlideshow();
    isPlaying = false;
  } else {
    isPlaying = true;
    startSlideshow();
  }
});

// Auto-hide control panel
const panel = document.getElementById("control-panel");
let hideTimeout;

function showPanel() {
  panel.classList.add("visible");
  clearTimeout(hideTimeout);
  hideTimeout = setTimeout(() => {
    panel.classList.remove("visible");
  }, 3000);
}
document.addEventListener("mousemove", showPanel);
