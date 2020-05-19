import {createUserLevelTemplate} from './components/user-level.js';
import {createNavigationTemplate} from './components/navigation.js';
import {createStatisticTemplate} from './components/statistic.js';
import {createSortingTemplate} from './components/sorting.js';
import {createFilmCardTemplate} from './components/film-card.js';
import * as filmList from './components/film-list.js';
import * as details from './components/details.js';

import {generateProfileData} from './mock/user-level.js';
import {generateNavItemsData} from './mock/navigation.js';
import {generateTextData} from './mock/statistic.js';
import {generateFieldsData} from './mock/film-card.js';
import * as detailsMock from './mock/details.js';

const FILM_CARDS_COUNT = 5;

const pageHeader = document.querySelector(`.header`);
const pageMain = document.querySelector(`.main`);
const pageFooter = document.querySelector(`.footer`);

const data = {
  profile: generateProfileData(),
  navItems: generateNavItemsData(),
  statisticText: generateTextData(),
  infoFields: generateFieldsData(),
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
renderHtml(pageMain, filmList.createSectionTemplate());

const filmListContainer = pageMain.querySelector(`.films-list__container`);

for (let i = 0; i < FILM_CARDS_COUNT; i++) {
  renderHtml(filmListContainer, createFilmCardTemplate(data.infoFields));
}
renderHtml(filmListContainer, filmList.createShowMoreButtonTemplate(), `afterend`);
renderHtml(pageFooter, details.createSectionTemplate(), `afterend`);

const filmDetails = document.querySelector(`.film-details__inner`);
renderHtml(filmDetails, details.createTopContainerTemplate());
renderHtml(filmDetails, details.createBottomContainerTemplate());

const detailsTopContainer = filmDetails.querySelector(`.form-details__top-container`);
renderHtml(detailsTopContainer, details.createDescriptionTemplate(data.detailsTable));
renderHtml(detailsTopContainer, details.createControlsTemplate());

const detailsBottomContainer = filmDetails.querySelector(`.film-details__comments-wrap`);
renderHtml(detailsBottomContainer, details.createCommentsTemplate(data.detailsComments));
renderHtml(detailsBottomContainer, details.createNewCommentTemplate());
