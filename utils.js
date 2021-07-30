const debounce = (func, delay = 1000) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const fetchFromMovieApi = (key) => {
  return async (val) => {
    const response = await fetch(
      'http://www.omdbapi.com/?' +
        new URLSearchParams({
          apikey: 'c1cb18e8',
          [key]: val,
        })
    );
    const data = await response.json();
    return data.Search ? data.Search : data;
  };
};

export { debounce, fetchFromMovieApi };
