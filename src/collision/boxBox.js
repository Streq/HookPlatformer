export function check(x0, y0, w0, h0, x1, y1, w1, h1) {
	return (
		(x0 + w0 > x1) &&
		(x1 + w1 > x0) &&
		(y0 + h0 > y1) &&
		(y1 + h1 > y0)
	);
}

export function checkContains(x0, y0, w0, h0, x1, y1, w1, h1) {
	return (
		(x0 <= x1) &&
		(x0 + w0 >= x1 + w1) &&
		(y0 <= y1) &&
		(y0 + h0 >= y1 + h1)
	);
}
