export const generateFieldsData = () => {
  return [
    {
      name: `year`,
      value: `1929`,
    },
    {
      name: `duration`,
      value: `1h 55m`,
    },
    {
      name: `genre`,
      value: `Musical`,
    },
  ];
};

export const generateControlsData = () => {
  return [
    {
      name: `Add to watchlist`,
    },
    {
      name: `Mark as watched`,
    },
    {
      name: `Mark as favorite`,
      id: `favorite`,
      isActive: true,
    },
  ];
};
