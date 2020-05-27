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
    const firstCardRaiting = first[`film_info`][`total_raiting`];
    const secondCardRaiting = second[`film_info`][`total_raiting`];
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
  constructor(container) {
    this._container = container;

    this._sortingComponent = new SortingComponent();
    this._noMoviesComponent = new NoMoviesComponent();
    this._filmListTitleComponent = new FilmListTitleComponent();
    this._filmsContainerComponent = new FilmsContainerComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();

    this._sectionContainerElement = this._container.getElement();
    this._filmsContainerElement = this._filmsContainerComponent.getElement();

    this._cards = [];
    this._sortedCards = [];
    this._showedCardControllers = [];
    this._currentFilmsCount = FILMS_DISPLAY_STEP;

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onVIewChange = this._onVIewChange.bind(this);

    this._sortingComponent.onSortTypeChange(this._onSortTypeChange);
  }

  render(cards) {
    this._cards = cards;
    this._sectionContainerElement.innerHTML = ``;

    if (!this._cards || !this._cards.length) {
      render(this._sectionContainerElement, this._noMoviesComponent);
      return;
    }

    render(this._sectionContainerElement, this._sortingComponent, RenderPosition.BEFOREBEGIN);
    render(this._sectionContainerElement, this._filmListTitleComponent);
    render(this._sectionContainerElement, this._filmsContainerComponent);

    this._sortedCards = getSortedCards(this._cards, this._sortingComponent.getSortType(), 0, this._currentFilmsCount);

    const newCards = renderCards(this._filmsContainerElement, this._sortedCards, this._onDataChange, this._onVIewChange);
    this._showedCardControllers = this._showedCardControllers.concat(newCards);

    this._renderLoadMoreButton();
  }

  _renderLoadMoreButton() {
    if (this._cards.length <= this._currentFilmsCount) {
      return;
    }

    const renderMoreCards = (isLastCards) => {
      const sortType = this._sortingComponent.getSortType();
      const showingCards = this._currentFilmsCount + FILMS_DISPLAY_STEP;
      this._sortedCards = getSortedCards(this._cards, sortType, this._currentFilmsCount, showingCards);

      const newCards = renderCards(this._filmsContainerElement, this._sortedCards, this._onDataChange, this._onVIewChange);
      this._showedCardControllers = this._showedCardControllers.concat(newCards);

      if (isLastCards) {
        remove(this._loadMoreButtonComponent);
      } else {
        this._currentFilmsCount += FILMS_DISPLAY_STEP;
      }
    };

    this._loadMoreButtonComponent.onClick((evt) => {
      evt.preventDefault();
      const isLastCards = !(this._currentFilmsCount + FILMS_DISPLAY_STEP < this._cards.length);
      renderMoreCards(isLastCards);
    });

    render(this._filmsContainerElement, this._loadMoreButtonComponent, RenderPosition.AFTEREND);
  }

  _onSortTypeChange(sortType) {
    this._currentFilmsCount = FILMS_DISPLAY_STEP;

    this._sortedCards = getSortedCards(this._cards, sortType, 0, this._currentFilmsCount);

    this._filmsContainerElement.innerHTML = ``;
    remove(this._loadMoreButtonComponent);

    const newCards = renderCards(this._filmsContainerElement, this._sortedCards, this._onDataChange, this._onVIewChange);
    this._showedCardControllers = newCards;

    this._renderLoadMoreButton();
  }

  _onDataChange(oldData, newData) {
    const index = this._cards.findIndex((it) => it === oldData);
    if (index === -1) {
      return;
    }

    this._cards = [].concat(this._cards.slice(0, index), newData, this._cards.slice(index + 1));

    this._showedCardControllers[index].render(newData);
  }

  _onVIewChange() {
    this._showedCardControllers.forEach((it) => it.setDefaultView());
  }
}
