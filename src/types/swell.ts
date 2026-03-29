import { Product } from 'swell-js';

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface SwellProductContent {
  dimensions: { length: number; width: number; height: number; unit?: string }[];
  factory: SwellFactory;
  factory_id: string;
  factory_id_id: string;
  featured: boolean;
  is_new: boolean;
  lead_time: { days: number; note?: string }[];
  minimum_quantity: number;
  unit_quantity: string;
  weight: { value: number; unit: string }[];
  [key: string]: any;
}

export interface SwellProductImage {
  id: string;
  file: {
    content_type: 'image/png' | 'image/jpeg' | string;
    date_uploaded: string;
    filename: string;
    height: number;
    id: string;
    length: number;
    md5: string;
    url: string;
    width: number;
  };
}
export interface SwellFactory {
  name?: string;
  location?: string;
  country?: string;
  [key: string]: any;
}

export interface SwellProductOption {
  label: string;
  value: string | number;
  available: boolean;
  [key: string]: any;
}

export interface SwellProductAttributes {
  size: string[];
}

export interface SwellPriceOption {
  region?: string;
  amount: number;
  currency: string;
}
export interface SwellCategoryIndex {
  id: string[];
  sort: {
    [key: string]: number | string;
  };
}
export interface SwellPurchaseOption {
  quantity: number;
  price: number;
  estimated_delivery?: string;
}

export interface SwellBundle {}
export interface SwellProduct {
  active: boolean;
  attributes: SwellProductAttributes;
  bundle: null | SwellBundle;
  category_index: SwellCategoryIndex;
  content: SwellProductContent;
  currency: 'USD' | string;
  date_created: string;
  date_updated: string;
  delivery: 'shipment' | 'pickup' | string;
  description: string;
  discount_percent: number;
  discounted_price: number | null;
  id: string;
  images: SwellProductImage[];
  isFavorite: boolean;
  name: string;
  options: SwellProductOption[];
  price: number;
  prices: SwellPriceOption[];
  purchase_options: {
    standard: SwellPurchaseOption;
  };
  sale: boolean;
  sale_price: number | null;
  sku: string | null;
  slug: string;
  stock_status: 'in_stock' | 'out_of_stock' | null;
  stock_tracking: boolean;
  type: 'physical' | 'digital' | string;
  variable: boolean;
}

export interface SwellImage {
  id: string;
  file: {
    url: string;
    width: number;
    height: number;
  };
  caption?: string;
}

export interface SwellOption {
  id: string;
  name: string;
  values: {
    id: string;
    name: string;
  }[];
}

export interface SwellVariant {
  id: string;
  name: string;
  price: number;
  option_value_ids: string[];
  stock_level?: number;
}

export interface SwellCategoryImage {
  id: string;
  file: {
    url: string;
  };
}
export interface SwellCategory {
  id: string;
  name: string;
  images: SwellCategoryImage[];
  slug: string;
  products?: Product[];
}

export interface SwellCart {
  id: string;
  items: SwellCartItem[];
  item_quantity: number;
  sub_total: number;
  grand_total: number;
  currency: string;
}

export interface SwellCartItem {
  id: string;
  product_id: string;
  productId: string;
  variant_id?: string;
  quantity: number;
  price: number;
  options?: {
    id: string;
    name: string;
    value: string;
  }[];
  product: SwellProduct;
}

export interface SwellCustomer {
  id: string;
  name?: string;
  email: string;
  shipping?: SwellAddress;
  billing?: SwellAddress;
}

export interface SwellAddress {
  name?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
}

export interface SwellQuery {
  limit?: number;
  page?: number;
  sort?: string;
  search?: string;
  filters?: Record<string, any>;
  expand?: string[];
  category_slug?: string;
  [key: string]: any;
}

export interface SwellPaginatedResponse<T> {
  results: T[];
  count: number;
  page: number;
  pages: number;
}

export type SwellSession = {
  account_id?: string;
  account_logged_in?: boolean;
  [key: string]: any;
};

export type SwellAccount = {
  id: string;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  [key: string]: any;
};

export type SwellShippingAddress = {
  name?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  [key: string]: any;
};

export type SwellBillingAddress = SwellShippingAddress;

export type SwellOrder = {
  id: string;
  number: string;
  status: string;
  items: SwellCartItem[];
  shipping: SwellShippingAddress;
  billing: SwellBillingAddress;
  [key: string]: any;
};

export interface ProductSearchResponse {
  success: boolean;
  total: number;
  page: number;
  groupedByFactory: FactoryGroup[];
}

export interface FactoryGroup {
  factory: FactoryProfile;
  products: (SwellSearchProduct & { moq: number })[];
}

export interface FactoryProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName?: string;
  details: FactoryDetails;
  currency: string;
  dateCreated: string;
  type: string;
  orderCount: number;
  orderValue: number;
  balance: number;
  dateUpdated: string;
  emailOptIn?: boolean;
  password?: string;
  content: FactoryDetails;
}

export interface FactoryDetails {
  registration_number?: string;
  country: string;
  factory_name: string;
  certifications?: Certification[];
  verified: boolean;
  city: any;
  tax_id: any;
  minimum_quantity?: number;
  store_front_cover_photo?: StoreFrontImage;
  store_front_logo?: StoreFrontImage;
  complain?: string;
  lead_time: LeadTimeRange[];
  personal_id?: PersonalId;
}

export interface Certification {
  id: string;
  date_uploaded: string;
  length: number;
  md5: string;
  filename: string;
  content_type: string;
  url: string;
  instance?: CertificationPreview;
  chunk_size?: number;
  original_filename?: string;
  extension?: string;
  mime_type?: string;
  date_created?: string;
  upload_date?: string;
}

export interface CertificationPreview {
  preview?: string;
}

export interface StoreFrontImage {
  file: UploadedFile;
  id: string;
  date_uploaded: string;
  length: number;
  md5: string;
  filename: string;
  content_type: string;
  url: string;
  width: number;
  height: number;
}

export interface UploadedFile {
  id: string;
  date_uploaded: string;
  length: number;
  md5: string;
  filename: string;
  content_type: string;
  url: string;
  width: number;
  height: number;
}

export interface LeadTimeRange {
  min_days: number;
  max_days: number;
  id: string;
}

export interface PersonalId {
  id: string;
  md5: string;
  length: number;
  date_uploaded: string;
  url: string;
}

export interface SwellSearchProduct {
  id: string;
  name: string;
  sku: any;
  active: boolean;
  images: any;
  purchase_options: PurchaseOptions;
  variable: boolean;
  description: any;
  tags: any[];
  meta_title: any;
  meta_description: any;
  slug: string;
  attributes: ProductAttributes;
  delivery: string;
  bundle: any;
  price: number;
  stock_tracking: boolean;
  options: Record<string, any>;
  details: ProductDetails;
  currency: string;
  type: string;
  date_created: string;
  stock_status: any;
  date_updated: string;
  category_index?: CategoryIndex;
  content: SwellProductContent;
  sold_by: string;
  [key: string]: any;
}

export interface Option {
  id: string;
  values: Value[];
  name: string;
  active: boolean;
  input_type: string;
  variant: boolean;
  description: string;
  required: boolean;
  attribute_id: string;
}

export interface Value {
  id: string;
  name: string;
  price: number;
  shipment_weight?: number;
  description: string;
  carton_dimensions_cm_: string;
  flc_quantity: FlcQuantity[];
  expiry_date: string;
  lead_time: LeadTime[];
  moq?: number;
  minimum_quantity: number;
  more_details: any;
}

export interface FlcQuantity {
  '20_ft_': number;
  '40_ft_hc': number;
  id: string;
}

export interface LeadTime {
  min_days: number;
  max_days: number;
  id: string;
}

export interface PurchaseOptions {}

export interface ProductAttributes {}

export interface ProductDetails {
  featured: boolean;
  weight: any[];
  dimensions: any[];
  lead_time: any[];
  minimum_quantity: any;
  unit_quantity: any;
  is_new: boolean;
  factory_id: string;
}

export interface CategoryIndex {
  sort: Record<string, number>;
  id: string[];
}
