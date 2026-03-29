import { useTranslation } from 'hooks';
import { Truck, Ship } from 'iconsax-react-nativejs';
import React from 'react';

export const useShipmentStatusRender = (): Record<
  string,
  { icon: React.ReactNode; text: string }
> => {
  const { translations } = useTranslation();

  return {
    'gate-in': {
      icon: <Truck size={24} color="#666" />,
      text: translations.gateIn,
    },
    'gate-out': {
      icon: <Truck size={24} color="#666" />,
      text: translations.gateOut,
    },
    'vessel-departure': {
      icon: <Ship size={24} color="#666" />,
      text: translations.vesselDeparture,
    },
    'vessel-arrival': {
      icon: <Ship size={24} color="#666" />,
      text: translations.vesselArrival,
    },
    loaded: {
      icon: <Ship size={24} color="#666" />,
      text: translations.loaded,
    },
  };
};
