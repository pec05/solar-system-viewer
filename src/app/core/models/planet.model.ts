export interface Planet {
  id: string;
  name: string;
  englishName: string;
  mass: MassVolume | null;
  vol: MassVolume | null;
  meanRadius: number;
  sideralOrbit: number;
  sideralRotation: number;
  distanceFromSun: number;
  moons: Moon[];
  isPlanet: boolean;
  gravity: number;
  avgTemp: number;
  axialTilt: number;
  textureUrl?: string;
}

export interface MassVolume {
  massValue: number;
  massExponent: number;
}

export interface Moon {
  moon: string;
  rel: string;
}

export interface SceneState {
  selectedPlanet: Planet | null;
  simulationSpeed: number;
  showOrbits: boolean;
  showLabels: boolean;
  isPaused: boolean;
}
