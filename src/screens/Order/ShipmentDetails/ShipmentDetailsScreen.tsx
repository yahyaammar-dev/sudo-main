import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useGetTracking } from 'api/extra';
import { useGetOrder } from 'api/orders/queries';
import { ThemedSafeAreaView } from 'components';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'hooks';
import { ArrowDown, ArrowLeft2, ArrowRight, Box1, TruckFast } from 'iconsax-react-nativejs';
import { Fragment, useState, useMemo } from 'react';
import {
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { YStack, View, XStack, Text, Button } from 'tamagui';
import { RouteData, TrackingResponse, Vessel } from 'types';

// Define comprehensive types for the shipment data
interface ShipmentLocation {
  id: number;
  name: string;
  country_code: string;
}

interface ShipmentFacility {
  id: number;
  name?: string;
}

interface ShipmentEvent {
  location: number;
  facility: number;
  description: string;
  date: string;
  actual: boolean;
}

interface ShipmentContainer {
  number: string;
  iso_code: string;
  size_type: string;
  status: string;
  events: ShipmentEvent[];
}

interface ShipmentVessel {
  name: string;
  imo: number;
  call_sign?: string;
  mmsi?: string;
  flag?: string;
}

interface ShipmentData {
  locations: ShipmentLocation[];
  facilities: ShipmentFacility[];
  containers: ShipmentContainer[];
  vessels: ShipmentVessel[];
}

interface RouteEvent {
  event: string;
  time: string;
  completed: boolean;
}

interface RouteStop {
  location: string;
  events: RouteEvent[];
  completed: boolean;
}

interface TabProps {
  tab: string;
  isActive: boolean;
  onPress: () => void;
}

interface ProgressLineProps {
  routeData: RouteStop[];
}

interface RouteTimelineProps {
  routeData: RouteStop[];
}

interface VesselInfoProps {
  vessels: Vessel[] | undefined;
  routeData: RouteData[] | undefined;
}

// Tab component for better reusability
const Tab: React.FC<TabProps> = ({ tab, isActive, onPress }) => (
  <TouchableOpacity style={[styles.tab, isActive && styles.activeTab]} onPress={onPress}>
    <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab}</Text>
  </TouchableOpacity>
);

// Progress line component for better separation of concerns
const ProgressLine: React.FC<ProgressLineProps> = ({ routeData }) => {
  const lastCompletedIndex = useMemo(() => {
    return routeData
      .map((stop, i) => (stop.completed || stop.events.some((e) => e.completed) ? i : -1))
      .filter((i) => i !== -1)
      .pop();
  }, [routeData]);

  return (
    <View style={styles.progressLine}>
      {routeData.map((stop, index) => {
        const isStopCompleted = stop.completed || stop.events.some((e) => e.completed);
        const isFirstStop = index === 0;
        const isLastStop = index === routeData.length - 1;
        const isMiddleStop = !isFirstStop && !isLastStop;
        const isLastCompletedStop = index === lastCompletedIndex;

        return (
          <Fragment key={index}>
            {!isMiddleStop && (
              <View style={styles.progressDotContainer}>
                <View
                  style={[
                    styles.progressDot,
                    isStopCompleted ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              </View>
            )}
            {!isLastStop && (
              <View flex={1} height={2} marginHorizontal={0}>
                {isStopCompleted ? (
                  <View style={[styles.progressBar, styles.activeBar]} />
                ) : (
                  <View
                    flex={1}
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    height={2}
                    marginHorizontal={0}>
                    {Array.from({ length: 8 }).map((_, dotIndex) => (
                      <View key={dotIndex} style={styles.inactiveBarDot} />
                    ))}
                  </View>
                )}
                {isLastCompletedStop && (
                  <View position="absolute" top={-7} right={-7} zIndex={3}>
                    <View
                      height={16}
                      width={16}
                      backgroundColor="#fff"
                      borderRadius={8}
                      justifyContent="center"
                      borderColor="#000"
                      borderWidth={2}
                      alignItems="center">
                      <ArrowRight size={10} fontWeight="bold" color="#000" />
                    </View>
                  </View>
                )}
              </View>
            )}
          </Fragment>
        );
      })}
    </View>
  );
};

// Route timeline component for better organization
const RouteTimeline: React.FC<RouteTimelineProps> = ({ routeData }) => {
  const lastCompletedIndex = useMemo(() => {
    return routeData
      .map((stop, i) => (stop.completed || stop.events.some((e) => e.completed) ? i : -1))
      .filter((i) => i !== -1)
      .pop();
  }, [routeData]);

  return (
    <View style={styles.card}>
      {routeData.map((stop, index) => {
        const isStopCompleted = stop.completed || stop.events.some((e) => e.completed);
        const completedEventsCount = stop.events.filter((e) => e.completed).length;
        const totalEventsCount = stop.events.length;

        const progressLineHeight = totalEventsCount * 20 + 32;
        const completedLineHeight = completedEventsCount * 20;
        const isLastCompletedStop = index === lastCompletedIndex;

        const nextStop = routeData[index + 1];
        const nextStopHasCompleted =
          nextStop && (nextStop.completed || nextStop.events.some((e) => e.completed));

        const shouldExtendCompletedLine = isStopCompleted && nextStopHasCompleted;
        const extendedCompletedHeight = shouldExtendCompletedLine
          ? completedLineHeight + 32
          : completedLineHeight;

        return (
          <YStack key={index} marginBottom={16}>
            <XStack gap={12}>
              <YStack alignItems="center">
                <View
                  width={16}
                  height={16}
                  borderRadius={8}
                  backgroundColor={isStopCompleted ? '#000' : '#EFF1F5'}
                  justifyContent="center"
                  alignItems="center"
                  zIndex={2}>
                  <View
                    width={6}
                    height={6}
                    borderRadius={3}
                    backgroundColor={isStopCompleted ? '#fff' : '#D9D9D9'}
                  />
                </View>

                {index < routeData.length - 1 && (
                  <View
                    width={2}
                    height={progressLineHeight}
                    position="relative"
                    marginTop={-8}
                    marginBottom={-24}>
                    {extendedCompletedHeight < progressLineHeight && (
                      <View
                        width={2}
                        height={progressLineHeight - extendedCompletedHeight}
                        position="absolute"
                        top={extendedCompletedHeight + 8}
                        left={0}
                        flexDirection="column"
                        justifyContent="space-between">
                        {Array.from({
                          length: Math.floor((progressLineHeight - extendedCompletedHeight) / 8),
                        }).map((_, dotIndex) => (
                          <View
                            key={dotIndex}
                            width={4}
                            height={4}
                            backgroundColor="#EFF1F5"
                            borderRadius={2}
                            marginBottom={4}
                            alignSelf="center"
                          />
                        ))}
                      </View>
                    )}
                    <View
                      width={2}
                      height={extendedCompletedHeight}
                      backgroundColor="#000"
                      position="absolute"
                      top={8}
                      left={0}
                    />
                    {isLastCompletedStop && (
                      <View position="absolute" top={completedLineHeight} left={-7} zIndex={3}>
                        <View
                          height={16}
                          width={16}
                          backgroundColor="#fff"
                          borderRadius={8}
                          justifyContent="center"
                          borderColor="#0088ff"
                          borderWidth={2}
                          alignItems="center">
                          <ArrowDown size={10} fontWeight="bold" color="#0088ff" />
                        </View>
                      </View>
                    )}
                  </View>
                )}

                {index === routeData.length - 1 && (
                  <View width={2} height={totalEventsCount * 20} position="relative" marginTop={-8}>
                    {completedLineHeight < totalEventsCount * 20 && (
                      <View
                        width={2}
                        height={totalEventsCount * 20 - completedLineHeight}
                        position="absolute"
                        top={completedLineHeight + 8}
                        left={0}
                        flexDirection="column"
                        justifyContent="space-between">
                        {Array.from({
                          length: Math.floor((totalEventsCount * 20 - completedLineHeight) / 8),
                        }).map((_, dotIndex) => (
                          <View
                            key={dotIndex}
                            width={4}
                            height={4}
                            backgroundColor="#EFF1F5"
                            borderRadius={2}
                            marginBottom={4}
                            alignSelf="center"
                          />
                        ))}
                      </View>
                    )}

                    <View
                      width={2}
                      height={completedLineHeight}
                      backgroundColor="#0088ff"
                      position="absolute"
                      top={8}
                      left={0}
                    />

                    <View position="absolute" bottom={-8} left={-7} zIndex={2}>
                      <View
                        width={16}
                        height={16}
                        borderRadius={8}
                        backgroundColor={
                          completedEventsCount === totalEventsCount ? '#0088ff' : '#EFF1F5'
                        }
                        justifyContent="center"
                        alignItems="center">
                        <View
                          width={6}
                          height={6}
                          borderRadius={3}
                          backgroundColor={
                            completedEventsCount === totalEventsCount ? '#fff' : '#D9D9D9'
                          }
                        />
                      </View>
                    </View>
                  </View>
                )}
              </YStack>

              <YStack gap={12} flex={1} paddingTop={0}>
                <Text fontSize={12} fontWeight="600" color="#000">
                  {stop.location}
                </Text>
                <YStack gap={6}>
                  {stop.events.map((event, eventIndex) => (
                    <XStack key={eventIndex} justifyContent="space-between" alignItems="center">
                      <Text fontSize={11} color="#070B1D">
                        {event.event}
                      </Text>
                      <Text fontSize={11} color="#070B1D">
                        {event.time}
                      </Text>
                    </XStack>
                  ))}
                </YStack>
              </YStack>
            </XStack>
          </YStack>
        );
      })}
    </View>
  );
};
// Vessel information component
const VesselInfo: React.FC<VesselInfoProps> = ({ vessels, routeData }) => {
  console.log({ routeData });
  const routeDataByCallSign = (vessel: Vessel) =>
    routeData?.reduce((acc, route) => {
      console.log(route.vessel?.call_sign, vessel.call_sign);
      if (route.vessel?.call_sign === vessel.call_sign) {
        acc = route;
      }
      return acc;
    }, {} as RouteData);

  console.log({ vessels, routeDataByCallSign });

  return (
    <View style={styles.card}>
      <YStack gap={16}>
        {vessels?.map((vessel, index) => (
          <YStack key={index} gap={8}>
            <XStack justifyContent="space-between">
              <Text fontSize={12} color="#070B1D">
                Vessel:
              </Text>
              <Text fontSize={12} color="#070B1D">
                {vessel.name}
                {console.log(routeDataByCallSign(vessel))}
              </Text>
            </XStack>
            {vessel.voyage && (
              <XStack justifyContent="space-between">
                <Text fontSize={12} color="#070B1D">
                  Voyage:
                </Text>
                <Text fontSize={12} color="#070B1D">
                  {vessel.voyage}
                </Text>
              </XStack>
            )}
            {routeDataByCallSign(vessel)?.from?.name && (
              <XStack justifyContent="space-between">
                <Text fontSize={12} color="#070B1D">
                  Loading:
                </Text>
                <Text fontSize={12} color="#070B1D">
                  {routeDataByCallSign(vessel)?.from?.name},{' '}
                  {routeDataByCallSign(vessel)?.from?.country_code}
                </Text>
              </XStack>
            )}
            {vessel.flag && (
              <XStack justifyContent="space-between">
                <Text fontSize={12} color="#070B1D">
                  Flag:
                </Text>
                <Text fontSize={12} color="#070B1D">
                  {vessel.flag}
                </Text>
              </XStack>
            )}
            {index < vessels.length - 1 && (
              <View height={1} backgroundColor="#EFF1F5" marginVertical={8} />
            )}
          </YStack>
        ))}
      </YStack>
    </View>
  );
};

const ShipmentDetailsScreen: React.FC = () => {
  // All hooks must be called at the top level, before any conditionals
  const { translations } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('Route');
  const tabs = ['Route', 'Vessel', 'Exceptions', 'Demurrage'];
  const { id, tracking_number } = useLocalSearchParams<{ id: string; tracking_number: string }>();
  const { data: orderData, isLoading } = useGetOrder(id as string);
  const { data: tracking, isLoading: isTrackingLoading } = useGetTracking(
    (tracking_number ?? orderData?.content?.shipping_tracking_number) as string
  );

  // Process the JSON data into the route format with proper typing
  const processShipmentData = (data: TrackingResponse | undefined): RouteStop[] => {
    if (!data) return [];

    const locations = data.locations || [];
    const facilities = data.facilities || [];
    const containers = data.containers || [];
    const vessels = data.vessels || [];

    if (containers.length === 0) return [];

    const container = containers[0];
    const events = container.events || [];

    // Group events by location with proper typing
    const locationGroups: Record<string, RouteStop> = {};

    events.forEach((event: ShipmentEvent) => {
      const location = locations.find((loc: ShipmentLocation) => loc.id === event.location);
      const facility = facilities.find((fac: ShipmentFacility) => fac.id === event.facility);

      if (!location) return;

      const locationName = `${location.name}, ${location.country_code}`;

      if (!locationGroups[locationName]) {
        locationGroups[locationName] = {
          location: locationName,
          events: [],
          completed: false,
        };
      }

      // Format the event
      const formattedEvent: RouteEvent = {
        event: event.description,
        time: new Date(event.date).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        completed: event.actual,
      };

      locationGroups[locationName].events.push(formattedEvent);

      // Mark location as completed if any event is completed
      if (event.actual) {
        locationGroups[locationName].completed = true;
      }
    });

    // Convert to array and sort by chronological order
    const routeStops = Object.values(locationGroups);

    // Sort events within each location by date
    routeStops.forEach((stop: RouteStop) => {
      stop.events.sort(
        (a: RouteEvent, b: RouteEvent) => new Date(a.time).getTime() - new Date(b.time).getTime()
      );
    });

    return routeStops;
  };

  // Use actual data or fallback to sample with proper typing
  const routeData = useMemo(() => {
    return tracking ? processShipmentData(tracking) : [];
  }, [tracking]);

  const containerInfo = tracking?.containers?.[0];
  const vesselInfo = tracking?.vessels?.[0];
  const handleBackPress = (): void => {
    router.back();
  };

  const handleTabPress = (tab: string): void => {
    setActiveTab(tab);
  };

  const renderTabContent = (): React.ReactNode => {
    switch (activeTab) {
      case 'Route':
        return <RouteTimeline routeData={routeData} />;
      case 'Vessel':
        return null;
      // return <VesselInfo routeData={tracking?.route_data} vessels={tracking?.vessels} />;
      case 'Exceptions':
      case 'Demurrage':
        return (
          <View style={styles.card}>
            <Text style={styles.placeholderText}>
              {activeTab} information will be displayed here
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  // Handle loading states AFTER all hooks have been called
  if (isTrackingLoading || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft2 size={20} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shipment Details</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0069FF" />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <ThemedSafeAreaView edges={['top']} style={styles.container}>
      <YStack flex={1} backgroundColor="#E5F2FA">
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft2 size={20} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shipment Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        {!tracking ? (
          <View justifyContent="center" alignItems="center" flex={1}>
            <Text fontSize={16} fontWeight="400" color="#000">
              {translations.noTrackingDataAvailable}
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <View style={styles.containerHeader}>
                <Box1 size={20} color="#0088ff" />
                <Text style={styles.containerNumber}>{containerInfo?.number}</Text>
              </View>

              <View style={styles.shipmentInfo}>
                <View style={styles.shipmentType}>
                  <Text style={styles.shipmentTypeText}>{containerInfo?.size_type}</Text>
                  <TruckFast size={16} color="#0088ff" />
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    {containerInfo?.status.replace('_', ' ').toLowerCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.routeSection}>
                <View style={styles.routeHeader}>
                  <Text style={styles.locationText}>{routeData[0]?.location}</Text>
                  <Text style={styles.locationText}>
                    {routeData[routeData.length - 1]?.location}
                  </Text>
                </View>

                {/* Progress Line */}
                <View style={styles.progressLineContainer}>
                  <ProgressLine routeData={routeData} />
                </View>

                <View flexDirection="row" justifyContent="space-between">
                  <XStack gap={24}>
                    <Text style={styles.timelineText}>
                      {tracking?.route?.pod?.date
                        ? `ETA ${new Date(tracking.route.pod.date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}`
                        : null}
                    </Text>
                    <Text style={styles.timelineText}>
                      {tracking?.route?.pol?.date
                        ? `ETD ${new Date(tracking.route.pol.date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}`
                        : null}
                    </Text>
                  </XStack>
                  <Button
                    backgroundColor="#f2f9ff"
                    borderRadius={6}
                    justifyContent="center"
                    alignItems="center"
                    height={32}
                    width={32}
                    padding={4}>
                    <FontAwesome name="trash-o" size={21} color="#08f" />
                  </Button>
                </View>
              </View>
            </View>

            <View style={styles.tabContainer}>
              {tabs.map((tab) => (
                <Tab
                  key={tab}
                  tab={tab}
                  isActive={activeTab === tab}
                  onPress={() => handleTabPress(tab)}
                />
              ))}
            </View>

            {renderTabContent()}
          </ScrollView>
        )}
      </YStack>
    </ThemedSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  headerSpacer: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  containerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  containerNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#000000',
  },
  shipmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  shipmentType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shipmentTypeText: {
    fontSize: 14,
    color: '#0088ff',
    marginRight: 8,
    fontWeight: '500',
  },
  statusBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#64748b',
  },
  routeSection: {
    marginTop: 8,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  progressLineContainer: {
    marginBottom: 0,
  },
  progressLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 0,
  },
  progressDotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  activeDot: {
    backgroundColor: '#000000',
  },
  currentDot: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#0088ff',
  },
  inactiveDot: {
    backgroundColor: '#e2e8f0',
  },
  progressBar: {
    flex: 1,
    height: 2,
    marginHorizontal: 0,
  },
  activeBar: {
    backgroundColor: '#000000',
    marginHorizontal: 0,
  },
  inactiveBarDot: {
    width: 4,
    height: 4,
    backgroundColor: '#EFF1F5',
    borderRadius: 2,
  },
  inactiveBar: {
    backgroundColor: '#e2e8f0',
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 2,
    marginHorizontal: 0,
  },
  timelineText: {
    fontSize: 13,
    color: '#000',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#0088ff',
  },
  tabText: {
    fontSize: 14,
    color: '#64748b',
  },
  activeTabText: {
    color: '#0088ff',
    fontWeight: '600',
  },
  placeholderText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 14,
    paddingVertical: 40,
  },
});

export default ShipmentDetailsScreen;
