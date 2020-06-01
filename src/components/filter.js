import AbstractComponent from './abstract-component.js';
import {swapActiveElements} from '../utils/common.js';
import {createMarkup} from '../utils/data-process.js';
import {FilterType} from '../utils/const.js';

const ACTIVE_FILTER_CLASS = `main-navigation__item--active`;

const createFilterItemMarkup = function (filters) {
  const {name, id, count = 0, checked} = filters;

  return (
    `<a href="#${id}"
      class="main-navigation__item${checked ? ` ${ACTIVE_FILTER_CLASS}` : ``}">
      ${name}
      ${count !== null ? ` <span class="main-navigation__item-count">${count}</span>` : ``}
    </a>`
  );
};

const createFilterTemplate = (filters) => {
  const filterItemsMarkup = createMarkup(filters, createFilterItemMarkup);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterItemsMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

const getFilterType = (element) => Object.values(FilterType)
  .find((filterType) => element.textContent.indexOf(filterType) !== -1);

export default class FilterComponent extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  resetFilter() {
    const defaultFilterButton = this.getElement().querySelectorAll(`.main-navigation__item`)[0];
    swapActiveElements(this.getElement(), defaultFilterButton, ACTIVE_FILTER_CLASS);
  }

  setFilterChangeHandler(handler) {
    this.getElement().querySelector(`.main-navigation__items`)
      .addEventListener(`click`, (evt) => {
        if (evt.target.tagName !== `A`) {
          return;
        }
        evt.preventDefault();

        const filterType = getFilterType(evt.target);
        swapActiveElements(this.getElement(), evt.target, ACTIVE_FILTER_CLASS);
        handler(filterType);
      });
  }

  setStatisticButtonClickHandler(handler) {
    this.getElement().querySelector(`.main-navigation__additional`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        swapActiveElements(this.getElement(), evt.target, ACTIVE_FILTER_CLASS);
        handler();
      });
  }
}
