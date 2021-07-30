import createAutoComplete from './autocomplete.js';
import { fetchFromMovieApi } from './utils.js';

const fetchBySearchTerm = fetchFromMovieApi('s');
const fetchById = fetchFromMovieApi('i');

const autoCompleteConfig = {
  fetchBySearchTerm,
  renderOption: (movie) => {
    const imgSrc =
      movie.Poster === 'N/A'
        ? 'https://images.unsplash.com/photo-1560109947-543149eceb16?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80'
        : movie.Poster;
    return `<img src="${imgSrc}" />${movie.Title}`;
  },
  inputValue: (movie) => movie.Title,
};

createAutoComplete({
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect: (movie) => {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  },
  ...autoCompleteConfig,
});
createAutoComplete({
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect: (movie) => {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  },
  ...autoCompleteConfig,
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryEl, side) => {
  const movieData = await fetchById(movie.imdbID);
  summaryEl.innerHTML = movieTemplate(movieData);
  if (side === 'left') leftMovie = movieData;
  if (side === 'right') rightMovie = movieData;
  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll('#left-summary .card-article');
  const rightSideStats = document.querySelectorAll('#right-summary .card-article');

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = Number(leftStat.dataset.value);
    const rightSideValue = Number(rightStat.dataset.value);

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('card-border-primary');
      leftStat.classList.add('card-border-secondary');
    } else {
      rightStat.classList.remove('card-border-primary');
      rightStat.classList.add('card-border-secondary');
    }
  });
};

const movieTemplate = (movieDetail) => {
  const dollars = Number(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
  const metascore = Number(movieDetail.Metascore);
  const imdbRating = Number(movieDetail.imdbRating);
  const imdbVotes = Number(movieDetail.imdbVotes.replace(/,/g, ''));
  const awards = movieDetail.Awards.split(' ').reduce((acc, cur) => {
    if (!isNaN(cur)) acc += Number(cur);
    return acc;
  }, 0);
  return `
  <div class="card">
  <div class="card-top">
    <div class="card-img">
      <img
        src="${movieDetail.Poster}">
    </div>
    <div class="card-info">
      <h1 class="card-title">${movieDetail.Title}</h1>
      <h4 class="card-subtitle">${movieDetail.Genre}</h4>
      <p class="card-description">${movieDetail.Plot}<</p>
    </div>
  </div>
  <div class="card-bottom">
    <article data-value=${awards} class="card-article card-border-primary">
      <p>Awards</p>
      <h4>${movieDetail.Awards}</h4>
    </article>
    <article data-value=${dollars} class="card-article card-border-primary">
      <p>Box Office</p>
      <h4>${movieDetail.BoxOffice}</h4>
    </article>
    <article data-value=${metascore} class="card-article card-border-primary">
      <p>Metascore</p>
      <h4>${movieDetail.Metascore}</h4>
    </article>
    <article data-value=${imdbRating} class="card-article card-border-primary">
      <p>IMDB Rating</p>
      <h4>${movieDetail.imdbRating}</h4>
    </article>
    <article data-value=${imdbVotes} class="card-article card-border-primary">
      <p>IMDB Votes</p>
      <h4>${movieDetail.imdbVotes}</h4>
    </article>
  </div>
  </div>
  `;
};
