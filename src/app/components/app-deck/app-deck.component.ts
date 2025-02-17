/**
  This file is part of Web Virtual DJ.

Web Virtual DJ is free software: you can redistribute it and / or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

Web Virtual DJ is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.See the
GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
along with Web Virtual DJ.If not, see < https://www.gnu.org/licenses/>.
*/
import { Component, OnInit, Input, AfterViewInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MusicLoaderService } from '../../services/music-loader.service';
import { PlayerService } from '../../services/player.service';
import { Subscription } from 'rxjs';
import * as WaveSurfer from 'wavesurfer.js';
import * as Cursor from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js';
import * as Regions from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import { HelpService } from 'src/app/services/help.service';
import { TranslationService } from 'src/app/services/translation.service';
import { TransitService } from 'src/app/services/transit.service';

@Component({
  selector: 'app-deck',
  templateUrl: './app-deck.component.html',
  styleUrls: ['./app-deck.component.css']
})
export class AppDeckComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  deckNumber: number;
  @ViewChild('waveform', { static: true })
  waveform: ElementRef;
  private musicSubscription: Subscription;
  rotation = 0;
  private active = false;
  song: any;
  bpm: any;
  beats: any;
  effects = [{}, {}, {}, {}, {}, {}] as any;
  pitch = 0;
  cues = [];
  activeLoop: any;
  activeLoopRegion: any;
  loops = [0.25, 0.5, 1, 2, 4, 8, 16];
  actualLoop = 2;
  showedLoops = 3;
  lastLoopStart: any;
  lastLoopEnd: any;
  loopChanger: any;
  incomingLoop = null;
  help: any;
  playerService: PlayerService;
  locale: string;
  // autoTransit: boolean;
  // autoTransitDuration: number;
  constructor(
    private musicService: MusicLoaderService,
    playerService: PlayerService,
    helpService: HelpService,
    translationService: TranslationService,
    private transitService: TransitService
  ) {
    this.playerService = playerService;
    helpService.help$.subscribe(help => {
      this.help = help;
    });
    this.locale = translationService.getActualLang();
    translationService.getTranslation().onLangChange.subscribe(value => {
      this.locale = value.lang;
    });
    // transitService.transit$.subscribe((transit: boolean) => {
    //   this.autoTransit = transit;
    // });
    // transitService.duration$.subscribe((duration: number) => {
    //   this.autoTransitDuration = duration;
    // });
  }
  ngOnInit() {
    setInterval(() => {
      this.rotate();
    }, 50);
    this.effects = this.playerService.effects[this.deckNumber].filter(_ => true);
    this.playerService.effects$[this.deckNumber].subscribe(effects => {
      const eff = effects as any;
      this.effects = eff.filter(_ => true);
    });
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      const height = this.waveform.nativeElement.offsetHeight;
      requestAnimationFrame(() => {
        this.playerService.save(
          this.deckNumber,
          WaveSurfer.create({
            container: '#' + this.waveform.nativeElement.id,
            waveColor: 'red',
            progressColor: 'purple',
            height: height,
            responsive: 0,
            plugins: [
              Cursor.create({
                showTime: true,
                opacity: 1,
                customShowTimeStyle: {
                  'background-color': '#000',
                  color: '#fff',
                  padding: '2px',
                  height: height,
                  'font-size': '10px'
                }
              }),
              Regions.create({
                regions: []
              })
            ]
          })
        );
        this.playerService.on(this.deckNumber, 'finish', () => {
          this.resetDisc();
        });
        this.playerService.on(this.deckNumber, 'ready', () => {
          this.resetDisc();
          this.resetCUE();
          this.resetPitch();
        });
        this.playerService.on(this.deckNumber, 'audioprocess', (current: number) => {
          this.transitService.auto(this.deckNumber, current);
        });
      });
      this.musicSubscription = this.musicService.decksongs$[this.deckNumber].subscribe(a => {
        const data = a as any;
        this.song = data.song as File;
        this.bpm = data.bpm;
        this.beats = data.beats ? data.beats.reverse() : null;
      });
      // Necessary delay for testing
    }, 100);
  }
  @HostListener('window:resize')
  onResize() {
    const height = this.waveform.nativeElement.offsetHeight;
    this.playerService.adjustHeight(this.deckNumber, height);
  }

  rotate() {
    if (this.active) {
      this.rotation = (this.rotation + (10 * (100 + this.pitch)) / 100) % 360;
    }
  }
  resetDisc() {
    this.active = false;
    this.rotation = 0;
  }
  ngOnDestroy(): void {
    if (this.musicSubscription) {
      this.musicSubscription.unsubscribe();
    }
  }
  playPause() {
    this.playerService.playPause(this.deckNumber);
    this.active = this.playerService.isPlaying(this.deckNumber);
  }
  applyEffect(i) {
    this.playerService.activateEffect(this.deckNumber, i);
  }
  changePitch() {
    const deck = this.deckNumber;
    this.playerService.setPitch(deck, (100 + this.pitch) / 100);
  }
  resetPitch() {
    const deck = this.deckNumber;
    this.pitch = 0;
    this.playerService.setPitch(deck, 1);
  }
  addCUE() {
    if (this.song) {
      const cue = {};
      cue['percent'] =
        (this.playerService.getCurrentTime(this.deckNumber) / this.playerService.getDuration(this.deckNumber)) * 100;
      cue['pos'] = this.playerService.getCurrentTime(this.deckNumber) / this.playerService.getDuration(this.deckNumber);
      if (this.cues.length === 4) {
        this.cues.shift();
      }
      this.cues.push(cue);
    }
  }
  startCUE(cue) {
    this.playerService.playFromPosition(this.deckNumber, this.cues[cue].pos);
  }
  resetCUE() {
    this.cues = [];
  }
  createLoop(loop) {
    if (this.song && this.beats && this.incomingLoop === null) {
      const currentTime = this.playerService.getCurrentTime(this.deckNumber);
      const index = this.beats.findIndex(e => e <= currentTime);
      if (index !== -1) {
        if (!this.activeLoop && index) {
          this.activeLoop = loop;
          if (this.loops.indexOf(loop) - 1 + this.showedLoops > this.loops.length) {
            this.actualLoop = this.loops.length - this.showedLoops;
          } else if (this.loops.indexOf(loop) - 1 < 0) {
            this.actualLoop = 0;
          } else {
            this.actualLoop = this.loops.indexOf(loop) - 1;
          }
          const start = this.beats[index];
          this.lastLoopStart = start;
          const end =
            loop >= 1
              ? this.beats[index - loop]
              : this.beats[index] + (this.beats[index - 1] - this.beats[index]) * loop;
          this.lastLoopEnd = end;
          if (currentTime > end) {
            this.playerService.playFromPosition(
              this.deckNumber,
              start / this.playerService.getDuration(this.deckNumber)
            );
          }
          this.activeLoopRegion = this.playerService.createLoop(this.deckNumber, start, end);
        } else if (this.activeLoop !== loop) {
          this.resetLoop();
          this.incomingLoop = loop;
          this.playerService.getInstance(this.deckNumber).on('audioprocess', () => {
            if (this.playerService.getCurrentTime(this.deckNumber) >= this.lastLoopEnd) {
              this.activeLoop = loop;
              this.incomingLoop = null;
              if (this.loops.indexOf(loop) - 1 + this.showedLoops > this.loops.length) {
                this.actualLoop = this.loops.length - this.showedLoops;
              } else if (this.loops.indexOf(loop) - 1 < 0) {
                this.actualLoop = 0;
              } else {
                this.actualLoop = this.loops.indexOf(loop) - 1;
              }
              const start = this.lastLoopStart;
              const indx = this.beats.findIndex(e => e <= this.lastLoopStart);
              const end =
                loop >= 1
                  ? this.beats[indx - loop]
                  : this.beats[indx] + (this.beats[indx - 1] - this.beats[indx]) * loop;
              this.lastLoopEnd = end;
              this.activeLoopRegion = this.playerService.createLoop(this.deckNumber, start, end);
              this.playerService.playFromPosition(
                this.deckNumber,
                start / this.playerService.getDuration(this.deckNumber)
              );
              this.playerService.getInstance(this.deckNumber).un('audioprocess');
            }
          });
        } else {
          this.resetLoop();
        }
      } else {
        this.resetLoop();
      }
    }
  }
  resetLoop() {
    if (this.activeLoopRegion) {
      this.activeLoopRegion.remove();
      this.activeLoopRegion = null;
    }
    this.activeLoop = null;
  }
  moveLoop(step) {
    if (!(this.actualLoop + step + this.showedLoops > this.loops.length || this.actualLoop + step < 0)) {
      this.actualLoop += step;
    }
  }
}
