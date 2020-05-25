import {isEscEvent} from './utils/common.js';
import {RenderPosition, render, remove, removeBySelector} from './utils/render.js';

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

let isPopupAlredyClosed = false;
let lastDetailsComponent;

const onCloseButtonClick = () => {
  isPopupAlredyClosed = true;
  setTimeout((() => {
    isPopupAlredyClosed = false;
  }), 200);
  document.removeEventListener(`keydown`, onDetailsEscPress);
  document.removeEventListener(`click`, onCloseButtonClick);
  pageBody.removeChild(lastDetailsComponent.getElement());
};

const onDetailsEscPress = (evt) => {
  isEscEvent(evt, onCloseButtonClick);
};

const renderFilmCard = (container, card) => {
  const cardComponent = new CardComponent(card);
  const detailsComponent = new DetailsComponent(card, generateCommentsData());
  const detailsCloseButtonElement = detailsComponent.getElement().querySelector(`.film-details__close-btn`);

  const appendNewPopup = () => {
    const lastDetailsElement = pageBody.querySelector(`.film-details`);
    if (lastDetailsElement) {
      document.removeEventListener(`keydown`, onDetailsEscPress);
      document.removeEventListener(`click`, onCloseButtonClick);
      if (lastDetailsElement !== detailsComponent.getElement()) {
        pageBody.replaceChild(detailsComponent.getElement(), lastDetailsElement);
      }
    } else if (!isPopupAlredyClosed) {
      pageBody.appendChild(detailsComponent.getElement());
    }
  };

  const onCardClick = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    detailsCloseButtonElement.addEventListener(`click`, onCloseButtonClick);
    detailsComponent.getElement().addEventListener(`click`, (clickEvt) => clickEvt.stopPropagation());
    appendNewPopup();
    lastDetailsComponent = detailsComponent;
    document.addEventListener(`keydown`, onDetailsEscPress);
    document.addEventListener(`click`, onCloseButtonClick);
  };

  const cardListeningElements = [
    cardComponent.getElement().querySelector(`.film-card__title`),
    cardComponent.getElement().querySelector(`.film-card__poster`),
    cardComponent.getElement().querySelector(`.film-card__comments`)];

  cardListeningElements.forEach((element) => element.addEventListener(`click`, onCardClick));

  render(container, cardComponent);
};

const renderLoadMoreButton = (container, cards) => {
  const loadMoreButtonComponent = new LoadMoreButtonComponent();

  render(container, loadMoreButtonComponent, RenderPosition.AFTEREND);
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

  loadMoreButtonComponent.getElement().addEventListener(`click`, ((evt) => {
    evt.preventDefault();
    const isLastCards = !(currentFilmsCount + FILMS_DISPLAY_STEP < cards.length);
    renderCards(isLastCards);
  }));
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
