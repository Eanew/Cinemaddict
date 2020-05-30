import {render} from './utils/render.js';
import {getCardsByFilter} from './utils/filter.js';
import {FilterType} from './utils/const.js';

import UserLevelComponent from './components/user-level.js';
import UserStatisticComponent from './components/user-statistic.js';
import FilmListComponent from './components/film-list.js';

import MoviesModel from './models/movies.js';

import PageController from './controllers/page-controller.js';
import FilterController from './controllers/filter-controller.js';

import {generateFilmCardsData} from './mock/film-list.js';

const FILM_CARDS_COUNT = 12;

const pageHeader = document.querySelector(`.header`);
const pageMain = document.querySelector(`.main`);

const filmCards = generateFilmCardsData(FILM_CARDS_COUNT);
const watchedMovies = getCardsByFilter(filmCards, FilterType.HISTORY);

const userLevelComponent = new UserLevelComponent(watchedMovies);
const statisticComponent = new UserStatisticComponent(watchedMovies);
const filmListComponent = new FilmListComponent();

const moviesModel = new MoviesModel();

const pageController = new PageController(filmListComponent, moviesModel);
const filterController = new FilterController(pageMain, moviesModel);

render(pageHeader, userLevelComponent);
render(pageMain, statisticComponent);
render(pageMain, filmListComponent);

moviesModel.setMovies(filmCards);

pageController.render();
filterController.render();
