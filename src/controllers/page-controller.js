import {isEscEvent} from '../utils/common.js';
import {RenderPosition, render, replace, remove} from '../utils/render.js';

import SortingComponent, {SortType} from '../components/sorting.js';
import NoMoviesComponent from '../components/no-movies.js';
import FilmListTitleComponent from '../components/film-list-title.js';
import FilmsContainerComponent from '../components/films-container.js';
import CardComponent from '../components/film-card.js';
import LoadMoreButtonComponent from '../components/load-more-button.js';
import DetailsComponent from '../components/details.js';

import {generateCommentsData} from '../mock/details.js';

const FILMS_DISPLAY_STEP = 5;
const PERMISSION_TO_OPEN_NEW_POPUP_TIMEOUT = 200;

const pageBody = document.querySelector(`body`);

let lastDetailsComponent = null;
let isPopupAlredyClosed = false;

const disableCasualPopupOpening = () => {
  isPopupAlredyClosed = true;
  setTimeout((() => {
    isPopupAlredyClosed = false;
  }), PERMISSION_TO_OPEN_NEW_POPUP_TIMEOUT);
};

const closePopup = () => {
  disableCasualPopupOpening();
  document.removeEventListener(`keydown`, onPopupEscPress);
  document.removeEventListener(`click`, closePopup);
  pageBody.removeChild(lastDetailsComponent.getElement());
};

const onPopupEscPress = (evt) => isEscEvent(evt, closePopup);

const renderFilmCard = (container, card) => {
  const cardComponent = new CardComponent(card);
  const detailsComponent = new DetailsComponent(card, generateCommentsData());

  const appendNewPopup = () => {
    if (lastDetailsComponent && pageBody.contains(lastDetailsComponent.getElement())) {
      if (lastDetailsComponent !== detailsComponent) {
        replace(detailsComponent, lastDetailsComponent);
      }
    } else if (!isPopupAlredyClosed) {
      pageBody.appendChild(detailsComponent.getElement());
    }
    lastDetailsComponent = detailsComponent;
  };

  const openPopup = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    document.addEventListener(`keydown`, onPopupEscPress);
    document.addEventListener(`click`, closePopup);
    detailsComponent.onPopupClick((clickEvt) => clickEvt.stopPropagation());
    detailsComponent.onCloseButtonClick(closePopup);
    appendNewPopup();
  };

  cardComponent.onPopupOpenersClick(openPopup);
  render(container, cardComponent);
};

const renderCards = (filmsContainerElement, cards) => {
  cards.forEach((card) => renderFilmCard(filmsContainerElement, card));
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
    this._currentFilmsCount = FILMS_DISPLAY_STEP;

    this._onSortTypeChange = this._onSortTypeChange.bind(this);

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

    renderCards(this._filmsContainerElement, this._sortedCards);
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

      renderCards(this._filmsContainerElement, this._sortedCards);

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

    renderCards(this._filmsContainerElement, this._sortedCards);
    this._renderLoadMoreButton();
  }
}
