import { Injectable, signal } from '@angular/core';
import { Planet } from '../models/planet.model';

@Injectable({
  providedIn: 'root',
})
export class SceneState {

  selectedPlanet = signal<Planet | null>(null);
  simulationSpeed = signal<number>(100);
  showOrbits = signal<boolean>(true);
  showLabels = signal<boolean>(true);
  isPaused = signal<boolean>(false);

  selectPlanet(planet: Planet | null) : void{
    this.selectedPlanet.set(planet);
  }

  setSpeed(speed: number): void {
    this.simulationSpeed.set(speed);
  }

  toggleOrbits(): void {
    this.showOrbits.update(v => !v);
  }

  togglePause(): void {
    this.isPaused.update(v => !v);
  }

  toggleLabels(): void {
    this.showLabels.update(v => !v);
  }
}
