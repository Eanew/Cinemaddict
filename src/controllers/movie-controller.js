import {isEscEvent} from '../utils/common.js';
import {render, replace} from '../utils/render.js';

import CardComponent from '../components/film-card.js';
import DetailsComponent from '../components/details.js';
import CommentsComponent from '../components/comments.js';

import {generateCommentsData} from '../mock/comments.js';

const PERMISSION_TO_OPEN_NEW_POPUP_TIMEOUT = 200;

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
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._data = null;
    this._cardComponent = null;
    this._detailsComponent = null;
    this._lastDetailsComponent = null;
    this._commentsComponent = null;
    this._commentsContainer = null;
    this._commentsCountElement = null;
    this._comments = generateCommentsData();

    this._closePopup = this._closePopup.bind(this);
    this._onPopupEscPress = this._onPopupEscPress.bind(this);
    this.setDefaultView = this.setDefaultView.bind(this);
  }

  render(card) {
    const oldCardComponent = this._cardComponent;
    const oldDetailsComponent = this._detailsComponent;

    this._data = card;
    this._comments = this._comments.slice(0, card[`comments`].length);
    this._cardComponent = new CardComponent(card);
    this._detailsComponent = new DetailsComponent(card);
    this._commentsComponent = new CommentsComponent(this._comments, this._onDataChange);
    this._commentsContainer = this._detailsComponent.getElement().querySelector(`.form-details__bottom-container`);
    this._commentsCountElement = this._commentsComponent.getElement().querySelector(`.film-details__comments-count`);

    render(this._commentsContainer, this._commentsComponent);

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
            'watching_date': new Date().toISOString,
          }),
        })));

      component.onMarkAsFavoriteButtonClick(() => this.
        _onDataChange(card, Object.assign({}, card, {

          'user_details': Object.assign({}, UserDetails, {

            'favorite': !card[`user_details`][`favorite`],
          }),
        })));
    });

    this._cardComponent.onPopupOpenersClick((evt) => {
      this._openPopup(evt);
    });

    if (oldCardComponent && oldDetailsComponent) {
      replace(this._cardComponent, oldCardComponent);

      if (pageBody.contains(oldDetailsComponent.getElement())) {
        this._addPopupListeners();
        replace(this._detailsComponent, oldDetailsComponent);
      }

    } else {
      render(this._container, this._cardComponent);
    }
  }

  getData() {
    return this._data;
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
  }

  _closePopup() {
    disableCasualPopupOpening();
    this.setDefaultView();
  }

  _onPopupEscPress(evt) {
    isEscEvent(evt, this._closePopup);
  }

  _deleteComment(evt) {
    const commentsElements = Array.from(evt.currentTarget.children);
    commentsElements.forEach((item, index) => {
      if (item.contains(evt.target)) {
        this._comments = this._comments.filter((it, i) => i !== index);
        this._commentsCountElement.textContent--;
        item.remove();
      }
    });
  }

  _addPopupListeners() {
    this._detailsComponent.onPopupClick((evt) => evt.stopPropagation());
    this._detailsComponent.onCloseButtonClick(this._closePopup);
    this._commentsComponent.onDeleteButtonsClick((evt) => this._deleteComment(evt));
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
    this._addPopupListeners();
    this._lastDetailsComponent = this._detailsComponent;
    pageBody.appendChild(this._detailsComponent.getElement());
  }
}
