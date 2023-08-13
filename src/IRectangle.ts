import P5 from "p5";

export default class IRectangle {
	_p5: P5;
	_pos: P5.Vector;
	_size: number;

	constructor(p5: P5, atPosition: P5.Vector, size: number) {
		this._p5 = p5;
		this._pos = atPosition;
		this._size = size;
	}

	draw() {
		const p5 = this._p5; // just for convenience
		
		p5.fill('rgba(0,255,0, 0.25)');
		p5.translate(p5.width / 2, p5.height / 2);
		p5.rotate(p5.PI / 4.0);
		p5.rect(-135, -135, 270, 270);
	}
}
