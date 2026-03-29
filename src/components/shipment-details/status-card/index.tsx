import { LocationPin } from 'components/ui';
import { useShipmentStatusRender } from 'constants/shipment-status-render';
import { memo } from 'react';
import { Card, Text, XStack, YStack } from 'tamagui';

import StatusLabelRow from '../status-label-row';

type StatusCardProps = {
  status: {
    id: number;
    status: string;
    date: string;
    location: string;
    locationAddress?: string;
    note?: string;
    voyageNo?: string;
  };
};

function StatusCard({ status }: StatusCardProps) {
  const shipmentStatusRender = useShipmentStatusRender();

  return (
    <YStack gap={12} key={status.id}>
      <Card
        borderColor="#DBDBDB"
        borderWidth={2}
        backgroundColor="white"
        borderRadius={8}
        padding={16}>
        <XStack gap={12}>
          <LocationPin completed />
          <YStack flex={1} gap={6}>
            <Text color="#42B0D5" fontWeight="400" fontSize={12}>
              {status.location}
            </Text>
            <YStack>
              {status.locationAddress && (
                <Text fontWeight="400" fontSize={12} color="#000">
                  {status.locationAddress}
                </Text>
              )}
              <Text fontWeight="400" color="#000" fontSize={12}>
                {status.date}
              </Text>
              {status.note && (
                <Text fontSize={12} color="#666">
                  {status.note}
                </Text>
              )}
              {status.voyageNo && (
                <Text fontSize={12} color="#666">
                  Voyage No: {status.voyageNo}
                </Text>
              )}
            </YStack>
          </YStack>
        </XStack>
      </Card>

      {status.status !== 'vessel-arrival' && shipmentStatusRender[status.status] && (
        <StatusLabelRow
          icon={shipmentStatusRender[status.status].icon}
          label={shipmentStatusRender[status.status].text}
        />
      )}
    </YStack>
  );
}

export default memo(StatusCard);
