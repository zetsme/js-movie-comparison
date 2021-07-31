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
    onMovieSelect(movie, document.querySelector('#left-summary'));
  },
  ...autoCompleteConfig,
});
createAutoComplete({
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect: (movie) => {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'));
  },
  ...autoCompleteConfig,
});

const onSelect = (left, right) => {
  const onMovieSelect = async (movie, summaryEl) => {
    const movieData = await fetchById(movie.imdbID);
    summaryEl.innerHTML = movieTemplate(movieData);
    if (left.textContent && right.textContent) {
      runComparison();
    }
  };
  return onMovieSelect;
};

const onMovieSelect = onSelect(
  document.querySelector('#left-summary'),
  document.querySelector('#right-summary')
);

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
  const cardValuesArr = [
    { title: 'Awards', text: movieDetail.Awards, val: awards },
    { title: 'Box Office', text: movieDetail.BoxOffice, val: dollars },
    { title: 'Metascore', text: movieDetail.Metascore, val: metascore },
    { title: 'IMDB Rating', text: movieDetail.imdbRating, val: imdbRating },
    { title: 'IMDB Votes', text: movieDetail.imdbVotes, val: imdbVotes },
  ];
  const cardArticles = cardValuesArr
    .map(({ title, text, val }) => {
      return `<article data-value=${val} class="card-article card-border-primary">
    <p>${title}</p>
    <h4>${text}</h4>
  </article>`;
    })
    .join(' ');
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
   ${cardArticles}
  </div>
  </div>
  `;
};
