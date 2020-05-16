const createSortingItemMarkup = function (name, isActive = false) {
  return (
    `<li>
      <a href="#" class="sort__button${isActive ? ` sort__button--active` : ``}">Sort by ${name}</a>
    </li>`
  );
};

export const createSortingTemplate = () => {
  const sortItem = createSortingItemMarkup(`date`);

  return (
    `<ul class="sort">
      ${sortItem}
      ${sortItem}
      ${sortItem}
    </ul>`
  );
};
