import API from './api.js';

import {render} from './utils/render.js';

import FilmListComponent from './components/film-list.js';

import MoviesModel from './models/movies.js';

import FilterController from './controllers/filter-controller.js';
import StatisticController from './controllers/statistic-controller.js';
import PageController from './controllers/page-controller.js';

const AUTHORIZATION = `Basic mlkj34klj6549fek37`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;

const pageHeader = document.querySelector(`.header`);
const pageMain = document.querySelector(`.main`);

const api = new API(END_POINT, AUTHORIZATION);

const moviesModel = new MoviesModel();

const filmListComponent = new FilmListComponent();

const filterController = new FilterController(pageMain, moviesModel);
const statisticController = new StatisticController(pageHeader, pageMain, moviesModel);
const pageController = new PageController(filmListComponent, moviesModel, api);

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

filterController.render();
render(pageMain, filmListComponent);

api.getCards()
  .then((cards) => {
    moviesModel.setMovies(cards);
    statisticController.render();
    statisticController.renderUserLevel();
    pageController.render();
  });

export {statisticDisplayToggle};
