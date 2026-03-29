import { Feather } from '@expo/vector-icons';
import { SvgProps } from 'react-native-svg';
export * from './swell';

export type SupportedLanguage = 'en' | 'fr';

export type Category = {
  id: string;
  name: string;
  icon: React.ComponentProps<typeof Feather>['name'];
};

export type Product = {
  id: number;
  name: string;
  packSize: string;
  price: number;
  currency?: string;
  quantity?: number;
  image: any;
  isNew?: boolean;
  isFavorite?: boolean;
  moq?: string;
};

export type SvgIconProps = {
  color?: string;
  size?: number;
  height?: number;
  width?: number;
} & SvgProps;

type OrderItem = {
  id: number;
  name: string;
  packSize: string;
  price: number;
  image: any;
};
export type Order = {
  id: string;
  company: string;
  companyLogo: any;
  expectedDelivery: string;
  status: 'payment_required' | 'payment_received' | 'delivered' | 'cancelled' | 'returned';
  pieces: number;
  items: OrderItem[];
  totalAmount: number;
  isExpanded?: boolean;
};

export type LoadingStatus = 'pending' | 'success' | 'error' | undefined;

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  [key: string]: any;
  data?: T;
};

export enum OrderStatus {
  OrderPlaced = 'order_placed',
  PaymentRequired = 'payment_required',
  PaymentReceived = 'payment_received',
  PaymentRecieved = 'payment_recieved',
  OrderInspected = 'order_inspected',
  OrderShipped = 'order_shipped',
  OrderCancelled = 'order_cancelled',
  OrderReturned = 'order_returned',
  PaymentPending = 'payment_pending',
  PendingPayment = 'pending_payment',
  OrderDelivered = 'order_delivered',
  Pending = 'pending',
  Canceled = 'canceled',
}

export interface Country {
  cca2: string;
  name: string;
  callingCode: string[];
  flag?: string;
}

export type CountryCode = string;

export type TrackingResponse = {
  metadata: {
    type: string;
    number: string;
    sealine: string;
    sealine_name: string;
    status: string;
    is_status_from_sealine: boolean;
    from_cache: boolean;
    updated_at: string;
    cache_expires: string;
    api_calls: {
      total: number;
      used: number;
      remaining: number;
    };
    unique_shipments: {
      total: number;
      used: number;
      remaining: number;
    };
  };
  locations: Location[];
  facilities: Facility[];
  route: {
    prepol: RoutePoint;
    pol: RoutePoint;
    pod: RoutePoint & { predictive_eta: string | null };
    postpod: RoutePoint;
  };
  vessels: Vessel[];
  containers: Container[];
  route_data: RouteData[];
};

export type Location = {
  id: number;
  name: string;
  state: string;
  country: string;
  country_code: string;
  locode: string;
  lat: number;
  lng: number;
  timezone: string;
};

export type Facility = {
  id: number;
  name: string;
  country_code: string;
  locode: string | null;
  bic_code: string | null;
  smdg_code: string | null;
  lat: number | null;
  lng: number | null;
};

export type RoutePoint = {
  location: number;
  date: string | null;
  actual: boolean | null;
};

export type Vessel = {
  id: number;
  name: string;
  imo: number;
  call_sign: string;
  mmsi: number;
  flag: string;
  voyage: string;
};

export type Container = {
  number: string;
  iso_code: string;
  size_type: string;
  status: string;
  is_status_from_sealine: boolean;
  charges: {
    storage: Charge;
    demurrage: Charge;
    detention: Charge;
  };
  events: Event[];
};

export type Charge = {
  free_days: number | null;
  days_in_charge: number | null;
};

export type Event = {
  order_id: number;
  location: number;
  facility: number;
  description: string;
  event_type: string;
  event_code: string;
  status: string;
  date: string;
  actual: boolean;
  is_date_from_sealine: boolean;
  is_additional_event: boolean;
  type: string;
  transport_type: string | null;
  vessel: number | null;
  voyage: string | null;
};

export type RouteData = {
  path: [number, number][];
  type: string;
  transport_type: string;
  vessel: Vessel | null;
  from: Location;
  to: Location;
};

export type ShippingRate = {
  id: string;
  country_name: string;
  min_rate: number;
  max_rate: number;
};

export type UserCountryResponse = {
  success: boolean;
  message: string;
  country: string;
  shippingRate: ShippingRate;
};