import React from "react";
import './App.css';

import click_1 from "./1_metronome.wav";
import click_2 from "./2_metronome.wav";

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      // metronome
      active: false,
      bpm: 120,
      perMeasure: 4,
      currentBeat: 0,
      // calculating BPM
      bpmCounting: false,
      times: [],
    };
  };


// explanation for arrow notation instead of using bind: https://stackoverflow.com/questions/35287949/react-with-es7-uncaught-typeerror-cannot-read-property-state-of-undefined/35287996
  changeBpm = event => {
    const bpm = event.target.value;
    this.setState({
      bpm: bpm,
      currentBeat: 0,
    });
    const {active} = this.state;
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
      this.setState({
        active: false,
        currentBeat: 0,
      });
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
    const click2 = new Audio(click_2);
    const {perMeasure, currentBeat} = this.state;
    // if 1st beat of measure, play click1, otherwise click 2
    if (currentBeat % perMeasure === 0) {
      click1.play();
    }
    else{
      click2.play();
    }

    // increment beat
    this.setState({
      currentBeat: currentBeat + 1,
    });
  }

  setBpm(){
    // get time
    const date = new Date();
    const time = date.getTime();
    // append time to times array
    const {times, perMeasure} = this.state;
    // get last N number of elements where N is time signature
    let newTimes = times;
    newTimes.push(time);
    newTimes = newTimes.slice((perMeasure) * -1);
    this.setState({times: newTimes});
    // alert(this.state.times);

    // this.setState({times: newTimes});
    // alert(this.state.times);
    // setTimeout(this.checkTimeout(time), 2000);
    setTimeout(() => this.checkTimeout(time), 2000);
  }

  checkTimeout(time){
    const {times} = this.state;
    let lastTime = times.at(-1);
    if(time === lastTime){
      // alert("time out");
      console.log(time + " " + lastTime);
    }
  }


  render(){
    const {active, bpm, times} = this.state;
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
          <button id="setbpm" onClick = {() => this.setBpm()}>set bpm</button>
          <button id="setbpm" onClick = {() => alert(this.state.times)}>hello</button>
          <p>{times}</p>
        </div>
      </div>
    );
  }

}

export default App;
