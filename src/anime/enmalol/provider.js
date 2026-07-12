// Enma.lol Seanime Provider
// Language: JavaScript

const BASE_URL = "https://enma.lol";

/**
 * Search for anime by title
 * @param {string} query
 * @returns {Promise<Array>}
 */
async function search(query) {
    const res = await fetch(`${BASE_URL}/search?keyword=${encodeURIComponent(query)}`);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    const results = [];
    doc.querySelectorAll(".anime-card").forEach(card => {
        results.push({
            id: card.querySelector("a")?.getAttribute("href") || "",
            title: card.querySelector(".anime-title")?.textContent.trim() || "",
            image: card.querySelector("img")?.src || "",
            url: BASE_URL + (card.querySelector("a")?.getAttribute("href") || "")
        });
    });
    return results;
}

/**
 * Get anime details and episodes
 * @param {string} animeId
 * @returns {Promise<Object>}
 */
async function getAnimeInfo(animeId) {
    const res = await fetch(`${BASE_URL}${animeId}`);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    const title = doc.querySelector("h1")?.textContent.trim() || "";
    const description = doc.querySelector(".anime-description")?.textContent.trim() || "";
    const episodes = [];

    doc.querySelectorAll(".episode-item a").forEach(ep => {
        episodes.push({
            id: ep.getAttribute("href"),
            title: ep.textContent.trim(),
            url: BASE_URL + ep.getAttribute("href")
        });
    });

    return { id: animeId, title, description, episodes };
}

/**
 * Get streaming sources for an episode
 * @param {string} episodeId
 * @returns {Promise<Array>}
 */
async function getEpisodeSources(episodeId) {
    const res = await fetch(`${BASE_URL}${episodeId}`);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    const video = doc.querySelector("video source");
    if (video) {
        return [{ url: video.src, quality: "default" }];
    }
    return [];
}

// Export provider API
module.exports = {
    id: "enmalol",
    name: "Enma.lol Anime Library",
    search,
    getAnimeInfo,
    getEpisodeSources
};
