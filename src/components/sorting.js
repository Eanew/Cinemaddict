import AbstractComponent from './abstract-component.js';
import {createMarkup} from '../utils/data-process.js';

const sortFieldsList = [
  `default`,
  `date`,
  `raiting`];

const createSortingItemMarkup = function (name, isActive = false) {
  return (
    `<li>
      <a href="#" class="sort__button${isActive ? ` sort__button--active` : ``}">Sort by ${name}</a>
    </li>`
  );
};

const createSortingTemplate = () => {
  const sortItemsMarkup = createMarkup(sortFieldsList, createSortingItemMarkup, 0);

  return (
    `<ul class="sort">
      ${sortItemsMarkup}
    </ul>`
  );
};

export default class SortingComponent extends AbstractComponent {
  getTemplate() {
    return createSortingTemplate();
  }

  getSortType() {

  }

  onSortTypeChange() {

  }
}
