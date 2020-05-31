import {render} from './utils/render.js';

import FilmListComponent from './components/film-list.js';

import MoviesModel from './models/movies.js';

import FilterController from './controllers/filter-controller.js';
import StatisticController from './controllers/statistic-controller.js';
import PageController from './controllers/page-controller.js';

import {generateFilmCardsData} from './mock/film-list.js';

const FILM_CARDS_COUNT = 12;

const pageHeader = document.querySelector(`.header`);
const pageMain = document.querySelector(`.main`);

const filmCards = generateFilmCardsData(FILM_CARDS_COUNT);
const filmListComponent = new FilmListComponent();

const moviesModel = new MoviesModel();
moviesModel.setMovies(filmCards);

const filterController = new FilterController(pageMain, moviesModel);
const statisticController = new StatisticController(pageHeader, pageMain, moviesModel);
const pageController = new PageController(filmListComponent, moviesModel);

filterController.render();
statisticController.render();
render(pageMain, filmListComponent);
pageController.render();
