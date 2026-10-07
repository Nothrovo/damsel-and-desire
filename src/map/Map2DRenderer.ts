import type { Floor, Room, Point } from "./types";
import { getCategoryColor, getRoomCenter } from "./mapUtils";

export interface Map2DRendererOptions {
  container: HTMLElement;
  floor: Floor;
  selectedRoomId?: string | null;
  onRoomSelect?: (room: Room) => void;
  onRoomHover?: (room: Room | null, clientX?: number, clientY?: number) => void;
}

export class Map2DRenderer {
  private container: HTMLElement;
  private floor: Floor;
  private selectedRoomId: string | null = null;
  private hoveredRoomId: string | null = null;
  private onRoomSelect?: (room: Room) => void;
  private onRoomHover?: (room: Room | null, clientX?: number, clientY?: number) => void;

  // Viewport transformation
  private scale: number = 1.0;
  private panX: number = 0;
  private panY: number = 0;
  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private touchStartDist: number = 0;
  private hasMoved: boolean = false;

  // DOM elements
  private svgElement: SVGSVGElement | null = null;
  private viewportGroup: SVGGElement | null = null;

  constructor(options: Map2DRendererOptions) {
    this.container = options.container;
    this.floor = options.floor;
    this.selectedRoomId = options.selectedRoomId || null;
    this.onRoomSelect = options.onRoomSelect;
    this.onRoomHover = options.onRoomHover;

    this.render();
    this.attachEvents();
  }

  public setFloor(newFloor: Floor) {
    this.floor = newFloor;
    this.render();
    this.resetView();
  }

  public selectRoom(roomId: string | null) {
    this.selectedRoomId = roomId;
    this.updateRoomHighlights();
  }

  public getSelectedRoomId(): string | null {
    return this.selectedRoomId;
  }

  public zoomIn() {
    this.applyZoom(1.25);
  }

  public zoomOut() {
    this.applyZoom(0.8);
  }

  public resetView(smooth: boolean = true) {
    if (this.viewportGroup && smooth) {
      this.viewportGroup.style.transition = "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)";
    }
    this.scale = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.updateTransform();
  }

  public focusRoom(roomId: string, smooth: boolean = true) {
    const room = this.floor.rooms.find(r => r.id === roomId);
    if (!room || !this.svgElement) return;

    this.selectedRoomId = roomId;
    this.updateRoomHighlights();

    const center = getRoomCenter(room);
    const [, , vbW, vbH] = this.floor.viewBox.split(" ").map(Number);
    const targetScale = Math.min(2.2, Math.max(1.5, 400 / Math.max(room.rect.width, room.rect.height)));

    if (this.viewportGroup && smooth) {
      this.viewportGroup.style.transition = "transform 350ms cubic-bezier(0.16, 1, 0.3, 1)";
    }
    this.scale = targetScale;
    this.panX = (vbW / 2 - center.x) * targetScale;
    this.panY = (vbH / 2 - center.y) * targetScale;
    this.updateTransform();
  }

  private applyZoom(factor: number, anchorX?: number, anchorY?: number) {
    if (!this.svgElement) return;
    const oldScale = this.scale;
    const newScale = Math.max(0.6, Math.min(4.5, oldScale * factor));

    if (anchorX === undefined || anchorY === undefined) {
      const rect = this.svgElement.getBoundingClientRect();
      anchorX = rect.width / 2;
      anchorY = rect.height / 2;
    }

    this.panX = anchorX - (anchorX - this.panX) * (newScale / oldScale);
    this.panY = anchorY - (anchorY - this.panY) * (newScale / oldScale);
    this.scale = newScale;

    this.updateTransform();
  }

  private updateTransform() {
    if (!this.viewportGroup || !this.svgElement) return;

    this.viewportGroup.setAttribute(
      "transform",
      `translate(${this.panX}, ${this.panY}) scale(${this.scale})`
    );

    // Level-of-Detail (LOD): toggle class when zoomed far out
    if (this.scale < 1.15) {
      this.svgElement.classList.add("lod-far");
    } else {
      this.svgElement.classList.remove("lod-far");
    }
  }

  private updateRoomHighlights() {
    if (!this.svgElement) return;

    const allRoomGroups = this.svgElement.querySelectorAll<SVGGElement>(".map-room-node");
    allRoomGroups.forEach(node => {
      const roomId = node.getAttribute("data-room-id");
      const isSelected = roomId === this.selectedRoomId;
      const isHovered = roomId === this.hoveredRoomId;

      if (isSelected) {
        node.classList.add("selected");
      } else {
        node.classList.remove("selected");
      }

      if (isHovered) {
        node.classList.add("hovered");
      } else {
        node.classList.remove("hovered");
      }
    });
  }

  private render() {
    const floor = this.floor;
    const [, , vbW, vbH] = floor.viewBox.split(" ").map(Number);
    const baseUrl = import.meta.env.BASE_URL.endsWith("/")
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`;

    // SVG container with dark theme background
    this.container.innerHTML = `
      <div class="map-viewport-wrapper" style="position:relative;width:100%;height:100%;overflow:hidden;background-color:#0b0f19;user-select:none;touch-action:none;">
        <svg
          class="map-svg ${this.scale < 1.15 ? 'lod-far' : ''}"
          viewBox="${floor.viewBox}"
          style="width:100%;height:100%;display:block;cursor:grab;"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="roomShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.6"/>
            </filter>
            <filter id="hoverGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#e11d48" flood-opacity="0.8"/>
            </filter>
          </defs>

          <g id="mapViewportGroup" transform="translate(${this.panX}, ${this.panY}) scale(${this.scale})">
            <!-- 1. Outer Floor Outline Slab -->
            <polygon
              class="map-outer-outline"
              points="${floor.outline.map(p => `${p.x},${p.y}`).join(' ')}"
              fill="#131b2a"
              stroke="#2d3748"
              stroke-width="3"
              stroke-linejoin="round"
            />

            <!-- 2. Courtyard Atrium Void (if applicable) -->
            ${
              floor.courtyard
                ? `
                <polygon
                  class="map-courtyard-void"
                  points="${floor.courtyard.map(p => `${p.x},${p.y}`).join(' ')}"
                  fill="#0b0f19"
                  stroke="#2d3748"
                  stroke-width="3"
                  stroke-linejoin="round"
                />
                <!-- Central Floor Label in Courtyard Void -->
                ${
                  floor.id === "f3"
                    ? `<text x="350" y="360" text-anchor="middle" class="map-courtyard-title">Third<tspan x="350" dy="85">Floor</tspan></text>`
                    : floor.id === "f2"
                    ? `<text x="350" y="360" text-anchor="middle" class="map-courtyard-title">Second<tspan x="350" dy="85">Floor</tspan></text>`
                    : floor.id === "roof"
                    ? `<text x="350" y="400" text-anchor="middle" class="map-courtyard-title">Roof</text>`
                    : ""
                }
              `
                : ""
            }

            <!-- 3. Decorative Elements (Walkways, Taman F1, Flagpole, Courtyard) -->
            ${(floor.decorativeElements || [])
              .map(elem => {
                if (elem.type === "path" && elem.pathData) {
                  return `
                    <path
                      id="${elem.id}"
                      d="${elem.pathData}"
                      fill="${elem.fill || '#182335'}"
                      fill-rule="evenodd"
                      stroke="${elem.stroke || '#334155'}"
                      stroke-width="${elem.strokeWidth || 2}"
                      stroke-linejoin="round"
                    />
                  `;
                }
                if (elem.type === "polygon" && elem.points) {
                  return `
                    <polygon
                      id="${elem.id}"
                      points="${elem.points.map(p => `${p.x},${p.y}`).join(' ')}"
                      fill="${elem.fill || '#182335'}"
                      stroke="${elem.stroke || '#334155'}"
                      stroke-width="${elem.strokeWidth || 2}"
                      stroke-linejoin="round"
                    />
                  `;
                }
                if (elem.type === "rect") {
                  return `
                    <rect
                      id="${elem.id}"
                      x="${elem.x}"
                      y="${elem.y}"
                      width="${elem.width}"
                      height="${elem.height}"
                      fill="${elem.fill || '#182335'}"
                      stroke="${elem.stroke || '#334155'}"
                      stroke-width="${elem.strokeWidth || 2}"
                      stroke-linejoin="round"
                    />
                  `;
                }
                if (elem.type === "circle") {
                  return `
                    <circle
                      id="${elem.id}"
                      cx="${elem.cx}"
                      cy="${elem.cy}"
                      r="${elem.r}"
                      fill="${elem.fill || '#064e3b'}"
                      stroke="${elem.stroke || '#10b981'}"
                      stroke-width="${elem.strokeWidth || 2.5}"
                    />
                  `;
                }
                return "";
              })
              .join("")}

            <!-- 4. Rooms Layer -->
            <g class="map-rooms-layer">
              ${floor.rooms.map(room => this.renderRoomSvg(room)).join("")}
            </g>
          </g>
        </svg>

        <!-- Floating Tooltip -->
        <div id="mapTooltip" class="map-floating-tooltip" style="display:none;position:absolute;pointer-events:none;z-index:40;"></div>
      </div>
    `;

    this.svgElement = this.container.querySelector<SVGSVGElement>(".map-svg");
    this.viewportGroup = this.container.querySelector<SVGGElement>("#mapViewportGroup");

    this.updateRoomHighlights();
  }

  private renderRoomSvg(room: Room): string {
    const isSelected = room.id === this.selectedRoomId;
    const isSmall = room.category === "utility" || room.category === "access";
    const colors = getCategoryColor(room.category);
    const center = getRoomCenter(room);

    const rect = room.rect;

    return `
      <g
        class="map-room-node ${isSelected ? 'selected' : ''} ${isSmall ? 'room-small' : ''}"
        data-room-id="${room.id}"
        style="cursor:pointer;"
      >
        <!-- Room Base Shape (Polygon if defined, otherwise Rect) -->
        ${
          room.polygon && room.polygon.length > 0
            ? `
            <polygon
              class="room-box"
              points="${room.polygon.map(p => `${p.x},${p.y}`).join(' ')}"
              fill="${colors.fill}"
              stroke="${colors.stroke}"
              stroke-width="2.5"
              stroke-linejoin="round"
            />
            `
            : `
            <rect
              class="room-box"
              x="${rect.x}"
              y="${rect.y}"
              width="${rect.width}"
              height="${rect.height}"
              fill="${colors.fill}"
              stroke="${colors.stroke}"
              stroke-width="2.5"
              rx="3"
              ry="3"
            />
            `
        }

        <!-- Room Label Text -->
        ${
          room.labelOrientation === "vertical"
            ? this.renderVerticalLabel(room, center)
            : this.renderHorizontalLabel(room, center)
        }
      </g>
    `;
  }

  private renderHorizontalLabel(room: Room, center: Point): string {
    const label = room.shortLabel || room.name;
    const isSmall = room.category === "utility" || room.category === "access";
    const fontSize = isSmall ? 13 : room.rect.width < 110 ? 15 : 20;

    // Handle multiline labels (e.g. Photography Club -> Photography \n Club)
    const words = label.split(" ");
    let lines: string[] = [];

    if (words.length >= 2 && room.rect.height > 60) {
      if (words.length === 2) {
        lines = words;
      } else if (words.length === 3) {
        lines = [words[0], `${words[1]} ${words[2]}`];
      } else {
        lines = [words.slice(0, 2).join(" "), words.slice(2).join(" ")];
      }
    } else {
      lines = [label];
    }

    const startY = center.y - ((lines.length - 1) * (fontSize * 1.15)) / 2;

    return `
      <text
        class="room-label ${isSmall ? 'label-small' : ''}"
        x="${center.x}"
        y="${startY}"
        text-anchor="middle"
        dominant-baseline="central"
        font-size="${fontSize}"
      >
        ${lines
          .map(
            (line, idx) =>
              `<tspan x="${center.x}" dy="${idx === 0 ? 0 : fontSize * 1.15}">${line}</tspan>`
          )
          .join("")}
      </text>
    `;
  }

  private renderVerticalLabel(room: Room, center: Point): string {
    const label = room.name;
    const words = label.split(" ");
    const fontSize = room.rect.width < 80 ? 14 : 17;

    // Split into vertical columns / word stacks
    // In screenshots, narrow rooms (Audiovisual Room, Computer Lab, etc.) display words stacked
    return `
      <text
        class="room-label label-vertical"
        x="${center.x}"
        y="${center.y - (words.length - 1) * 14}"
        text-anchor="middle"
        dominant-baseline="central"
        font-size="${fontSize}"
      >
        ${words
          .map(
            (word, idx) =>
              `<tspan x="${center.x}" dy="${idx === 0 ? 0 : 26}">${word}</tspan>`
          )
          .join("")}
      </text>
    `;
  }

  private attachEvents() {
    if (!this.svgElement) return;
    const svg = this.svgElement;

    // 1. Wheel Zoom anchored to cursor
    svg.addEventListener(
      "wheel",
      e => {
        e.preventDefault();
        if (this.viewportGroup) this.viewportGroup.style.transition = "none";
        const factor = e.deltaY < 0 ? 1.15 : 0.87;
        const rect = svg.getBoundingClientRect();
        const anchorX = e.clientX - rect.left;
        const anchorY = e.clientY - rect.top;
        this.applyZoom(factor, anchorX, anchorY);
      },
      { passive: false }
    );

    // 2. Mouse Drag (Pan)
    svg.addEventListener("mousedown", e => {
      // Left click
      if (e.button !== 0) return;
      if (this.viewportGroup) this.viewportGroup.style.transition = "none";
      this.isDragging = true;
      this.hasMoved = false;
      this.dragStartX = e.clientX - this.panX;
      this.dragStartY = e.clientY - this.panY;
      svg.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", e => {
      if (!this.isDragging) return;
      const newPanX = e.clientX - this.dragStartX;
      const newPanY = e.clientY - this.dragStartY;

      if (Math.hypot(newPanX - this.panX, newPanY - this.panY) > 3) {
        this.hasMoved = true;
      }

      this.panX = newPanX;
      this.panY = newPanY;
      this.updateTransform();
    });

    window.addEventListener("mouseup", () => {
      if (this.isDragging) {
        this.isDragging = false;
        if (this.svgElement) this.svgElement.style.cursor = "grab";
      }
    });

    // 3. Touch Drag & Pinch Zoom
    svg.addEventListener(
      "touchstart",
      e => {
        if (this.viewportGroup) this.viewportGroup.style.transition = "none";
        if (e.touches.length === 1) {
          this.isDragging = true;
          this.hasMoved = false;
          this.dragStartX = e.touches[0].clientX - this.panX;
          this.dragStartY = e.touches[0].clientY - this.panY;
        } else if (e.touches.length === 2) {
          this.isDragging = false;
          this.touchStartDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
        }
      },
      { passive: false }
    );

    svg.addEventListener(
      "touchmove",
      e => {
        e.preventDefault();
        if (e.touches.length === 1 && this.isDragging) {
          const newPanX = e.touches[0].clientX - this.dragStartX;
          const newPanY = e.touches[0].clientY - this.dragStartY;
          if (Math.hypot(newPanX - this.panX, newPanY - this.panY) > 3) {
            this.hasMoved = true;
          }
          this.panX = newPanX;
          this.panY = newPanY;
          this.updateTransform();
        } else if (e.touches.length === 2) {
          const dist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          if (this.touchStartDist > 0) {
            const factor = dist / this.touchStartDist;
            const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
            const rect = svg.getBoundingClientRect();
            this.applyZoom(factor, midX - rect.left, midY - rect.top);
            this.touchStartDist = dist;
          }
        }
      },
      { passive: false }
    );

    svg.addEventListener("touchend", () => {
      this.isDragging = false;
      this.touchStartDist = 0;
    });

    // 4. Room Click & Hover Delegation
    svg.addEventListener("click", e => {
      if (this.hasMoved) return; // Prevent selecting when dragging

      const targetRoomGroup = (e.target as Element).closest(".map-room-node");
      if (targetRoomGroup) {
        const roomId = targetRoomGroup.getAttribute("data-room-id");
        const room = this.floor.rooms.find(r => r.id === roomId);
        if (room) {
          this.selectedRoomId = room.id;
          this.updateRoomHighlights();
          if (this.onRoomSelect) this.onRoomSelect(room);
        }
      }
    });

    svg.addEventListener("mousemove", e => {
      const tooltip = this.container.querySelector<HTMLElement>("#mapTooltip");
      const targetRoomGroup = (e.target as Element).closest(".map-room-node");

      if (targetRoomGroup) {
        const roomId = targetRoomGroup.getAttribute("data-room-id");
        if (roomId !== this.hoveredRoomId) {
          this.hoveredRoomId = roomId;
          this.updateRoomHighlights();
          const room = this.floor.rooms.find(r => r.id === roomId);
          if (room && tooltip) {
            tooltip.innerHTML = `
              <div class="tooltip-bubble" style="background:rgba(17,24,39,0.92);backdrop-filter:blur(8px);border:1px solid #ffacda;border-radius:6px;padding:6px 10px;box-shadow:0 4px 12px rgba(0,0,0,0.5);color:#fff;font-size:12px;white-space:nowrap;">
                <div style="font-weight:700;color:#ffacda;">${room.name}</div>
                <div style="font-size:10px;color:#d1d5db;text-transform:capitalize;">${room.category}</div>
              </div>
            `;
            tooltip.style.display = "block";
          }
          if (this.onRoomHover) {
            this.onRoomHover(room || null, e.clientX, e.clientY);
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
    });

    svg.addEventListener("mouseleave", () => {
      this.hoveredRoomId = null;
      this.updateRoomHighlights();
      const tooltip = this.container.querySelector<HTMLElement>("#mapTooltip");
      if (tooltip) tooltip.style.display = "none";
      if (this.onRoomHover) this.onRoomHover(null);
    });
  }

  public destroy() {
    this.container.innerHTML = "";
  }
}
