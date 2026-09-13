/**
 * Cars that cycle through the hero's magnifying glass.
 *
 * These are illustrative of the kind of car people ask us to find — they are not
 * an inventory, an availability claim, or a statement of dealer affiliation.
 * Images supplied by the client.
 */

export type HeroCar = {
  name: string;
  image: string;
};

export const HERO_CARS: HeroCar[] = [
  { name: "Mahindra Thar", image: "/media/cars/thar.webp" },
  { name: "Hyundai Creta", image: "/media/cars/creta.webp" },
  { name: "Toyota Innova", image: "/media/cars/innova.webp" },
  { name: "Kia Seltos", image: "/media/cars/seltos.webp" },
  { name: "Tata Nexon", image: "/media/cars/nexon.webp" },
  { name: "MG Hector", image: "/media/cars/hector.webp" },
  { name: "Maruti Suzuki Swift", image: "/media/cars/swift.webp" },
  { name: "Honda City", image: "/media/cars/city.webp" },
];
