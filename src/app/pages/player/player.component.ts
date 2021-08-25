import { Component, OnInit } from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {ProgressBarMode} from '@angular/material/progress-bar';
import { observable, Observable } from 'rxjs';
import * as moment from 'moment';
import { getLocaleTimeFormat } from '@angular/common';

export interface Section {
  name: string;
  artist: string;
}
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  value = 50;
  bufferValue = 75;
  activeSong:number=0;
  isPlaying:boolean=false;
  icon:string='play_circle_filled';
  constructor() { }
  audioObj=new Audio();
  rowSelected:boolean;
  currentTime:any='00:00:00';
  duration:any='00:00:00';
  pausedTime:any='00:00:00';
  indexPlaying:number;
  seek:any=0;
  cuurentSong:string;
  playSong:boolean=false;
  audioEvents = [
    "ended",
    "error",
    "play",
    "playing",
    "pause",
    "timeupdate",
    "canplay",
    "loadedmetadata",
    "loadstart"
  ];
  files = [
    {
      url:'./assets/dil ibadat.mp3',
      name: 'Dil Ibadat',
      artist: 'KK',
    },
    {
      url:'./assets/Ishq Sufiyana.mp3',
      name: 'Ishq Sufiyana',
      artist: 'Kamal Khan',
    },
    {
      url:'./assets/Kaun Tujhe.mp3',
      name: 'Kaun Tujhe',
      artist: 'Palak Muchhal',
    }
  ];

  ngOnInit(): void {
  }
  playPrevious(){
    if(this.indexPlaying===0){
      this.indexPlaying=this.files.length;
    }
    console.log(this.indexPlaying);
    this.audioObj.src=this.files[this.indexPlaying-1].url;
    this.audioObj.load();
    this.openFile(this.files[this.indexPlaying-1].url,this.indexPlaying+1)
  }
  play(){
    console.log("in play");
    if(this.pausedTime==='00:00:00'){
      console.log(this.files[0].url);
      this.audioObj.src=this.files[0].url;
      this.audioObj.load();
    this.audioObj.play();
    }
    else{
      this.audioObj.currentTime=this.pausedTime;
      this.audioObj.src=this.cuurentSong;
      //this.audioObj.load();
      this.audioObj.play();
    }
    
    
    this.playSong=true;
    this.isPlaying=true;
    
  }
  pause(){
    console.log("in pause");
    this.playSong=false;
    this.isPlaying=false;
    this.icon='play_circle_filled'
    this.audioObj.pause();
    this.pausedTime=this.audioObj.currentTime;
  }
  playNext(){
  console.log(this.indexPlaying);
    if(this.indexPlaying===this.files.length-1){
      this.indexPlaying=-1;
    }
    this.audioObj.src=this.files[this.indexPlaying+1].url;
    this.audioObj.load();
    this.openFile(this.files[this.indexPlaying+1].url,this.indexPlaying+1)
  }
  openFile(url,index){
    this.indexPlaying=index
    console.log( index);
    console.log( this.activeSong);
    this.cuurentSong=url;
    this.streamPlay(url).subscribe();
    this.activeSong=index;
    this.rowSelected=true;
    this.isPlaying=true;
      console.log("playing song");
  }


  streamPlay(url){
    return new Observable(observable=>{
      console.log(url);
      this.audioObj.src=url;
      this.audioObj.load();
      this.audioObj.play();
      this.isPlaying=true;
      const handler=(event:Event)=>{
        console.log(event);
        this.seek=this.audioObj.currentTime;
        this.duration=this.timeFormat(this.audioObj.duration);
        this.currentTime=this.timeFormat(this.audioObj.currentTime);
      }
      this.addEvent(this.audioObj,this.audioEvents,handler);
      return () => {
        // Stop Playing
        this.audioObj.pause();
        this.audioObj.currentTime = 0;
        // remove event listeners
        this.removeEvents(this.audioObj, this.audioEvents, handler);
      };
    });
  }

  removeEvents(obj, events, handler) {
    events.forEach(event => {
      obj.removeEventListener(event, handler);
    });
  }
  addEvent(obj,events,handler){
    events.forEach(ev => {
      console.log(obj);
      obj.addEventListener(ev,handler);
    });
  }
  timeFormat(time){
    const momentTime=time*1000;
    return moment.utc(momentTime).format("HH:mm:ss");
  }
  seekTo(ev){
    console.log(ev);
    this.audioObj.currentTime=ev.value;
  }
}
