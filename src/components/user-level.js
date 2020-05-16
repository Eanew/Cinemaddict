const Rank = {
  'movie buff': 21,
  'fan': 11,
  'novice': 1,
};

const setRank = (movies) => {
  let rank;

  if (movies >= Rank[`movie buff`]) {
    rank = `Movie Buff`;
  } else if (movies >= Rank[`fan`]) {
    rank = `Fan`;
  } else if (movies >= Rank[`novice`]) {
    rank = `Novice`;
  } else {
    rank = null;
  }

  return rank;
};

export const createUserLevelTemplate = (watchedMovies, avatar) => {
  const rank = setRank(watchedMovies);
  return (
    `<section class="header__profile profile">
      ${rank ? `<p class="profile__rating">${rank}</p>` : ``}
      <img class="profile__avatar" src="${avatar}" alt="Avatar" width="35" height="35">
    </section>`
  );
};
