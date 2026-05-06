import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetPanel } from './planet-panel';

describe('PlanetPanel', () => {
  let component: PlanetPanel;
  let fixture: ComponentFixture<PlanetPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanetPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanetPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
