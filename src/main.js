import API from './api.js';

import {render} from './utils/render.js';

import FilmListComponent from './components/film-list.js';

import MoviesModel from './models/movies.js';

import FilterController from './controllers/filter-controller.js';
import StatisticController from './controllers/statistic-controller.js';
import PageController from './controllers/page-controller.js';

const AUTHORIZATION = `Basic mlkj34klj6549fek37`;

// import {generateFilmCardsData} from './mock/film-list.js';

// const FILM_CARDS_COUNT = 12;

const pageHeader = document.querySelector(`.header`);
const pageMain = document.querySelector(`.main`);

// const filmCards = generateFilmCardsData(FILM_CARDS_COUNT);
const api = new API(AUTHORIZATION);
const moviesModel = new MoviesModel();

const filmListComponent = new FilmListComponent();

// moviesModel.setMovies(filmCards);

const filterController = new FilterController(pageMain, moviesModel);
const statisticController = new StatisticController(pageHeader, pageMain, moviesModel);
const pageController = new PageController(filmListComponent, moviesModel);

const statisticDisplayToggle = () => {
  if (statisticController.getDisplayStatus() === false) {
    pageController.hide();
    statisticController.show();
  } else {
    statisticController.hide();
    filterController.reset();
    pageController.show();
  }
};

// filterController.render();
// statisticController.render();
// statisticController.renderUserLevel();
render(pageMain, filmListComponent);
// pageController.render();

api.getCards()
  .then((cards) => {
    moviesModel.setMovies(cards);
    filterController.render();
    statisticController.render();
    statisticController.renderUserLevel();
    pageController.render();
  });

export {statisticDisplayToggle};
