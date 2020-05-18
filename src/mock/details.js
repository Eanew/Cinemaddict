import {Emoji} from '../components/details.js';

export const generateTableData = () => {
  return [
    {
      name: `Director`,
      values: [`Anthony Mann`],
    },
    {
      name: `Writers`,
      values: [`Anne Wigton`, `Heinz Herald`, `Richard Weil`],
    },
    {
      name: `Actors`,
      values: [`Erich von Stroheim`, `Mary Beth Hughes`, `Dan Duryea`],
    },
    {
      name: `Release Date`,
      values: [`30 March 1945`],
    },
    {
      name: `Runtime`,
      values: [`1h 18m`],
    },
    {
      name: `Country`,
      values: [`USA`],
    },
    {
      name: `Genres`,
      values: [`Drama`, `Film-Noir`, `Mystery`],
    }
  ];
};

export const generateControlsData = () => {
  return [
    {
      name: `Add to watchlist`,
      id: `watchlist`,
    },
    {
      name: `Already watched`,
      id: `watched`,
    },
    {
      name: `Add to favorites`,
      id: `favorite`,
    },
  ];
};

export const generateCommentsData = () => {
  return [
    {
      author: `Tim Macoveev`,
      time: `2019/12/31 23:59`,
      text: `Interesting setting and a good cast`,
      emoji: Emoji.smile,
    },
    {
      author: `John Doe`,
      time: `2 days ago`,
      text: `Booooooooooring`,
      emoji: Emoji.sleeping,
    },
    {
      author: `John Doe`,
      time: `2 days ago`,
      text: `Very very old. Meh`,
      emoji: Emoji.puke,
    },
    {
      author: `John Doe`,
      time: `Today`,
      text: `Almost two hours? Seriously?`,
      emoji: Emoji.angry,
    },
  ];
};
