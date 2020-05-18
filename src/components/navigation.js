import {createMarkup, setId} from '../util.js';

const MAX_FILTER_RESULTS_COUNT_TO_DISPLAY = 5;

const createNavigationItemMarkup = function (isActive = false, name, count = 0, itemId = null) {
  return (
    `<a href="#${itemId || setId(name)}"
      class="main-navigation__item${isActive ? ` main-navigation__item--active` : ``}">
      ${name}
      ${(count > MAX_FILTER_RESULTS_COUNT_TO_DISPLAY || !count) ? ``
      : ` <span class="main-navigation__item-count">${count}</span>`}
    </a>`
  );
};

export const createNavigationTemplate = (itemsData) => {
  const navItemsMarkup = createMarkup(itemsData, createNavigationItemMarkup, 0);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${navItemsMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};
