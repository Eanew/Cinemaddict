import AbstractComponent from './abstract-component.js';
import {createMarkup, setId} from '../utils/data-process.js';

let watchlist = [];
let favorites = [];
let history = [];

const AllMovies = {
  ID: `all`,
  NAME: `All movies`,
};

const navItemsList = [
  AllMovies.NAME,
  `Watchlist`,
  `History`,
  `Favorites`];

const generateNavItemsData = (counts) => navItemsList.map((it, i) => ({
  name: it,
  id: it === AllMovies.NAME ? AllMovies.ID : setId(it),
  count: counts[i],
}));

const createNavigationItemMarkup = function ({name, id, count = 0}, isActive = false) {
  return (
    `<a href="#${id || setId(name)}"
      class="main-navigation__item${isActive ? ` main-navigation__item--active` : ``}">
      ${name}
      ${count !== null ? ` <span class="main-navigation__item-count">${count}</span>` : ``}
    </a>`
  );
};

const generateNavigationItems = (films) => {
  watchlist = films.filter((it) => it[`user_details`][`watchlist`]);
  favorites = films.filter((it) => it[`user_details`][`favorite`]);
  history = films.filter((it) => it[`user_details`][`already_watched`])
    .sort((first, second) => {
      const a = Date.parse(first[`user_details`][`watching_date`]);
      const b = Date.parse(second[`user_details`][`watching_date`]);
      if (a < b) {
        return 1;
      } else if (a > b) {
        return -1;
      } else {
        return 0;
      }
    });

  const displayedCounts = [null, watchlist.length, history.length, favorites.length];
  const navItems = generateNavItemsData(displayedCounts);
  return createMarkup(navItems, createNavigationItemMarkup, 0);
};

const createNavigationTemplate = (films) => {
  const navItemsMarkup = generateNavigationItems(films);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${navItemsMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class NavigationComponent extends AbstractComponent {
  constructor(films) {
    super();

    this._films = films;
  }

  getTemplate() {
    return createNavigationTemplate(this._films);
  }
}
