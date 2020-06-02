import AbstractSmartComponent from './abstract-smart-component.js';
import {createMarkup, setTwoDigit} from '../utils/data-process.js';
import {Key} from '../utils/common.js';

import {encode} from 'he';

const emojiList = [`smile`, `sleeping`, `puke`, `angry`];

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

const createCommentsTemplate = (comments) => {
  const detailsCommentsMarkup = createMarkup(comments, renderCommentsItemMarkup);
  const emojiListMarkup = createMarkup(emojiList, renderEmojiItemMarkup);

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

    this._localComment = {
      'comment': null,
      'date': null,
      'emotion': null,
    };
  }

  getTemplate() {
    return createCommentsTemplate(this._comments);
  }

  rerender() {
    super.rerender();
    this.fillLocalComment(this._localComment[`emoji`], this._localComment[`comment`]);
  }

  recoveryListeners() {
    this.onCommentsListClick(this._commentsListClickHandler);
    this.onCommentInput(this._commentInputHandler);
    this.onEmojiClick(this._emojiClickHandler);
    this.onCommentSubmit(this._commentSubmitHandler);
  }

  getLocalComment() {
    return Object.assign({}, this._localComment, {
      'comment': encode(this._localComment[`comment`]),
      'date': new Date().toISOString(),
    });
  }

  fillLocalComment(emoji, comment) {
    const imageMarkup = renderEmojiImageMarkup(emoji);

    this.getElement().querySelector(`.film-details__add-emoji-label`)
      .innerHTML = imageMarkup;

    this.getElement().querySelector(`.film-details__comment-input`)
      .value = comment;

    this._localComment[`emoji`] = emoji;
    this._localComment[`comment`] = comment;
  }

  updateComments(newComments) {
    this._comments = [].concat(newComments);
  }

  onCommentsListClick(handler) {
    this.getElement().querySelector(`.film-details__comments-list`)
      .addEventListener(`click`, (evt) => {
        if (evt.target.tagName !== `BUTTON`) {
          return;
        }
        evt.preventDefault();
        handler(evt);
        this.rerender();
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
      .addEventListener(`input`, (evt) => handler(evt));

    this._commentInputHandler = handler;
  }

  onCommentSubmit(handler) {
    this.getElement().querySelector(`.film-details__new-comment`)
      .addEventListener(`keydown`, (evt) => {
        if (evt.ctrlKey && evt.key === Key.ENTER) {
          handler();
        }
      });

    this._commentSubmitHandler = handler;
    // this.rerender();
  }
}
