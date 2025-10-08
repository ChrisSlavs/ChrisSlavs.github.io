import { CURRENCY_COIN, CURRENCY_SWEEP } from "../../src/GlobalVariables";

export const EVENT_SWEEP_CHANGE = new CustomEvent('walletValueChanged', {
    detail: {
        currency: CURRENCY_SWEEP,
    },
});

export const EVENT_COIN_CHANGE = new CustomEvent('walletValueChanged', {
    detail: {
        currency: CURRENCY_COIN,
    },
});