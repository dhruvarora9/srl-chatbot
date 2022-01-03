export const toLowerCaseConverter = (originalString) => {
  return originalString.trim().toLowerCase();
};

export const removeHTMLHandler = (originalString) => {
  return originalString.replace(/<[^>]*>?/gm, "");
};
export const stringContainHTMLHandler = (originalString) => {
  // function isHTML(str) {
  //   var doc = new DOMParser().parseFromString(str, "text/html");
  //   return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
  // }
  return originalString.replace(/<\/?[a-z][\s\S]*>/i, "");
};
