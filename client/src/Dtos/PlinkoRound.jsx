import { GameRoundDto } from "./GameRoundDto";

export class PlinkoRoundDto extends GameRoundDto {
    constructor(rows, risk, wager, currency) {
        super(risk, wager, currency);
        this.rows = rows;
    }
}
