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
  }

  render(cards) {
    const sectionContainerElement = this._container.getElement();
    const filmsContainerElement = this._filmsContainerComponent.getElement();

    const renderLoadMoreButton = () => {
      if (cards.length <= currentFilmsCount) {
        return;
      }

      const renderMoreCards = (isLastCards) => {
        const sortType = this._sortingComponent.getSortType();
        sortedCards = getSortedCards(cards, sortType, currentFilmsCount, currentFilmsCount + FILMS_DISPLAY_STEP);
        renderCards(filmsContainerElement, sortedCards);

        if (isLastCards) {
          remove(this._loadMoreButtonComponent);
        } else {
          currentFilmsCount += FILMS_DISPLAY_STEP;
        }
      };

      this._loadMoreButtonComponent.onClick((evt) => {
        evt.preventDefault();
        const isLastCards = !(currentFilmsCount + FILMS_DISPLAY_STEP < cards.length);
        renderMoreCards(isLastCards);
      });

      render(filmsContainerElement, this._loadMoreButtonComponent, RenderPosition.AFTEREND);
    };

    sectionContainerElement.innerHTML = ``;

    if (!cards || !cards.length) {
      render(sectionContainerElement, this._noMoviesComponent);
      return;
    }

    render(sectionContainerElement, this._sortingComponent, RenderPosition.BEFOREBEGIN);
    render(sectionContainerElement, this._filmListTitleComponent);
    render(sectionContainerElement, this._filmsContainerComponent);

    let currentFilmsCount = FILMS_DISPLAY_STEP;
    let sortedCards = getSortedCards(cards, this._sortingComponent.getSortType(), 0, currentFilmsCount);

    renderCards(filmsContainerElement, sortedCards);
    renderLoadMoreButton();

    this._sortingComponent.onSortTypeChange((sortType) => {
      currentFilmsCount = FILMS_DISPLAY_STEP;

      sortedCards = getSortedCards(cards, sortType, 0, currentFilmsCount);

      filmsContainerElement.innerHTML = ``;
      remove(this._loadMoreButtonComponent);

      renderCards(filmsContainerElement, sortedCards);
      renderLoadMoreButton();
    });
  }
}
