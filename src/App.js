import React from "react";
import './App.css';

import click_1 from "./1_metronome.wav";
import click_2 from "./2_metronome.wav";

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      active: false,
      bpm: 120,
      perMeasure: 4,
    };
  };


// explanation for arrow notation instead of using bind: https://stackoverflow.com/questions/35287949/react-with-es7-uncaught-typeerror-cannot-read-property-state-of-undefined/35287996
  changeBpm = event => {
    this.setState({bpm: event.target.value});
    const {active, bpm} = this.state;
    if(active){
      // stop current interval, start a new one
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.playClick();
      }, ((60/bpm)*1000));
    }

  }

  playPause(){
    const {active, bpm} = this.state;
    if(active){
      clearInterval(this.interval);
      this.setState({active: false});
    }
    else{
      this.setState({active: true});
      this.interval = setInterval(() => {
        this.playClick();
      }, ((60/bpm)*1000));
    }

  }


  playClick(){
    const click1 = new Audio(click_1);
    click1.play();
    console.log("hello");
  }

  render(){
    const {active, bpm} = this.state;
    return (
      <div className = "body">
        <div className = "bpm">
          <div>{bpm} BPM</div>
          <button>-</button>
          <input type = "range" min = "40" max = "218" value = {bpm} onChange = {this.changeBpm}/>
          <button>+</button>
        </div>
        <div className = "buttons">
          <button id="play" onClick = {() => this.playPause()}>{active ? "pause" : "play"}</button>
          <button id="setbpm">set bpm</button>
        </div>
      </div>
    );
  }

}

export default App;
