export default function (x0, y0, w0, h0, x1, y1, w1, h1){
	return (
		(x0 + w0 > x1) &&
		(x1 + w1 > x0) &&
		(y0 + h0 > y1) &&
		(y1 + h1 > y0)
	);
}
export function closed(x0, y0, w0, h0, x1, y1, w1, h1){
	return (
		(x0 + w0 >= x1) &&
		(x1 + w1 >= x0) &&
		(y0 + h0 >= y1) &&
		(y1 + h1 >= y0)
	);
}
export function containsClosed(x0, y0, w0, h0, x1, y1, w1, h1) {
	return (
		(x0 <= x1) &&
		(x0 + w0 >= x1 + w1) &&
		(y0 <= y1) &&
		(y0 + h0 >= y1 + h1)
	)
}
export function contains(x0, y0, w0, h0, x1, y1, w1, h1) {
	return (
		(x0 < x1) &&
		(x0 + w0 > x1 + w1) &&
		(y0 < y1) &&
		(y0 + h0 > y1 + h1)
	)
}
export function coords(x0a, y0a, x1a, y1a, x0b, y0b, x1b, y1b) {
	return (
		(x1a > x0b) &&
		(x1b > x0a) &&
		(y1a > y0b) &&
		(y1b > y0a)
	);
}