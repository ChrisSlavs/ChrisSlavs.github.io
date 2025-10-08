// Plinko uses no time stepping (plinko is frame-dependent) to provide deterministic results
import * as mm from "../../../libraries/MoreMath.js";
import * as helpers from "../../../libraries/Helpers.js"
import {MAIN_THEME_COLOR_5, 
        PLINKO_ROW_MINIMUM,
        GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT,
        MAIN_THEME_FONT,
        MAIN_THEME_TEXT_COLOR_1} from "../../GlobalVariables.js";

import PlinkoData from "./PlinkoData.json"
import Cookies from 'js-cookie'
import { getUserCurrency, updateCurrencyFromFloat } from "../../../libraries/CasinoLib/UserManagement/UserDataFunctions.jsx";

// PEGS
const PEG_COLOR = "#f4f4f4"
const PEG_RADIUS = 4;
const VERTICAL_PEG_SPACING = 33;
const HORIZONTAL_PEG_SPACING = 30;
const EFFECT_ALPHA = 0.5;

// CHIPS
const CHIP_COLOR = "#ea1f1f"
const CHIP_RADIUS = 7;

// CANVAS
const BACKGROUND_COLOR = MAIN_THEME_COLOR_5;
const CANV_WIDTH = GAME_CANVAS_WIDTH;
const CANV_HEIGHT = GAME_CANVAS_HEIGHT;

// PHYISCS
const GRAVITY = 0.2;
const VEL_LIMIT = 1.75;
const DRAG = 0.97;

// GAME SETTINGS
const TOP_ROW_PEG_AMT = 3;
const START_Y = 35;

const TARGET_ROWS = 17;

// SLOTS
const SLOT_HEIGHT = 22;
const SLOT_SPACING = 2;
const RECT_ROUNDING = 8;
const SLOT_EFFECT_HEIGHT = 17;
const SLOT_EFFECT_LENGTH = 12;

// TEXT
const TEXT_FONT = MAIN_THEME_FONT;
const FONT_STYLE = "bold italic"
const FONT_SIZE = 0.68;
const FONT_UNIT = "rem";
const FONT_COLOR = MAIN_THEME_TEXT_COLOR_1;
const SLIDE_FONT_SIZE = 1.45;

// SLIDES
const SLIDE_HEIGHT = 48;
const SLIDE_WIDTH = 64;
const SLIDE_X_POS = 700
const SLIDE_FADE_TIME = 100;
const SLIDE_LIFESPAN = 240;

class WalletUpdater {
    roundWagerResultSet = {}
    constructor() {}

    PushToRoundWagerResultSet(roundId, winAmount, wager)
    {
        const selectedCurrency = Cookies.get("currency");
        updateCurrencyFromFloat(selectedCurrency, -wager);
        
        this.roundWagerResultSet[roundId] = [parseFloat(winAmount), selectedCurrency];
    }

    HandleUpdateWallet(roundId)
    {
        const winAmount = this.roundWagerResultSet[roundId][0];
        const currency = this.roundWagerResultSet[roundId][1];
        updateCurrencyFromFloat(currency, winAmount);
        
        delete this.roundWagerResultSet[roundId];
    }
}

export class Game {
    static canvas;
    static walletUpdater;

    running;
    chipPegManager;
    slotManager;
    slideManager;
    animationFrameId;

    constructor(canvas, risk, rows) {
        Game.canvas = canvas;
        this.initAll(risk, rows);
    }

    initAll(risk, rows)  {
        this.animationFrameId = null;
        this.kill();
        this.chipPegManager = null;
        rows = parseInt(rows);
        GameObject.nextUniqueId = 0;
        GameCanvas.scale = rows / TARGET_ROWS;     
        this.initManagers(risk, rows);
        this.running = true;
    }

    initManagers(risk, rows) {
        Game.walletUpdater = new WalletUpdater();
        this.chipPegManager = new ChipPegManager(rows);
        this.slideManager = new SlideManager(this.chipPegManager.BottomYStart);

        const slotAmt = this.chipPegManager.rows + 1;
        
        const halfRadius = this.chipPegManager.pegRadius / 2;
        const xStart = this.chipPegManager.BottomXStart - halfRadius;
        const xEnd = xStart + this.chipPegManager.horizontalSpacing * (slotAmt) + halfRadius;

        this.slotManager = new SlotManager();
        this.slotManager.initializeSlots(
          slotAmt,
          xStart,
          xEnd,
          this.chipPegManager.BottomYStart,
          risk
        );
    }

    dropChip(position, multiplier, winAmount,wager) {
        var c = this.chipPegManager.spawnChip(position, 0);
        Game.walletUpdater.PushToRoundWagerResultSet(c.id, winAmount, wager);
        this.addSlide(multiplier, c);
    }

    addSlide(multiplier, chip) {
        var c;
        for (let i = 0; i < this.slotManager.slots.length; i++) {
            var s = this.slotManager.slots[i];
            if (s.multiplier === multiplier) {
                c = s.multiplierTextBox.roundRect.color;
                break;
            }
        }
        this.slideManager.addSlide(multiplier, c, chip);
    }

    kill() {
        this.running = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId); // Cancel any pending frames
            this.animationFrameId = null;
        }
    }

    run() {
        if (this.running) {
            this.chipPegManager.updatePhysicsObjects();
            this.slotManager.updateSlots(this.chipPegManager.chips);
            this.slideManager.updateSlides();
            Game.canvas.render(this.chipPegManager, this.slotManager, this.slideManager);
            this.animationFrameId = window.requestAnimationFrame(() => this.run());
        }   
    }
}

export class GameCanvas {
    static scale;
    ctx;

    constructor(canvasContext) {
        this.ctx = canvasContext
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
    }

    colorCanvas() {
        this.ctx.rect(0, 0, CANV_WIDTH, CANV_HEIGHT);
        this.ctx.fillStyle = BACKGROUND_COLOR;
        this.ctx.fill();
    }

    drawCircle(c, alpha) {
        this.ctx.beginPath();
        this.ctx.globalAlpha = alpha;
        this.ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
        this.ctx.fillStyle = c.color;
        this.ctx.fill();
        this.ctx.globalAlpha = 1.0;
    }

    drawRoundRect(r) {
        this.ctx.beginPath();
        this.ctx.globalAlpha = r.alpha;
        this.ctx.roundRect(r.x, r.y, r.w, r.h, r.r);
        this.ctx.fillStyle = r.color;
        this.ctx.fill();
        this.ctx.globalAlpha = 1.0;
    }

    drawText(t, font, size, alpha, x, y) {
        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = FONT_COLOR;
        this.ctx.font = FONT_STYLE + " " + size + FONT_UNIT + " " + font;

        this.ctx.fillText(t, x, y);
        this.ctx.globalAlpha = 1.0;
    }

    render(chipPegMan, slotMan, slideManager) {
        this.ctx.clearRect(0, 0, CANV_WIDTH, CANV_HEIGHT);
        this.colorCanvas();
        for (let i = 0; i < chipPegMan.pegs.length; i++) {
            this.drawCircle(chipPegMan.pegs[i].circle, 1.0);
        }

        for (let j = 0; j < chipPegMan.chips.length; j++) {
            this.drawCircle(chipPegMan.chips[j].circle, 1.0);
        }
        
        this.ctx.save();
        slotMan.slots.forEach(s => {
            this.drawRoundRect(s.multiplierTextBox.roundRect, 1.0);
            this.drawText(s.multiplierTextBox.text.text, 
                s.multiplierTextBox.text.font, 
                s.multiplierTextBox.text.size, 
                1.0, 
                s.multiplierTextBox.text.x, 
                s.multiplierTextBox.text.y);
        });
        this.ctx.restore();

        for (var key in chipPegMan.pegEffects) {
            if (chipPegMan.pegEffects[key] != null) {  
                this.drawCircle(chipPegMan.pegEffects[key].circle, EFFECT_ALPHA);
            }
        } 
        this.ctx.save();
        for (var s of slideManager.slides) {
            this.drawRoundRect(s.textBox.roundRect);
            this.drawText(s.textBox.text.text,
                          s.textBox.text.font,
                          s.textBox.text.size,
                          s.textBox.text.alpha,
                          s.textBox.text.x,
                          s.textBox.text.y
            );
        }
        this.ctx.restore();
    }
}

class Circle {
    x;
    y;
    r;
    color;

    constructor(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
    }
}

class Effect {
    effectLength;
    effectFrame;

    finished = false;
    constructor() {
        this.effectFrame = 0;
    }

    /**
     * 
     * @returns bool denoting if effect is finished or not, true for finished, false for still continuing
     */
    runEffect() {
        this.effectFrame++;
        this.finished = this.effectFrame >= this.effectLength;
        return this.finished;
    }
}

class GameObject {
    static nextUniqueId = 0;
    events = [];
    id;

    constructor(prefix = '') {
        this.id = prefix + GameObject.nextUniqueId++;
    }

    recieveEvent(event) {
        this.events.push(event);
    }
}

class ChipCollideEffect extends Effect{
    SIZE_INCREASE_SCALE = 1.5;
    
    increaseAmt;
    baseRadius;

    circle;

    constructor(circle) {
        super("C");
        this.effectLength = 16;
        this.increaseAmt = this.SIZE_INCREASE_SCALE / this.effectLength;

        
        this.circle = new Circle(circle.x, circle.y, circle.r, circle.color);
        this.baseRadius = circle.r;
    }

    /**
     * 
     * @returns bool denoting if effect is finished or not, true for finished, false for still continuing
     */
    runEffect() {
        super.runEffect();
        this.circle.r += this.increaseAmt * this.baseRadius;
        return this.finished;
    }
}

class Peg extends GameObject {
    circle;

    constructor(x, y, r) {
        super("P");
        this.circle = new Circle(x, y, r, PEG_COLOR);
    }

    chipCollideEffect() {
        return new ChipCollideEffect(this.circle);
    }
}

class Chip extends GameObject{
    circle;
    velocityX = 0.0;
    velocityY = 0.0;
    newPosX;
    newPosY;

    constructor(x, y, r) {
        super("C");
        
        this.circle = new Circle(x, y, r, CHIP_COLOR);    
    
        this.newPosX = x;
        this.newPosY = y;
    }
}

export class ChipPegManager {
    pegRadius = PEG_RADIUS;
    chipRadius = CHIP_RADIUS;

    pegs = [];
    chips = [];

    pegEffects = {};

    rows = PLINKO_ROW_MINIMUM;
    verticalSpacing = VERTICAL_PEG_SPACING;
    horizontalSpacing = HORIZONTAL_PEG_SPACING;
    startX = CANV_WIDTH / 2.0 + this.horizontalSpacing / 2.0;
    startY = START_Y;

    scaledGravity;
    scaledMaxVelocity;

    BottomXStart;
    BottomYStart;
    
    constructor(rows) {
        this.rows = rows;

        this.initializeSettings();
        this.initializePegs();
    }

    initializeSettings() {
        this.pegRadius  = PEG_RADIUS / GameCanvas.scale;
        this.chipRadius = CHIP_RADIUS / GameCanvas.scale;
        
        this.verticalSpacing = this.verticalSpacing / GameCanvas.scale;
        this.horizontalSpacing = this.horizontalSpacing / GameCanvas.scale;

        this.scaledGravity = GRAVITY / GameCanvas.scale;
        this.scaledMaxVelocity = VEL_LIMIT / GameCanvas.scale;
        this.startX = (CANV_WIDTH / 2);

        const tempRows = this.rows - 1;
        this.BottomXStart = this.startX + (-(TOP_ROW_PEG_AMT + tempRows) / 2.0) 
                            * (this.horizontalSpacing) + (this.pegRadius / 2.0);
        this.BottomYStart = this.startY + (this.rows - 0.5) * this.verticalSpacing;
    }

    initializePegs() {
        let pegId = 0;
        for (let row = 0; row < this.rows; row++) {
            let rowPegAmt = row + TOP_ROW_PEG_AMT;
            let rowOffset = -rowPegAmt / 2;
            for (let col = 0; col < rowPegAmt; col++) {
                const x = this.startX + (col + rowOffset) * (this.horizontalSpacing);
                const y = this.startY + row * this.verticalSpacing;
                this.addPeg(new Peg(x, y, this.pegRadius, pegId++));

            }
        }
    }

    addPeg(newPeg) {
        this.pegs.push(newPeg);
    }

    spawnChip(xPos, yPos) {
        const c = new Chip(xPos, yPos, this.chipRadius)
        this.chips.push(c);
        return c;
    }

    addChips(newChip) {
        this.chips.push(newChip);
    }

    removeChip(chip) {
        const index = this.chips.indexOf(chip);
        if (index > -1) {
            this.chips.splice(index, 1);
        }
    }

    updateChips() {
        this.chips.forEach((c) => {
            c.velocityY += this.scaledGravity;
            c.velocityY = c.velocityY * DRAG
            c.velocityX = c.velocityX * DRAG;
            c.newPosX = (c.circle.x + c.velocityX);
            c.newPosY = (c.circle.y + c.velocityY);
        });
    }

    ResolveCollision(chip, peg) {
        const distX = chip.newPosX - peg.circle.x;
        const distY = chip.newPosY - peg.circle.y;
        const radiiSum = chip.circle.r + peg.circle.r;
        const len = Math.sqrt(distX * distX + distY * distY);
    
        if (len === 0) return;
    
        const overlap = (radiiSum - len);
    
        const unitX = distX / len;
        const unitY = distY / len;
    
        chip.newPosX += unitX * overlap;
        chip.newPosY += unitY * overlap;
    
        const dotProduct = mm.Dot(chip.velocityX, chip.velocityY, unitX, unitY);

        const maxVel = this.scaledMaxVelocity;        

        chip.velocityX -= 2 * dotProduct * unitX;
        chip.velocityY -= 2 * dotProduct * unitY;
    
        chip.velocityX = Math.min(Math.max(chip.velocityX, -maxVel), maxVel);
        chip.velocityY = Math.min(Math.max(chip.velocityY, -maxVel), maxVel);
    }

    createPegEffects(peg) {
        if (!helpers.checkKey(this.pegEffects, peg.id)) {
            this.pegEffects[peg.id] = peg.chipCollideEffect();
        }
    }

    updatePegEffects() {
        for (var key in this.pegEffects) {
            if (this.pegEffects[key] != null) {    
                if (this.pegEffects[key].runEffect()) {
                    this.pegEffects[key] = null;
                }
            } 
        }
    }

    HandleCollisions() {
        for (let i = 0; i < this.chips.length; i++) {
            for (let j = 0; j < this.pegs.length; j++) {
                const c = this.chips[i];
                const p = this.pegs[j];
                if (this.CheckCollisions(c, p)) {
                    this.ResolveCollision(c, p);
                    
                    this.createPegEffects(p);

                    break;
                }                
            }
        }
    }

    CheckCollisions(chip, peg) {
        const distance = mm.CalcDistance(chip.newPosX, chip.newPosY, peg.circle.x, peg.circle.y);
        const radiiSum = chip.circle.r + peg.circle.r;
        return distance <= radiiSum;
    }

    updatePhysicsObjects() {
        this.updateChips();
        this.HandleCollisions();
        this.updatePegEffects();

        // Update positions and remove chips that are out of bounds, 
        // add win amount to wallet if out of bounds 
        this.chips = this.chips.filter(chip => {
            chip.circle.x = chip.newPosX;
            chip.circle.y = chip.newPosY;
            const retVal = chip.circle.y < this.BottomYStart + chip.circle.r;
            if (!retVal) {
                Game.walletUpdater.HandleUpdateWallet(chip.id);
            }
            return retVal
        });
    }
}

class RoundRect {
    x;
    y;
    w;
    h;
    r = RECT_ROUNDING;
    color;
    alpha = 1.0;

    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;  
        this.h = h;
        this.color = color;
    }
}

class SlotManager {
    slots = [];
    slotEffects = {};
    spacing = SLOT_SPACING;
    slotWidth;

    slotYStart;
    
    constructor() {}

    checkCircleRectCollision(c, r) {
        const halfW = r.w / 2;
        const halfH = r.h / 2;
        const xDist = Math.abs(c.x - r.x - halfW);
        const yDist = Math.abs(c.y - r.y - halfH);

        if (xDist <= halfW && yDist <= halfH) {
            return true;
        }
    }

    handleChipSlotCollisions(s) {    
        this.slotEffects[s.id] = s.collideEffect(this.scalar);
    }

    slotCollisions(chips) {
        for (let i = 0; i < chips.length; i++) {
            const c = chips[i];
            if (c.circle.y + c.circle.r < this.slotYStart) {
                continue;
            } else {
                for (let j = 0; j < this.slots.length; j++) {
                    const s = this.slots[j];
                    if  (this.checkCircleRectCollision(c.circle, s.multiplierTextBox.roundRect) && 
                        !helpers.checkKey(this.slotEffects, s.id)) {
                            this.handleChipSlotCollisions(s);
                        }
                }
            }
        }
    }

    initializeSlots(slotAmt, xStart, xEnd, y, risk) {
        this.spacing /= GameCanvas.scale;

        // load slot data
        const r = slotAmt - 1;
        const probs = PlinkoData[r].Probabilities
        const mults = PlinkoData[r].RiskMultipliers[risk];

        const distance = xEnd - xStart;
        this.slotWidth = (distance / slotAmt) - this.spacing;

        const height = SLOT_HEIGHT / GameCanvas.scale;
        
        const halfRows = slotAmt / 2;
        const isEven = slotAmt % 2 === 0;
        
        for (let i = 0; i < slotAmt; i++) {
            const x = (i * (this.slotWidth + this.spacing)) + xStart;

            // Calculate distance from center
            let distFromCenter;
            if (isEven) {
                distFromCenter = Math.abs(i - halfRows + 0.5);
            } else {
                distFromCenter = Math.abs(i - Math.floor(halfRows));
            }
            parseInt(distFromCenter) === 0 ? 0 : distFromCenter;

            // Percentage from center (0 at center, 1 at edges)
            const z = distFromCenter / halfRows;
            
            // Colors
            const g = Math.round((1 - z) * 192);
            const b = Math.round(z * 63);
            const color = mm.rgbToHex(255, g, b);

            const newSlot = new Slot(x, y, this.slotWidth, height, mults[i], 0, color);
            this.slots.push(newSlot);
        }
        
        this.slotYStart = this.slots[0].multiplierTextBox.roundRect.y;
    }

    updateSlots(chips) {
        this.slotCollisions(chips);
        
        for (let key in this.slotEffects) {
            if (this.slotEffects[key] != null) {    
                this.slotEffects[key].runEffect();
            }
            if (this.slotEffects[key] != null && this.slotEffects[key].finished) {
                this.slotEffects[key].reset();
                this.slotEffects[key] = null;
            }
        }
        
        for (var s of this.slots) {
            s.multiplierTextBox.update();
        }

    }
}

class SlotEffect extends Effect {
    EFFECT_HEIGHT = SLOT_EFFECT_HEIGHT;
    
    scaledEffectHeight;
    moveAmt;

    slot;

    constructor(slot) {
        super();
        this.effectLength = SLOT_EFFECT_LENGTH;
        this.scaledEffectHeight = this.EFFECT_HEIGHT / GameCanvas.scale; 

        this.moveAmt = this.scaledEffectHeight / this.effectLength;

        this.slot = slot;
    }

    reset() {
        this.slot.multiplierTextBox.roundRect.y -= this.scaledEffectHeight;
    }

    runEffect() {
        super.runEffect();
        this.slot.multiplierTextBox.roundRect.y += this.moveAmt;
        
        return this.finished;
    }
}

class Slot extends GameObject {
    probability;
    multiplier;
    multiplierTextBox;

    constructor(x, y, w, h, multiplier, probability, color) {
        super("S");

        this.multiplier = multiplier;
        const s = multiplier < 1000 ? String(multiplier) + "x" : String(multiplier);
        this.multiplierTextBox = new TextBox(x, y, w, h, color, s, FONT_COLOR, FONT_SIZE / GameCanvas.scale, TEXT_FONT);

        this.probability = String(probability);
    }
    
    collideEffect(scalar) {
        return new SlotEffect(this, scalar);
    }
}

class Text {
    text;
    font;
    size;
    color;
    alpha = 1.0;
    x;
    y;

    constructor(text, size, font, color, x, y) {
        this.text = text;
        this.font = font;
        this.size = size;
        this.color = color;
        this.x = x;
        this.y = y;         
    }
}

class TextBox {
    text;
    roundRect;

    constructor(x, y, w, h, boxColor, text, textColor, fontSize, font) {
        this.roundRect = new RoundRect(x, y, w, h, boxColor);
        this.text = new Text(text, fontSize, font, textColor)
    }

    update() {
        this.text.x = this.roundRect.x + this.roundRect.w / 2;
        this.text.y = this.roundRect.y + this.roundRect.h / 2;
    }
}

class Slide extends GameObject {
    textBox;
    timeLive;

    static FADE_OUT_TIME = SLIDE_FADE_TIME;
    static FADE_AMOUNT = 1.0 / SLIDE_FADE_TIME;
    fade = false;
    faded = false;
    constructor(multiplier, color, yOffset) {
        super("D");
        
        this.textBox = new TextBox(
            SLIDE_X_POS, 
            CANV_HEIGHT / 5 + yOffset, 
            SLIDE_WIDTH, 
            SLIDE_HEIGHT, 
            color,
            String(multiplier) + "x",
            FONT_COLOR,
            SLIDE_FONT_SIZE,
            TEXT_FONT
        );
        this.timeLive = 0;
    }

    update() {
        if (this.fade) {
            this.fadeOut()
            return;
        }
        this.timeLive++;
        this.fade = this.timeLive >= SlideManager.SLIDE_LIFESPAN - Slide.FADE_OUT_TIME;
    }

    fadeOut() {
        this.textBox.roundRect.alpha -= Slide.FADE_AMOUNT;
        this.textBox.text.alpha -= Slide.FADE_AMOUNT;
        this.faded = this.textBox.roundRect.alpha <= 0.0; 
    }
}

class SlideSpawner {
    targetChip;
    multiplier;
    color;

    static spawnCheckValue;

    constructor(targetChip, multiplier, color) {
        this.targetChip = targetChip;
        this.multiplier = multiplier;
        this.color = color;
    }

    check() {
        var c = this.targetChip.circle; 
        if (c.y + c.r >= SlideSpawner.spawnCheckValue) {
            return true;
        } 
        return false;
    }
}

class SlideManager {
    SLIDE_AMOUNT = 4;

    static SLIDE_LIFESPAN = SLIDE_LIFESPAN + Slide.FADE_OUT_TIME;

    slides = [];
    slideSpawners = [];

    constructor(slotYStart) {
        SlideSpawner.spawnCheckValue = slotYStart;
    }

    pushToVisible(multiplier, color) {
        if (this.slides.length >= this.SLIDE_AMOUNT) {
            this.slides.shift();
        }

        const y = SLIDE_HEIGHT;

        this.slides.forEach(s => {
            s.textBox.roundRect.y += SLIDE_HEIGHT;
        });

        this.slides.push(new Slide(multiplier, color, y));
    }

    addSlide(multiplier, color, chip) {
        this.slideSpawners.push(new SlideSpawner(chip, multiplier, color));
    }

    checkSlideTimes() {
        let newSlideArr = [];
        for (let i = 0; i < this.slides.length; i++) {
            const s = this.slides[i];
            if (s.timeLive >= this.SLIDE_LIFESPAN) {
                newSlideArr.push(s);
            }
        }
        this.slides = newSlideArr;
    }

    updateSlides() {
        this.slideSpawners = this.slideSpawners.filter(sp => {
            if (sp.check()) {
                this.pushToVisible(sp.multiplier, sp.color);
                return false;
            }
            return true;
        });

        this.slides.forEach(s => {
            // Update each slide
            s.update()
            if (s.faded) {
                this.slides.shift();
            }
            s.textBox.update();
        });
    }
}