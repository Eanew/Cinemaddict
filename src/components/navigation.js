import {createMarkup} from '../util.js';

const MAX_FILTER_RESULTS_COUNT_TO_DISPLAY = 5;

const createNavigationItemMarkup = function (name, count = 0, isActive = false, itemId = null) {
  return (
    `<a href="#${itemId || name.toLowerCase()}"
      class="main-navigation__item${isActive ? ` main-navigation__item--active` : ``}">
      ${name}
      ${(count > MAX_FILTER_RESULTS_COUNT_TO_DISPLAY || !count) ? ``
      : ` <span class="main-navigation__item-count">${count}</span>`}
    </a>`
  );
};

export const createNavigationTemplate = () => {
  const navItemsData = [
    {
      name: `All movies`,
      count: null,
      isActive: true,
      id: `all`,
    },
    {
      name: `Watchlist`,
      count: 13,
    },
    {
      name: `History`,
      count: 4,
    },
    {
      name: `Favorites`,
      count: 8,
    },
  ];

  const navItemsMarkup = createMarkup(navItemsData, createNavigationItemMarkup);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${navItemsMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};
