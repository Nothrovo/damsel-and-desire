import { describe, it, expect } from "vitest";
import { svgToWorld3D, getCategory3DColor, SCALE_3D, FLOOR_HEIGHT_3D, create3DRoomGroup, createFloorSlabMesh } from "../src/map/map3DUtils";
import { MAP_FLOORS } from "../src/map/mapData";

describe("3D Map Geometry & Coordinate Conversion", () => {
  it("correctly converts SVG center coordinates to 3D world space (0, 0)", () => {
    const viewBox = "0 0 700 850";
    // Center in SVG is (350, 425)
    const worldCenter = svgToWorld3D(350, 425, viewBox, SCALE_3D);
    expect(worldCenter.x).toBeCloseTo(0, 5);
    expect(worldCenter.z).toBeCloseTo(0, 5);
  });

  it("correctly scales and offsets SVG boundaries into symmetric 3D boundaries", () => {
    const viewBox = "0 0 700 850";
    const topLeft = svgToWorld3D(0, 0, viewBox, SCALE_3D);
    const bottomRight = svgToWorld3D(700, 850, viewBox, SCALE_3D);

    expect(topLeft.x).toBeCloseTo(-175, 4);
    expect(topLeft.z).toBeCloseTo(-212.5, 4);

    expect(bottomRight.x).toBeCloseTo(175, 4);
    expect(bottomRight.z).toBeCloseTo(212.5, 4);
  });

  it("provides distinct category colors matching 2D aesthetic", () => {
    const classroom = getCategory3DColor("classroom");
    const club = getCategory3DColor("club");
    const admin = getCategory3DColor("admin");

    expect(classroom.wall).toBeDefined();
    expect(club.wall).toBeDefined();
    expect(classroom.wall).not.toBe(club.wall);
    expect(admin.wall).not.toBe(classroom.wall);
  });

  it("creates 3D room group with proper userData and wall meshes", () => {
    const room = MAP_FLOORS.f1.rooms[0];
    const group = create3DRoomGroup(room, MAP_FLOORS.f1.viewBox, 10);

    expect(group.name).toBe(`room_${room.id}`);
    expect(group.children.length).toBeGreaterThan(0);

    // Find floor mesh
    const floorMesh = group.children.find(c => (c as any).userData?.roomId === room.id);
    expect(floorMesh).toBeDefined();
    expect((floorMesh as any).userData.isRoom).toBe(true);
  });

  it("creates floor slab mesh with extruded geometry", () => {
    const floor = MAP_FLOORS.f1;
    const slabMesh = createFloorSlabMesh(floor.outline, floor.courtyard, floor.viewBox, 2.5);

    expect(slabMesh).toBeDefined();
    expect(slabMesh.geometry).toBeDefined();
    expect(slabMesh.receiveShadow).toBe(true);
  });

  it("validates floor heights and elevation layering", () => {
    expect(FLOOR_HEIGHT_3D).toBeGreaterThan(10);
    expect(SCALE_3D).toBe(0.5);
  });
});
