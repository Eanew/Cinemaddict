import AbstractComponent from './abstract-component.js';
import {createMarkup, setId} from '../utils/data-process.js';
import {FilterType} from '../utils/const.js';
import {getCardsByFilter} from '../utils/filter.js';

let watchlist = [];
let favorites = [];
let history = [];

const ALL_MOVIES_ID = `all`;

const generateFilterItemsData = (counts) => Object.values(FilterType).map((it, i) => ({
  name: it,
  id: it === FilterType.ALL_MOVIES ? ALL_MOVIES_ID : setId(it),
  count: counts[i],
}));

const createFiltersItemMarkup = function ({name, id, count = 0}, isActive = false) {
  return (
    `<a href="#${id || setId(name)}"
      class="main-navigation__item${isActive ? ` main-navigation__item--active` : ``}">
      ${name}
      ${count !== null ? ` <span class="main-navigation__item-count">${count}</span>` : ``}
    </a>`
  );
};

const generateFilterItems = (cards) => {
  watchlist = getCardsByFilter(cards, FilterType.WATCHLIST);
  history = getCardsByFilter(cards, FilterType.HISTORY);
  favorites = getCardsByFilter(cards, FilterType.FAVORITES);

  const displayedCounts = [null, watchlist.length, history.length, favorites.length];
  const filterItems = generateFilterItemsData(displayedCounts);
  return createMarkup(filterItems, createFiltersItemMarkup, 0);
};

const createFilterTemplate = (films) => {
  const navItemsMarkup = generateFilterItems(films);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${navItemsMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class FilterComponent extends AbstractComponent {
  constructor(films) {
    super();

    this._films = films;
  }

  getTemplate() {
    return createFilterTemplate(this._films);
  }
}
