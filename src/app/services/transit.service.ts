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
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PlayerService } from './player.service';

@Injectable({
  providedIn: 'root'
})
export class TransitService {
  transit: boolean;
  duration: number;
  // transit = new Subject();
  // duration = new Subject();
  // transit$ = this.transit.asObservable();
  // duration$ = this.duration.asObservable();
  volumnMaster = new Subject();
  volumnMaster$ = this.volumnMaster.asObservable();
  constructor(public playerService: PlayerService) {}

  changeTransit(enabled: boolean, duration: number) {
    this.transit = enabled;
    this.duration = duration;
  }

  auto(deckNumber: number, current: number) {
    if (!this.transit) return;
    const nextDeck = (deckNumber + 1) % 2;
    const nextSong = this.playerService.getInstance(nextDeck);
    if (nextSong.getDuration() <= 0) return;
    const transitDuration = this.playerService.getDuration(deckNumber) - current
    if (transitDuration > this.duration || transitDuration <= 0) return;
    if (!this.playerService.isPlaying(deckNumber)) return;

    if (!this.playerService.isPlaying(nextDeck)) this.playerService.playPause(nextDeck);
    const maxVol = 100;
    const volProgress = 2 * maxVol / this.duration * (this.duration - transitDuration);
    if (deckNumber === 0) {
      this.volumnMaster.next(-maxVol + volProgress);
    } else {
      this.volumnMaster.next(maxVol - volProgress);
    }
    console.log("audioprocess", current);
  }
}
