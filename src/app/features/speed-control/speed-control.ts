import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Scene } from 'three';
import { SceneState } from '../../core/services/scene-state';
import { SceneService } from '../../core/scene/scene.service';
@Component({
  selector: 'app-speed-control',
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './speed-control.html',
  styleUrl: './speed-control.scss',
})
export class SpeedControl {
  constructor(
    public state: SceneState,
    private sceneService: SceneService
  ) {}

  onSpeedChange(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.state.setSpeed(value);
    this.sceneService.setSpeed(value);
  }
}
