
export const PRIORITY_WEIGHTS = {
  F: 0.45, // Tần suất xuất hàng
  W: 0.25, // Khối lượng
  S: 0.18, // Kích thước (Volume)
  I: 0.12, // Tần suất nhập hàng
};

export const NORMALIZATION_RANGES = {
  F: { min: 1, max: 200 },
  W: { min: 1, max: 50 },
  S: { min: 1, max: 100 },
  I: { min: 1, max: 200 },
};

export const WAREHOUSE_LAYOUT_PROMPT = `
The warehouse is a 100m x 50m rectangle. The single main entrance/exit is located at the center of one of the 50m walls. The storage area consists of long rows of shelves.

- **Rows:** There are 4 main rows of shelving units (labeled A, B, C, D) running parallel to the 100m length. Row A is closest to the main aisle near the entrance, and Row D is the furthest.
- **Sections:** Along the 100m length, each row is divided into 5 sections (labeled 1, 2, 3, 4, 5). Section 1 is closest to the entrance/exit wall, and Section 5 is the furthest down the aisle.
- **Shelves:** Within each section, there are 4 individual shelf units (labeled S1, S2, S3, S4).
- **Tiers:** Each shelf unit is 12m high and has 7 tiers (labeled T1, T2, ..., T7). Tier T1 is the bottom-most (floor level), and T7 is the highest.

A location is identified by its Row, Section, Shelf, and Tier (e.g., A-1-S1-T1 is the best possible location, being in the first row, first section, first shelf, and on the floor).
`;
