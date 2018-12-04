import { Injectable } from '@angular/core';
import Tuna from 'tunajs';

@Injectable({
  providedIn: 'root'
})
export class EffectsService {
  effects = [
    {
      name: 'Basic moog filter',
      type: 'MoogFilter',
      active: false,
      config: {
        cutoff: 0.065, // 0 to 1
        resonance: 3.5, // 0 to 4
        bufferSize: 4096 // 256 to 16384
      }
    },
    {
      name: 'Basic ping pong',
      type: 'PingPongDelay',
      active: false,
      config: {
        cutoff: 0.065, // 0 to 1
        resonance: 3.5, // 0 to 4
        bufferSize: 4096 // 256 to 16384
      }
    },
    {
      name: 'Basic left panner',
      type: 'Panner',
      active: false,
      config: {
        pan: -1 // -1 (left) to 1 (right)
      }
    },
    {
      name: 'Basic right panner',
      type: 'Panner',
      active: false,
      config: {
        pan: 1 // -1 (left) to 1 (right)
      }
    },
    {
      name: 'Basic bitcrusher',
      type: 'Bitcrusher',
      active: false,
      config: {
        bits: 4, // 1 to 16
        normfreq: 0.1, // 0 to 1
        bufferSize: 4096 // 256 to 16384
      }
    },
    {
      name: 'Basic phaser',
      type: 'Phaser',
      active: false,
      config: {
        rate: 1.2, // 0.01 to 8 is a decent range, but higher values are possible
        depth: 0.3, // 0 to 1
        feedback: 0.2, // 0 to 1+
        stereoPhase: 30, // 0 to 180
        baseModulationFrequency: 700, // 500 to 1500
        bypass: 0
      }
    }
  ];
  getEffects() {
    return this.effects;
  }
  addEffect(effect) {
    this.effects.push(effect);
  }

  constructor() {}
}
