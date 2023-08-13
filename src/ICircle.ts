import P5 from "p5";

export default class ICircle {
	_p5: P5;
	_size: number;
    _color: number[];

	constructor(p5: P5, size: number, color: number[]) {
		this._p5 = p5;
		this._size = size;
        this._color = color;
	}

	draw() {
		const p5 = this._p5; // just for convenience
		
		p5.fill(p5.color(this._color[0], this._color[1], this._color[2]));
		p5.circle(0, 0, this._size);
	}
}
