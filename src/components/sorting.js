import AbstractComponent from './abstract-component.js';
import {createMarkup} from '../utils/data-process.js';

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RAITING: `raiting`,
};

const sortTypessList = [
  SortType.DEFAULT,
  SortType.DATE,
  SortType.RAITING];

const createSortingItemMarkup = function (type, isActive = false) {
  return (
    `<li>
      <a href="#" data-sort-type="${type}" class="sort__button${isActive ? ` sort__button--active` : ``}">
        Sort by ${type}
      </a>
    </li>`
  );
};

const createSortingTemplate = () => {
  const sortItemsMarkup = createMarkup(sortTypessList, createSortingItemMarkup, 0);

  return (
    `<ul class="sort">
      ${sortItemsMarkup}
    </ul>`
  );
};

export default class SortingComponent extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortingTemplate();
  }

  getSortType() {
    return this._currentSortType;
  }

  onSortTypeChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;

      handler(this._currentSortType);
    });
  }
}
