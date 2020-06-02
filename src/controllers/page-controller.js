import {RenderPosition, render, remove} from '../utils/render.js';

import SortingComponent, {SortType} from '../components/sorting.js';
import NoMoviesComponent from '../components/no-movies.js';
import FilmListTitleComponent from '../components/film-list-title.js';
import FilmsContainerComponent from '../components/films-container.js';
import LoadMoreButtonComponent from '../components/load-more-button.js';

import MovieController from './movie-controller';

const FILMS_DISPLAY_STEP = 5;

const renderCards = (filmsContainerElement, cards, onDataChange, onViewChange) => {
  return cards.map((card) => {
    const movieController = new MovieController(filmsContainerElement, onDataChange, onViewChange);
    movieController.render(card);
    return movieController;
  });

};

const sortByDate = (cards) => {
  cards.sort((first, second) => {
    const firstCardDate = Date.parse(first[`film_info`][`release`][`date`]);
    const secondCardDate = Date.parse(second[`film_info`][`release`][`date`]);
    return secondCardDate - firstCardDate;
  });
  return cards;
};

const sortByRaiting = (cards) => {
  cards.sort((first, second) => {
    const firstCardRaiting = first[`film_info`][`total_rating`];
    const secondCardRaiting = second[`film_info`][`total_rating`];
    return secondCardRaiting - firstCardRaiting;
  });
  return cards;
};

const getSortedCards = (cards, sortType, from, to) => {
  let sortedCadrs = [];
  const showingCards = cards.slice();

  switch (sortType) {
    case SortType.DEFAULT:
      sortedCadrs = showingCards;
      break;

    case SortType.DATE:
      sortedCadrs = sortByDate(showingCards);
      break;

    case SortType.RAITING:
      sortedCadrs = sortByRaiting(showingCards);
      break;
  }
  return sortedCadrs.slice(from, to);
};

export default class PageController {
  constructor(container, moviesModel, api) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._api = api;

    this._sortingComponent = new SortingComponent();
    this._noMoviesComponent = new NoMoviesComponent();
    this._filmListTitleComponent = new FilmListTitleComponent();
    this._filmsContainerComponent = new FilmsContainerComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();

    this._sectionContainerElement = this._container.getElement();
    this._filmsContainerElement = this._filmsContainerComponent.getElement();

    this._currentFilmsCount = FILMS_DISPLAY_STEP;
    this._showedCardControllers = [];

    this._isShowed = true;

    this.show = this.show.bind(this);
    this._updateCards = this._updateCards.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onVIewChange = this._onVIewChange.bind(this);

    this._sortingComponent.onSortTypeChange(this._updateCards);
    this._moviesModel.setFilterChangeHandler(this.show);
  }

  hide() {
    this._container.hide();
    this._sortingComponent.hide();
    this._sortingComponent.resetSortType();
    this._isShowed = false;
  }

  show() {
    this._updateCards();
    if (this._isShowed === false) {
      this._container.show();
      this._sortingComponent.show();
      this._isShowed = true;
    }
  }

  render() {
    if (!this._moviesModel.getMovies() || !this._moviesModel.getMovies().length) {
      render(this._sectionContainerElement, this._noMoviesComponent);
      return;
    }

    render(this._sectionContainerElement, this._sortingComponent, RenderPosition.BEFOREBEGIN);
    render(this._sectionContainerElement, this._filmListTitleComponent);
    render(this._sectionContainerElement, this._filmsContainerComponent);
    this._renderCards(0, this._currentFilmsCount);
    this._renderLoadMoreButton();
  }

  _renderLoadMoreButton() {
    remove(this._loadMoreButtonComponent);
    if (this._moviesModel.getMovies().length <= this._currentFilmsCount) {
      return;
    }

    const renderMoreCards = (isLastCards) => {
      this._renderCards(this._currentFilmsCount, this._currentFilmsCount += FILMS_DISPLAY_STEP);
      if (isLastCards) {
        remove(this._loadMoreButtonComponent);
      }
    };

    this._loadMoreButtonComponent.onClick(() => {
      const isLastCards = !(this._currentFilmsCount + FILMS_DISPLAY_STEP < this._moviesModel.getMovies().length);
      renderMoreCards(isLastCards);
    });
    render(this._filmsContainerElement, this._loadMoreButtonComponent, RenderPosition.AFTEREND);
  }

  _renderCards(from, to) {
    const sortedCards = getSortedCards(this._moviesModel.getMovies(), this._sortingComponent.getSortType(), from, to);
    const newCards = renderCards(this._filmsContainerElement, sortedCards, this._onDataChange, this._onVIewChange);
    this._showedCardControllers = this._showedCardControllers.concat(newCards);
  }

  _removeCards() {
    this._showedCardControllers.forEach((cardController) => cardController.destroy());
    this._showedCardControllers = [];
  }

  _updateCards() {
    this._currentFilmsCount = FILMS_DISPLAY_STEP;
    this._removeCards();
    this._renderCards(0, this._currentFilmsCount);
    this._renderLoadMoreButton();
  }

  _onDataChange(oldData, newData) {
    this._api.updateCard(oldData[`id`], newData)
      .then((updatedCard) => {
        const isSuccess = this._moviesModel.updateMovie(oldData[`id`], updatedCard);
        if (isSuccess) {
          const controller = this._showedCardControllers.find((it) => it.getData() === oldData);
          controller.render(updatedCard);
        }
      });
  }

  _onVIewChange() {
    this._showedCardControllers.forEach((it) => it.setDefaultView());
  }
}
