export const HOUR_IN_MINUTES = 60;
export const SPACE = ` `;

export const Key = {
  SPACE,
  ESC: `Escape`,
  ENTER: `Enter`,
};

export const Regular = {
  SPACE,
  COMMA: `,`,
  ELLIPSIS: `...`,
  DASH: `-`,
  NUMBERS: /\d+/g,
  EXCEPT_NUMBERS: /(\D+)*[^.\d]/g,
  FIRST_NUMBER: /\d+/,
  EMPTY_SPACE: /\s+/g,
  EMPTY_SPACE_IN_EDGES: /^\s+|\s+(?!.)/g,
};

export const isEscEvent = (evt, action) => {
  if (evt.key === Key.ESC) {
    action();
  }
};

export const swapActiveElements = (container, target, activeElementClass) => {
  if (target && !target.classList.contains(activeElementClass)) {
    container.querySelector(`.${activeElementClass}`).classList.remove(activeElementClass);
    target.classList.add(activeElementClass);
  }
};
