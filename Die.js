import React from "react";
import './App.css';

export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? "blue" : "white",
    color: props.isHeld ? "white" : "black"
  };

  return (
    <div style={styles} className="die">
      <h2 onClick={props.holdDice}>{props.value}</h2>
    </div>
  );
}

