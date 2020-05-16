import {Regular} from '../util.js';

const GENRES_FIELD_NAME = `Genres`;

const renderFilmDetailsRowMarkup = (name, ...values) => {
  const term = (name === GENRES_FIELD_NAME && values.length < 2)
    ? name.replace(`s`, ``)
    : name;

  const cell = (name === GENRES_FIELD_NAME)
    ? values.map((it) => `<span class="film-details__genre">${it}</span>`).join(` `)
    : values.join(`, `);

  return (
    `<tr class="film-details__row">
      <td class="film-details__term">${term}</td>
      <td class="film-details__cell">${cell}</td>
    </tr>`
  );
};

const renderControlFieldMarkup = (name, fieldId) => {
  const id = fieldId || name.replace(Regular.EMPTY_SPACE_IN_EDGES, ``).split(Regular.SPACE).pop().toLowerCase();

  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="${id}" name="${id}">
    <label for="${id}" class="film-details__control-label film-details__control-label--${id}">${name}</label>`
  );
};

const renderCommentsItemMarkup = (author, time, text, emoji) => {
  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${time}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

const renderEmojiItemMarkup = (emoji) => {
  return (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
    </label>`
  );
};

export const createSectionTemplate = () => {
  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get"></form>
    </section>`
  );
};

export const createTopContainerTemplate = () => {
  return (
    `<div class="form-details__top-container"></div>`
  );
};

export const createDescriptionTemplate = () => {
  return (
    `<div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
    <div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="./images/posters/the-great-flamarion.jpg" alt="">

        <p class="film-details__age">18+</p>
      </div>

      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">The Great Flamarion</h3>
            <p class="film-details__title-original">Original: The Great Flamarion</p>
          </div>

          <div class="film-details__rating">
            <p class="film-details__total-rating">8.9</p>
          </div>
        </div>

        <table class="film-details__table">
          ${renderFilmDetailsRowMarkup(`Director`, `Anthony Mann`)}
          ${renderFilmDetailsRowMarkup(`Writers`, `Anne Wigton`, `Heinz Herald`, `Richard Weil`)}
          ${renderFilmDetailsRowMarkup(`Actors`, `Erich von Stroheim`, `Mary Beth Hughes`, `Dan Duryea`)}
          ${renderFilmDetailsRowMarkup(`Release Date`, `30 March 1945`)}
          ${renderFilmDetailsRowMarkup(`Runtime`, `1h 18m`)}
          ${renderFilmDetailsRowMarkup(`Country`, `USA`)}
          ${renderFilmDetailsRowMarkup(`Genres`, `Drama`, `Film-Noir`, `Mystery`)}
        </table>

        <p class="film-details__film-description">
          The film opens following a murder at a cabaret in Mexico City in 1936, and then presents the events leading up to it in flashback. The Great Flamarion (Erich von Stroheim) is an arrogant, friendless, and misogynous marksman who displays his trick gunshot act in the vaudeville circuit. His show features a beautiful assistant, Connie (Mary Beth Hughes) and her drunken husband Al (Dan Duryea), Flamarion's other assistant. Flamarion falls in love with Connie, the movie's femme fatale, and is soon manipulated by her into killing her no good husband during one of their acts.
        </p>
      </div>
    </div>`
  );
};

export const createControlsTemplate = () => {
  return (
    `<section class="film-details__controls">
      ${renderControlFieldMarkup(`Add to watchlist`)}
      ${renderControlFieldMarkup(`Already watched`)}
      ${renderControlFieldMarkup(`Add to favorites`, `favorite`)}
    </section>`
  );
};

export const createBottomContainerTemplate = () => {
  return (
    `<div class="form-details__bottom-container">
      <section class="film-details__comments-wrap"></section>
    </div>`
  );
};

export const createCommentsTemplate = () => {
  return (
    `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">4</span></h3>

    <ul class="film-details__comments-list">
      ${renderCommentsItemMarkup(`Tim Macoveev`, `2019/12/31 23:59`, `Interesting setting and a good cast`, `smile`)}
      ${renderCommentsItemMarkup(`John Doe`, `2 days ago`, `Booooooooooring`, `sleeping`)}
      ${renderCommentsItemMarkup(`John Doe`, `2 days ago`, `Very very old. Meh`, `puke`)}
      ${renderCommentsItemMarkup(`John Doe`, `Today`, `Almost two hours? Seriously?`, `angry`)}
    </ul>`
  );
};

export const createNewCommentTemplate = () => {
  return (
    `<div class="film-details__new-comment">
      <div for="add-emoji" class="film-details__add-emoji-label"></div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
      </label>

      <div class="film-details__emoji-list">
        ${renderEmojiItemMarkup(`smile`)}
        ${renderEmojiItemMarkup(`sleeping`)}
        ${renderEmojiItemMarkup(`puke`)}
        ${renderEmojiItemMarkup(`angry`)}
      </div>
    </div>`
  );
};
