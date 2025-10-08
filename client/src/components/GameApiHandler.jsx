import { NEW_PLINKO_ROUND_ENDPOINT } from "../../ENDPOINTS";
import { PlinkoRoundDto } from "../Dtos/PlinkoRound";

export const PostNewPlinkoRoundtoApi = async (plinkoDto) => {  
    if (plinkoDto instanceof PlinkoRoundDto) {
        try {
            const r = await fetch(NEW_PLINKO_ROUND_ENDPOINT, {
                method: 'POST',
                credentials:'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(plinkoDto)
            });
            if (!r.ok) {
                throw new Error(`Http Error! Status ${r.status}`);
            }
            const data = await r.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    } else {
        console.error("Incorrect DTO! Expected PlinkoRoundDto");
    }
};
