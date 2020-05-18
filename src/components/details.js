import {getKeys, createMarkup} from '../util.js';

const GENRES_FIELD_NAME = `Genres`;

const Emoji = {
  smile: `smile`,
  sleeping: `sleeping`,
  puke: `puke`,
  angry: `angry`,
};

const renderFilmDetailsRowMarkup = (name, values) => {
  const term = (name === GENRES_FIELD_NAME && values.length < 2)
    ? name.replace(`s`, ``)
    : name;

  const cell = (name === GENRES_FIELD_NAME)
    ? values.map((it) => `<span class="film-details__genre">${it}</span>`).join(`\n`)
    : values.join(`, `);

  return (
    `<tr class="film-details__row">
      <td class="film-details__term">${term}</td>
      <td class="film-details__cell">${cell}</td>
    </tr>`
  );
};

const renderControlFieldMarkup = (name, id) => {
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
  const detailsTableData = [
    {
      name: `Director`,
      values: [`Anthony Mann`],
    },
    {
      name: `Writers`,
      values: [`Anne Wigton`, `Heinz Herald`, `Richard Weil`],
    },
    {
      name: `Actors`,
      values: [`Erich von Stroheim`, `Mary Beth Hughes`, `Dan Duryea`],
    },
    {
      name: `Release Date`,
      values: [`30 March 1945`],
    },
    {
      name: `Runtime`,
      values: [`1h 18m`],
    },
    {
      name: `Country`,
      values: [`USA`],
    },
    {
      name: `Genres`,
      values: [`Drama`, `Film-Noir`, `Mystery`],
    }
  ];

  const detailsTableMarkup = createMarkup(detailsTableData, renderFilmDetailsRowMarkup);

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
          ${detailsTableMarkup}
        </table>

        <p class="film-details__film-description">
          The film opens following a murder at a cabaret in Mexico City in 1936, and then presents the events leading up to it in flashback. The Great Flamarion (Erich von Stroheim) is an arrogant, friendless, and misogynous marksman who displays his trick gunshot act in the vaudeville circuit. His show features a beautiful assistant, Connie (Mary Beth Hughes) and her drunken husband Al (Dan Duryea), Flamarion's other assistant. Flamarion falls in love with Connie, the movie's femme fatale, and is soon manipulated by her into killing her no good husband during one of their acts.
        </p>
      </div>
    </div>`
  );
};

export const createControlsTemplate = () => {
  const detailsControlsData = [
    {
      name: `Add to watchlist`,
      id: `watchlist`,
    },
    {
      name: `Already watched`,
      id: `watched`,
    },
    {
      name: `Add to favorites`,
      id: `favorite`,
    },
  ];

  const detailsControlsMarkup = createMarkup(detailsControlsData, renderControlFieldMarkup);

  return (
    `<section class="film-details__controls">
      ${detailsControlsMarkup}
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
  const detailsCommentsData = [
    {
      author: `Tim Macoveev`,
      time: `2019/12/31 23:59`,
      text: `Interesting setting and a good cast`,
      emoji: Emoji.smile,
    },
    {
      author: `John Doe`,
      time: `2 days ago`,
      text: `Booooooooooring`,
      emoji: Emoji.sleeping,
    },
    {
      author: `John Doe`,
      time: `2 days ago`,
      text: `Very very old. Meh`,
      emoji: Emoji.puke,
    },
    {
      author: `John Doe`,
      time: `Today`,
      text: `Almost two hours? Seriously?`,
      emoji: Emoji.angry,
    },
  ];

  const detailsCommentsMarkup = createMarkup(detailsCommentsData, renderCommentsItemMarkup);

  return (
    `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">4</span></h3>

    <ul class="film-details__comments-list">
      ${detailsCommentsMarkup}
    </ul>`
  );
};

export const createNewCommentTemplate = () => {
  const emojiListMarkup = getKeys(Emoji).map((it) => renderEmojiItemMarkup(it)).join(`\n`);

  return (
    `<div class="film-details__new-comment">
      <div for="add-emoji" class="film-details__add-emoji-label"></div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
      </label>

      <div class="film-details__emoji-list">
        ${emojiListMarkup}
      </div>
    </div>`
  );
};
