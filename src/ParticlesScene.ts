import { Container, Ticker, Assets, Spritesheet } from 'pixi.js';
import * as particles from '@pixi/particle-emitter';
import Scene from './Scene';

export default class ParticlesScene extends Scene {
    private static readonly SCALE_FACTOR = 0.005;
    private static readonly Y_POS_FACTOR = 0.25;

    private emitter: particles.Emitter;
    private emitterContainer: Container;

    public constructor() {
        super();

        this.emitterContainer = new Container();
        this.addChild(this.emitterContainer);

        this.loadSpritesheet();
    }

    private async loadSpritesheet() {
        const fireSpritesheet = Assets.get('FireSpritesheet');

        if (!fireSpritesheet) {
            console.error('Fire spritesheet not found!');
            return;
        }

        if (fireSpritesheet.parse) {
            await fireSpritesheet.parse();
        }

        const fireFrames = Object.values(fireSpritesheet.textures);
        if (fireFrames.length === 0) {
            console.error('Fire spritesheet textures are empty!');
            return;
        }

        console.log('Fire spritesheet successfully loaded:', fireFrames);

        this.createEmitter(fireFrames);
    }

    private createEmitter(fireFrames) {
        this.emitter = new particles.Emitter(
            this.emitterContainer,
            {
                "lifetime": { "min": 0.25, "max": 0.75 },
                "frequency": 0.001,
                "spawnChance": 0.05,
                "emitterLifetime": 0,
                "maxParticles": 10,
                "addAtBack": false,
                "pos": { "x": 0, "y": 0 },
                "behaviors": [
                    { "type": "alpha", "config": { "alpha": { "list": [{ "time": 0, "value": 0.62 }, { "time": 1, "value": 0 }] } } },
                    { "type": "moveSpeedStatic", "config": { "min": 20, "max": 40 } },
                    { "type": "scale", "config": { "scale": { "list": [{ "time": 0, "value": 0.25 }, { "time": 1, "value": 0.75 }] }, "minMult": 1 } },
                    { "type": "color", "config": { "color": { "list": [{ "time": 0, "value": "fff191" }, { "time": 1, "value": "ff622c" }] } } },
                    { "type": "rotation", "config": { "accel": 0, "minSpeed": -20, "maxSpeed": 20, "minStart": 265, "maxStart": 275 } },
                    { 
                        "type": "textureRandom", 
                        "config": { "textures": fireFrames }
                    },
                    { "type": "spawnShape", "config": { "type": "torus", "data": { "x": 0, "y": 0, "radius": 15, "innerRadius": 0, "affectRotation": false } } }
                ]
            }
        );

        this.emitter.emit = true;

        Ticker.shared.add(() => {
            this.emitter.update(Ticker.shared.deltaMS * 0.001);
        }, this);
    }

    public resize(width: number, height: number) {
        const minSize = Math.min(width, height);
        this.emitterContainer.x = width * 0.5;
        this.emitterContainer.y = height * 0.5 + minSize * ParticlesScene.Y_POS_FACTOR;
        this.emitterContainer.scale.set(minSize * ParticlesScene.SCALE_FACTOR);
    }
}
