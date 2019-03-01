define(function () {
	function approach(val, target, amount) {
		if (val == target) return val;
		if (val < target) return Math.min(val + amount, target);
		return Math.max(val - amount, target);
	};

	function toRadians(degrees) {
		return degrees * Math.PI / 180;
	};

	function toDegrees(radians) {
		return radians * 180 / Math.PI;
	};


	function modulo(index, size) {
		return (size + (index % size)) % size;
	}
	let mod = modulo;

	function clamp(min, max, val) {
		return Math.min(max, Math.max(min, val));
	}

	function offsetNoRepeat(size, index) {
		//clamp
		return clamp(0, size - 1, index);
	}

	function offsetRepeat(size, index) {
		//wrap
		return modulo(size, index);
	}

	function offsetBoomerang(size, index) {
		//oscillate
		var size2 = size * 2 - 2;
		var index2 = modulo(size2, index);
		return (index2 > size - 1) ?
			size2 - index2 :
			index2;
	}

	function compare(a,b,error){
		return Math.abs(a-b)<error;
	}
	return {
		approach: approach,
		toRadians: toRadians,
		toDegrees: toDegrees,
		modulo: modulo,
		mod:modulo,
		clamp: clamp,
		offsetNoRepeat: offsetNoRepeat,
		offsetRepeat: offsetRepeat,
		offsetBoomerang: offsetBoomerang,
		compare: compare,
	};
});