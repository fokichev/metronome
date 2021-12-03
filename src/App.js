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
  changeBpm = event => {
    const bpm = event.target.value;
    this.setState({
      bpm: bpm,
      currentBeat: 0,
    }, this.resetPlay);
  }

  selectChange = event => {
    this.setState({perMeasure: event.target.value});
    this.resetPlay();
  }


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

  playClick(){
    const {perMeasure, currentBeat, measure} = this.state;
    // if 1st beat of measure, play click1, otherwise click 2
    let temp = "";
    if (currentBeat % perMeasure === 0) {
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
      // if perMeasure is 0, limit to 20 characters
      if (perMeasure == 0 && measure.length > 18){
        temp = "☆ ";
      }
      else{
        temp = measure + "☆ ";
      }
    }
    this.setState({
      measure: temp,
      // increment beat
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
    this.setState({
      calculating: true,
      times: newTimes,
    });
    this.calculateBPM();
    setTimeout(() => this.checkTimeout(time), 2000);
  }

  checkTimeout(time){
    const {active, times} = this.state;
    let lastTime = times.at(-1);
    if(time === lastTime){
      // 2 seconds passed = time out
      // change color of BPM back to black
      // reset times array
      this.setState({
        calculating: false,
        times: [],
      });
      // if active, don't need to reset beat and measure
      if(!active){
        this.setState({
          currentBeat: 0,
          measure: "",
        });
      }

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
      let temp = parseInt(bpm) + x;
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
