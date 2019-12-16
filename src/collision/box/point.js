export default function(x, y, w, h, px, py) {
	return (
		(px > x) &&
		(py > y) &&
		(px < x + w) &&
		(py < y + h)
	);
}

export function closed(x, y, w, h, px, py) {
	return (
		(px >= x) &&
		(py >= y) &&
		(px <= x + w) &&
		(py <= y + h)
	);
}