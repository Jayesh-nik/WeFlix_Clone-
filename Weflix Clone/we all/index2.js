// Get references to HTML elements
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const goToWatchlistBtn = document.getElementById('goToWatchlist');

// Event listener to navigate to WatchList page
goToWatchlistBtn.addEventListener('click', () => {
    window.location.href = 'watchList/watchlist.html';
});

const scrollDistance = 900;

// Define a function to handle scrolling
function setupScroll(containerClass, previousButtonClass, nextButtonClass) {
    const previousButtons = document.querySelectorAll(`.${previousButtonClass}`);
    const nextButtons = document.querySelectorAll(`.${nextButtonClass}`);
    const containers = document.querySelectorAll(`.${containerClass}`);

    containers.forEach((container, index) => {
        const previousButton = previousButtons[index];
        const nextButton = nextButtons[index];
        nextButton.addEventListener('click', () => {
            container.scrollBy({
                left: scrollDistance,
                behavior: 'smooth',
            });
        });
        previousButton.addEventListener('click', () => {
            container.scrollBy({
                left: -scrollDistance,
                behavior: 'smooth',
            });
        });
    });
}

// SetupScroll function called for each section
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

// Function to fetch and display movies or TV shows
function fetchMedia(containerClass, endpoint, mediaType) {
    const containers = document.querySelectorAll(`.${containerClass}`);
    containers.forEach((container) => {
        fetch(`https://api.themoviedb.org/3/${endpoint}&api_key=${api_Key}`)
            .then(response => response.json())
            .then(data => {
                container.innerHTML = ''; // Clear previous content
                data.results.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.classList.add('movie-item');
                    const imageUrl = containerClass === 'netflix-container' ? item.poster_path : item.backdrop_path;
                    itemElement.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${imageUrl}" alt="${item.title || item.name}">`;
                    container.appendChild(itemElement);

                    itemElement.addEventListener('click', () => {
                        const media_Type = item.media_type || mediaType;
                        window.location.href = `movie_details/movie_details.html?media=${media_Type}&id=${item.id}`;
                    });
                });
            })
            .catch(error => console.error(error));
    });
}

// Fetch data for each category
fetchMedia('trending-container', 'trending/all/week?', 'movie');
fetchMedia('netflix-container', 'discover/tv?with_networks=213', 'tv');
fetchMedia('netflixShows-container', 'discover/tv?', 'tv');
fetchMedia('top-container', 'movie/top_rated?', 'movie');
fetchMedia('horror-container', 'discover/movie?with_genres=27', 'movie');
fetchMedia('comedy-container', 'discover/movie?with_genres=35', 'movie');
fetchMedia('action-container', 'discover/movie?with_genres=28', 'movie');
fetchMedia('romantic-container', 'discover/movie?with_genres=10749', 'movie');
