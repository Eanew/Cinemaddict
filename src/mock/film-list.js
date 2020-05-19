import * as util from '../util.js';

const MAX_DESCRIPTION_LENGTH = 140;

const infoFieldNames = [
  `year`,
  `duration`,
  `genre`];

const infoFieldValues = [
  `1929`,
  `1h 55m`,
  `Musical`];

const generateInfoFieldsData = () => infoFieldNames.map((it, i) => ({
  name: it,
  value: infoFieldValues[i],
}));

const renderInfoFieldMarkup = ({name, value}) => {
  return (
    `<span class="film-card__${name}">${value}</span>`
  );
};

const controlButtons = [
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

const films = [
  {
    name: `Made for Each Other`,
    picture: `made-for-each-other.png`,
  },
  {
    name: `Popeye meets Sinbad`,
    picture: `popeye-meets-sinbad.png`,
  },
  {
    name: `Sagebrush trail`,
    picture: `sagebrush-trail.jpg`,
  },
  {
    name: `Santa Claus conquers the martians`,
    picture: `santa-claus-conquers-the-martians.jpg`,
  },
  {
    name: `The dance of life`,
    picture: `the-dance-of-life.jpg`,
  },
  {
    name: `The Great Flamarion`,
    picture: `the-great-flamarion.jpg`,
  },
  {
    name: `The man with the golden arm`,
    picture: `the-man-with-the-golden-arm.jpg`,
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

  return string.length > MAX_DESCRIPTION_LENGTH
    ? string.replace(string.slice(MAX_DESCRIPTION_LENGTH - 1), `...`)
    : string;
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

const FilmCard = function () {
  this.film = util.getUniqueRandomItem(films);
  this.infoFieldsMarkup = util.createMarkup(generateInfoFieldsData(), renderInfoFieldMarkup);
  this.activeButtons = util.generateRandomActiveItems(controlButtons);
  this.controlButtonsMarkup = util.createMarkup(controlButtons, renderControlButtonMarkup, ...this.activeButtons);
  this.raiting = generateRaiting();
  this.description = generateDescription();
  this.commentsMarkup = generateCommentsMarkup();
};

const generateFilmCard = (data) => {
  const {name, picture} = data.film;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${name}</h3>
      <p class="film-card__rating">${data.raiting}</p>
      <p class="film-card__info">
        ${data.infoFieldsMarkup}
      </p>
      <img src="./images/posters/${picture}" alt="" class="film-card__poster">
      <p class="film-card__description">${data.description}</p>
        ${data.commentsMarkup}
      <form class="film-card__controls">
        ${data.controlButtonsMarkup}
      </form>
    </article>`
  );
};

export const generateFilmCardsTemplate = (count) => new Array(count)
  .fill(``)
  .map(() => generateFilmCard(new FilmCard()))
  .join(`\n`);
