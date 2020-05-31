import AbstractComponent from './abstract-component.js';

const createUserLevelTemplate = (userInfo) => {
  const {avatar, rank} = userInfo;

  return rank ? (
    `<section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="${avatar}" alt="Avatar" width="35" height="35">
    </section>`
  ) : ``;
};

export default class UserLevelComponent extends AbstractComponent {
  constructor(userInfo) {
    super();

    this._userInfo = userInfo;
  }

  getTemplate() {
    return createUserLevelTemplate(this._userInfo);
  }
}
