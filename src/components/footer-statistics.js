import AbstractComponent from "./abstract-component";

const createFooterStatisticsTemplate = (films) => {
  return (
    `<p>${films || `No`} movies inside</p>`
  );
};

export default class FooterStatisticsComponent extends AbstractComponent {
  constructor(films) {
    super();

    this._films = films;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._films);
  }
}
