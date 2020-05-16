const MAX_FILTER_RESULTS_COUNT_TO_DISPLAY = 5;

const createNavigationItemMarkup = function (name, count = 0, isActive = false, itemId = null) {
  return (
    `<a href="#${itemId || name.toLowerCase()}"
      class="main-navigation__item${isActive ? ` main-navigation__item--active` : ``}">
      ${name} ${(count === null || count > MAX_FILTER_RESULTS_COUNT_TO_DISPLAY) ? `` :
      `<span class="main-navigation__item-count">${count}</span></a>`}
    </a>`
  );
};

export const createNavigationTemplate = () => {
  const navItem = createNavigationItemMarkup(`History`, 4);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${navItem}
        ${navItem}
        ${navItem}
        ${navItem}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};
