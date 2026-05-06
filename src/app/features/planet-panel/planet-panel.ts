import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Planet } from '../../core/models/planet.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-planet-panel',
  imports: [CommonModule],
  templateUrl: './planet-panel.html',
  styleUrl: './planet-panel.scss',
})
export class PlanetPanel {

  @Input() planet!: Planet;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

   formatMass(planet: Planet): string {
    if (!planet.mass) return 'Inconnue';
    return `${planet.mass.massValue} × 10^${planet.mass.massExponent} kg`;
  }

  formatTemp(kelvin: number): string {
    if (!kelvin) return 'Inconnue';
    const celsius = Math.round(kelvin - 273.15);
    return `${kelvin}K (${celsius}°C)`;
  }
}
