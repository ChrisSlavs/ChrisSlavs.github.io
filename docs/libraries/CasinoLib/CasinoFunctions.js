export const GetPlinkoOddsItems = async ( oddsJsonPath, rows, risk ) => {
    try {
        const response = await fetch(oddsJsonPath);
        if (response.ok) {
            const data = await response.json();

            let res = [];
            for (let i = 0; i < data[rows].Probabilities / 2 + 1; i++) {
                res.push({probability: data[rows].Probabilities[i]})
            }
            return {
                Probabilities: data[rows].Probabilities.slice(0, (rows / 2) + 1),
                Results: data[rows].RiskMultipliers[risk].slice(0, (rows / 2) + 1)
            };
        }
    } catch (error) {
        console.log(`${error}. Could not load data from ${oddsJsonPath}`);
    }
}
