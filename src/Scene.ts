import { Container } from 'pixi.js';

export default abstract class Scene extends Container
{
	public constructor()
	{
		super();
	}

	abstract resize(width: number, height: number);
}
