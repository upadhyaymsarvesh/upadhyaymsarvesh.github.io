import { Graphics, Text } from 'pixi.js';
import { FancyButton } from '@pixi/ui';

export default class Button extends FancyButton
{
	private static readonly BACKGROUND_COLOR = 0x00A2C2;
	private static readonly LABEL_COLOR = 0xFFFFFF;
	private static readonly SCALE_UP_FACTOR = 1.05;
	private static readonly SCALE_DOWN_FACTOR = 0.95;
	private static readonly SCALE_DURATION = 100;

	public constructor(options: any)
	{
		super({
			defaultView: new Graphics()
				.beginFill(Button.BACKGROUND_COLOR)
				.drawRoundedRect(0, 0, options.width, options.height, options.cornerRadius)
				.endFill(),
			text: new Text(options.label, {
				fontFamily: 'Arial',
				fontSize: options.labelFontSize,
				fill: Button.LABEL_COLOR
			}),
			animations: {
				hover: {
					props: {
						scale: {
							x: Button.SCALE_UP_FACTOR,
							y: Button.SCALE_UP_FACTOR,
						}
					},
					duration: Button.SCALE_DURATION,
			},
				pressed: {
					props: {
						scale: {
							x: Button.SCALE_DOWN_FACTOR,
							y: Button.SCALE_DOWN_FACTOR,
						}
					},
					duration: Button.SCALE_DURATION,
				}
			}
		});
	}
}
