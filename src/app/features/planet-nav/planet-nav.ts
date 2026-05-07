import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Planet } from '../../core/models/planet.model';

@Component({
  selector: 'app-planet-nav',
  imports: [],
  templateUrl: './planet-nav.html',
  styleUrl: './planet-nav.scss',
})
export class PlanetNav {

  @Input() planets: Planet[] = [];
  @Input() selectedId: string | null = null;
  @Output() planetSelected = new EventEmitter<Planet>();

  readonly planetColors: Record<string, string> = {
    'Mercury': '#b5b5b5',
    'Venus':   '#e8cda0',
    'Earth':   '#2a7ae4',
    'Mars':    '#c1440e',
    'Jupiter': '#c88b3a',
    'Saturn':  '#e4d191',
    'Uranus':  '#7de8e8',
    'Neptune': '#3f54ba',
  };


  // Ordre du plus proche au plus loin du soleil
  get sortedPlanets(): Planet[] {
    return [...this.planets].sort((a, b) => a.distanceFromSun - b.distanceFromSun);
  }

  getColor(planet: Planet): string {
    return this.planetColors[planet.englishName] ?? '#ffffff';
  }

  select(planet: Planet): void {
    this.planetSelected.emit(planet);
  }
}
