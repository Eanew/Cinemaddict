import * as util from '../util.js';

const filmTemplates = [
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

const genreTemplates = [`Drama`, `Cartoon`, `Comedy`, `Western`, `Horror`];

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
  return string.replace(util.Regular.EMPTY_SPACE_IN_EDGES, ``);
};

const generateRaiting = () => {
  const minRaiting = 6;
  const maxRaiting = 10;
  return util.getRandomCount(minRaiting * 10, maxRaiting * 10) / 10;
};

const generateGenres = () => {
  const clonedGenresTemplate = genreTemplates.slice();
  let genres = [];
  for (let i = 0; i < clonedGenresTemplate.length; i++) {
    genres.push(util.getUniqueRandomItem(clonedGenresTemplate));
  }
  return genres;
};

const RandomFilmCard = function (index) {
  const film = util.getUniqueRandomItem(filmTemplates);
  this[`id`] = `${index}`;
  this[`comments`] = new Array(Math.floor(Math.random() * 6)).fill(``).map((it, i) => i);
  this[`film_info`] = {
    'title': film.name,
    'alternative_title': ``,
    'total_raiting': generateRaiting(),
    'poster': film.picture,
    'age_raiting': 0,
    'director': [`Tom Ford`, `Ken Cuopis`, `Kreve Standers`, `Elise Woo`, `Justin Cursele`][Math.floor(Math.random() * 5)],
    'writers': [[`Takeshi KItano`, `Tom Ford`, `Ken Cuopis`, `Kreve Standers`, `Elise Woo`, `Justin Cursele`][Math.floor(Math.random() * 6)]],
    'actors': [[`Morgan Freeman`, `Takeshi KItano`, `Tom Ford`, `Ken Cuopis`, `Kreve Standers`, `Elise Woo`, `Justin Cursele`][Math.floor(Math.random() * 7)]],
    'release': {
      'date': `20${Math.floor(Math.random() * 2)}${Math.floor(Math.random() * 10)}-05-11T00:00:00.000Z`,
      'release_country': [`Finland`, `Russia`, `USA`, `Brasil`, `India`, `England`][Math.floor(Math.random() * 5)],
    },
    'runtime': util.getRandomCount(40, 140),
    'genre': generateGenres(),
    'description': generateDescription(),
  };
  this[`user_details`] = {
    'watchlist': Math.round(Math.random()),
    'already_watched': Math.round(Math.random()),
    'watching_date': `20${Math.floor(Math.random() * 2)}${Math.floor(Math.random() * 10)}-04-12T16:12:32.554Z`,
    'favorite': Math.round(Math.random()),
  };
};

export const generateFilmCardsData = (count) => new Array(count)
  .fill(``)
  .map(() => new RandomFilmCard());

// const filmDataTemplate = {
//   'id': `0`,
//   'comments': [1, 2],
//   'film_info': {
//     'title': `Sagebrush trail`,
//     'alternative_title': ``,
//     'total_raiting': 6.3,
//     'poster': `./images/posters/sagebrush-trail.jpg`,
//     'age_raiting': 0,
//     'director': `Tom Ford`,
//     'writers': [`Takeshi KItano`],
//     'actors': [`Morgan Freeman`],
//     'release': {
//       'date': `2019-05-11T00:00:00.000Z`,
//       'release_country': `Finland`,
//     },
//     'runtime': 77,
//     'genre': [`Comedy`],
//     'description': `Oscar-winning film, a war drama about two young people, from the creators of timeless classic \"Nu, Pogodi!\" and \"Alice in Wonderland\", with the best fight scenes since Bruce Lee.`,
//   },
//   'user_details': {
//     'watchlist': false,
//     'already_watched': true,
//     'watching_date': `2019-04-12T16:12:32.554Z`,
//     'favorite': false,
//   },
// };
