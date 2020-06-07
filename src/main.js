import API from './api/index.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

import {render, remove} from './utils/render.js';

import FilmListComponent from './components/film-list.js';
import FooterStatisticsComponent from './components/footer-statistics.js';
import LoadingComponent from './components/loading.js';

import MoviesModel from './models/movies.js';

import FilterController from './controllers/filter-controller.js';
import StatisticController from './controllers/statistic-controller.js';
import PageController from './controllers/page-controller.js';

const AUTHORIZATION = `Basic mlkj34klj6549fek37`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const pageHeader = document.querySelector(`.header`);
const pageMain = document.querySelector(`.main`);
const footerStatistics = document.querySelector(`.footer__statistics`);

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const moviesModel = new MoviesModel();

const filmListComponent = new FilmListComponent();
const loadingComponent = new LoadingComponent();

const filterController = new FilterController(pageMain, moviesModel);
const statisticController = new StatisticController(pageHeader, pageMain, moviesModel);
const pageController = new PageController(filmListComponent, moviesModel, apiWithProvider);

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
render(filmListComponent.getElement(), loadingComponent);

const renderContent = (cards) => {
  moviesModel.setMovies(cards);
  statisticController.render();
  statisticController.renderUserLevel();
  remove(loadingComponent);
  pageController.render();
  render(footerStatistics, new FooterStatisticsComponent(cards.length));
};

apiWithProvider.getCards()
  .then((cards) => {
    renderContent(cards);
  })
  .catch(() => {
    renderContent([]);
  });

export {statisticDisplayToggle};
