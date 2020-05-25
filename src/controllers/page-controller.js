import {isEscEvent} from '../utils/common.js';
import {RenderPosition, render, replace, remove, removeBySelector} from '../utils/render.js';

import FilmListComponent from '../components/film-list.js';
import CardComponent from '../components/film-card.js';
import LoadMoreButtonComponent from '../components/load-more-button.js';
import DetailsComponent from '../components/details.js';

import {generateCommentsData} from '../mock/details.js';

const PERMISSION_TO_OPEN_NEW_POPUP_TIMEOUT = 200;
const FILMS_DISPLAY_STEP = 5;

const pageBody = document.querySelector(`body`);
const pageMain = document.querySelector(`.main`);

let lastDetailsComponent = null;
let isPopupAlredyClosed = false;

const closePopup = () => {
  document.removeEventListener(`keydown`, onPopupEscPress);
  document.removeEventListener(`click`, closePopup);
  pageBody.removeChild(lastDetailsComponent.getElement());
  isPopupAlredyClosed = true;
  setTimeout((() => {
    isPopupAlredyClosed = false;
  }), PERMISSION_TO_OPEN_NEW_POPUP_TIMEOUT);
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

const renderLoadMoreButton = (container, cards) => {
  const loadMoreButtonComponent = new LoadMoreButtonComponent();

  let currentFilmsCount = FILMS_DISPLAY_STEP;

  const renderCards = (isLastCards) => {
    cards.slice(currentFilmsCount, currentFilmsCount + FILMS_DISPLAY_STEP)
      .forEach((card) => renderFilmCard(container, card));

    if (isLastCards) {
      remove(loadMoreButtonComponent);
    } else {
      currentFilmsCount += FILMS_DISPLAY_STEP;
    }
  };

  loadMoreButtonComponent.onClick((evt) => {
    evt.preventDefault();
    const isLastCards = !(currentFilmsCount + FILMS_DISPLAY_STEP < cards.length);
    renderCards(isLastCards);
  });
  render(container, loadMoreButtonComponent, RenderPosition.AFTEREND);
};

export default class PageController {
  constructor(container) {
    this._container = container;
  }

  render(cards) {
    const filmListComponent = new FilmListComponent(cards);

    removeBySelector(`.films-list`);
    render(pageMain, filmListComponent);

    const filmListElement = filmListComponent.getElement().querySelector(`.films-list__container`);

    if (!filmListElement) {
      return;
    } else {
      cards.slice(0, FILMS_DISPLAY_STEP).forEach((card) => renderFilmCard(filmListElement, card));
      if (cards.length > FILMS_DISPLAY_STEP) {
        renderLoadMoreButton(filmListElement, cards);
      }
    }
  }
}
