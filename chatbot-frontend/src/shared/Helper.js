import { sanitize, escape, unescapeEntities, normalizeRCData } from "sanitizer";

export const toLowerCaseConverter = (originalString) => {
  return originalString.trim().toLowerCase();
};

export const removeHTMLHandler = (originalString) => {
  return originalString.replace(/<[^>]*>?/gm, "");
};
// export const stringContainHTMLHandler = (originalString) => {
//   function isHTML(str) {
//     var doc = new DOMParser().parseFromString(str, "text/html");
//     return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
//   }
//   return originalString.replace(/<\/?[a-z][\s\S]*>/i, "");
// };

export const stringContainHTMLHandler = (originalString) => {
  // console.log("escape", escape(originalString));
  // console.log("sanitize", sanitize(originalString));
  // console.log("unescapeEntities", unescapeEntities(originalString));
  // console.log("normalizeRCData", normalizeRCData(originalString));
  // console.log(
  //   "final text: ",
  //   sanitize(originalString).replace(/<\/?[a-z][\s\S]*>/i, "")
  // );
  // console.log("tt", sanitize(originalString.replace(/<\/?[a-z][\s\S]*>/i, "")));

  // return sanitize(originalString.replace(/<\/?[a-z][\s\S]*>/i, ""));
  return originalString;
};
