import { default as AccountScreens } from './Account';
import { default as AuthScreens } from './Auth';
import { default as OrderScreens } from './Order';
import { default as OrdersScreens } from './Orders';
import { default as PaymentScreens } from './Payment';
import { default as ProductScreens } from './Product';
import { default as ThankYouScreens } from './ThankYou';
const Screens = {
  ...OrderScreens,
  ...ProductScreens,
  ...ProductScreens,
  ...AuthScreens,
  ...PaymentScreens,
  ...AccountScreens,
  Orders: OrdersScreens,
  ThankYouScreens,
};

export default Screens;
