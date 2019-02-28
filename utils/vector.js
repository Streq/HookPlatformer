define(function () {
	class Vector {
		get length() {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		}
		get lengthSquared() {
			return this.x * this.x + this.y * this.y;
		}
		get unit() {
			return Vector.div(this, this.length);
		}
		normalize() {
			(this.x || this.y || this.div(1)) && this.div(this.length);
			return this;
		}
		constructor(x = 0, y = 0) {
			this.x = x;
			this.y = y;
		}
		assign(b) {
			this.x = b.x;
			this.y = b.y;
			return this;
		}
		add(b) {
			this.x += b.x;
			this.y += b.y;
			return this;
		}
		sub(b) {
			this.x -= b.x;
			this.y -= b.y;
			return this;
		}
		mul(b) {
			this.x *= b;
			this.y *= b;
			return this;
		}
		div(b) {
			this.x /= b;
			this.y /= b;
			return this;
		}
		scale(b) {
			this.x *= b.x;
			this.y *= b.y;
			return this;
		}
		static copy(a) {
			return new Vector(a.x, a.y);
		}
		static add(a, b) {
			return new Vector(a.x + b.x, a.y + b.y);
		}
		static sub(a, b) {
			return new Vector(a.x - b.x, a.y - b.y);
		}
		static div(a, b) {
			return new Vector(a.x / b, a.y / b);
		}
		static mul(a, b) {
			return new Vector(a.x * b, a.y * b);
		}
		static dot(a, b) {
			return a.x * b.x + a.y * b.y;
		}
		static cross(a, b) {
			return a.x * b.y - a.y * b.x;
		}
		static getLength(a) {
			return Math.sqrt(a.x * a.x + a.y * a.y);
		}
		static unit(a) {
			return ((a.x || a.y) && Vector.div(a, Vector.getLength(a))) || new Vector(a.x, a.y);
		}
		static scale(a, b) {
			return new Vector(a.x * b.x, a.y * b.y);
		}
		static scalarProjection(a, b) {
			return Vector.dot(a, b) / Vector.getLength(b);
		}
		static interpolate(a, b, val) {
			return new Vector(a.x + (b.x - a.x) * val, a.y + (b.y - a.y) * val);
		}
	}
	return Vector;
});