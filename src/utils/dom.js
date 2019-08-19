export function fromString(html){
	var template = document.createElement('template'),
		text = html.trim();
	template.innerHTML = text;
	return template.content.firstChild;
}

export function get(idValue, propertyName, rootElement) {
	let r = rootElement || document.body;
	let p = propertyName || "id";
	let v = idValue;
	return r.querySelector(`[${p}=${v}]`);
};

export function set(stringHtml, idValue, propertyName, rootElement) {
	let target = get(idValue,propertyName,rootElement);
	let r = rootElement || document.body;
	if (!target) {
		target = r.appendChild(fromString(stringHtml));
	} else {
		target.outerHtml = template.outerHtml;
	}
	return target;
};

export function loadScrollBar() {
	document.documentElement.style.overflow = 'auto';  // firefox, chrome
	document.body.scroll = "yes"; // ie only
}

export function unloadScrollBar() {
	document.documentElement.style.overflow = 'hidden';  // firefox, chrome
	document.body.scroll = "no"; // ie only
}

export function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}
