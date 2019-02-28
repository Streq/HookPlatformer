define(function () {
	function create(html) {
		var template = document.createElement('template'),
			text = html.trim();
		template.innerHTML = text;
		return template.content.firstChild;
	};

	function get(id, root) {
		root = root || document.body;
		return root.querySelector(`[app-id=${id}]`);
	};

	function set(id, html, root) {
		root = root || document.body;
		let target = get(id, root);
		if (!target) {
			target = document.createElement("template");
			root.appendChild(target);
		}
		target.outerHTML = html;
		return target;
	};

	function inner(id, value, root) {
		root = root || document.body;
		let target = get(id);
		target.innerHTML = content;
		return target;
	};

	function getMousePos(mouseEvent, element){
		var rect = element.getBoundingClientRect();
		return {
			x: mouseEvent.clientX - rect.left,
			y: mouseEvent.clientY - rect.top
		};
	}
    
    function reloadScrollBar() {
        document.documentElement.style.overflow = 'auto';  // firefox, chrome
        document.body.scroll = "yes"; // ie only
    }

    function unloadScrollBar() {
        document.documentElement.style.overflow = 'hidden';  // firefox, chrome
        document.body.scroll = "no"; // ie only
    }
	
	
	/**
	 * Load some dang image, then pass it to a callback;
	 * @param {String} src - the image path,
	 * @param {function(Image img)} [onload] - function to execute once the image is loaded.
	 */
	function loadImage(src, onload){
		onload = onload || (x => x);
		return new Promise((resolve) => {
			var img = document.createElement("img");
			img.onload = () => resolve(onload(img));
			img.src = src;
		});
	}
	/**
	 * Load some dang images;
	 * @function
	 * @param {String[]} srcs - the images paths,
	 * @param {function(loadImages~ImageMap imgs)}[onload] - function to execute once all images are loaded.
	 */
	function loadImages(srcs, onload){
		onload = onload || (x => x);
		var imgs = {};
		function loadAndAdd(src){
			return loadImage(src, img => {imgs[src] = img;});
		}
		return Promise.all(srcs.map(loadAndAdd))
			.then(() => onload(imgs));
	}
	
	/**
	 * Load some dang json, then pass it to a callback;
	 * @param {String} src - the json path,
	 * @param {function(Object json)} onload - function to execute once the json is loaded.
	 */
	function loadJSON(src, onload){
		onload = onload || (x => x);
		return fetch(src)
			.then(response => response.json())
			.then(json => onload(json));
	}
	return {
		create: create,
		get: get,
		set: set,
		inner: inner,
		getMousePos: getMousePos,
        reloadScrollBar: reloadScrollBar,
        unloadScrollBar: unloadScrollBar,
		loadImg: loadImage,
		loadImgs: loadImages,
		loadJSON: loadJSON
	};
});