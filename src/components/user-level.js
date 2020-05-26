import AbstractComponent from './abstract-component.js';

const AVATAR = `images/bitmap@2x.png`;

const Rank = {
  'Movie Buff': 21,
  'Fan': 11,
  'Novice': 1,
};

const getRank = (watchedMovies) => {
  for (const count in Rank) {
    if (Rank.hasOwnProperty(count) && Rank[count] <= watchedMovies) {
      return count;
    }
  }
  return ``;
};

const createUserLevelTemplate = (rank) => {
  return rank ? (
    `<section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="${AVATAR}" alt="Avatar" width="35" height="35">
    </section>`
  ) : ``;
};

export default class UserLevelComponent extends AbstractComponent {
  constructor(films) {
    super();

    this._rank = getRank(films.length);
  }

  getTemplate() {
    return createUserLevelTemplate(this._rank);
  }
}
