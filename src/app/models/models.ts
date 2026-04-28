export interface Movie {
  id: number;
  title: string;
  description: string;
  duration: number;
  genre: string[];
  rating: number;
  posterUrl?: string;
  widePosterUrl?: string;
  posterData?: string; 
  widePosterData?: string;
  releaseDate: string;
  recomended: boolean;
  running: boolean;
}

export interface Theater {
  id: number;
  name: string;
  locationId?: number;
  location?: AppLocation;
  screens?: Screen[];
}

export interface AppLocation {
  id: number;
  state: string;
  city: string;
  location: string;
}

export interface Screen {
  id: number;
  name: string;
  capacity: number;
  theaterId: number;
  theaterName?: string;
  theater?: Theater;
  seats?: Seat[];
}

export interface Seat {
  id: number;
  row: string;
  number: number;
  screenId: number;
  seatType: string; // Silver, Gold, Platinum
}

export interface Showtime {
  id: number;
  startTime: string;
  endTime: string;
  basePrice: number;
  movieId: number;
  movie?: Movie;
  screenId: number;
  screen?: Screen;
}

export interface Booking {
  id: number;
  bookingTime: string;
  totalAmount: number;
  status: string;
  showtimeId: number;
  userId?: number;
  adminId?: number;
  showtime?: Showtime;
  selectedSeats?: { seat: Seat }[];
}
