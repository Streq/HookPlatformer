//like Math.floor but integers are rounded down
export function floor(n){return Math.ceil(n-1);}
export function ceil(n){return Math.floor(n+1);}
export function getDecimalPart(n){return n-Math.trunc(n);}
export function approach(value, target, amount){
	return (
		(value < target) 
			? Math.min(value+amount, target) 
			: Math.max(value-amount, target)
	);
}
export function approachSum(value,target,amount){
	return (
		(value < target) 
			? Math.min(value+amount, target) 
			: Math.max(value+amount, target)
	);
}
export function clamp(v,a,b){
	return Math.min(Math.max(a, v), b);
}
export function clampWithSort(v,a,b){
	return Math2.clamp(v, Math.min(a, b), Math.max(a, b));
}