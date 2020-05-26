import {isEscEvent} from '../utils/common.js';
import {render, replace} from '../utils/render.js';

import CardComponent from '../components/film-card.js';
import DetailsComponent from '../components/details.js';

import {generateCommentsData} from '../mock/details.js';

const PERMISSION_TO_OPEN_NEW_POPUP_TIMEOUT = 200;

const pageBody = document.querySelector(`body`);

let lastDetailsComponent = null;
let isPopupAlredyClosed = false;

const disableCasualPopupOpening = () => {
  isPopupAlredyClosed = true;
  setTimeout((() => {
    isPopupAlredyClosed = false;
  }), PERMISSION_TO_OPEN_NEW_POPUP_TIMEOUT);
};

const closePopup = () => {
  disableCasualPopupOpening();
  document.removeEventListener(`keydown`, onPopupEscPress);
  document.removeEventListener(`click`, closePopup);
  pageBody.removeChild(lastDetailsComponent.getElement());
};

const onPopupEscPress = (evt) => isEscEvent(evt, closePopup);

// const renderFilmCard = (container, card) => {
//   const cardComponent = new CardComponent(card);
//   const detailsComponent = new DetailsComponent(card, generateCommentsData());

//   const appendNewPopup = () => {
//     if (lastDetailsComponent && pageBody.contains(lastDetailsComponent.getElement())) {
//       if (lastDetailsComponent !== detailsComponent) {
//         replace(detailsComponent, lastDetailsComponent);
//       }
//     } else if (!isPopupAlredyClosed) {
//       pageBody.appendChild(detailsComponent.getElement());
//     }
//     lastDetailsComponent = detailsComponent;
//   };

//   const openPopup = (evt) => {
//     evt.preventDefault();
//     evt.stopPropagation();
//     document.addEventListener(`keydown`, onPopupEscPress);
//     document.addEventListener(`click`, closePopup);
//     detailsComponent.onPopupClick((clickEvt) => clickEvt.stopPropagation());
//     detailsComponent.onCloseButtonClick(closePopup);
//     appendNewPopup();
//   };

//   cardComponent.onPopupOpenersClick(openPopup);
//   render(container, cardComponent);
// };

export default class CardController {
  constructor(container) {
    this._container = container;

    this._cardComponent = null;
    this._detailsComponent = null;
  }

  render(card) {
    this._cardComponent = new CardComponent(card);
    this._detailsComponent = new DetailsComponent(card, generateCommentsData());

    const appendNewPopup = () => {
      if (lastDetailsComponent && pageBody.contains(lastDetailsComponent.getElement())) {
        if (lastDetailsComponent !== this._detailsComponent) {
          replace(this._detailsComponent, lastDetailsComponent);
        }
      } else if (!isPopupAlredyClosed) {
        pageBody.appendChild(this._detailsComponent.getElement());
      }
      lastDetailsComponent = this._detailsComponent;
    };

    const openPopup = (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      document.addEventListener(`keydown`, onPopupEscPress);
      document.addEventListener(`click`, closePopup);
      this._detailsComponent.onPopupClick((clickEvt) => clickEvt.stopPropagation());
      this._detailsComponent.onCloseButtonClick(closePopup);
      appendNewPopup();
    };

    this._cardComponent.onPopupOpenersClick(openPopup);
    render(this._container, this._cardComponent);
  }
}
