/** @typedef {{x:number, y:number}} Point */

/** @param {number} x,@param {number} y */
export const make = (x,y) => ({x: x, y: y});

/** @param {Point} p */
export const copy = p => ({x: p.x, y: p.y});

/** @param {Point} a, @param {Point} b */
export const add = (a,b) =>  ({x: a.x + b.x, y: a.y + b.y});

/** @param {Point} a, @param {Point} b */
export const sub = (a,b) =>  ({x: a.x - b.x, y: a.y - b.y});

/** @param {Point} a, @param {Point} b */
export const mul = (a,b) =>  ({x: a.x * b.x, y: a.y * b.y});

/** @param {Point} a, @param {number} k */
export const scale = (a,k) =>  ({x: a.x * k, y: a.y * k});

/** @param {Point} a, @param {Point} b */
export const dot = (a,b) =>  (a.x * b.x + a.y * b.y);

/** @param {Point} a, @param {Point} b */
export const cross = (a,b) => (a.x * b.y - b.x * a.y);

/** @param {Point} p */
export const squareLength = (p) => (p.x*p.x + p.y*p.y);

/** @param {Point} p */
export const length = (p) => (Math.sqrt(p.x*p.x + p.y*p.y));

/** @param {Point} p */
export const unit = (p) => scale(p, length(p));