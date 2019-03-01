
define([],function () {
	/**
	@callback removeIfCallback 
	@param {Object} element
	@param {number} index
	@returns boolean
	*/
	
	/**
	@param {Array} array
	@param {removeIfCallback} predicate
	*/
	function removeIf(array, predicate){
		var i = array.length;
		while (i--) {
			
			if (predicate(array[i], i)) {
				array.splice(i, 1);
			}
		}
	}
	return {
		removeIf: removeIf,
	};
});
