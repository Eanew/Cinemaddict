import {createUserLevelTemplate} from './components/user-level.js';
import {createNavigationTemplate} from './components/navigation.js';
import {createStatisticTemplate} from './components/statistic.js';
import {createSortingTemplate} from './components/sorting.js';
import {createFilmListTemplate} from './components/film-list.js';
import * as details from './components/details.js';

import {generateProfileData} from './mock/user-level.js';
import {generateNavItemsData} from './mock/navigation.js';
import {generateTextData} from './mock/statistic.js';
import {generateFilmCardsData} from './mock/film-list.js';
import * as detailsMock from './mock/details.js';

const FILM_CARDS_COUNT = 5;

const pageHeader = document.querySelector(`.header`);
const pageMain = document.querySelector(`.main`);
const pageFooter = document.querySelector(`.footer`);

const data = {
  profile: generateProfileData(),
  navItems: generateNavItemsData(),
  statisticText: generateTextData(),
  filmCards: generateFilmCardsData(FILM_CARDS_COUNT),
  detailsTable: detailsMock.generateTableData(),
  detailsComments: detailsMock.generateCommentsData(),
};

const renderHtml = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

renderHtml(pageHeader, createUserLevelTemplate(data.profile));
renderHtml(pageMain, createNavigationTemplate(data.navItems));
renderHtml(pageMain, createStatisticTemplate(data.statisticText));
renderHtml(pageMain, createSortingTemplate());
renderHtml(pageMain, createFilmListTemplate(data.filmCards));
renderHtml(pageFooter, details.createSectionTemplate(), `afterend`);

const filmDetails = document.querySelector(`.film-details__inner`);
renderHtml(filmDetails, details.createTopContainerTemplate());
renderHtml(filmDetails, details.createBottomContainerTemplate());

const detailsTopContainer = filmDetails.querySelector(`.form-details__top-container`);
renderHtml(detailsTopContainer, details.createDescriptionTemplate(data.detailsTable));
renderHtml(detailsTopContainer, details.createControlsTemplate());

const commentsCount = data.filmCards[0][`comments`].length;
const detailsBottomContainer = filmDetails.querySelector(`.film-details__comments-wrap`);
renderHtml(detailsBottomContainer, details.createCommentsTemplate(data.detailsComments.slice(0, commentsCount)));
renderHtml(detailsBottomContainer, details.createNewCommentTemplate());
