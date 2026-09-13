/**
 * Showcase vehicles — models named in the client brief.
 * This is NOT live inventory. Every card renders an explicit availability caveat.
 * When real inventory connects, replace this array; CarCard needs no changes.
 */

export type AvailabilityState = "network" | "enquire";

export type Car = {
  slug: string;
  brand: string;
  model: string;
  variant: string;
  fuel: string;
  transmission: string;
  seating: number;
  colour: string;
  location: string;
  availability: AvailabilityState;
  /** null renders the art-directed placeholder frame. Drop a /public path here to swap. */
  image: string | null;
};

export const AVAILABILITY_LABEL: Record<AvailabilityState, string> = {
  network: "Check with network",
  enquire: "Enquire to confirm",
};

export const CARS: Car[] = [
  {
    slug: "toyota-fortuner",
    brand: "Toyota",
    model: "Fortuner",
    variant: "4x2 AT",
    fuel: "Diesel",
    transmission: "Automatic",
    seating: 7,
    colour: "Attitude Black",
    location: "Pune",
    availability: "network",
    image: null,
  },
  {
    slug: "toyota-innova-hycross",
    brand: "Toyota",
    model: "Innova Hycross",
    variant: "ZX (O) Hybrid",
    fuel: "Hybrid",
    transmission: "e-CVT",
    seating: 7,
    colour: "Platinum White",
    location: "Mumbai",
    availability: "network",
    image: null,
  },
  {
    slug: "toyota-innova-crysta",
    brand: "Toyota",
    model: "Innova Crysta",
    variant: "GX+ 7-STR",
    fuel: "Diesel",
    transmission: "Manual",
    seating: 7,
    colour: "Silver Metallic",
    location: "Nashik",
    availability: "enquire",
    image: null,
  },
  {
    slug: "mahindra-thar-roxx",
    brand: "Mahindra",
    model: "Thar Roxx",
    variant: "MX5 AT",
    fuel: "Diesel",
    transmission: "Automatic",
    seating: 5,
    colour: "Tango Red",
    location: "Pune",
    availability: "network",
    image: null,
  },
  {
    slug: "mahindra-scorpio-n",
    brand: "Mahindra",
    model: "Scorpio N",
    variant: "Z8 L 4WD",
    fuel: "Diesel",
    transmission: "Automatic",
    seating: 7,
    colour: "Napoli Black",
    location: "Nagpur",
    availability: "network",
    image: null,
  },
  {
    slug: "mahindra-xuv-7xo",
    brand: "Mahindra",
    model: "XUV 7XO",
    variant: "AX7 L",
    fuel: "Petrol",
    transmission: "Automatic",
    seating: 7,
    colour: "Everest White",
    location: "Mumbai",
    availability: "enquire",
    image: null,
  },
  {
    slug: "mahindra-xuv-3xo",
    brand: "Mahindra",
    model: "XUV 3XO",
    variant: "AX7 L Turbo",
    fuel: "Petrol",
    transmission: "Automatic",
    seating: 5,
    colour: "Citrine Yellow",
    location: "Pune",
    availability: "network",
    image: null,
  },
];
