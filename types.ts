export interface Sku {
  id: string;
  name: string;
  f: number; // Tần suất xuất hàng (Outbound Frequency)
  w: number; // Khối lượng (Weight)
  s: number; // Kích thước (Size/Volume)
  i: number; // Tần suất nhập hàng (Inbound Frequency)
  normalizedF: number;
  normalizedW: number;
  normalizedS: number;
  normalizedI: number;
  priority: number;
}

export interface Placement {
  sku: Sku;
  location: string; // e.g., "A-1-S1-T1"
}
