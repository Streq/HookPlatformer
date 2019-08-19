export function data(a, b, c, d, p, q, r, s){
	var det, gamma, lambda;
	det = (c - a) * (s - q) - (r - p) * (d - b);
	if(det){
		let det_ = 1/det
		lambda = ((s - q) * (r - a) + (p - r) * (s - b)) * det_;
		gamma = ((b - d) * (r - a) + (c - a) * (s - b)) * det_;
		return {
			lambda: lambda,
			gamma: gamma
		};
	}
	return null;
}

export function checkData(d){
	d && (0 < d.lambda && d.lambda < 1) && (0 < d.gamma && d.gamma < 1);
}

export function checkClosedData(d){
	d && (0 <= d.lambda && d.lambda <= 1) && (0 <= d.gamma && d.gamma <= 1)
}

export function check(a, b, c, d, p, q, r, s){ 
	return checkData(data(a, b, c, d, p, q, r, s));
}

export function checkClosed(a, b, c, d, p, q, r, s){ 
	let d = checkClosedData(data(a, b, c, d, p, q, r, s));
}
