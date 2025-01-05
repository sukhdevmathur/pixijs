import { Application, Assets, Container, SCALE_MODES, Sprite } from "pixi.js";

export class DragAndDrop extends Container {
	constructor() {
		super();
		this.app = new Application();
		this.dragTarget = null;
	}

	async init() {
		await this.app.init({ resizeTo: window, backgroundColor: 0xdfdfdf });

		document.body.appendChild(this.app.canvas);

		const texture = await Assets.load("../../assets/prop.png");
		texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;

		this.mainContainer = new Container();

		this.app.stage.addChild(this.mainContainer);

		this.startStage(texture);
		this.app.stage.eventMode = "static";
		this.app.stage.hitArea = this.app.screen;
		this.app.stage.on("pointerup", this.dragend.bind(this));
		this.app.stage.on("pointerupoutside", this.dragend.bind(this));
	}

	startStage(texture) {
		for (let i = 0; i < 10; i++) {
			const x = Math.random() * this.app.screen.width;
			const y = Math.random() * this.app.screen.height;
			this.setImage(x, y, texture);
		}
	}

	setImage(x, y, texture) {
		const sprite = Sprite.from(texture);

		sprite.x = x;
		sprite.y = y;
		sprite.anchor.set(0.5);
		sprite.scale.set(0.25);

		sprite.eventMode = "static";
		sprite.cursor = "pointer";
		// sprite.interactive = true;
		sprite.on("pointerdown", this.dragStart.bind(this), sprite);
		// baseTexture.scaleMode
		this.mainContainer.addChild(sprite);
	}

	dragStart(event) {
		this.dragTarget = event.target;
		this.app.stage.on("pointermove", this.dragMove.bind(this));
	}

	dragMove(event) {
		if (this.dragTarget) {
			this.dragTarget.parent.toLocal(
				event.global,
				null,
				this.dragTarget.position
			);
		}
	}

	dragend(event) {
		if (this.dragTarget) {
			this.app.stage.off("pointermove", this.dragMove.bind(this));
			this.dragTarget = null;
		}
	}
}

const app = new DragAndDrop();
app.init();
