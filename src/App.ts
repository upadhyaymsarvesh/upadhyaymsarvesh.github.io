import { Application, Assets, Ticker, Text } from 'pixi.js';

import Scene from './Scene';
import Button from './Button';
import MenuScene from './MenuScene';
import CardsScene from './CardsScene';
import TextScene from './TextScene';
import ParticlesScene from './ParticlesScene';

export class App {
	private static readonly BACKGROUND_COLOR = 0xFFFFFF;

	private static readonly FPS_COLOR = 0x000000;
	private static readonly FPS_FONT_SIZE_FACTOR = 0.024;
	private static readonly FPS_MARGIN_FACTORS = { x: 0.01, y: 0.01 };
	private static readonly FPS_UPDATE_INTERVAL = 1000;

	private static readonly BACK_BUTTON_SIZE_FACTORS = { width: 0.12, height: 0.05 };
	private static readonly BACK_BUTTON_CORNER_RADIUS_FACTOR = 0.015;
	private static readonly BACK_BUTTON_LABEL_FONT_SIZE_FACTOR = 0.03;
	private static readonly BACK_BUTTON_MARGIN_FACTORS = { x: 0.02, y: 0.02 };

	private pixi: Application<HTMLCanvasElement>;

	private isInitialized = false;

	private currentScene: Scene;
	private currentSceneID: string;

	private fpsCounter: Text;
	private fpsUpdateTime = 0;
	private framesCount = 0;

	private backButton: Button;

	public constructor() {
		this.pixi = new Application<HTMLCanvasElement>({ resizeTo: window, background: App.BACKGROUND_COLOR });
		document.body.appendChild(this.pixi.view);

		this.init();
	}

	private async init() {
		await Assets.load([
			{ alias: 'Card', src: 'sprites/Card.png' },
			{ alias: 'Particle', src: 'sprites/Particle.png' },
			{ alias: 'FireSpritesheet', src: 'sprites/fire_spritesheet.json' }
		]);

		this.fpsCounter = new Text('FPS: 0', { fontFamily: 'Arial', fontSize: 24, fill: App.FPS_COLOR });
		this.fpsCounter.zIndex = 100;
		this.pixi.stage.addChild(this.fpsCounter);

		Ticker.shared.add(() => {
			this.fpsUpdateTime += Ticker.shared.deltaMS;
			++this.framesCount;
			if (this.fpsUpdateTime > App.FPS_UPDATE_INTERVAL) {
				this.fpsCounter.text = `FPS: ${Math.round(this.framesCount)}`;
				this.fpsUpdateTime -= App.FPS_UPDATE_INTERVAL;
				this.framesCount = 0;
			}
		}, this);

		this.isInitialized = true;

		this.switchScene('menu');
	}

	private switchScene(sceneID: string) {
		if (this.currentScene) {
			if (this.currentScene instanceof TextScene) {
				(this.currentScene as TextScene).destroyScene(); // Stop updates in TextScene
			}

			this.currentScene.removeFromParent();
			this.currentScene.destroy();
			this.currentScene = null;
		}

		this.currentSceneID = sceneID;

		switch (sceneID) {
			case 'menu':
				const menu = new MenuScene();
				menu.addButtonClickedHandler(this.onMenuButtonClicked.bind(this));
				this.currentScene = menu;
				break;
			case 'cards':
				this.currentScene = new CardsScene();
				break;
			case 'text':
				this.currentScene = new TextScene();
				(this.currentScene as TextScene).restartScene(); // Restart TextScene properly
				break;
			case 'particles':
				this.currentScene = new ParticlesScene();
				break;
		}

		if (this.currentScene) {
			this.pixi.stage.addChild(this.currentScene);
		}

		this.resize();
	}

	private resizeFPS() {
		const minSize = Math.min(window.innerWidth, window.innerHeight);
		this.fpsCounter.x = minSize * App.FPS_MARGIN_FACTORS.x;
		this.fpsCounter.y = minSize * App.FPS_MARGIN_FACTORS.y;
		this.fpsCounter.style.fontSize = minSize * App.FPS_FONT_SIZE_FACTOR;
	}

	private createBackButton() {
		if (this.backButton) {
			this.backButton.removeFromParent();
			this.backButton.destroy();
		}

		const minSize = Math.min(window.innerWidth, window.innerHeight);
		const buttonOptions = {
			width: minSize * App.BACK_BUTTON_SIZE_FACTORS.width,
			height: minSize * App.BACK_BUTTON_SIZE_FACTORS.height,
			cornerRadius: minSize * App.BACK_BUTTON_CORNER_RADIUS_FACTOR,
			label: 'BACK',
			labelFontSize: minSize * App.BACK_BUTTON_LABEL_FONT_SIZE_FACTOR
		};
		this.backButton = new Button(buttonOptions);
		this.backButton.anchor.set(0.5, 0.5);
		this.backButton.zIndex = 100;
		this.backButton.visible = this.currentSceneID != 'menu';
		this.backButton.x = window.innerWidth - this.backButton.width * 0.5 - minSize * App.BACK_BUTTON_MARGIN_FACTORS.x;
		this.backButton.y = minSize * App.BACK_BUTTON_MARGIN_FACTORS.y + this.backButton.height * 0.5;
		this.backButton.onUp.connect(this.onBackButtonClicked.bind(this));
		this.pixi.stage.addChild(this.backButton);
	}

	private onMenuButtonClicked(buttonID: string) {
		this.switchScene(buttonID);
	}

	private onBackButtonClicked() {
		if (this.currentScene instanceof TextScene) {
			(this.currentScene as TextScene).destroyScene(); // Ensure TextScene stops updates
		}
		this.switchScene('menu');
	}

	public resize() {
		if (!this.isInitialized) {
			return false;
		}
		this.resizeFPS();
		this.createBackButton();
		if (this.currentScene) {
			this.currentScene.resize(window.innerWidth, window.innerHeight);
		}
	}
};

document.addEventListener('DOMContentLoaded', () => {
	const app = new App();
	window.addEventListener('resize', () => app.resize());

	const body = document.body;
	const onPointerDown = () => {
		body.requestFullscreen();
		body.removeEventListener('pointerdown', onPointerDown);
	};
	body.addEventListener('pointerdown', onPointerDown);
});
