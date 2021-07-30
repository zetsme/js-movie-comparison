import { debounce } from './utils.js';
const createAutoComplete = ({
  root,
  fetchBySearchTerm,
  renderOption,
  inputValue,
  onOptionSelect,
}) => {
  root.innerHTML = `
  <label><b>Search</b><input class="input" /></label>
  
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results" id="results">
      </div>
    </div>
  </div>
  `;

  const inputEl = root.querySelector('input');
  const dropdownEl = root.querySelector('.dropdown');
  const resultsEl = root.querySelector('#results');

  const onInput = async (e) => {
    const items = await fetchBySearchTerm(e.target.value);
    if (!items.length) {
      dropdownEl.classList.remove('is-active');
      return;
    }

    resultsEl.innerHTML = '';
    dropdownEl.classList.add('is-active');

    items.forEach((item) => {
      const option = document.createElement('a');
      option.classList.add('dropdown-item');
      option.innerHTML = renderOption(item);
      option.addEventListener('click', () => {
        dropdownEl.classList.remove('is-active');
        inputEl.value = inputValue(item);
        onOptionSelect(item);
      });
      resultsEl.appendChild(option);
    });
  };

  inputEl.addEventListener('input', debounce(onInput, 1000));

  document.addEventListener('click', (e) => {
    if (!root.contains(e.target)) {
      dropdownEl.classList.remove('is-active');
    }
  });
};

export default createAutoComplete;
