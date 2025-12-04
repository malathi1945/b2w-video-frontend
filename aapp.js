// frontend/app.js

const API_BASE_URL = "http://localhost:5000";

const searchForm = document.getElementById("searchForm");
const requirementInput = document.getElementById("requirementInput");
const serviceTypeSelect = document.getElementById("serviceTypeSelect");
const industryInput = document.getElementById("industryInput");
const resultsHeader = document.getElementById("resultsHeader");
const resultsContainer = document.getElementById("resultsContainer");

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const q = requirementInput.value.trim();
  const serviceType = serviceTypeSelect.value;
  const industry = industryInput.value.trim();

  resultsHeader.textContent = "Fetching recommendations...";
  resultsContainer.innerHTML = "";

  try {
    const params = new URLSearchParams();
    if (q) params.append("q", q);
    if (serviceType) params.append("serviceType", serviceType);
    if (industry) params.append("industry", industry);

    const res = await fetch(`${API_BASE_URL}/api/videos?${params.toString()}`);
    const data = await res.json();

    if (data.count === 0) {
      resultsHeader.textContent =
        "No exact matches found. Try simplifying your requirement or removing filters.";
      resultsContainer.innerHTML = "";
      return;
    }

    resultsHeader.textContent = `Showing ${data.count} recommendation${
      data.count > 1 ? "s" : ""
    } based on your requirement.`;

    renderCards(data.results);
  } catch (err) {
    console.error(err);
    resultsHeader.textContent =
      "Something went wrong while fetching recommendations.";
    resultsContainer.innerHTML = "";
  }
});

function renderCards(videos) {
  resultsContainer.innerHTML = videos
    .map(
      (v) => `
    <article class="card">
      <div class="card-thumb">
        <img src="${v.thumbnail}" alt="${v.title}" />
      </div>
      <div class="card-body">
        <div class="card-title">${v.title}</div>
        <div class="card-meta">
          <span class="badge">${v.serviceType}</span>
          <span class="badge">${v.industry}</span>
          <span class="badge">${v.goal}</span>
          <span class="badge">${v.duration}</span>
        </div>
        <p class="card-description">${v.description}</p>
        <div class="card-link">
          <a href="${v.url}" target="_blank" rel="noopener noreferrer">
            View sample on b2w.tv →
          </a>
        </div>
      </div>
    </article>
  `
    )
    .join("");
}
