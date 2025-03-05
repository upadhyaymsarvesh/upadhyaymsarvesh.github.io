import Scene from './Scene';
import Button from './Button';

type OnButtonClickedCallback = (buttonID: string) => void;

export default class MenuScene extends Scene
{
	private static readonly BUTTON_SIZE_FACTORS = { width: 0.3, height: 0.08 };
	private static readonly BUTTON_V_SPACING_FACTOR = 0.03;
	private static readonly BUTTON_CORNER_RADIUS_FACTOR = 0.015;
	private static readonly BUTTON_LABEL_FONT_SIZE_FACTOR = 0.04;

	private static readonly BUTTON_CONFIGS = [
		{ id: 'cards', label: 'CARDS' },
		{ id: 'text', label: 'TEXT' },
		{ id: 'particles', label: 'PARTICLES' }
	];

	private buttonClickedHandlers: OnButtonClickedCallback[] = [];

	public constructor()
	{
		super();
	}

	public resize(width: number, height: number)
	{
		this.removeChildren();

		const minSize = Math.min(width, height);
		const buttonOptions = {
			width: minSize * MenuScene.BUTTON_SIZE_FACTORS.width,
			height: minSize * MenuScene.BUTTON_SIZE_FACTORS.height,
			cornerRadius: minSize * MenuScene.BUTTON_CORNER_RADIUS_FACTOR,
			label: '',
			labelFontSize: minSize * MenuScene.BUTTON_LABEL_FONT_SIZE_FACTOR
		};
		const buttonVSpacing = minSize * MenuScene.BUTTON_V_SPACING_FACTOR;
		let buttonX = width * 0.5;
		let buttonY = (height - (buttonOptions.height + buttonVSpacing) * MenuScene.BUTTON_CONFIGS.length - buttonVSpacing) * 0.5
		            + buttonOptions.height * 0.5;
		
		for (const buttonConfig of MenuScene.BUTTON_CONFIGS)
		{
			buttonOptions.label = buttonConfig.label;
			const button = new Button(buttonOptions);
			button.x = buttonX;
			button.y = buttonY;
			button.anchor.set(0.5, 0.5);

			button.onUp.connect(() =>
			{
				for (const handler of this.buttonClickedHandlers)
				{
					handler(buttonConfig.id);
				}
			});

			this.addChild(button);

			buttonY += buttonOptions.height + buttonVSpacing;
		}
	}

	public addButtonClickedHandler(handler: OnButtonClickedCallback)
	{
		this.buttonClickedHandlers.push(handler);
	}

	public removeButtonClickedHandler(handler: OnButtonClickedCallback)
	{
		const index = this.buttonClickedHandlers.indexOf(handler);
		if (index !== -1)
		{
			this.buttonClickedHandlers.splice(index, 1);
		}
	}
}
