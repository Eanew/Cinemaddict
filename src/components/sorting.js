import {createMarkup} from '../util.js';
import {generateSortItemsData} from '../mock/sorting.js';

const createSortingItemMarkup = function (name, isActive = false) {
  return (
    `<li>
      <a href="#" class="sort__button${isActive ? ` sort__button--active` : ``}">Sort by ${name}</a>
    </li>`
  );
};

export const createSortingTemplate = () => {
  const sortItemsData = generateSortItemsData();

  const sortItemsMarkup = createMarkup(sortItemsData, createSortingItemMarkup);

  return (
    `<ul class="sort">
      ${sortItemsMarkup}
    </ul>`
  );
};
