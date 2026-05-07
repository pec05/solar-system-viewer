import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetNav } from './planet-nav';

describe('PlanetNav', () => {
  let component: PlanetNav;
  let fixture: ComponentFixture<PlanetNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanetNav],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanetNav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
