import P5 from "p5";
import "p5/lib/addons/p5.dom";

import ICircle from "./ICircle";

export class CustomP5 extends P5 {
	constructor() {
		super(() => {});
	}

	setup = () => {
		const canvas = this.createCanvas(400, 400);
		canvas.parent("playlistCover")
	}

	delete() {
		this.clear;
	}

	setBackground(mode: number, instrumentalness: number) {
		this.colorMode(this.HSL);
		let color1;
		let color2;

		let hue;
		let saturation = this.scale_(instrumentalness, 0, 1, 30, 100);
		let lightness = this.scale_(instrumentalness, 0, 1, 30, 40);

		if(mode == 1) {
			// Green background
			hue = this.scale_(instrumentalness, 0, 1, 90, 140);
			color1 = this.color(hue, saturation, lightness);
			color2 = this.color(hue, saturation + 10, lightness + 10);
		}else {
			// Purple background
			hue = this.scale_(instrumentalness, 0, 1, 270, 315);
			color1 = this.color(hue, saturation, lightness);
			color2 = this.color(hue, saturation + 10, lightness + 10);
		}

		// Background
		this.setGradient_(0, 0, this.width / 2, this.height, color1, color2);
		this.setGradient_(this.width / 2, 0, this.width / 2, this.height, color2, color1);
	}

	/**
	 * HSL
	 * @param mode Base color 1: major key (yellow), 0: minor key (blue) (250-190) 250 is "moodier"
	 * @param danceability Base color lightness and hue 0-1, amount of circles, lightness (0-100), hue (0-60)
	 * @param valence Sequential circles lightness and saturation 0-1, lightness (0-100), saturation (100-0)
	 */
	drawCircles(danceability: number, valence: number, energy: number) {
		this.colorMode(this.HSL);
		this.noStroke();
		this.translate(this.width / 2, this.height / 2);
		let amount_of_circles = this.scale_(energy, 0, 1, 3, 12);
		let base_color: number[]; // 255, 204, 0 - yellow | 0, 133, 255 - blue
		let radius_change = this.scale_(danceability, 0, 1, 10, 50);

		// Decide base colour for the circles
		if(valence > 0.5) {
			base_color = [50 - this.scale_(valence, 0.5, 1, 0, 40), 100, 50];
		}else {
			base_color = [230 - this.scale_(valence, 0, 0.5, 0, 30), 100, 50];
		}

		for(let i = 1; i <= amount_of_circles; i++) {
			let radius = this.width/i - radius_change;
			let circle_ = new ICircle(this, radius, base_color)
			circle_.draw();

			// if valence > 0.5 (positive), then ligthness increases (base_color[0])
			// else ligthness decreases. But saturation always decreases [base_color[1]]
			base_color[2] = base_color[2] - 5;
		}
	}

	createSaveButton(playlistName: String) {
		// Create save album cover button
		const button = document.createElement('button');
		button.id = "saveButtonID";
		button.innerText = "Save as file"
		button.addEventListener('click', () => {
			this.saveCanvas(`${playlistName}_cover`, 'png');
		  })
		const divButton = document.getElementById("saveButton");
		divButton?.appendChild(button)
	}

	deleteSaveButton() {
		const button = document.getElementById("saveButtonID");
		button?.remove();
	}

	setGradient_(x: number, y: number, w: number, h: number, c1: any, c2: any) {
		for (let i = y; i <= y + h; i++) {
			let inter = this.map(i, y, y + h, 0, 1);
			let c = this.lerpColor(c1, c2, inter);
			this.stroke(c);
			this.line(x, i, x + w, i);
		}
	}

	scale_(number: number, inMin: number, inMax: number, outMin: number, outMax: number) {
		return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
	}

}