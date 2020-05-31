import {RenderPosition, render, replace} from '../utils/render.js';
import {getCardsByFilter} from '../utils/filter.js';
import {FilterType} from '../utils/const.js';
import {setId} from '../utils/data-process.js';

import FilterComponent from '../components/filter.js';

const ALL_MOVIES_ID = `all`;

export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._activeFilterType = FilterType.ALL_MOVIES;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allCards = this._moviesModel.getAllMovies();
    const filters = Object.values(FilterType).map((filterType) => ({
      name: filterType,
      id: filterType === FilterType.ALL_MOVIES ? ALL_MOVIES_ID : setId(filterType),
      count: filterType === FilterType.ALL_MOVIES ? null : getCardsByFilter(allCards, filterType).length,
      checked: filterType === this._activeFilterType,
    }));

    const oldComponent = this._filterComponent;
    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _onFilterChange(filterType) {
    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
