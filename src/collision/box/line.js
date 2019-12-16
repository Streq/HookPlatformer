export default function(x,y,w,h,a,b,c,d){
	let	
		dx = c-a
	,	dy = d-b
	,	n = 1/dx
	,	m = 1/dy
	//si representamos el segmento como 
	//S(t) = A + t * (B - A)
	// con t >= 0 && t <= 1
	//tonces
	//(S(t) - A) / (B - A) = t
	//nos fijamos cuanto es t para el borde izquierdo del rect
	,	tx1 = (x - a)*n
	//nos fijamos cuanto es t para el borde derecho del rect
	,	tx2 = (x+w - a)*n

	//nos fijamos t para el borde superior
	,	ty1 = (y - b)*m
	//nos fijamos t para el borde inferior
	,	ty2 = (y+h - b)*m

	//de haber interseccion:
	//el tmin es la primera instancia de t para la cual x e y estan en el rect
	//es decir, el t mayor entre txmin y tymin
	,	tmin = Math.max(Math.min(tx1, tx2), Math.min(ty1, ty2))
	//el tmin es la ultima instancia de t para la cual x e y estan en el rect
	//es decir, el t menor entre txmax y tymax
	,	tmax = Math.min(Math.max(tx1, tx2), Math.max(ty1, ty2))
	;

	return tmax >= tmin && (		// tmax solo es menor si los intervalos (txmin,txmax) y (tymin,tymax) no se tocan
		(tmin > 0 && tmin < 1) ||	// la primera colision ocurre dentro del segmento
		(tmin <= 0 && tmax > 0)		// la primera colision ocurre retrocediendo pero la segunda avanzando -> esta dentro del rect
	);
}

export function data(x,y,w,h,a,b,c,d){
	let 
		dx = c-a
	,	dy = d-b
	,	n = 1/dx
	,	m = 1/dy
	//si representamos el segmento como 
	//S(t) = A + t * (B - A)
	// con t >= 0 && t <= 1
	//tonces
	//(S(t) - A) / (B - A) = t
	//nos fijamos cuanto es t para el borde izquierdo del rect
	,	tx1 = (x - a)*n
	//nos fijamos cuanto es t para el borde derecho del rect
	,	tx2 = (x+w - a)*n

	//nos fijamos t para el borde superior
	,	ty1 = (y - b)*m
	//nos fijamos t para el borde inferior
	,	ty2 = (y+h - b)*m

	,	txmin = Math.min(tx1, tx2)
	,	tymin =  Math.min(ty1, ty2)

	,	txmax = Math.max(tx1, tx2)
	,	tymax =  Math.max(ty1, ty2)

	//de haber interseccion:
	//el tmin es la primera instancia de t para la cual x e y estan en el rect
	//es decir, el t mayor entre txmin y tymin
	,	tmin = Math.max(txmin, tymin)
	//el tmin es la ultima instancia de t para la cual x e y estan en el rect
	//es decir, el t menor entre txmax y tymax
	,	tmax = Math.min(txmax, tymax)

	,	sdx = Math.sign(dx)
	,	sdy = Math.sign(dy)
	;

	return {
		tmin:tmin,
		tmax:tmax,
		side_tmin:{
			x: (tmin == txmin) && -sdx,
			y: (tmin == tymin) && -sdy
		},
		side_tmax:{
			x: (tmax == txmax) && sdx,
			y: (tmax == tymax) && sdy
		},
	};
}