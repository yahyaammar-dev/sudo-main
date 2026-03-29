import { Pressable, ScrollView, View, Animated } from 'react-native';
import { Text } from 'tamagui';

import { styles } from './styles';

interface StoreCategoriesTabsProps {
  onSelectCategory?: (category: string) => void;
  categories: string[];
  selectedCategory?: string;
}

function StoreCategoriesTabs({
  onSelectCategory,
  categories,
  selectedCategory: controlledSelectedCategory,
}: StoreCategoriesTabsProps) {
  const handleTabPress = (tab: string) => {
    onSelectCategory?.(tab);
  };
  return (
    <View style={{ position: 'relative' }}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        style={styles.container}
        // onLayout={(e) => setScrollViewWidth(e.nativeEvent.layout.width)}
        // onContentSizeChange={handleContentSizeChange}
        contentContainerStyle={{ paddingBottom: 4 }}
        bounces={false}
        decelerationRate="fast">
        {categories.map((tab, index) => (
          <View
            key={`${tab}-${index}`}
            // onLayout={(e) => handleTabLayout(index, e)}
          >
            <Pressable
              style={[
                styles.tab,
                {
                  backgroundColor: controlledSelectedCategory === tab ? 'white' : 'transparent',
                  borderBottomWidth: 0,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  marginHorizontal: 4,
                  borderRadius: 16,
                  minWidth: 60,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
              onPress={() => handleTabPress(tab)}>
              <Text
                fontWeight={controlledSelectedCategory === tab ? '600' : '500'}
                fontSize={12}
                color={controlledSelectedCategory === tab ? '#000' : '#6B6B6B'}
                textAlign="center">
                {tab}
              </Text>
            </Pressable>
            {controlledSelectedCategory === tab && (
              <Animated.View
                style={[
                  {
                    backgroundColor: '#000',
                    borderRadius: 2,
                    width: '100%',
                    height: 2,
                  },
                ]}
              />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default StoreCategoriesTabs;
