import {createUserLevelTemplate} from './components/user-level.js';
import {createNavigationTemplate} from './components/navigation.js';
import {createStatisticTemplate} from './components/statistic.js';
import {createSortingTemplate} from './components/sorting.js';
import {createFilmListTemplate} from './components/film-list.js';
import {createDetailsTemplate} from './components/details.js';

import {generateProfileData} from './mock/user-level.js';
import {generateFilmCardsData} from './mock/film-list.js';
import {generateCommentsData} from './mock/details.js';

const FILM_CARDS_COUNT = 12;

const renderHtml = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const pageHeader = document.querySelector(`.header`);
const pageMain = document.querySelector(`.main`);
const pageFooter = document.querySelector(`.footer`);

const data = {
  profile: generateProfileData(),
  filmCards: generateFilmCardsData(FILM_CARDS_COUNT),
  detailsComments: generateCommentsData(),
};

renderHtml(pageHeader, createUserLevelTemplate(data.profile));
renderHtml(pageMain, createNavigationTemplate(data.filmCards));
renderHtml(pageMain, createStatisticTemplate(data.profile));
renderHtml(pageMain, createSortingTemplate());
renderHtml(pageMain, createFilmListTemplate(data.filmCards));
// renderHtml(pageFooter, createDetailsTemplate(data.filmCards[0], data.detailsComments), `afterend`);
