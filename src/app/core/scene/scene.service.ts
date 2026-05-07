import { Injectable, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Planet } from '../models/planet.model';

@Injectable({ providedIn: 'root' })
export class SceneService {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private animationId!: number;
  private planetMeshes: Map<string, THREE.Mesh> = new Map();
  private orbitLines: THREE.Line[] = [];
  private clock = new THREE.Clock();

  // Multiplicateur de vitesse de simulation
  simulationSpeed = 1;
  showOrbits = true;
  isPaused = false;

  // Callback quand on clique sur une planète
  onPlanetClick?: (planet: Planet) => void;

  private planets: Planet[] = [];

  // Échelle visuelle : 1 UA = 10 unités Three.js
  private readonly AU = 10;
  // Échelle des rayons (sinon les planètes seraient invisibles)
  private readonly RADIUS_SCALE = 0.004;
  private readonly MIN_RADIUS = 0.3;

  initScene(canvas: ElementRef<HTMLCanvasElement>): void {
    const el = canvas.nativeElement;

    const width = window.innerWidth;
    const height = window.innerHeight;

    //Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000010);

    //Camera
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(0, 80, 120);
    this.camera.lookAt(0, 0, 0);

    //Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: el, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 3, 300);
    sunLight.position.set(0, 0, 0);
    this.scene.add(sunLight);

    // OrbitControls pour permettre la navigation
    this.controls = new OrbitControls(this.camera, el);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 400;
    this.controls.enablePan = true;


    // Étoiles en arrière-plan
    this.addStarField();

    // Soleil
    this.addSun();

    // Gestion du resize
    window.addEventListener('resize', () => this.onResize(el));

    // Gestion du clic
    el.addEventListener('click', (e) => this.onCanvasClick(e, el));
  }

  loadPlanets(planets: Planet[]): void {
    this.planets = planets;
    planets.forEach(planet => this.addPlanet(planet));
    if (this.showOrbits) {
      planets.forEach(planet => this.addOrbit(planet));
    }
  }

  startAnimation(): void {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      this.controls.update();
      if (!this.isPaused) {
        const delta = this.clock.getDelta() * this.simulationSpeed;
        this.updatePlanetPositions(delta);
      }

      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  stopAnimation(): void {
    cancelAnimationFrame(this.animationId);
  }

  toggleOrbits(): void {
    this.showOrbits = !this.showOrbits;
    this.orbitLines.forEach(line => {
      line.visible = this.showOrbits;
    });
  }

  setSpeed(speed: number): void {
    this.simulationSpeed = speed;
  }

  focusOnPlanet(planetId: string): void {
    const mesh = this.planetMeshes.get(planetId);
    if (!mesh) return;

    const pos = mesh.position;
    this.camera.position.set(pos.x + 5, pos.y + 5, pos.z + 5);
    this.camera.lookAt(pos);
  }

  private addSun(): void {
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xFDB813 });
    const sun = new THREE.Mesh(geometry, material);
    this.scene.add(sun);

    // Halo lumineux autour du soleil
    const glowGeometry = new THREE.SphereGeometry(2.4, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xFDB813,
      transparent: true,
      opacity: 0.15
    });
    this.scene.add(new THREE.Mesh(glowGeometry, glowMaterial));
  }

  private addPlanet(planet: Planet): void {
    const radius = Math.max(
      planet.meanRadius * this.RADIUS_SCALE,
      this.MIN_RADIUS
    );

    const geometry = new THREE.SphereGeometry(radius, 32, 32);

    // Couleur par défaut selon la planète
    const color = this.getPlanetColor(planet.englishName);
    const material = new THREE.MeshPhongMaterial({ color });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { planet };

    // Position initiale sur l'orbite
    const distance = planet.distanceFromSun * this.AU;
    mesh.position.set(distance, 0, 0);

    this.scene.add(mesh);
    this.planetMeshes.set(planet.id, mesh);
  }

  private addOrbit(planet: Planet): void {
    const distance = planet.distanceFromSun * this.AU;
    const points: THREE.Vector3[] = [];
    const segments = 128;

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(angle) * distance,
        0,
        Math.sin(angle) * distance
      ));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x444466,
      transparent: true,
      opacity: 0.5
    });

    const orbit = new THREE.Line(geometry, material);
    this.scene.add(orbit);
    this.orbitLines.push(orbit);
  }

  private addStarField(): void {
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 800;
    }

    starsGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.3
    });

    this.scene.add(new THREE.Points(starsGeometry, starsMaterial));
  }

  private updatePlanetPositions(delta: number): void {
    this.planetMeshes.forEach((mesh, planetId) => {
      const planet = this.planets.find(p => p.id === planetId);
      if (!planet) return;

      const distance = planet.distanceFromSun * this.AU;
      // Vitesse angulaire basée sur la période orbitale réelle
      const angularSpeed = (2 * Math.PI) / (planet.sideralOrbit * 24);
      const currentAngle = Math.atan2(mesh.position.z, mesh.position.x);
      const newAngle = currentAngle + angularSpeed * delta * 1000;

      mesh.position.set(
        Math.cos(newAngle) * distance,
        0,
        Math.sin(newAngle) * distance
      );

      // Rotation propre de la planète
      mesh.rotation.y += delta * 0.5;
    });
  }

  private onCanvasClick(event: MouseEvent, canvas: HTMLCanvasElement): void {
    const rect = canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    const meshes = Array.from(this.planetMeshes.values());
    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const planet = intersects[0].object.userData['planet'] as Planet;
      this.onPlanetClick?.(planet);
    }
  }

  private onResize(canvas: HTMLCanvasElement): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private getPlanetColor(name: string): number {
    const colors: Record<string, number> = {
      'Mercury': 0xb5b5b5,
      'Venus':   0xe8cda0,
      'Earth':   0x2a7ae4,
      'Mars':    0xc1440e,
      'Jupiter': 0xc88b3a,
      'Saturn':  0xe4d191,
      'Uranus':  0x7de8e8,
      'Neptune': 0x3f54ba,
    };
    return colors[name] ?? 0xffffff;
  }
}
