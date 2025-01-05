import {
	AnimatedSprite,
	Application,
	Assets,
	Container,
	Texture,
} from "pixi.js";

class AnimateSprite extends Container {
	constructor() {
		super();
		this._application = new Application();
		this._frames = [];
	}

	async init() {
		await this._application.init({
			resizeTo: window,
			backgroundColor: 0xfff999,
		});

		document.body.appendChild(this._application.canvas);

		const framePath = Array.from(
			{ length: 20 },
			(_, i) => `../../assets/parrot/parrot-${i}.png`
		);

		const loadedTexture = await Assets.load(framePath);

		const frames = Object.values(loadedTexture);

		const parrotAnim = new AnimatedSprite(frames);
		parrotAnim.anchor.set(0.5);
		parrotAnim.position.set(
			window.innerWidth * 0.5,
			window.innerWidth * 0.5 - 100
		);

		parrotAnim.play();
		this._application.stage.addChild(parrotAnim);
	}
}

const app = new AnimateSprite();

app.init();
