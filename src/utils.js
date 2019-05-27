export const isItemRemarks = item => {
  const lastChar = item.description[item.description.length - 1];
  return lastChar === "*";
};
