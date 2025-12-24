// Get references to HTML elements
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const goToWatchlistBtn = document.getElementById('goToWatchlist');

// Event listener to navigate to WatchList page
goToWatchlistBtn.addEventListener('click', () => {
    window.location.href = 'watchList/watchlist.html';
});

const scrollDistance = 900;

// Function to handle horizontal scrolling
function setupScroll(containerClass, previousButtonClass, nextButtonClass) {
    const previousButtons = document.querySelectorAll(`.${previousButtonClass}`);
    const nextButtons = document.querySelectorAll(`.${nextButtonClass}`);
    const containers = document.querySelectorAll(`.${containerClass}`);

    containers.forEach((container, index) => {
        const previousButton = previousButtons[index];
        const nextButton = nextButtons[index];
        nextButton.addEventListener('click', () => {
            container.scrollBy({ left: scrollDistance, behavior: 'smooth' });
        });
        previousButton.addEventListener('click', () => {
            container.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
        });
    });
}

// Setup scroll for each section
const sections = [
    ['trending-container', 'trending-previous', 'trending-next'],
    ['netflix-container', 'netflix-previous', 'netflix-next'],
    ['netflixShows-container', 'netflixShows-previous', 'netflixShows-next'],
    ['top-container', 'top-previous', 'top-next'],
    ['horror-container', 'horror-previous', 'horror-next'],
    ['comedy-container', 'comedy-previous', 'comedy-next'],
    ['action-container', 'action-previous', 'action-next'],
    ['romantic-container', 'romantic-previous', 'romantic-next']
];

sections.forEach(([container, prev, next]) => setupScroll(container, prev, next));

// TMDB API key
const api_Key = '4626200399b08f9d04b72348e3625f15';

// Local cache object
const cache = {};

// Render function with lazy image loading and efficient DOM update
function renderMedia(containerClass, data, mediaType) {
    const containers = document.querySelectorAll(`.${containerClass}`);
    containers.forEach((container) => {
        const fragment = document.createDocumentFragment();
        data.results.forEach(item => {
            const imageUrl = containerClass === 'netflix-container' ? item.poster_path : item.backdrop_path;
            if (!imageUrl) return;

            const itemElement = document.createElement('div');
            itemElement.classList.add('movie-item');
            itemElement.innerHTML = `
                <img loading="lazy" src="https://image.tmdb.org/t/p/w500${imageUrl}" alt="${item.title || item.name || 'media'}">
            `;
            itemElement.addEventListener('click', () => {
                const media_Type = item.media_type || mediaType;
                window.location.href = `movie_details/movie_details.html?media=${media_Type}&id=${item.id}`;
            });

            fragment.appendChild(itemElement);
        });

        container.innerHTML = '';
        container.appendChild(fragment);
    });
}

// Fetch and display media with caching
function fetchMedia(containerClass, endpoint, mediaType) {
    if (cache[endpoint]) {
        renderMedia(containerClass, cache[endpoint], mediaType);
        return;
    }

    fetch(`https://api.themoviedb.org/3/${endpoint}&api_key=${api_Key}`)
        .then(response => response.json())
        .then(data => {
            cache[endpoint] = data;
            renderMedia(containerClass, data, mediaType);
        })
        .catch(error => {
            console.error(error);
            const containers = document.querySelectorAll(`.${containerClass}`);
            containers.forEach(container => {
                container.innerHTML = '<p class="error-message">Failed to load data. Please try again later.</p>';
            });
        });
}

// Fetch data (you can delay some if needed for performance)
fetchMedia('trending-container', 'trending/all/week?', 'movie');
fetchMedia('netflix-container', 'discover/tv?with_networks=213', 'tv');
fetchMedia('netflixShows-container', 'discover/tv?', 'tv');
fetchMedia('top-container', 'movie/top_rated?', 'movie');

// Delay these non-critical sections (optional tweak)
setTimeout(() => fetchMedia('horror-container', 'discover/movie?with_genres=27', 'movie'), 1000);
setTimeout(() => fetchMedia('comedy-container', 'discover/movie?with_genres=35', 'movie'), 1200);
setTimeout(() => fetchMedia('action-container', 'discover/movie?with_genres=28', 'movie'), 1400);
setTimeout(() => fetchMedia('romantic-container', 'discover/movie?with_genres=10749', 'movie'), 1600);
