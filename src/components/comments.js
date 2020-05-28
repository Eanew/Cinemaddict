import AbstractSmartComponent from './abstract-smart-component.js';
import {createMarkup, setTwoDigit} from '../utils/data-process.js';

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

const createCommentsTemplate = (comments, commentsCount) => {
  const detailsCommentsMarkup = createMarkup(comments.slice(0, commentsCount), renderCommentsItemMarkup);
  const emojiListMarkup = createMarkup(emojiList, renderEmojiItemMarkup);

  return (
    `<section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">
        ${commentsCount || `0`}</span>
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

export default class CommentsComponent extends AbstractSmartComponent {
  constructor(comments, commentsCount) {
    super();

    this._comments = comments;
    this._commentsCount = commentsCount;
  }

  getTemplate() {
    return createCommentsTemplate(this._comments, this._commentsCount);
  }

  rerender() {
    super.rerender();
  }

  recoveryListeners() {

  }
}
