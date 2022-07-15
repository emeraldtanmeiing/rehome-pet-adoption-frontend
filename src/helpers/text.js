export const recoverLineBreak = (str) => {
  return str.replace(/(?:\r\n|\r|\n)/g, "<br>");
};