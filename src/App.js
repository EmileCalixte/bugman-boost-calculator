import {useMemo, useState} from "react";

const AVERAGE_MONEY_PER_MESSAGE = 10;

const App = () => {
    const [averageMessagesPerDay, setAverageMessagesPerDay] = useState(30);
    const [boostRate, setBoostRate] = useState(1.5) // 1.5 = 150%
    const [boostDuration, setBoostDuration] = useState(7); // In days
    const [boostCost, setBoostCost] = useState(4500);

    const averageDollarsPerDay = useMemo(() => {
        return averageMessagesPerDay * AVERAGE_MONEY_PER_MESSAGE;
    }, [averageMessagesPerDay]);

    const boostDayCost = useMemo(() => {
        return boostCost / averageDollarsPerDay
    }, [boostCost, averageDollarsPerDay]);

    const boostBonus = useMemo(() => {
        return {
            dailyBonusDollars: averageDollarsPerDay * (boostRate - 1),
            dailyDollars: averageDollarsPerDay * boostRate,
            totalBonusDollars: averageDollarsPerDay * (boostRate - 1) * boostDuration,
            totalDollars: averageDollarsPerDay * boostRate * boostDuration,
        };
    }, [averageDollarsPerDay, boostRate, boostDuration]);

    const boostWorth = useMemo(() => {
        const minTotalDollars = boostCost + averageDollarsPerDay * boostDuration;
        const totalDollarsMoreThanNormal = minTotalDollars - (averageDollarsPerDay * boostDuration);
        const dailyDollarsMoreThanNormal = Math.ceil(totalDollarsMoreThanNormal / boostDuration);
        const dailyMessagesMoreThanNormal = Math.ceil(dailyDollarsMoreThanNormal / (AVERAGE_MONEY_PER_MESSAGE * boostRate));
        const dailyMessages = dailyMessagesMoreThanNormal + averageMessagesPerDay;
        const dailyMessagesMoreThanNormalPercentage = dailyMessages / averageMessagesPerDay;

        return {
            minTotalDollars,
            totalDollarsMoreThanNormal,
            dailyDollarsMoreThanNormal,
            dailyMessagesMoreThanNormal,
            dailyMessages,
            dailyMessagesMoreThanNormalPercentage,
        };

    }, [boostCost, averageDollarsPerDay, averageMessagesPerDay, boostDuration, boostRate]);

    return (
        <div className="app">
            <h1>Calcul de rentabilité du boost</h1>

            <h2>Paramètres d'entrée</h2>

            <div>
                Nombre moyen de messages postés par l'utilisateur par jour&nbsp;
                <input type="number"
                       value={averageMessagesPerDay}
                       style={{width: 80}}
                       onChange={(e) => {
                           setAverageMessagesPerDay(parseFloat(e.target.value));
                       }}
                />
            </div>

            <div>
                Coût du boost&nbsp;
                <input type="number"
                       value={boostCost}
                       style={{width: 80}}
                       onChange={(e) => {
                           setBoostCost(parseFloat(e.target.value));
                       }}
                />
                &nbsp;$
            </div>

            <div>
                Durée du boost&nbsp;
                <input type="number"
                       value={boostDuration}
                       style={{width: 80}}
                       onChange={(e) => {
                           setBoostDuration(parseFloat(e.target.value));
                       }}
                />
                &nbsp;jours
            </div>

            <div>
                Multiplicateur : x
                <input type="number"
                       value={boostRate}
                       style={{width: 80}}
                       step="0.5"
                       onChange={(e) => {
                           setBoostRate(parseFloat(e.target.value));
                       }}
                />
            </div>

            <h2>Résultat</h2>

            <div>
                L'utilisateur gagne en moyenne {averageDollarsPerDay}$ par jour
            </div>

            <div>
                Il faut en moyenne {boostDayCost.toFixed(2)} jours à l'utilisateur pour se payer un boost
            </div>

            <div>
                Si l'utilisateur ne modifie pas sa cadence moyenne de messages, il gagne :
                <ul>
                    <li>{boostBonus.dailyDollars}$ par jour, soit {boostBonus.dailyBonusDollars}$ de plus chaque jour</li>
                    <li>{boostBonus.totalDollars}$ pendant la durée du boost ({boostDuration} jours), soit {boostBonus.totalBonusDollars}$ de plus au total</li>
                </ul>
            </div>

            <div>
                Si l'utilisateur souhaite rentabiliser son boost, il doit gagner {boostCost}$ + ({averageDollarsPerDay}$ x {boostDuration}j) = {boostWorth.minTotalDollars}$ soit :
                <ul>
                    <li>{boostWorth.totalDollarsMoreThanNormal}$ de plus que d'habitude sur {boostDuration} jours</li>
                    <li>{boostWorth.dailyDollarsMoreThanNormal}$ de plus que d'habitude chaque jour</li>
                </ul>
            </div>

            <div>
                Il doit donc poster en moyenne {boostWorth.dailyMessagesMoreThanNormal} messages de plus chaque jour, soit un total de {boostWorth.dailyMessages} messages par jour ({(boostWorth.dailyMessagesMoreThanNormalPercentage * 100).toFixed(0)}%)
            </div>

        </div>
    )
}

export default App;
