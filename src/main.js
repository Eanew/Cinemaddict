import {RenderPosition, render, removeElement, isEscEvent} from './util.js';
import {replace} from './utils/render.js';

import UserLevel from './components/user-level.js';
import Navigation from './components/navigation.js';
import UserStatistic from './components/user-statistic.js';
import Sorting from './components/sorting.js';
import FilmList from './components/film-list.js';
import Card from './components/film-card.js';
import LoadMoreButton from './components/load-more-button.js';
import Details from './components/details.js';

import {generateFilmCardsData} from './mock/film-list.js';
import {generateCommentsData} from './mock/details.js';

const FILM_CARDS_COUNT = 12;
const FILMS_DISPLAY_STEP = 5;

const pageBody = document.querySelector(`body`);
const pageHeader = document.querySelector(`.header`);
const pageMain = document.querySelector(`.main`);

const renderUserLevel = (watchedMovies) => {
  const userLevelComponent = new UserLevel(watchedMovies);

  removeElement(`.header__profile`);
  render(pageHeader, userLevelComponent.getElement());
};

const renderNavigation = (movies) => {
  const navigationComponent = new Navigation(movies);

  removeElement(`.main-navigation`);
  render(pageMain, navigationComponent.getElement());
};

const renderStatistic = (movies) => {
  const statisticComponent = new UserStatistic(movies);

  removeElement(`.statistic`);
  render(pageMain, statisticComponent.getElement());
};

let isPopupAlredyClosed = false;

const renderFilmCard = (container, card) => {
  const cardComponent = new Card(card);
  const detailsComponent = new Details(card, generateCommentsData());
  const detailsCloseButtonElement = detailsComponent.getElement().querySelector(`.film-details__close-btn`);

  const appendNewPopup = (currentDetailsElement) => {
    const lastDetailsElement = pageBody.querySelector(`.film-details`);
    if (lastDetailsElement) {
      replace(pageBody, currentDetailsElement, lastDetailsElement);
    } else if (!isPopupAlredyClosed) {
      pageBody.appendChild(currentDetailsElement);
    }
  };

  const onCloseButtonClick = () => {
    isPopupAlredyClosed = true;
    setTimeout((() => {
      isPopupAlredyClosed = false;
    }), 200);
    document.removeEventListener(`keydown`, onDetailsEscPress);
    document.removeEventListener(`click`, onCloseButtonClick);
    pageBody.removeChild(detailsComponent.getElement());
  };

  const onDetailsEscPress = (evt) => {
    isEscEvent(evt, onCloseButtonClick);
  };

  const onCardClick = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    detailsCloseButtonElement.addEventListener(`click`, onCloseButtonClick);
    detailsComponent.getElement().addEventListener(`click`, (clickEvt) => clickEvt.stopPropagation());
    document.addEventListener(`keydown`, onDetailsEscPress);
    document.addEventListener(`click`, onCloseButtonClick);
    appendNewPopup(detailsComponent.getElement());
  };

  const cardListeningElements = [
    cardComponent.getElement().querySelector(`.film-card__title`),
    cardComponent.getElement().querySelector(`.film-card__poster`),
    cardComponent.getElement().querySelector(`.film-card__comments`)];

  cardListeningElements.forEach((element) => element.addEventListener(`click`, onCardClick));

  render(container, cardComponent.getElement());
};

const renderLoadMoreButton = (container, cards) => {
  const loadMoreButton = new LoadMoreButton();

  render(container, loadMoreButton.getElement(), RenderPosition.AFTEREND);
  const buttonElement = document.querySelector(`.films-list__show-more`);

  let currentFilmsCount = FILMS_DISPLAY_STEP;

  const renderCards = (isLastCards) => {
    cards.slice(currentFilmsCount, currentFilmsCount + FILMS_DISPLAY_STEP)
      .forEach((card) => renderFilmCard(container, card));

    if (isLastCards) {
      buttonElement.remove();
      loadMoreButton.removeElement();
    } else {
      currentFilmsCount += FILMS_DISPLAY_STEP;
    }
  };

  buttonElement.addEventListener(`click`, ((evt) => {
    evt.preventDefault();
    const isLastCards = !(currentFilmsCount + FILMS_DISPLAY_STEP < cards.length);
    renderCards(isLastCards);
  }));
};

const renderFilmList = (cards) => {
  const filmListComponent = new FilmList(cards);

  removeElement(`.films-list`);
  render(pageMain, filmListComponent.getElement());

  const filmListElement = filmListComponent.getElement().querySelector(`.films-list__container`);

  if (filmListElement) {
    cards.slice(0, FILMS_DISPLAY_STEP).forEach((card) => renderFilmCard(filmListElement, card));
  }

  if (cards.length > FILMS_DISPLAY_STEP) {
    renderLoadMoreButton(filmListElement, cards);
  }
};

const filmCards = generateFilmCardsData(FILM_CARDS_COUNT);
const watchedMovies = filmCards.filter((it) => it[`user_details`][`already_watched`]);

renderUserLevel(watchedMovies);
renderNavigation(filmCards);
renderStatistic(watchedMovies);
render(pageMain, new Sorting().getElement());
renderFilmList(filmCards);

export {renderUserLevel, renderNavigation, renderStatistic, renderFilmList};
