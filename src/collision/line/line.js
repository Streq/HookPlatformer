export default function(a, b, c, d, p, q, r, s) {
	var det, gamma, lambda;
	det = (c - a) * (s - q) - (r - p) * (d - b);
	if (det === 0) {
		return false;
	} else {
		let det_1 = 1/det;
		lambda = ((s - q) * (r - a) + (p - r) * (s - b)) * det_1;
		gamma = ((b - d) * (r - a) + (c - a) * (s - b)) * det_1;
		return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
	}
}

export function closed(a, b, c, d, p, q, r, s) {
	var det, gamma, lambda;
	det = (c - a) * (s - q) - (r - p) * (d - b);
	if (det === 0) {
		return false;
	} else {
		let det_1 = 1/det;
		lambda = ((s - q) * (r - a) + (p - r) * (s - b)) * det_1;
		gamma = ((b - d) * (r - a) + (c - a) * (s - b)) * det_1;
		return (0 <= lambda && lambda <= 1) && (0 <= gamma && gamma <= 1);
	}
}

export function lambda(a, b, c, d, p, q, r, s) {
	var det, gamma, lambda;
	det = (c - a) * (s - q) - (r - p) * (d - b);
	if (det === 0) {
		return 1; //they are parallel
	} else {
		lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
		gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
		return ((0 <= lambda && lambda < 1) && (0 <= gamma && gamma <= 1)) ?
			lambda :
			1;
	}
}