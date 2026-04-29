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
  isNearby?: boolean;
  distance?: number;
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
  screenType?: string;
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
  seatType: string;
  price?: number;
  isAvailable?: boolean;
}

export interface Showtime {
  id: number;
  startTime: string;
  endTime: string;
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

export interface Review {
  id?: number;
  movieId: number;
  userId?: number;
  adminId?: number;
  rating: number;
  comment: string;
  createdAt?: string;
  userName?: string;
}
