import React from "react";
import './App.css';

import click_1 from "./1_metronome.wav";
import click_2 from "./2_metronome.wav";

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      active: false,
      bpm: 90,
      perMeasure: 4,
    };
    this.click_1 = new Audio(click_1);
    this.click_2 = new Audio(click_2);
  };


  startClick(){
    const {bpm} = this.state;
    this.setState({
      active: true,
    });
    // clearInterval()
    setInterval(() => {
      this.playClick();
    }, ((60/bpm)*1000));
  }

  pauseClick(){

  }


  playClick(){
    const click1 = new Audio(click_1);
    click1.play();
    // this.click_1.play();
    console.log("hello");
  }

  render(){
    const {bpm} = this.state;
    return (
      <div className = "body">
        <div className = "bpm">
          <div>{bpm} BPM</div>
          <button>-</button>
          <input type = "range" min = "40" max = "218" value = {bpm} />
          <button>+</button>
        </div>
        <div className = "buttons">
          <button id="play" onClick = {() => this.startClick()}>play</button>
          <button id="setbpm">set bpm</button>
          <button id="pause">pause</button>
        </div>
      </div>
    );
  }

}

export default App;
