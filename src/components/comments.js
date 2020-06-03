import AbstractSmartComponent from './abstract-smart-component.js';
import {createMarkup, setTwoDigit} from '../utils/data-process.js';
import {Key} from '../utils/common.js';

import {encode} from 'he';

const DeleteButtonText = {
  DEFAULT: `Delete`,
  DELETING: `Deleting…`,
};

const EMOJI_LIST = [`smile`, `sleeping`, `puke`, `angry`];

const getTimeString = (iso) => {
  const date = new Date(Date.parse(iso));
  const month = setTwoDigit(date, Date.prototype.getMonth);
  const day = setTwoDigit(date, Date.prototype.getDate);
  const hours = setTwoDigit(date, Date.prototype.getHours);
  const minutes = setTwoDigit(date, Date.prototype.getMinutes);
  return `${date.getFullYear()}/${month}/${day} ${hours}:${minutes}`;
};

const renderCommentsItemMarkup = ({author, comment, date, emotion}) => {
  const time = getTimeString(date);

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${time}</span>
          <button class="film-details__comment-delete">${DeleteButtonText.DEFAULT}</button>
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

const createCommentsTemplate = (comments) => {
  const detailsCommentsMarkup = createMarkup(comments, renderCommentsItemMarkup);
  const emojiListMarkup = createMarkup(EMOJI_LIST, renderEmojiItemMarkup);

  return (
    `<section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">
        ${comments.length || `0`}</span>
      </h3>

      <ul class="film-details__comments-list">
        ${detailsCommentsMarkup}
      </ul>

      <div class="film-details__new-comment">
        <div for="add-emoji" class="film-details__add-emoji-label"></div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>

        <div class="film-details__emoji-list">
          ${emojiListMarkup}
        </div>
      </div>
    </section>`
  );
};

const renderEmojiImageMarkup = (emoji) => {
  return emoji ? `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">` : ``;
};

export default class CommentsComponent extends AbstractSmartComponent {
  constructor(comments) {
    super();

    this._comments = comments;

    this._commentsListClickHandler = null;
    this._commentInputHandler = null;
    this._emojiClickHandler = null;
    this._commentSubmitHandler = null;

    this._textInput = this.getElement().querySelector(`.film-details__comment-input`);

    this._localComment = {
      'comment': null,
      'date': null,
      'emotion': null,
    };
  }

  getTemplate() {
    return createCommentsTemplate(this._comments);
  }

  rerender(newComments) {
    this._comments = newComments ? [].concat(newComments) : this._comments;
    super.rerender();
    this._textInput = this.getElement().querySelector(`.film-details__comment-input`);
    this.fillLocalComment(this._localComment[`emotion`], this._localComment[`comment`]);
  }

  recoveryListeners() {
    this.onCommentsListClick(this._commentsListClickHandler);
    this.onCommentInput(this._commentInputHandler);
    this.onEmojiClick(this._emojiClickHandler);
    this.onCommentSubmit(this._commentSubmitHandler);
  }

  getLocalComment() {
    return Object.assign({}, this._localComment, {
      'comment': this._localComment[`comment`] ? encode(this._localComment[`comment`]) : null,
      'date': new Date().toISOString(),
    });
  }

  fillLocalComment(emoji, comment) {
    const imageMarkup = renderEmojiImageMarkup(emoji);
    this.getElement().querySelector(`.film-details__add-emoji-label`).innerHTML = imageMarkup;
    this._textInput.value = comment;

    this._localComment[`emotion`] = emoji;
    this._localComment[`comment`] = comment;
  }

  onCommentsListClick(handler) {
    this.getElement().querySelector(`.film-details__comments-list`)
      .addEventListener(`click`, (evt) => {
        if (evt.target.tagName !== `BUTTON`) {
          return;
        }
        evt.preventDefault();
        handler(evt);
      });

    this._commentsListClickHandler = handler;
  }

  onEmojiClick(handler) {
    this.getElement().querySelector(`.film-details__emoji-list`)
      .addEventListener(`click`, (evt) => {
        if (evt.target.tagName !== `INPUT`) {
          return;
        }
        handler(evt);
      });

    this._emojiClickHandler = handler;
  }

  onCommentInput(handler) {
    this.getElement().querySelector(`.film-details__comment-input`)
      .addEventListener(`input`, (evt) => {
        handler(evt);
        evt.target.style.outline = ``;
      });

    this._commentInputHandler = handler;
  }

  disableTextInput() {
    this._textInput.disabled = true;
    this._textInput.style.outline = ``;
    this._textInput.value = `Sending...`;
    this.getElement().querySelectorAll(`.film-details__emoji-item`).forEach((input) => {
      input.disabled = true;
    });
  }

  enableTextInput() {
    this._textInput.disabled = false;
    this._textInput.style.outline = `2px solid red`;
    this._textInput.value = this._localComment[`comment`];
    this.getElement().querySelectorAll(`.film-details__emoji-item`).forEach((input) => {
      input.disabled = false;
    });
  }

  onCommentSubmit(handler) {
    this.getElement().querySelector(`.film-details__new-comment`)
      .addEventListener(`keydown`, (evt) => {
        if ((evt.ctrlKey || evt.metaKey) && evt.key === Key.ENTER) {
          evt.preventDefault();
          handler();
        }
      });

    this._commentSubmitHandler = handler;
  }

  onCommentsLoading() {
    this.getElement().querySelector(`.film-details__comments-title`).textContent = `Loading...`;
  }

  onCommentsLoadError() {
    this.getElement().querySelector(`.film-details__comments-title`).textContent = `Loading comments error`;
    this._textInput.placeholder = `Sorry, but you can not write a comment right now`;
    this._textInput.disabled = true;
  }
}

export {DeleteButtonText};
