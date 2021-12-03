import React from "react";
import './App.css';

import click_1 from "./1_metronome.wav";
import click_2 from "./2_metronome.wav";
import playImg from "./buttons/play.svg";
import pauseImg from "./buttons/pause.svg";
import recordImg from "./buttons/record.svg";
import recordDisabledImg from "./buttons/recordDisabled.svg";
import minusImg from "./buttons/minus.svg";
import plusImg from "./buttons/plus.svg";

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
      calculating: false,
      times: [],
      measure: "",
    };
  };


  // explanation for arrow notation instead of using bind: https://stackoverflow.com/questions/35287949/react-with-es7-uncaught-typeerror-cannot-read-property-state-of-undefined/35287996
  // BPM slider onChange handler
  changeBpm = event => {
    const bpm = event.target.value;
    this.setState({
      bpm: bpm,
      currentBeat: 0,
    }, this.resetPlay); // resetPlay happens only after state is updates
  }

  // time signature select onChange handler
  selectChange = event => {
    this.setState({perMeasure: event.target.value});
    this.resetPlay();
  }

  // onClick play/pause button handler
  playPause(){
    const {active, bpm} = this.state;
    // pause
    if(active){
      clearInterval(this.interval);
      this.setState({
        active: false,
        currentBeat: 0,
        measure: "",
      });
    }
    // play
    else{
      this.setState({
        active: true,
        currentBeat: 0,
        measure: "",
      });
      this.interval = setInterval(() => {
        this.playClick();
      }, ((60/bpm)*1000));
    }
  }

  // play appropriate click sound and display visual representation through star symbols
  playClick(){
    const {perMeasure, currentBeat, measure} = this.state;
    let temp = "";
    // if 1st beat of measure, play click 1, otherwise click 2
    if (currentBeat % perMeasure === 0) {
      // have to create new Audio object every time, otherwise JS will wait for previous click to finish to play new one
      const click1 = new Audio(click_1);
      click1.play();
      // if two measures displayed, reset measures
      if (currentBeat % (perMeasure*2) === 0) {
        temp = "★ ";
      }
      else{
        temp = measure + "★ ";
      }
    }
    else{
      const click2 = new Audio(click_2);
      click2.play();
      // if perMeasure is 0 (no accent click), limit to 10 beats
      if (perMeasure == 0 && measure.length > 18){
        temp = "☆ ";
      }
      else{
        temp = measure + "☆ ";
      }
    }
    this.setState({
      // increment stars
      measure: temp,
      // increment beat
      currentBeat: currentBeat + 1,
    });
  }

  // determine BPM from user clicking the button in rhythm
  setBpm(){
    // play sound when button is pressed
    this.playClick();
    // get time
    const date = new Date();
    const time = date.getTime();
    // append time to times array
    const {times, perMeasure} = this.state;
    let newTimes = times;
    newTimes.push(time);
    // get last N number of elements where N is time signature (so user can adjust & average isn't skewed)
    newTimes = newTimes.slice((perMeasure * 2) * -1);
    this.setState({
      // calculating status for colour of BPM value ot let user know when its changeable
      calculating: true,
      times: newTimes,
    });
    this.calculateBPM();
    // after 2 seconds, stop the calculating process & reset variables
    setTimeout(() => this.checkTimeout(time), 2000);
  }

  // check if it's been 2 seconds since user last clicked "setBPM" button
  checkTimeout(time){
    const {active, times} = this.state;
    let lastTime = times.at(-1);
    if(time === lastTime){
      // 2 seconds passed = time out
      this.setState({
        // allows to change color of BPM back to black
        calculating: false,
        // reset times array
        times: [],
      });
      // if active, don't need to reset beat and measure after 2 seconds (as playPause resets locally)
      // else, reset current beat
      if(!active){
        this.setState({
          currentBeat: 0,
          measure: "",
        });
      }

    }
  }

  // calculate BPM from times values
  calculateBPM(){
    const {times} = this.state;
    if (times.length > 1){
      let sumOfGaps = 0;
      for (let i = 1; i < times.length; i++){
        sumOfGaps = sumOfGaps + (times[i] - times[i-1]);
      }
      let average = sumOfGaps/(times.length-1)
      let bpm = Math.round((1000/average)*60);
      // don't go over min/max boundaries
      if(bpm > 250){bpm = 250;}
      if(bpm < 35){bpm = 35;}
      this.setState({bpm: bpm});
    }
  }

  // plus/minus onClick event handler to adjust BPM
  plusMinus(x){
    const {bpm} = this.state;
    let temp = parseInt(bpm) + x; //parseInt as bpm becomes string from slider
    // don't go over min/max boundaries
    if(temp > 250){temp = 250;}
    if(temp < 35){temp = 35;}
    this.setState({bpm: temp});
    this.resetPlay();
  }

  resetPlay(){
    const {active, bpm} = this.state;
    if(active){
      // stop current interval, start a new one
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.playClick();
      }, ((60/bpm)*1000));
    }
  }

  render(){
    const {active, bpm, perMeasure, calculating, measure} = this.state;
    return (
      <div className = "metronome">
        <div className = "bpm">
          <div><span className = {calculating ? "activeBPM" : null}>{bpm}</span> BPM</div>
          <div className = "sliderContainer">
            <input type="image" src={minusImg} className = "plusMinus" onClick = {() => this.plusMinus(-1)}/>
            <input type = "range" min = "35" max = "250" className = "slider" value = {bpm} onChange = {this.changeBpm}/>
            <input type="image" src={plusImg} className = "plusMinus" onClick = {() => this.plusMinus(1)}/>
          </div>
        </div>
        <div className = "buttons">
          <input type="image" src={active ? pauseImg : playImg} className = "circleButton" onClick = {() => this.playPause()} alt={active ? "pause button" : "play button"}/>
          <input type="image" src={active ? recordDisabledImg: recordImg} className = "circleButton" disabled={active} onClick = {() => this.setBpm()} alt="set BPM button"/>
        </div>
        <div className = "timeSignature">
          Beats per measure: &nbsp;
          <select className = "selectStyle" onChange = {this.selectChange} value = {perMeasure}>
            <option value = "0">N/A</option>
            <option value = "2">2</option>
            <option value = "3">3</option>
            <option value = "4">4</option>
            <option value = "5">5</option>
            <option value = "6">6</option>
            <option value = "7">7</option>
            <option value = "8">8</option>
            <option value = "9">9</option>
            <option value = "10">10</option>
            <option value = "11">11</option>
            <option value = "12">12</option>
          </select>
        </div>
        <span className = "measure">{measure}</span>
      </div>
    );
  }
}

export default App;
