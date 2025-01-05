import { AnimatedSprite, Application, Assets, Container } from "pixi.js";

class PlayerAnim extends Container {
	constructor() {
		super();
		this._application = new Application();

		this._playerTexture = null;
		this._currentAnim = null;
		this._currentAnimation = null; // Current animation name
		this._animationQueue = []; // Queue for pending animations
		this._isAnimating = false; // Animation lock
		this._heldKeys = new Set(); // To track currently pressed keys
	}

	async init() {
		await this._application.init({
			resizeTo: window,
			backgroundColor: 0xfff888,
		});

		document.body.appendChild(this._application.canvas); 
		// Load the player texture atlas
		this._playerTexture = await Assets.load(
			"../../assets/pirate/player.json"
		);

		// Start with the IDLE animation
		this.playAnimation("IDLE");

		// Listen for key down and key up events
		window.addEventListener("keydown", (event) =>
			this.handleKeyDown(event)
		);
		window.addEventListener("keyup", (event) => this.handleKeyUp(event));
	}

	handleKeyDown(event) {
		// Add key to the set of pressed keys
		this._heldKeys.add(event.key);

		// Handle the animation based on the key pressed
		const animationMap = {
			ArrowLeft: "WALK",
			ArrowUp: "JUMP",
			ArrowDown: "DIE",
			a: "ATTACK",
			x: "HURT",
			d: "RUN",
		};

		const animation = animationMap[event.key] || "IDLE";
		this.queueAnimation(animation);
	}

	handleKeyUp(event) {
		// Remove key from the set of pressed keys
		this._heldKeys.delete(event.key);

		// If no keys are pressed, switch to IDLE animation
		if (this._heldKeys.size === 0) {
			this.queueAnimation("IDLE");
		}
	}

	queueAnimation(animation) {
		// Add animation to the queue if it's not already playing
		this._animationQueue.push(animation);
		this.processQueue();
	}

	processQueue() {
		if (this._isAnimating || !this._animationQueue.length) return;

		const nextAnimation = this._animationQueue.shift();
		this.switchAnimation(nextAnimation, nextAnimation === "IDLE");
	}

	playAnimation(animation) {
		// Verify if the animation exists
		const textures = this._playerTexture.animations[`anim_${animation}`];
		if (!textures) {
			console.error(`Animation ${animation} does not exist.`);
			return;
		}

		// Create and add the AnimatedSprite if it doesn't exist
		if (!this._currentAnim) {
			this._currentAnim = new AnimatedSprite(textures);
			this._currentAnim.position.set(
				window.innerWidth * 0.5,
				window.innerHeight * 0.5
			);
			this._currentAnim.scale.set(0.2);
			this._currentAnim.animationSpeed = 0.2;
			this._currentAnim.loop = animation === "IDLE";
			this._currentAnim.play();
			this._application.stage.addChild(this._currentAnim);

			this._currentAnim.onComplete = () => {
				this._isAnimating = false;
				this.processQueue();
			};
		}

		this._currentAnimation = animation; // Track current animation
	}

	switchAnimation(animation, loop = false) {
		// Skip if the requested animation is already playing
		if (this._currentAnimation === animation && this._isAnimating) {
			return;
		}

		// Update the textures and start the new animation
		const textures = this._playerTexture.animations[`anim_${animation}`];
		if (!textures) {
			console.error(`Animation ${animation} does not exist.`);
			return;
		}

		this._currentAnim.textures = textures;
		this._currentAnim.loop = loop;
		this._currentAnim.gotoAndPlay(0); // Start from the beginning
		this._currentAnimation = animation; // Update current animation name
		this._isAnimating = !loop; // Lock animation for non-looping animations
	}
}

// Initialize the player animation
const app = new PlayerAnim();
app.init();
