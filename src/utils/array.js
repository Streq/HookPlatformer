
define([],function () {
	/**
	@callback RemoveIfCallback 
	@param {Object} element
	@param {number} index
	@returns boolean
	*/
	
	/**
	@param {Array} array
	@param {RemoveIfCallback} predicate
	*/
	function removeIf(array, predicate){
		var i = array.length;
		while (i--) {
			if (predicate(array[i], i)) {
				array.splice(i, 1);
			}
		}
	}
	
	function forEachReversed(array, callback){
		var i = array.length;
		while (i--) {
			callback(array[i], i, array);
		}
	}
	
	return {
		removeIf: removeIf,
		forEachReversed: forEachReversed,
	};
});
