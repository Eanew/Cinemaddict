import {isEscEvent} from './utils/common.js';
import {RenderPosition, render, replace, remove, removeBySelector} from './utils/render.js';

import UserLevelComponent from './components/user-level.js';
import NavigationComponent from './components/navigation.js';
import UserStatisticComponent from './components/user-statistic.js';
import SortingComponent from './components/sorting.js';
import FilmListComponent from './components/film-list.js';
import CardComponent from './components/film-card.js';
import LoadMoreButtonComponent from './components/load-more-button.js';
import DetailsComponent from './components/details.js';

import {generateFilmCardsData} from './mock/film-list.js';
import {generateCommentsData} from './mock/details.js';

const FILM_CARDS_COUNT = 12;
const FILMS_DISPLAY_STEP = 5;
const PERMISSION_TO_OPEN_NEW_POPUP_TIMEOUT = 200;

const pageBody = document.querySelector(`body`);
const pageHeader = document.querySelector(`.header`);
const pageMain = document.querySelector(`.main`);

const renderUserLevel = (watchedMovies) => {
  const userLevelComponent = new UserLevelComponent(watchedMovies);

  removeBySelector(`.header__profile`);
  render(pageHeader, userLevelComponent);
};

const renderNavigation = (movies) => {
  const navigationComponent = new NavigationComponent(movies);

  removeBySelector(`.main-navigation`);
  render(pageMain, navigationComponent);
};

const renderStatistic = (movies) => {
  const statisticComponent = new UserStatisticComponent(movies);

  removeBySelector(`.statistic`);
  render(pageMain, statisticComponent);
};

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

const renderFilmList = (cards) => {
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
};

const filmCards = generateFilmCardsData(FILM_CARDS_COUNT);
const watchedMovies = filmCards.filter((it) => it[`user_details`][`already_watched`]);

renderUserLevel(watchedMovies);
renderNavigation(filmCards);
renderStatistic(watchedMovies);
render(pageMain, new SortingComponent());
renderFilmList(filmCards);

export {renderUserLevel, renderNavigation, renderStatistic, renderFilmList};
