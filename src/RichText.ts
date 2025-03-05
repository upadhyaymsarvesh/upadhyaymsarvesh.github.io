import { Container, Text, Sprite, Texture } from 'pixi.js';

enum TokenType {
    Text,
    Image
}

export default class RichText extends Container {
    private static readonly DEFAULT_FONT_SIZE = 24;
    private static readonly DEFAULT_FONT_COLOR = 0x000000;
    private originalText: string = '';
    private _fontSize: number;
    private _fontColor: number;
    private emojiMap: Record<string, string> = {};

    public constructor(text: string = '', fontSize = RichText.DEFAULT_FONT_SIZE, fontColor = RichText.DEFAULT_FONT_COLOR) {
        super();

        this._fontSize = fontSize;
        this._fontColor = fontColor;
        if (text.length > 0) {
            this.text = text;
        }
    }

    public setEmojis(emojiMap: Record<string, string>) {
        this.emojiMap = emojiMap;
        this.text = this.originalText;
    }

    get text(): string {
        return this.originalText;
    }

    set text(value: string) {
        if (!value) return;
        this.originalText = value;
        this.buildContents();
    }

    get fontSize(): number {
        return this._fontSize;
    }

    set fontSize(value: number) {
        this._fontSize = value;
        this.text = this.originalText;
    }

    get fontColor(): number {
        return this._fontColor;
    }

    set fontColor(value: number) {
        this._fontColor = value;
        this.text = this.originalText;
    }

    private async buildContents() {
		this.removeChildren();
	
		if (!this.originalText) return;
	
		let width = 0;
		const height = this._fontSize * 1.2;
	
		const tokens: { type: TokenType; value: string }[] = [];
		let regex = /{(\w+)}/g;
		let lastIndex = 0;
		let match;
	
		while ((match = regex.exec(this.originalText)) !== null) {
			if (match.index > lastIndex) {
				tokens.push({ type: TokenType.Text, value: this.originalText.substring(lastIndex, match.index) });
			}
			tokens.push({ type: TokenType.Image, value: match[1] });
			lastIndex = regex.lastIndex;
		}
	
		if (lastIndex < this.originalText.length) {
			tokens.push({ type: TokenType.Text, value: this.originalText.substring(lastIndex) });
		}
	
		let x = 0;
		for (const token of tokens) {
			if (token.type === TokenType.Text) {
				const text = new Text(token.value, { fontFamily: 'Arial', fontSize: this._fontSize, fill: this._fontColor });
				text.anchor.set(0, 0.5);
				text.x = x;
				this.addChild(text);
				x += text.width;
				width += text.width;
			} else if (token.type === TokenType.Image) {
				const emojiUrl = this.emojiMap[token.value];
				if (emojiUrl) {
					const texture = Texture.from(emojiUrl);
					if (texture) {
						const image = new Sprite(texture);
						image.anchor.set(0, 0.5);
						image.scale.set(0.5);
						image.width = this._fontSize * 1.2;
						image.height = this._fontSize * 1.2;
						image.x = x;
						this.addChild(image);
						x += image.width;
						width += image.width;
					}
				}
			}
		}
	
		this.width = width;
		this.height = height;
	}
}
