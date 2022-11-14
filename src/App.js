import { useEffect, useState } from 'react';
import './App.css';
import Die from './components/Die';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [count, setCount] = useState(0);

  let highScore = JSON.parse(localStorage.getItem('count')) || 0;

  useEffect(() => {
    if (dice.every(die => die.isHeld && die.value === dice[0].value)) {
      setTenzies(true);
      if (!localStorage.getItem('count')) {
        localStorage.setItem('count', JSON.stringify(count));
      } else {
        const prevCount = localStorage.getItem('count');
        if (count < prevCount) {
          localStorage.setItem('count', JSON.stringify(count));
        }
      }
    }
  }, [dice, count]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      setDice(oldDice =>
        oldDice.map(die => {
          return !die.isHeld ? generateNewDie() : die;
        })
      );
      setCount(prevCount => prevCount + 1);
    } else {
      setTenzies(false);
      setDice(allNewDice());
      setCount(0);
    }
  }

  function holdDice(id) {
    setDice(oldDice =>
      oldDice.map(die => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = dice.map(die => (
    <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)} />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className='title'>Tenzies</h1>
      <p className='instructions'>
        Roll until all dice are the same. Click each die to freeze it at its current value between
        rolls.
      </p>
      <div className='dice-container'>{diceElements}</div>
      <button className='roll-dice' onClick={rollDice}>
        {tenzies ? 'New Game' : 'Roll'}
      </button>
      <div className='count-container'>
        <p>Number of Rolls: {count}</p>
        <p>High Score: {highScore}</p>
      </div>
    </main>
  );
}
