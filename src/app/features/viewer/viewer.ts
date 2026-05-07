import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { SpeedControl } from '../speed-control/speed-control';
import { SceneState } from '../../core/services/scene-state';
import { SolarApiService } from '../../core/services/solar-api.service';
import { SceneService } from '../../core/scene/scene.service';
import { PlanetPanel } from "../planet-panel/planet-panel";
import { PlanetNav } from '../planet-nav/planet-nav';
import { Planet } from '../../core/models/planet.model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-viewer',
  imports: [SpeedControl, PlanetPanel, PlanetNav, CommonModule],
  templateUrl: './viewer.html',
  styleUrl: './viewer.scss',
})
export class Viewer implements AfterViewInit, OnDestroy {

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  loading = true;

  planets: Planet[] = [];

  constructor(
    public state : SceneState,
    public sceneService : SceneService,
    private solarApi : SolarApiService
  ) {}

  ngAfterViewInit(): void {
   this.sceneService.initScene(this.canvasRef);

    this.solarApi.getAllPlanets().subscribe(planets => {
      this.planets = planets;
      this.sceneService.loadPlanets(planets);
      this.loading = false;
      this.sceneService.startAnimation();

      this.sceneService.onPlanetClick = (planet) => {
        this.state.selectPlanet(planet);
      };
    });
  }

  toggleOrbits(): void {
    this.state.toggleOrbits();
    this.sceneService.toggleOrbits();
  }

  togglePause(): void {
    this.state.togglePause();
    this.sceneService.isPaused = this.state.isPaused();
  }

  ngOnDestroy(): void {
    this.sceneService.stopAnimation();
  }

  navigateToPlanet(planet: Planet): void {
  this.state.selectPlanet(planet);
  this.sceneService.focusOnPlanet(planet.id);
}
}
