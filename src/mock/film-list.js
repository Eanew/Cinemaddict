import * as util from '../util.js';

const MAX_DESCRIPTION_LENGTH = 140;
const HOUR_IN_MINUTES = 60;


const infoFieldsValues = [
  `1929`,
  `1h 55m`,
  `Musical`];

const films = [
  {
    name: `Made for Each Other`,
    picture: `./images/posters/made-for-each-other.png`,
  },
  {
    name: `Popeye meets Sinbad`,
    picture: `./images/posters/popeye-meets-sinbad.png`,
  },
  {
    name: `Sagebrush trail`,
    picture: `./images/posters/sagebrush-trail.jpg`,
  },
  {
    name: `Santa Claus conquers the martians`,
    picture: `./images/posters/santa-claus-conquers-the-martians.jpg`,
  },
  {
    name: `The dance of life`,
    picture: `./images/posters/the-dance-of-life.jpg`,
  },
  {
    name: `The Great Flamarion`,
    picture: `./images/posters/the-great-flamarion.jpg`,
  },
  {
    name: `The man with the golden arm`,
    picture: `./images/posters/the-man-with-the-golden-arm.jpg`,
  }];

const descriptionTemplates = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. `,
  `Cras aliquet varius magna, non porta ligula feugiat eget. `,
  `Fusce tristique felis at fermentum pharetra. `,
  `Aliquam id orci ut lectus varius viverra. `,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. `,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. `,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. `,
  `Sed sed nisi sed augue convallis suscipit in sed felis. `,
  `Aliquam erat volutpat. `,
  `Nunc fermentum tortor ac porta dapibus. `,
  `In rutrum ac purus sit amet tempus. `];

const generateDescription = () => {
  const minDescriptionStringsCount = 1;
  const maxDescriptionStringsCount = 5;
  const descriptions = descriptionTemplates.slice();

  let string = ``;
  for (let i = 0; i < util.getRandomCount(minDescriptionStringsCount, maxDescriptionStringsCount); i++) {
    string += util.getUniqueRandomItem(descriptions);
  }
  string = string.replace(util.Regular.EMPTY_SPACE_IN_EDGES, ``);

  return getDescription(string);
};

const generateRaiting = () => {
  const minRaiting = 6;
  const maxRaiting = 10;
  return util.getRandomCount(minRaiting * 10, maxRaiting * 10) / 10;
};

const generateCommentsMarkup = () => {
  const minCount = 0;
  const maxCount = 5;
  const count = util.getRandomCount(minCount, maxCount);
  return `<a class="film-card__comments">${count} comment${count !== 1 ? `s` : ``}</a>`;
};

// const FilmCard = function () {
//   this.film = util.getUniqueRandomItem(films);
//   this.infoFieldsMarkup = util.createMarkup(generateInfoFieldsData(), renderInfoFieldMarkup);
//   this.activeButtons = util.generateRandomActiveItems(controlButtons);
//   this.controlButtonsMarkup = util.createMarkup(controlButtons, renderControlButtonMarkup, ...this.activeButtons);
//   this.raiting = generateRaiting();
//   this.description = generateDescription();
//   this.commentsMarkup = generateCommentsMarkup();
// };

const getDescription = (string) => string.length > MAX_DESCRIPTION_LENGTH
  ? string.replace(string.slice(MAX_DESCRIPTION_LENGTH), `...`)
  : string;

const getYear = (iso) => new Date(Date.parse(iso)).getFullYear();

const getDuration = (minutesAmount) => {
  const hours = Math.floor(minutesAmount / HOUR_IN_MINUTES)
    ? `${Math.floor(minutesAmount / HOUR_IN_MINUTES)}h`
    : ``;

  const restOfMinutes = minutesAmount % HOUR_IN_MINUTES
    ? ` ${minutesAmount % HOUR_IN_MINUTES}m`
    : ``;

  const minutes = hours
    ? restOfMinutes
    : `${minutesAmount}m`;

  return hours + minutes;
};

const infoFieldsNames = [
  `year`,
  `duration`,
  `genre`];

const generateInfoFields = (infoFieldsData) => infoFieldsNames.map((it, i) => ({
  name: it,
  value: infoFieldsData[i],
}));

const renderInfoFieldMarkup = ({name, value}) => {
  return (
    `<span class="film-card__${name}">${value}</span>`
  );
};

const setActiveButtons = (buttons) => buttons.map((it, i) => it ? i : -1);

const controlButtonsList = [
  {name: `Add to watchlist`},
  {name: `Mark as watched`},
  {name: `Mark as favorite`, id: `favorite`}];

const renderControlButtonMarkup = ({name, id}, isActive = false) => {
  return (
    `<button class="film-card__controls-item button film-card__controls-item--${id || util.setId(name)}
      ${isActive ? ` film-card__controls-item--active` : ``}">
      ${name}
    </button>`
  );
};

const FilmCard = function (data) {
  const info = data[`film_info`];
  this.title = info[`title`];
  this.poster = info[`poster`];
  this.raiting = info[`total_raiting`];
  this.description = getDescription(info[`description`]);
  this.commentsCount = data[`comments`].length;

  const year = getYear(info[`release`][`date`]);
  const duration = getDuration(info[`runtime`]);
  const genre = info[`genre`][0];
  const infoFields = generateInfoFields([year, duration, genre]);
  this.infoFieldsMarkup = util.createMarkup(infoFields, renderInfoFieldMarkup);

  const watchlistButtonStatus = data[`user_details`][`watchlist`];
  const watchedButtonStatus = data[`user_details`][`already_watched`];
  const favoriteButtonStatus = data[`user_details`][`favorite`];
  const activeButtons = setActiveButtons([watchlistButtonStatus, watchedButtonStatus, favoriteButtonStatus]);
  this.buttonsMarkup = util.createMarkup(controlButtonsList, renderControlButtonMarkup, ...activeButtons);
};

const generateFilmCard = (data) => {

  const {title, poster, raiting, description, commentsCount, infoFieldsMarkup, buttonsMarkup} = new FilmCard(data);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${raiting}</p>
      <p class="film-card__info">
        ${infoFieldsMarkup}
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <form class="film-card__controls">
        ${buttonsMarkup}
      </form>
    </article>`
  );
};

const filmDataTemplate = {
  'id': `0`,
  'comments': [1, 2],
  'film_info': {
    'title': `Sagebrush trail`,
    'alternative_title': ``,
    'total_raiting': 6.3,
    'poster': `./images/posters/sagebrush-trail.jpg`,
    'age_raiting': 0,
    'director': `Tom Ford`,
    'writers': [`Takeshi KItano`],
    'actors': [`Morgan Freeman`],
    'release': {
      'date': `2019-05-11T00:00:00.000Z`,
      'release_country': `Finland`,
    },
    'runtime': 77,
    'genre': [`Comedy`],
    'description': `Oscar-winning film, a war drama about two young people, from the creators of timeless classic \"Nu, Pogodi!\" and \"Alice in Wonderland\", with the best fight scenes since Bruce Lee.`,
  },
  'user_details': {
    'watchlist': false,
    'already_watched': true,
    'watching_date': `2019-04-12T16:12:32.554Z`,
    'favorite': false,
  },
};

export const generateFilmCardsTemplate = (count) => new Array(count)
  .fill(``)
  .map(() => generateFilmCard(filmDataTemplate))
  .join(`\n`);
