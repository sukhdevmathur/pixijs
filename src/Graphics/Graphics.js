import { Application, Container, Graphics } from "pixi.js";

class GraphicsDesign extends Container {
	constructor() {
		super();
		this._application = new Application();
	}

	async init() {
		const rows = 5; // Number of rows
		const cols = 5; // Number of columns
		const boxSize = 50;

		await this._application.init({
			resizeTo: window,
			backgroundColor: 0xfff888,
		});

		document.body.appendChild(this._application.canvas);

		const line = new Graphics();

		/** Horizontal lines */
		for (let i = 1; i <= 5; i++) {
			line.moveTo(i * 40, 40)
				.lineTo(i * 40, 200)
				.stroke({ width: 4, color: 0xff0000 });
		}

		/** Vertical lines */
		for (let i = 1; i <= 5; i++) {
			line.moveTo(40, i * 40)
				.lineTo(200, i * 40)
				.stroke({ width: 4, color: 0xff0000 });
		}

		this._application.stage.addChild(line);

		const graphics = new Graphics();
		graphics
			.moveTo(300, 40)
			.lineTo(450, 40)
			.lineTo(375, 140)
			.lineTo(300, 40)
			.stroke({ width: 4, color: 0xff0000 })
			.fill(0x00ff88);

		this._application.stage.addChild(graphics);

		const grid = new Graphics();

		// Draw the grid
		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				// Determine the color (alternate colors)
				const isEven = (row + col) % 2 === 0;
				const color = isEven ? 0x3498db : 0xe74c3c; // Blue and Red

				// Draw the box
				// grid.beginFill(color);
				grid.rect(
					col * boxSize + 220,
					row * boxSize + 220,
					boxSize,
					boxSize
				).fill(color);
				// grid.endFill();
			}
		}
		this._application.stage.addChild(grid);
	}
}

const app = new GraphicsDesign();
app.init();
