import { describe, it, expect } from "vitest";
import { MAP_FLOORS } from "../src/map/mapData";
import { doRectanglesOverlap, getRoomCenter, calculateFocusTransform } from "../src/map/mapUtils";
import { FALLBACK_DD_DATA } from "../src/data/fallbackCompendium";

describe("Map Data Validation & Geometry Integrity", () => {
  it("enforces hardcoded room count per floor exactly as required", () => {
    expect(MAP_FLOORS.f3.rooms).toHaveLength(18);
    expect(MAP_FLOORS.f2.rooms).toHaveLength(18);
    expect(MAP_FLOORS.f1.rooms).toHaveLength(18);
    expect(MAP_FLOORS.roof.rooms).toHaveLength(5);
    expect(MAP_FLOORS.campus.rooms).toHaveLength(8);

    const totalRooms =
      MAP_FLOORS.f3.rooms.length +
      MAP_FLOORS.f2.rooms.length +
      MAP_FLOORS.f1.rooms.length +
      MAP_FLOORS.roof.rooms.length +
      MAP_FLOORS.campus.rooms.length;
    expect(totalRooms).toBe(67);
  });

  it("verifies all room IDs are globally unique across all floors", () => {
    const allIds: string[] = [];
    Object.values(MAP_FLOORS).forEach(floor => {
      floor.rooms.forEach(room => {
        expect(allIds, `Duplicate room id detected: ${room.id}`).not.toContain(room.id);
        allIds.push(room.id);
      });
    });
    expect(allIds).toHaveLength(67);
  });

  it("verifies all rooms are strictly within the bounding box of their floor", () => {
    Object.values(MAP_FLOORS).forEach(floor => {
      const [vbX, vbY, vbW, vbH] = floor.viewBox.split(" ").map(Number);
      floor.rooms.forEach(room => {
        expect(room.rect.x, `Room ${room.id} x >= viewBox minX`).toBeGreaterThanOrEqual(vbX);
        expect(room.rect.y, `Room ${room.id} y >= viewBox minY`).toBeGreaterThanOrEqual(vbY);
        expect(
          room.rect.x + room.rect.width,
          `Room ${room.id} right <= viewBox maxX`
        ).toBeLessThanOrEqual(vbX + vbW);
        expect(
          room.rect.y + room.rect.height,
          `Room ${room.id} bottom <= viewBox maxY`
        ).toBeLessThanOrEqual(vbY + vbH);
      });
    });
  });

  it("verifies no two rooms overlap on the same floor", () => {
    Object.values(MAP_FLOORS).forEach(floor => {
      const rooms = floor.rooms;
      for (let i = 0; i < rooms.length; i++) {
        for (let j = i + 1; j < rooms.length; j++) {
          const overlaps = doRectanglesOverlap(rooms[i].rect, rooms[j].rect, 3);
          expect(
            overlaps,
            `Overlap detected on floor ${floor.id} between ${rooms[i].id} and ${rooms[j].id}`
          ).toBe(false);
        }
      }
    });
  });

  it("verifies club room ekskulId rules and validity in compendium", () => {
    const validEkskulIds = FALLBACK_DD_DATA.ekskul.map(e => e.id);

    Object.values(MAP_FLOORS).forEach(floor => {
      floor.rooms.forEach(room => {
        if (room.category === "club" || room.id.includes("student_council")) {
          // Club room must have valid ekskulId
          expect(room.ekskulId, `Club room ${room.id} must have ekskulId`).toBeDefined();
          expect(
            validEkskulIds,
            `ekskulId "${room.ekskulId}" for room ${room.id} must exist in compendium`
          ).toContain(room.ekskulId);
        } else {
          // Non-club rooms must NOT have ekskulId
          expect(
            room.ekskulId,
            `Non-club room ${room.id} should NOT have ekskulId`
          ).toBeUndefined();
        }
      });
    });
  });

  it("verifies campus contains the 8 expected zones", () => {
    const campusZoneIds = MAP_FLOORS.campus.rooms.map(r => r.id);
    expect(campusZoneIds).toEqual([
      "campus_athletic_field",
      "campus_swimming_pool",
      "campus_gymnasium",
      "campus_west_zen_garden",
      "campus_east_zen_garden",
      "campus_garden",
      "campus_hedge_maze",
      "campus_main_building"
    ]);
  });

  it("enforces user rules for Rooftop Access naming and shortLabel", () => {
    const roofRooms = MAP_FLOORS.roof.rooms;
    expect(roofRooms).toHaveLength(5);
    const expectedRoofIds = [
      "roof_access_nw",
      "roof_access_ne",
      "roof_access_sw",
      "roof_access_se",
      "roof_access_s"
    ];
    expect(roofRooms.map(r => r.id)).toEqual(expectedRoofIds);

    roofRooms.forEach(room => {
      expect(room.name).toMatch(/^Rooftop Access \((NW|NE|SW|SE|S)\)$/);
      expect(room.shortLabel).toBe("Access");
      expect(room.category).toBe("access");
    });
  });

  it("verifies campus Athletic Field polygon and decorative flagpole circle", () => {
    const athleticField = MAP_FLOORS.campus.rooms.find(r => r.id === "campus_athletic_field");
    expect(athleticField).toBeDefined();
    expect(athleticField?.name).toBe("Athletic Field");
    expect(athleticField?.polygon).toBeDefined();
    expect(athleticField?.polygon).toHaveLength(6);

    const circleElem = MAP_FLOORS.campus.decorativeElements?.find(
      d => d.id === "campus_flagpole_circle"
    );
    expect(circleElem).toBeDefined();
    expect(circleElem?.type).toBe("circle");
  });

  it("verifies campus walkway path network exists in decorativeElements", () => {
    const walkwayElem = MAP_FLOORS.campus.decorativeElements?.find(
      d => d.id === "campus_walkways"
    );
    expect(walkwayElem).toBeDefined();
    expect(walkwayElem?.type).toBe("path");
    expect(walkwayElem?.pathData).toBeDefined();
    expect(walkwayElem?.pathData?.length).toBeGreaterThan(100);
  });

  it("verifies calculateFocusTransform centers every room exactly at the center of the viewport", () => {
    // Specific check for f1_faculty_room (reported by user)
    const facultyRoom = MAP_FLOORS.f1.rooms.find(r => r.id === "f1_faculty_room")!;
    expect(facultyRoom).toBeDefined();

    const tf1 = calculateFocusTransform(facultyRoom, MAP_FLOORS.f1.viewBox);
    const center1 = getRoomCenter(facultyRoom);
    const [, , vbW1, vbH1] = MAP_FLOORS.f1.viewBox.split(" ").map(Number);

    expect(tf1.panX + tf1.scale * center1.x).toBeCloseTo(vbW1 / 2, 4);
    expect(tf1.panY + tf1.scale * center1.y).toBeCloseTo(vbH1 / 2, 4);

    // Comprehensive check across all 67 rooms on all 5 levels
    Object.values(MAP_FLOORS).forEach(floor => {
      const [, , vbW, vbH] = floor.viewBox.split(" ").map(Number);
      floor.rooms.forEach(room => {
        const tf = calculateFocusTransform(room, floor.viewBox);
        const c = getRoomCenter(room);
        const actualX = tf.panX + tf.scale * c.x;
        const actualY = tf.panY + tf.scale * c.y;

        expect(
          actualX,
          `Room ${room.id} on floor ${floor.id} should center X at ${vbW / 2}`
        ).toBeCloseTo(vbW / 2, 4);
        expect(
          actualY,
          `Room ${room.id} on floor ${floor.id} should center Y at ${vbH / 2}`
        ).toBeCloseTo(vbH / 2, 4);
      });
    });
  });
});
