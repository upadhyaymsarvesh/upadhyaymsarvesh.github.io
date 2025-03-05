import { Ticker, Sprite, Texture, Container, Graphics } from 'pixi.js';
import Scene from './Scene';
import RichText from './RichText';

export default class TextScene extends Scene {
    private static readonly TEXT_UPDATE_INTERVAL = 2000; // 2 seconds per dialogue
    private dialogue: any[] = [];
    private emojies: Record<string, string> = {};
    private avatars: any[] = [];
    private currentIndex = 0;
    private lastUpdateTime = 0;
    private dialogueContainer: Container;
    private maskGraphics: Graphics;
    private isActive = true;

    public constructor() {
        super();
        this.dialogueContainer = new Container();
        this.addChild(this.dialogueContainer);

        // Create a mask for scrolling
        this.maskGraphics = new Graphics();
        this.addChild(this.maskGraphics);
        this.dialogueContainer.mask = this.maskGraphics;

        this.fetchData();
        Ticker.shared.add(this.update, this);
    }

    private async fetchData() {
        try {
            const response = await fetch('https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords');
            const data = await response.json();

            this.dialogue = data.dialogue;
            this.emojies = Object.fromEntries(data.emojies.map((e: any) => [e.name, e.url]));
            this.avatars = data.avatars;
        } catch (error) {
            console.error('Failed to fetch dialogue data:', error);
        }
    }

    private update(delta: number) {
        if (!this.isActive) return; // Prevent updates when scene is inactive

        this.lastUpdateTime += Ticker.shared.deltaMS;
        if (this.lastUpdateTime >= TextScene.TEXT_UPDATE_INTERVAL && this.currentIndex < this.dialogue.length) {
            this.lastUpdateTime = 0;
            this.displayDialogue();
            this.currentIndex++;
        }
    }

    private displayDialogue() {
        if (this.currentIndex >= this.dialogue.length) return;

        const entry = this.dialogue[this.currentIndex];
        const avatarData = this.avatars.find(a => a.name === entry.name);
        const avatarUrl = avatarData ? avatarData.url : null;

        let formattedText = entry.text;
        Object.keys(this.emojies).forEach((key) => {
            const regex = new RegExp(`{${key}}`, 'g');
            formattedText = formattedText.replace(regex, `{${key}}`);
        });

        const textContainer = new Container();
        const richText = new RichText();
        richText.setEmojis(this.emojies);
        richText.text = `${entry.name}: ${formattedText}`;
        richText.scale.set(0.5); // Reduce text and emoji size
        textContainer.addChild(richText);

        if (avatarUrl) {
            const texture = Texture.from(avatarUrl);
            if (texture) {
                const avatar = new Sprite(texture);
                avatar.anchor.set(0, 0.5);
                avatar.x = 10; // Left align avatar
                avatar.scale.set(0.4); // Reduce avatar size
                textContainer.addChild(avatar);

                richText.x = avatar.width + 15; // Reduce gap between avatar and text
            }
        }

        textContainer.y = this.dialogueContainer.height + 10; // Stack dialogues dynamically
        this.dialogueContainer.addChild(textContainer);

        // Enable scrolling when text goes out of bounds
        if (this.dialogueContainer.height > this.height) {
            this.dialogueContainer.y = Math.max(this.height - this.dialogueContainer.height, 0);
        }
    }

    public resize(width: number, height: number) {
        this.dialogueContainer.x = 20; // Left align dialogues
        this.dialogueContainer.y = 50;

        // Update mask to enable scrolling
        this.maskGraphics.clear();
        this.maskGraphics.beginFill(0x000000);
        this.maskGraphics.drawRect(0, 50, width - 40, height - 60);
        this.maskGraphics.endFill();
    }

    public destroyScene() {
        this.isActive = false; // Stop updates when leaving
        Ticker.shared.remove(this.update, this);
        this.dialogueContainer.removeChildren(); // Clear dialogues when leaving
        this.currentIndex = 0;
    }

    public restartScene() {
        this.isActive = true;
        this.lastUpdateTime = 0;
        this.currentIndex = 0;
        this.dialogueContainer.removeChildren(); // Clear previous dialogues
        Ticker.shared.add(this.update, this);
    }
}
