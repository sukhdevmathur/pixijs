import { Application, Assets, Container, TilingSprite } from "pixi.js";

class Index extends Container {
	constructor() {
		super();
		this._application = new Application();
	}
	async init() {
		await this._application.init({
			resizeTo: window,
			backgroundColor: 0xff0000,
		});

		document.body.appendChild(this._application.canvas);

		// const texture = await Assets.load("../assets/bg-tile.png");

		const texture = await Assets.load("../assets/Corruption1.png");

		const textureWidth = texture.width;
		const textureHeight = texture.height;

		// Calculate scale factors
		const scaleX = this._application.screen.width / textureWidth;
		const scaleY = this._application.screen.height / textureHeight;

		/**tiles will be repeated with in the given size */
		/**For bg-tile.png */
		// const bg = new TilingSprite({
		// 	texture,
		// 	width: window.innerWidth,
		// 	height: window.innerHeight,
		// 	tileScale: {
		// 		x: 1,
		// 		y: 1,
		// 	},
		// });

		/**corruption1.png */
		const bg = new TilingSprite({
			texture,
			width: window.innerWidth,
			height: window.innerHeight,
			tileScale: {
				x: scaleX,
				y: scaleY,
			},
		});

		this.addChild(bg);

		this._application.stage.addChild(this);

		// Animate the tiling sprite
		this._application.ticker.add((delta) => {
			bg.tilePosition.x += Math.ceil(delta.deltaTime); // Move the tiles horizontally
			// bg.tilePosition.y += 0.5 * Math.ceil(delta.deltaTime); // Move the tiles vertically
		});
	}
}

const app = new Index();

app.init();
