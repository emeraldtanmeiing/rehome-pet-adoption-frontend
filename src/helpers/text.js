export const recoverLineBreak = (str) => {
  return str.replace(/(?:\r\n|\r|\n)/g, "<br>");
};

const support = (function () {
	if (!window.DOMParser) return false;
	var parser = new DOMParser();
	try {
		parser.parseFromString('x', 'text/html');
	} catch(err) {
		return false;
	}
	return true;
})();

export const stringToHTML = function (str) {
  str = recoverLineBreak(str);

  // If DOMParser is supported, use it
  if (support) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, "text/html");
    return doc.body;
  }

  // Otherwise, fallback to old-school method
  var dom = document.createElement("div");
  dom.innerHTML = str;
  return dom;
};

export const stringToHTML2 = function (str) {
    str = recoverLineBreak(str)
	var parser = new DOMParser();
	var doc = parser.parseFromString(str, 'text/html');
	return doc.body;
};
