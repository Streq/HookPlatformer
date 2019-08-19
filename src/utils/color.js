export function itos(_0xRRGGBB){
	return '#' + Number(_0xRRGGBB).toString(16).padStart(6,'0');
}
export function stoi(_RRGGBB){
	return parseInt(_RRGGBB.substr(1),16);
}
export function complement(_RRGGBB){
	return itos(0xffffff ^ stoi(_RRGGBB));
}