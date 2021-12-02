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
      bpm: 140,
      perMeasure: 4,
      currentBeat: 0,
      // calculating BPM
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
    const {perMeasure, currentBeat} = this.state;
    // if 1st beat of measure, play click1, otherwise click 2
    if (currentBeat % perMeasure === 0) {
      const click1 = new Audio(click_1);
      click1.play();
    }
    else{
      const click2 = new Audio(click_2);
      click2.play();
    }

    // increment beat
    this.setState({
      currentBeat: currentBeat + 1,
    });
  }

  setBpm(){
    // play sound
    this.playClick();
    // get time
    const date = new Date();
    const time = date.getTime();
    // append time to times array
    const {times, perMeasure} = this.state;
    // get last N number of elements where N is time signature
    let newTimes = times;
    newTimes.push(time);
    newTimes = newTimes.slice((perMeasure*2) * -1);
    this.setState({times: newTimes});
    this.calculateBPM();
    setTimeout(() => this.checkTimeout(time), 2000);
  }

  checkTimeout(time){
    const {times} = this.state;
    let lastTime = times.at(-1);
    if(time === lastTime){
      // 2 seconds passed = time out
      // change color of BPM back to black
      // reset times array
      this.setState({
        times: [],
        currentBeat: 0,
      });

    }
  }

    calculateBPM(){
      const {times} = this.state;
      if (times.length > 1){
        let sumOfGaps = 0;
        for (let i = 1; i < times.length; i++){
          sumOfGaps = sumOfGaps + (times[i] - times[i-1]);
        }
        let average = sumOfGaps/(times.length-1)
        let bpm = Math.round((1000/average)*60);
        if(bpm > 250){bpm = 250;}
        if(bpm < 35){bpm = 35;}
        this.setState({bpm: bpm});
      }
    }

    plusMinus(x){
      const {bpm} = this.state;
      let temp = bpm + x;
      this.setState({bpm: temp});
    }



  render(){
    const {active, bpm} = this.state;
    return (
      <div className = "body">
        <div className = "bpm">
          <div>{bpm} BPM</div>
          <button onClick = {() => this.plusMinus(-1)}>-</button>
          <input type = "range" min = "35" max = "250" value = {bpm} onChange = {this.changeBpm}/>
          <button onClick = {() => this.plusMinus(1)}>+</button>
        </div>
        <div className = "buttons">
          <button id="play" onClick = {() => this.playPause()}>{active ? "pause" : "play"}</button>
          <button id="setbpm" disabled={active} onClick = {() => this.setBpm()}>set bpm</button>
        </div>
      </div>
    );
  }

}

export default App;
