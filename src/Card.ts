import { Container, Sprite, Text, Assets } from 'pixi.js';

export default class Card extends Container
{
	private static readonly LABEL_COLOR = 0x652F00;
	private static readonly FONT_SIZE_FACTOR = 0.15;

	private background: Sprite;
	private aspectRatio: number;
	private title: Text;

	public constructor(titleText: string)
	{
		super();

		this.background = Sprite.from(Assets.get('Card'));
		this.aspectRatio = this.background.width / this.background.height;
		this.background.anchor.set(0.5);
		this.addChild(this.background);

		this.title = new Text(titleText, {
			fontFamily: 'Arial',
			fontSize: 24,
			fill: Card.LABEL_COLOR,
			align: 'center'
		});
		this.title.anchor.set(0.5);
		this.addChild(this.title);
	}

	public resize(width: number)
	{
		this.width = width;
		this.height = width / this.aspectRatio;
		this.pivot.set(this.width * 0.5, this.height * 0.5);
		this.background.width = width;
		this.background.height = this.height;
		
		this.title.style.fontSize = width * Card.FONT_SIZE_FACTOR;
	}
}
