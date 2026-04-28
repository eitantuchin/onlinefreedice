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

const sideOptions = [4, 6, 8, 10, 12, 20];

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
  const total = useMemo(() => values.reduce((sum, value) => sum + value, 0), [values]);
  const average = useMemo(() => total / values.length, [total, values.length]);
  const possibleOutcomes = useMemo(() => sides ** diceCount, [diceCount, sides]);
  const highestRoll = useMemo(() => diceCount * sides, [diceCount, sides]);

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
        <div className="hero-copy">
          <span className="eyebrow">Free Dice Roller</span>
          <h1>Fast, polished dice rolls for games, study, and split-second decisions.</h1>
          <p>
            Roll up to 10 dice, switch between classic and RPG die types, and see the outcome instantly in a layout that feels more like a real play surface than a form.
          </p>
          <div className="hero-actions">
            <button className="roll-button hero-roll" onClick={rollDice} disabled={rolling}>
              {rolling ? 'Rolling...' : 'Roll Now'}
            </button>
            <div className="hero-note">Tap any die to reroll the full set.</div>
          </div>
        </div>

        <div className="hero-stats" aria-label="Current roll overview">
          <div className="stat-card">
            <span>Total</span>
            <strong>{total}</strong>
          </div>
          <div className="stat-card">
            <span>Average</span>
            <strong>{average.toFixed(1)}</strong>
          </div>
          <div className="stat-card">
            <span>Max Roll</span>
            <strong>{highestRoll}</strong>
          </div>
          <div className="stat-card">
            <span>Outcomes</span>
            <strong>{possibleOutcomes.toLocaleString()}</strong>
          </div>
        </div>
      </header>

      <main className="content-grid">
        <section className="dice-card" aria-label="dice roller">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Roll Setup</span>
              <h2>Customize the table</h2>
            </div>
            <p>Dial in the exact roll, then throw the whole set with one click.</p>
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

            <div className="sides-control">
              <span>Sides per die</span>
              <div className="side-toggle" role="group" aria-label="Sides per die">
                {sideOptions.map((side) => (
                  <button
                    key={side}
                    type="button"
                    className={`side-chip ${sides === side ? 'active' : ''}`}
                    onClick={() => handleSidesChange({ target: { value: side } })}
                    aria-pressed={sides === side}
                  >
                    d{side}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="result-banner" aria-live="polite">
            <div>
              <span className="result-label">Live Result</span>
              <strong>{values.join(' · ')}</strong>
            </div>
            <div>
              <span className="result-label">Chance Per Face</span>
              <strong>{(100 / sides).toFixed(2)}%</strong>
            </div>
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
              Current range: {diceCount} to {highestRoll}. Total combinations: {possibleOutcomes.toLocaleString()}.
            </p>
          </div>
        </section>

        <section className="probability-card" aria-labelledby="probability-heading">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Odds Guide</span>
              <h2 id="probability-heading">Probability at a glance</h2>
            </div>
            <p>Enough math to be useful, without turning the page into homework.</p>
          </div>

          <div className="probability-grid">
            <div>
              <h3>Multiple dice</h3>
              <p>
                Every die roll is independent, so adding more dice increases the number of possible combined outcomes without changing each face's individual fairness.
              </p>
            </div>
            <div>
              <h3>Different die types</h3>
              <p>
                A d4 hits each face 25% of the time, while a d20 lands on each number 5% of the time. Bigger dice give you finer-grained results.
              </p>
            </div>
            <div>
              <h3>Useful at the table</h3>
              <p>
                Use the totals, averages, and face odds to sanity-check encounters, classroom examples, or quick rules calls during a session.
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

        <section className="seo-copy" aria-labelledby="guide-heading">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Dice Guide</span>
              <h2 id="guide-heading">Free online dice roller for tabletop games, classrooms, and quick choices</h2>
            </div>
            <p>Static, readable copy helps people and search engines understand exactly what this page is for.</p>
          </div>

          <div className="seo-grid">
            <article>
              <h3>Roll common RPG dice online</h3>
              <p>
                This virtual dice roller supports d4, d6, d8, d10, d12, and d20 dice, so it works well for tabletop RPGs, board games, wargames, classroom demos, and any situation where you need a fast random number.
              </p>
            </article>

            <article>
              <h3>Use multiple dice in one roll</h3>
              <p>
                You can roll up to 10 dice at once and instantly review the individual values, total rolled amount, average result, and the maximum score available for the current setup.
              </p>
            </article>

            <article>
              <h3>Understand the odds before you play</h3>
              <p>
                The page also highlights per-face probability and possible outcome counts, which makes it useful for comparing dice systems, planning encounters, and explaining probability basics in plain language.
              </p>
            </article>
          </div>
        </section>

        <section className="faq-card" aria-labelledby="faq-heading">
          <div className="section-heading">
            <div>
              <span className="section-kicker">FAQ</span>
              <h2 id="faq-heading">Questions people ask about rolling dice online</h2>
            </div>
            <p>These answers also reinforce the page topic with clean semantic structure.</p>
          </div>

          <div className="faq-list">
            <article>
              <h3>How do I roll a die online?</h3>
              <p>
                Pick the number of dice, choose the die type, and press the roll button. The tool generates a random result in your browser without requiring sign-up or downloads.
              </p>
            </article>

            <article>
              <h3>Can I roll a d20, d12, or d6 here?</h3>
              <p>
                Yes. This free online dice roller supports d4, d6, d8, d10, d12, and d20 rolls, so it covers the most common dice used in tabletop role-playing and board games.
              </p>
            </article>

            <article>
              <h3>Is this useful for probability practice?</h3>
              <p>
                Yes. The totals, averages, face odds, and outcome counts make the page useful for probability lessons, homework demonstrations, and quick comparisons between different dice sizes.
              </p>
            </article>
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
