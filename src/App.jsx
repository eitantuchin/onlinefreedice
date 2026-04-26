import { useMemo, useState } from 'react';

const dotLayout = {
  1: [4],
  2: [1, 7],
  3: [1, 4, 7],
  4: [1, 3, 5, 7],
  5: [1, 3, 4, 5, 7],
  6: [1, 2, 3, 5, 6, 7],
};

const dotPositions = [
  { top: '18%', left: '18%' },
  { top: '18%', left: '50%' },
  { top: '18%', left: '82%' },
  { top: '50%', left: '50%' },
  { top: '82%', left: '18%' },
  { top: '82%', left: '50%' },
  { top: '82%', left: '82%' },
];

function App() {
  const [diceCount, setDiceCount] = useState(1);
  const [sides, setSides] = useState(6);
  const [values, setValues] = useState([1]);
  const [rolling, setRolling] = useState(false);
  const [message, setMessage] = useState('Choose the number of dice, select the sides, then roll for your result.');

  const activeDotSets = useMemo(
    () => values.map((value) => (sides === 6 ? dotLayout[value] ?? [] : [])),
    [values, sides]
  );

  const handleDiceCountChange = (event) => {
    const nextCount = Number(event.target.value);
    setDiceCount(nextCount);
    setValues((current) => {
      return Array.from({ length: nextCount }, (_, index) => current[index] ?? 1);
    });
  };

  const handleSidesChange = (event) => {
    const nextSides = Number(event.target.value);
    setSides(nextSides);
    setValues((current) => current.map((value) => Math.min(value, nextSides) || 1));
  };

  const rollDice = () => {
    if (rolling) return;
    setRolling(true);
    setMessage('Rolling the free online dice...');

    const nextValues = Array.from({ length: diceCount }, () => Math.floor(Math.random() * sides) + 1);
    setTimeout(() => {
      setValues(nextValues);
      setRolling(false);
      setMessage(
        `Rolled ${diceCount} ${sides}-sided dice: ${nextValues.join(', ')}. Each die has a 1 in ${sides} chance per face.`
      );
    }, 750);
  };

  return (
    <div className="page-shell">
      <header className="hero-panel">
        <div>
          <span className="eyebrow">Free Dice Roller</span>
          <h1>Roll dice online with any number of dice and custom sides</h1>
          <p>
            Use this free online dice roller to choose up to 10 dice, set the number of sides per die, and generate random rolls for tabletop games,
            board game sessions, role-playing, probability study, and quick decisions.
          </p>
        </div>
      </header>

      <main className="content-grid">
        <section className="dice-card" aria-label="dice roller">
          <div className="dice-hero">
            <h2>Customize your roll</h2>
            <p>
              Pick how many dice to roll and how many sides each die should have, then click the die or the button to roll.
            </p>
          </div>

          <div className="dice-settings">
            <label>
              Dice count
              <select value={diceCount} onChange={handleDiceCountChange}>
                {Array.from({ length: 10 }, (_, index) => index + 1).map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Sides per die
              <select value={sides} onChange={handleSidesChange}>
                {[4, 6, 8, 10, 12, 20].map((side) => (
                  <option key={side} value={side}>
                    d{side}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="dice-grid" role="group" aria-label="Dice results">
            {values.map((value, index) => (
              <button
                key={index}
                className="die-frame die-cell"
                onClick={rollDice}
                disabled={rolling}
                aria-label={`Die ${index + 1} value ${value}`}
              >
                <div className={`die-face ${rolling ? 'rolling' : ''}`}>
                  {sides === 6 ? (
                    dotPositions.map((position, dotIndex) => (
                      <span
                        key={dotIndex}
                        className={`dot ${activeDotSets[index].includes(dotIndex + 1) ? 'active' : ''}`}
                        style={position}
                      />
                    ))
                  ) : (
                    <span className="die-number">{value}</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button className="roll-button" onClick={rollDice} disabled={rolling}>
            {rolling ? 'Rolling...' : 'Roll Dice'}
          </button>

          <div className="roll-summary">
            <p>{message}</p>
            <p className="hint">
              Use this online dice roller with up to 10 dice. The odds update automatically for multiple dice and different sided dice.
            </p>
          </div>
        </section>

        <section className="probability-card">
          <h2>Dice rolling probability explained</h2>
          <p>
            When you roll a fair die, each face has an equal probability. For a six-sided die, each face has a 16.67% chance. For a d12, the chance of any single outcome is 8.33%.
          </p>

          <div className="probability-grid">
            <div>
              <h3>Multiple dice odds</h3>
              <p>
                Rolling more than one die multiplies the number of possible outcomes. Each die is independent, so ten d6 dice still have equal individual chances for each face.
              </p>
            </div>
            <div>
              <h3>Custom sided dice</h3>
              <p>
                Different sided dice are common in tabletop RPGs and probability practice. A d20 has one in twenty chance per face, while a d4 has one in four.
              </p>
            </div>
            <div>
              <h3>Probability in games</h3>
              <p>
                This free online dice roller helps you learn dice probability, compare odds, and generate fair random results for gaming and probability study.
              </p>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Die Type</th>
                  <th>Odds per face</th>
                  <th>Probability</th>
                </tr>
              </thead>
              <tbody>
                {[4, 6, 8, 10, 12, 20].map((side) => (
                  <tr key={side}>
                    <td>d{side}</td>
                    <td>1 in {side}</td>
                    <td>{(100 / side).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>Free online dice roller for tabletop gaming, probability practice, and fast digital die rolls.</p>
      </footer>
    </div>
  );
}

export default App;
