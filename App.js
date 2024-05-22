import React, { useEffect, useState } from "react";
import './App.css';
import Die from './Die.js';
import { nanoid } from "nanoid";
import CustomConfetti from "./Confetti.js";

function App() {
  const [dice, setDice] = useState(getAllNewDice());
  const [tenzie, setTenzie] = useState(false);
  const [count, setCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [misses, setMisses] = useState(0);

  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld);
    const firstNum = dice[0].value;
    const allSameValue = dice.every(die => die.value === firstNum);

    if (allHeld && allSameValue) {
      setTenzie(true);
    }
  }, [dice]);

  useEffect(() => {
    let timer;
    if (startTime && !tenzie) {
      timer = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    } else if (tenzie) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [startTime, tenzie]);

  function holdDice(id) {
    if (startTime === null) {
      setStartTime(Date.now());
    }
    setDice(prevDice =>
      prevDice.map(die =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  }

  function generateNewDice() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function getAllNewDice() {
    const newDice = [];
    for (let i = 0; i < 40; i++) { 
      newDice.push(generateNewDice());
    }
    return newDice;
  }

  function roll() {
    if (tenzie) {
      setDice(getAllNewDice());
      setTenzie(false);
      setCount(0);
      setStartTime(null);
      setElapsedTime(0);
      setMisses(0);
    } else {
      const heldDiceValues = dice.filter(die => die.isHeld).map(die => die.value);
      const unheldMatchingValues = dice.some(die => !die.isHeld && heldDiceValues.includes(die.value));

      if (heldDiceValues.length > 0 && unheldMatchingValues) {
        setMisses(prevMisses => prevMisses + 1);
      }
      
      setDice(prevDice =>
        prevDice.map(die =>
          die.isHeld ? die : generateNewDice()
        )
      );
      setCount(prevCount => prevCount + 1);
    }
  }

  const diceElements = dice.map(data => (
    <Die
      value={data.value}
      isHeld={data.isHeld}
      key={data.id}
      holdDice={() => holdDice(data.id)}
    />
  ));

  function formatElapsedTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  return (
    <div className="page">
      {tenzie && <CustomConfetti />}
      <div className="App">
        <h1 className="header">Roll Tenzies</h1>
        <div className="stats-container">
          <button className="misses">Misses: {misses}</button>
          <button className="time"><img width="20" height="20" src="https://img.icons8.com/officel/16/time.png" className="time-icon" alt="time" />: {formatElapsedTime(elapsedTime)}</button>
          <button className="numberOfRolls">Rolls: {count}</button>
        </div>
        <h2 className="rule" style={!tenzie ? {} : { marginLeft: "600px" }}>
  {!tenzie ? "Roll until all dice are the same. Click each die to freeze it at its current value between rolls." : "YOU WON!!!"}
</h2>
<hr className="line" />
        <div className="die-group">
          {diceElements}
        </div>
        <button className="roll" onClick={roll}>
          {tenzie ? "Play Again" : "Roll"}
        </button>
      </div>
    </div>
  );
}

export default App;
