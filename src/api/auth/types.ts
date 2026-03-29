export type RegisterPayload = {
  email: string;
  fullName: string;
  companyName: string;
  country: string;
  phone: string;
};

export type RegisterResponse = {
  user: {
    id: string;
    email: string;
    phone: string;
    factory_name: string;
    country: string;
  };
  success: boolean;
  message: string;
};

export type SendOtpPayload = {
  toPhoneNumber: number;
  country: string;
  phoneNumber: string;
};

export type VerifyOtpPayload = {
  toPhoneNumber: number;
  otp: number;
};

export type OtpResponse = {
  success: boolean;
  message: string;
  email: string;
};

export type TUser = {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  balance: number;
  currency: string;
  date_created: string;
  date_updated: string;
  date_last_login: string;
  email_optin: boolean;
  order_count: number;
  order_value: number;
  shipping: {
    account_address_id: string;
    name: string;
    first_name: string;
    last_name: string;
    address1: string;
    address2: string | null;
    city: string;
    state: string;
    zip: string;
    country: string;
    company: string | null;
    phone: string | null;
    type: 'individual' | 'business';
  };
  billing: {
    name: string;
    address1: string;
    address2: string | null;
    city: string;
    state: string;
    zip: string;
    country: string;
    first_name: string;
    last_name: string;
  };
  isVerified: boolean;
};
export type VerifyOtpResponse = {
  success: boolean;
  message: string;
  token?: string;
  user: TUser;
  content: {
    otp: string;
    verified: boolean;
  };
};

export type LogoutResponse = {
  success: boolean;
  message: string;
};

export type LogoutPayload = {
  token: string;
};
