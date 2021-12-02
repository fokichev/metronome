import React from "react";
import './App.css';

import click_1 from "./1_metronome.wav";
import click_2 from "./2_metronome.wav";

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      active: false,
      bpm: 180,
      perMeasure: 4,
    };
  };


  changeBpm(e){
    // const {bpm} = this.state;
    // alert(e.target.value)
    this.setState({bpm: e.target.value});
    // alert(bpm)
  }

  playPause(){
    const {active, bpm} = this.state;
    if(active){
      clearInterval(this.interval)
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
          <input type = "range" min = "40" max = "218" value = {bpm} onChange = {this.changeBpm.bind(this)}/>
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
