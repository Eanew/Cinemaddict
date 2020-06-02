import {isEscEvent} from '../utils/common.js';
import {render, replace, remove} from '../utils/render.js';

import CardComponent from '../components/film-card.js';
import DetailsComponent from '../components/details.js';
import CommentsComponent from '../components/comments.js';

const PERMISSION_TO_OPEN_NEW_POPUP_TIMEOUT = 200;
const SHAKE_ANIMATION_TIMEOUT = 600;

const pageBody = document.querySelector(`body`);

let isPopupAlredyClosed = false;
let lastTimeout;

const disableCasualPopupOpening = () => {
  isPopupAlredyClosed = true;
  if (lastTimeout) {
    clearTimeout(lastTimeout);
  }
  lastTimeout = setTimeout((() => {
    isPopupAlredyClosed = false;
  }), PERMISSION_TO_OPEN_NEW_POPUP_TIMEOUT);
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange, api) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._api = api;

    this._data = null;
    this._cardComponent = null;
    this._detailsComponent = null;
    this._lastDetailsComponent = null;
    this._commentsComponent = null;
    this._commentsContainer = null;
    this._commentValue = null;
    this._emojiValue = null;
    this._comments = [];

    this._closePopup = this._closePopup.bind(this);
    this._onPopupEscPress = this._onPopupEscPress.bind(this);
    this._onCommentsListClick = this._onCommentsListClick.bind(this);
    this._onCommentInput = this._onCommentInput.bind(this);
    this._onEmojiClick = this._onEmojiClick.bind(this);
    this._onCommentSubmit = this._onCommentSubmit.bind(this);
    this.setDefaultView = this.setDefaultView.bind(this);
  }

  render(card) {
    const oldCardComponent = this._cardComponent;
    const oldDetailsComponent = this._detailsComponent;

    this._data = card;

    this._cardComponent = new CardComponent(card);
    this._detailsComponent = new DetailsComponent(card);
    this._commentsComponent = new CommentsComponent(this._comments);
    this._commentsContainer = this._detailsComponent.getElement().querySelector(`.form-details__bottom-container`);

    const UserDetails = Object.assign({}, card[`user_details`]);

    [this._cardComponent, this._detailsComponent].forEach((component) => {

      component.onAddToWatchlistButtonClick(() => this.
        _onDataChange(card, Object.assign({}, card, {

          'user_details': Object.assign({}, UserDetails, {

            'watchlist': !card[`user_details`][`watchlist`],
          }),
        })));

      component.onMarkAsWatchedButtonClick(() => this.
        _onDataChange(card, Object.assign({}, card, {

          'user_details': Object.assign({}, UserDetails, {

            'already_watched': !card[`user_details`][`already_watched`],
            'watching_date': new Date().toISOString(),
          }),
        })));

      component.onMarkAsFavoriteButtonClick(() => this.
        _onDataChange(card, Object.assign({}, card, {

          'user_details': Object.assign({}, UserDetails, {

            'favorite': !card[`user_details`][`favorite`],
          }),
        })));
    });

    this._cardComponent.onPopupOpenersClick((evt) => this._openPopup(evt));

    if (this._emojiValue || this._commentValue) {
      this._commentsComponent.fillLocalComment(this._emojiValue, this._commentValue);
    }
    render(this._commentsContainer, this._commentsComponent);

    if (oldCardComponent && oldDetailsComponent) {

      if (pageBody.contains(oldDetailsComponent.getElement())) {
        replace(this._detailsComponent, oldDetailsComponent);
        this._addPopupListeners();
      }

      replace(this._cardComponent, oldCardComponent);
      return;
    }
    render(this._container, this._cardComponent);
  }

  getData() {
    return this._data;
  }

  destroy() {
    remove(this._cardComponent);
    remove(this._detailsComponent);
    remove(this._commentsComponent);
    document.removeEventListener(`keydown`, this._onPopupEscPress);
    document.removeEventListener(`click`, this._closePopup);
  }

  commentReset() {
    this._commentValue = null;
    this._emojiValue = null;
    this._commentsComponent.fillLocalComment(this._emojiValue, this._commentValue);
  }

  setDefaultView() {
    if (!this._detailsComponent || !pageBody.contains(this._detailsComponent.getElement())) {
      return;
    }
    document.removeEventListener(`keydown`, this._onPopupEscPress);
    document.removeEventListener(`click`, this._closePopup);
    pageBody.removeChild(this._detailsComponent.getElement());
    this._lastDetailsComponent = null;
    this._onDataChange(this._data, Object.assign({}, this._data, {
      'comments': this._comments.map((it) => it[`id`]),
    }));
    this.commentReset();
  }

  _closePopup() {
    disableCasualPopupOpening();
    this.setDefaultView();
  }

  _onPopupEscPress(evt) {
    isEscEvent(evt, this._closePopup);
  }

  _openPopup(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    if ((this._detailsComponent === this._lastDetailsComponent) || isPopupAlredyClosed) {
      return;
    }
    this._onViewChange();

    document.addEventListener(`keydown`, this._onPopupEscPress);
    document.addEventListener(`click`, this._closePopup);
    this._lastDetailsComponent = this._detailsComponent;
    this._addPopupListeners();
    pageBody.appendChild(this._detailsComponent.getElement());

    this._api.getComments(this._data[`id`])
      .then((response) => {
        this._comments = response;
        this._commentsComponent.rerender(this._comments);
      });
  }

  _onCommentsListClick(evt) {
    Array.from(evt.currentTarget.children).forEach((item, index) => {

      if (item.contains(evt.target)) {
        this._api.deleteComment(this._comments[index][`id`])
          .then(() => {
            this._comments = this._comments.filter((it, i) => i !== index);
            this._commentsComponent.rerender(this._comments);
          })
          .catch(() => {
            this._shake();
          });
      }
    });
  }

  _onEmojiClick(evt) {
    this._emojiValue = evt.target.value;
    this._commentsComponent.fillLocalComment(this._emojiValue, this._commentValue);
  }

  _onCommentInput(evt) {
    this._commentValue = evt.target.value;
    this._commentsComponent.fillLocalComment(this._emojiValue, this._commentValue);
  }

  _onCommentSubmit() {
    const localComment = this._commentsComponent.getLocalComment();
    if (localComment.emotion && localComment.comment && localComment.comment.length) {
      this._api.createComment(this._data[`id`], localComment)
        .then((response) => {
          this.commentReset();
          this._comments = response.comments;
          this._commentsComponent.rerender(this._comments);
        })
        .catch(() => {
          this._shake();
        });
    } else {
      this._shake();
    }
  }

  _addPopupListeners() {
    this._detailsComponent.onPopupClick((evt) => evt.stopPropagation());
    this._detailsComponent.onCloseButtonClick(this._closePopup);
    this._commentsComponent.onCommentsListClick(this._onCommentsListClick);
    this._commentsComponent.onEmojiClick(this._onEmojiClick);
    this._commentsComponent.onCommentInput(this._onCommentInput);
    this._commentsComponent.onCommentSubmit(this._onCommentSubmit);
  }

  _shake() {
    this._detailsComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._detailsComponent.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
