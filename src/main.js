import {render, removeBySelector} from './utils/render.js';

import UserLevelComponent from './components/user-level.js';
import NavigationComponent from './components/navigation.js';
import UserStatisticComponent from './components/user-statistic.js';
import SortingComponent from './components/sorting.js';
import FilmListComponent from './components/film-list.js';

import PageController from './controllers/page-controller.js';

import {generateFilmCardsData} from './mock/film-list.js';

const FILM_CARDS_COUNT = 12;
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

const filmCards = generateFilmCardsData(FILM_CARDS_COUNT);
const watchedMovies = filmCards.filter((it) => it[`user_details`][`already_watched`]);

renderUserLevel(watchedMovies);
renderNavigation(filmCards);
renderStatistic(watchedMovies);
render(pageMain, new SortingComponent());
const filmListComponent = new FilmListComponent(filmCards);
const pageController = new PageController(filmListComponent);
pageController.render(filmCards);

export {renderUserLevel, renderNavigation, renderStatistic};
