import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { MAP_FLOORS } from "./mapData";
import type { Floor, FloorId, Room } from "./types";
import {
  SCALE_3D,
  FLOOR_HEIGHT_3D,
  svgToWorld3D,
  createFloorSlabMesh,
  create3DRoomGroup,
  createRoomLabelSprite,
  createCampusFacilitiesGroup
} from "./map3DUtils";
import { getRoomCenter } from "./mapUtils";

export interface Map3DRendererOptions {
  container: HTMLElement;
  floorId: FloorId;
  selectedRoomId?: string | null;
  onRoomSelect?: (room: Room) => void;
  onRoomHover?: (room: Room | null, clientX?: number, clientY?: number) => void;
}

export class Map3DRenderer {
  private container: HTMLElement;
  private currentFloorId: FloorId;
  private selectedRoomId: string | null = null;
  private hoveredRoomId: string | null = null;
  private onRoomSelect?: (room: Room) => void;
  private onRoomHover?: (room: Room | null, clientX?: number, clientY?: number) => void;

  // Three.js Core
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.OrthographicCamera;
  private controls!: OrbitControls;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  // Scene Hierarchy
  private worldGroup = new THREE.Group();
  private floorGroups: Map<FloorId, THREE.Group> = new Map();
  private interactiveMeshes: THREE.Mesh[] = [];

  // Animation & Interaction Loop
  private animFrameId: number | null = null;
  private isDestroyed = false;
  private pointerDownPos = { x: 0, y: 0 };
  private isPointerDown = false;

  // Camera animation
  private targetAnimation: {
    startTarget: THREE.Vector3;
    endTarget: THREE.Vector3;
    startCamPos: THREE.Vector3;
    endCamPos: THREE.Vector3;
    startTime: number;
    duration: number;
  } | null = null;

  constructor(options: Map3DRendererOptions) {
    this.container = options.container;
    this.currentFloorId = options.floorId;
    this.selectedRoomId = options.selectedRoomId || null;
    this.onRoomSelect = options.onRoomSelect;
    this.onRoomHover = options.onRoomHover;

    this.initScene();
    this.buildWorld();
    this.updateFloorVisibility();
    this.attachEvents();
    this.startLoop();

    if (this.selectedRoomId) {
      this.selectRoom(this.selectedRoomId);
      this.focusRoom(this.selectedRoomId, false);
    }
  }

  private initScene() {
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 600;

    // 1. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.innerHTML = "";
    this.container.style.position = "relative";
    this.container.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.outline = "none";
    this.renderer.domElement.style.cursor = "grab";

    // Tooltip overlay element
    const tooltip = document.createElement("div");
    tooltip.id = "mapTooltip";
    tooltip.className = "map-floating-tooltip";
    tooltip.style.display = "none";
    tooltip.style.position = "absolute";
    tooltip.style.pointerEvents = "none";
    tooltip.style.zIndex = "40";
    this.container.appendChild(tooltip);

    // 2. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b0f19);
    this.scene.add(this.worldGroup);

    // 3. Orthographic Isometric Camera
    const aspect = width / height;
    const isCampus = this.currentFloorId === "campus";
    const d = isCampus ? 210 : 150;
    this.camera = new THREE.OrthographicCamera(
      -d * aspect,
      d * aspect,
      d,
      -d,
      1,
      2500
    );

    const initTarget = isCampus ? new THREE.Vector3(0, 0, -25) : new THREE.Vector3(0, 0, 0);
    const initCamPos = isCampus ? new THREE.Vector3(260, 320, 240) : new THREE.Vector3(220, 280, 220);

    this.camera.position.copy(initCamPos);
    this.camera.lookAt(initTarget);

    // 4. OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
    this.controls.minPolarAngle = Math.PI / 6;
    this.controls.minZoom = 0.4;
    this.controls.maxZoom = 4.0;
    this.controls.target.copy(initTarget);

    // 5. Lighting Setup
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x0f172a, 0.85);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff1f2, 1.25);
    dirLight.position.set(280, 450, 180);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 50;
    dirLight.shadow.camera.far = 1200;
    const shadowD = 220;
    dirLight.shadow.camera.left = -shadowD;
    dirLight.shadow.camera.right = shadowD;
    dirLight.shadow.camera.top = shadowD;
    dirLight.shadow.camera.bottom = -shadowD;
    this.scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.35);
    rimLight.position.set(-180, 250, -180);
    this.scene.add(rimLight);
  }

  private buildWorld() {
    this.interactiveMeshes = [];
    this.floorGroups.clear();

    // 1. Campus Grounds
    const campusFloor = MAP_FLOORS.campus;
    const campusGroup = new THREE.Group();
    campusGroup.name = "floor_campus";
    campusGroup.position.set(0, 0, 0);

    const campusFacilities = createCampusFacilitiesGroup(campusFloor);
    campusGroup.add(campusFacilities);

    // Add interactive campus facility meshes
    campusFacilities.traverse(child => {
      if ((child as THREE.Mesh).isMesh && child.userData.isRoom) {
        this.interactiveMeshes.push(child as THREE.Mesh);
      }
    });

    this.floorGroups.set("campus", campusGroup);
    this.worldGroup.add(campusGroup);

    // 2. Building Floors (1F, 2F, 3F, Roof)
    const buildingFloorIds: FloorId[] = ["f1", "f2", "f3", "roof"];

    buildingFloorIds.forEach((fId, index) => {
      const floorData = MAP_FLOORS[fId];
      const floorGroup = new THREE.Group();
      floorGroup.name = `floor_${fId}`;

      // Stacked vertical elevation
      const elevation = index * FLOOR_HEIGHT_3D;
      floorGroup.position.set(0, elevation, 0);

      // Floor Slab
      const slab = createFloorSlabMesh(
        floorData.outline,
        floorData.courtyard,
        floorData.viewBox,
        2.5,
        fId === "roof" ? 0x172133 : 0x0f172a
      );
      slab.position.set(0, -1.25, 0);
      floorGroup.add(slab);

      // Floor Rooms
      floorData.rooms.forEach(room => {
        const roomGroup = create3DRoomGroup(room, floorData.viewBox, 10);
        floorGroup.add(roomGroup);

        // Room Label Sprite
        const sprite = createRoomLabelSprite(room, floorData.viewBox, 10);
        floorGroup.add(sprite);

        // Register interactive floor mesh for raycasting
        roomGroup.traverse(child => {
          if ((child as THREE.Mesh).isMesh && child.userData.isRoom) {
            this.interactiveMeshes.push(child as THREE.Mesh);
          }
        });
      });

      this.floorGroups.set(fId, floorGroup);
      this.worldGroup.add(floorGroup);
    });
  }

  private updateFloorVisibility() {
    const isCampus = this.currentFloorId === "campus";

    if (isCampus) {
      // 1. Show campus grounds with outdoor facilities and 3D Main Building
      const campusGroup = this.floorGroups.get("campus");
      if (campusGroup) campusGroup.visible = true;

      // 2. Hide interior building floor plans completely so they do not overlap campus facilities
      const buildingIds: FloorId[] = ["f1", "f2", "f3", "roof"];
      buildingIds.forEach(id => {
        const grp = this.floorGroups.get(id);
        if (grp) grp.visible = false;
      });
    } else {
      // Hide campus grounds
      const campusGroup = this.floorGroups.get("campus");
      if (campusGroup) campusGroup.visible = false;

      // Cutaway / slice view for building floors
      const buildingIds: FloorId[] = ["f1", "f2", "f3", "roof"];
      const activeIndex = buildingIds.indexOf(this.currentFloorId);

      buildingIds.forEach((id, idx) => {
        const grp = this.floorGroups.get(id);
        if (!grp) return;

        if (idx === activeIndex) {
          // Active Floor: positioned at Y=0, fully visible with rooms & labels
          grp.visible = true;
          grp.position.set(0, 0, 0);
          grp.traverse(child => {
            if ((child as THREE.Sprite).isSprite) child.visible = true;
          });
        } else if (idx < activeIndex) {
          // Below floors: act as foundation slab under active floor
          grp.visible = true;
          grp.position.set(0, (idx - activeIndex) * FLOOR_HEIGHT_3D, 0);
          // Hide labels on floors below to prevent visual clutter
          grp.traverse(child => {
            if ((child as THREE.Sprite).isSprite) child.visible = false;
          });
        } else {
          // Above floors: cut away so user can see inside active floor
          grp.visible = false;
        }
      });
    }
  }

  public setFloor(floor: Floor) {
    this.currentFloorId = floor.id;
    this.updateFloorVisibility();
    this.updateRoomHighlights();

    // Adjust camera projection distance for campus vs interior
    const aspect = (this.container.clientWidth || 800) / (this.container.clientHeight || 600);
    const d = this.currentFloorId === "campus" ? 210 : 150;
    this.camera.left = -d * aspect;
    this.camera.right = d * aspect;
    this.camera.top = d;
    this.camera.bottom = -d;
    this.camera.updateProjectionMatrix();

    const newTarget = this.currentFloorId === "campus"
      ? new THREE.Vector3(0, 0, -25)
      : new THREE.Vector3(0, 0, 0);

    const newCamPos = this.currentFloorId === "campus"
      ? new THREE.Vector3(260, 320, 240)
      : new THREE.Vector3(220, 280, 220);

    this.animateCameraTo(newTarget, newCamPos);
  }

  public selectRoom(roomId: string | null) {
    this.selectedRoomId = roomId;
    this.updateRoomHighlights();
  }

  public getSelectedRoomId(): string | null {
    return this.selectedRoomId;
  }

  private updateRoomHighlights() {
    this.interactiveMeshes.forEach(mesh => {
      const isSelected = mesh.userData.roomId === this.selectedRoomId;
      const isHovered = mesh.userData.roomId === this.hoveredRoomId;

      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (!mat) return;

      if (isSelected) {
        mat.emissive.setHex(0xf43f5e);
        mat.emissiveIntensity = 0.8;
      } else if (isHovered) {
        mat.emissive.setHex(0xe11d48);
        mat.emissiveIntensity = 0.45;
      } else {
        mat.emissive.setHex(0x000000);
        mat.emissiveIntensity = 0;
      }
    });
  }

  public focusRoom(roomId: string, smooth: boolean = true) {
    const floorData = MAP_FLOORS[this.currentFloorId];
    const room = floorData.rooms.find(r => r.id === roomId);
    if (!room) return;

    this.selectedRoomId = roomId;
    this.updateRoomHighlights();

    const center = getRoomCenter(room);
    const worldPos = svgToWorld3D(center.x, center.y, floorData.viewBox);
    const target = new THREE.Vector3(worldPos.x, 2, worldPos.z);

    if (smooth) {
      this.animateCameraTo(target);
    } else {
      const delta = target.clone().sub(this.controls.target);
      this.controls.target.copy(target);
      this.camera.position.add(delta);
    }
  }

  public zoomIn() {
    this.camera.zoom = Math.min(4.0, this.camera.zoom * 1.25);
    this.camera.updateProjectionMatrix();
  }

  public zoomOut() {
    this.camera.zoom = Math.max(0.4, this.camera.zoom * 0.8);
    this.camera.updateProjectionMatrix();
  }

  public resetView(_smooth: boolean = true) {
    this.camera.zoom = 1.0;
    const aspect = (this.container.clientWidth || 800) / (this.container.clientHeight || 600);
    const d = this.currentFloorId === "campus" ? 210 : 150;
    this.camera.left = -d * aspect;
    this.camera.right = d * aspect;
    this.camera.top = d;
    this.camera.bottom = -d;
    this.camera.updateProjectionMatrix();

    const newTarget = this.currentFloorId === "campus"
      ? new THREE.Vector3(0, 0, -25)
      : new THREE.Vector3(0, 0, 0);

    const newCamPos = this.currentFloorId === "campus"
      ? new THREE.Vector3(260, 320, 240)
      : new THREE.Vector3(220, 280, 220);

    this.animateCameraTo(newTarget, newCamPos);
  }

  private animateCameraTo(newTarget: THREE.Vector3, newCamPos?: THREE.Vector3) {
    const startTarget = this.controls.target.clone();
    const endTarget = newTarget.clone();

    const startCamPos = this.camera.position.clone();
    const delta = endTarget.clone().sub(startTarget);
    const endCamPos = newCamPos ? newCamPos.clone() : startCamPos.clone().add(delta);

    this.targetAnimation = {
      startTarget,
      endTarget,
      startCamPos,
      endCamPos,
      startTime: performance.now(),
      duration: 400
    };
  }

  private attachEvents() {
    const canvas = this.renderer.domElement;

    const onPointerDown = (e: PointerEvent) => {
      this.isPointerDown = true;
      this.pointerDownPos = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = "grabbing";
    };

    const onPointerUp = () => {
      this.isPointerDown = false;
      canvas.style.cursor = "grab";
    };

    const onClick = (e: MouseEvent) => {
      const dist = Math.hypot(e.clientX - this.pointerDownPos.x, e.clientY - this.pointerDownPos.y);
      if (dist > 5) return; // Dragged, ignore

      const hit = this.raycast(e.clientX, e.clientY);
      if (hit && hit.userData.room) {
        const room = hit.userData.room as Room;
        this.selectRoom(room.id);
        if (this.onRoomSelect) {
          this.onRoomSelect(room);
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (this.isPointerDown) return;

      const hit = this.raycast(e.clientX, e.clientY);
      const tooltip = document.getElementById("mapTooltip");

      if (hit && hit.userData.room) {
        const room = hit.userData.room as Room;
        if (room.id !== this.hoveredRoomId) {
          this.hoveredRoomId = room.id;
          this.updateRoomHighlights();

          if (tooltip) {
            tooltip.innerHTML = `
              <div class="tooltip-bubble" style="background:rgba(17,24,39,0.92);backdrop-filter:blur(8px);border:1px solid #ffacda;border-radius:6px;padding:6px 10px;box-shadow:0 4px 12px rgba(0,0,0,0.5);color:#fff;font-size:12px;white-space:nowrap;">
                <div style="font-weight:700;color:#ffacda;">${room.name}</div>
                <div style="font-size:10px;color:#d1d5db;text-transform:capitalize;">${room.category}</div>
              </div>
            `;
            tooltip.style.display = "block";
          }

          if (this.onRoomHover) {
            this.onRoomHover(room, e.clientX, e.clientY);
          }
        }

        if (tooltip && tooltip.style.display === "block") {
          const wrapperRect = this.container.getBoundingClientRect();
          tooltip.style.left = `${e.clientX - wrapperRect.left + 14}px`;
          tooltip.style.top = `${e.clientY - wrapperRect.top + 14}px`;
        }
      } else {
        if (this.hoveredRoomId !== null) {
          this.hoveredRoomId = null;
          this.updateRoomHighlights();
          if (tooltip) tooltip.style.display = "none";
          if (this.onRoomHover) this.onRoomHover(null);
        }
      }
    };

    const onPointerLeave = () => {
      this.hoveredRoomId = null;
      this.updateRoomHighlights();
      const tooltip = document.getElementById("mapTooltip");
      if (tooltip) tooltip.style.display = "none";
      if (this.onRoomHover) this.onRoomHover(null);
    };

    const onResize = () => {
      if (this.isDestroyed || !this.container) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      if (width === 0 || height === 0) return;

      const aspect = width / height;
      const d = this.currentFloorId === "campus" ? 210 : 150;
      this.camera.left = -d * aspect;
      this.camera.right = d * aspect;
      this.camera.top = d;
      this.camera.bottom = -d;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", onResize);

    // Store cleanup callbacks
    (this as any)._cleanupEvents = () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
    };
  }

  private raycast(clientX: number, clientY: number): THREE.Mesh | null {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Filter to only visible meshes on active floor
    const activeFloorGroup = this.floorGroups.get(this.currentFloorId);
    if (!activeFloorGroup) return null;

    const testMeshes: THREE.Mesh[] = [];
    activeFloorGroup.traverse(child => {
      if ((child as THREE.Mesh).isMesh && child.userData.isRoom && child.visible) {
        testMeshes.push(child as THREE.Mesh);
      }
    });

    const intersects = this.raycaster.intersectObjects(testMeshes, false);
    if (intersects.length > 0) {
      return intersects[0].object as THREE.Mesh;
    }
    return null;
  }

  private startLoop() {
    const animate = (time: number) => {
      if (this.isDestroyed) return;

      // Camera animation
      if (this.targetAnimation) {
        const elapsed = time - this.targetAnimation.startTime;
        const progress = Math.min(1, elapsed / this.targetAnimation.duration);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);

        this.controls.target.lerpVectors(
          this.targetAnimation.startTarget,
          this.targetAnimation.endTarget,
          ease
        );
        this.camera.position.lerpVectors(
          this.targetAnimation.startCamPos,
          this.targetAnimation.endCamPos,
          ease
        );

        if (progress >= 1) {
          this.targetAnimation = null;
        }
      }

      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      this.animFrameId = requestAnimationFrame(animate);
    };

    this.animFrameId = requestAnimationFrame(animate);
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if ((this as any)._cleanupEvents) {
      (this as any)._cleanupEvents();
    }

    this.controls.dispose();

    // Deep clean geometries & materials
    this.scene.traverse(object => {
      const mesh = object as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });

    this.renderer.dispose();
    this.container.innerHTML = "";
  }
}
