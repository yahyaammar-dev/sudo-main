import AntDesign from '@expo/vector-icons/AntDesign';
import { catalogueKeyFactory } from 'api/catalogue/key-factory';
import { useSearchProducts } from 'api/queries';
import { CartIcon } from 'components/cart';
import { router } from 'expo-router';
import { useTranslation } from 'hooks';
import React, { useState, useRef, useEffect } from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Routes } from 'routers';
import { XStack, YStack, Input, Text } from 'tamagui';
import { SwellSearchProduct } from 'types';

import { SearchIcon } from '../../../../assets/icons';
import SearchSkeleton from '../search-skeleton';

// const PAGE_SIZE = 5;

type ProductSearchProps = {
  onClose?: () => void;
  dropdownPosition?: number;
};

function ProductSearch({ onClose, dropdownPosition = 45 }: ProductSearchProps) {
  const { translations } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  // const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  // const [page, setPage] = useState(1);
  const [products, setProducts] = useState<SwellSearchProduct[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  // const isInitialMount = useRef(true);

  const { data: searchResults, isLoading: isSearching } = useSearchProducts(
    searchQuery
      ? {
          search: searchQuery,
          // limit: PAGE_SIZE, page
        }
      : undefined,
    {
      queryKey: [
        catalogueKeyFactory.searchProducts,
        searchQuery,
        //  page, PAGE_SIZE
      ],
      enabled: !!searchQuery,
    }
  );
  useEffect(() => {
    if (searchResults?.groupedByFactory) {
      const allProducts = searchResults.groupedByFactory.reduce<SwellSearchProduct[]>(
        (acc, item) => [...acc, ...item.products],
        []
      );
      setProducts(allProducts);
    }
  }, [searchResults]);
  // useEffect(() => {
  //   if (isInitialMount.current) {
  //     isInitialMount.current = false;
  //     return;
  //   }

  //   setPage(1);
  //   setResults([]);
  // }, [searchQuery]);

  // useEffect(() => {
  //   if (!searchResults?.results) return;

  //   if (page === 1) {
  //     setResults(searchResults.results);
  //   } else {
  //     setResults((prev) => [...prev, ...searchResults.results]);
  //   }
  // }, [searchResults, page]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleCloseSearch = () => {
    setSearchQuery('');
    setProducts([]);
    // setPage(1);
    onClose?.();
  };

  const handleSuggestionSelect = (search_text: string) => {
    // setPage(1);
    router.push({
      pathname: Routes.ProductSearch,
      params: { search_text },
    });

    setSearchQuery('');
    setProducts([]);
    Keyboard.dismiss();
  };

  // const handleScroll = useCallback(
  //   ({ nativeEvent }: any) => {
  //     if (isSearching) return;

  //     const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
  //     const paddingToBottom = 50;
  //     const isCloseToBottom =
  //       layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

  //     if (isCloseToBottom) {
  //       console.log('Loading more results, current page:', page);
  //       setPage((prev) => prev + 1);
  //     }
  //   },
  //   [isSearching, page]
  // );

  const renderSuggestion = (product: SwellSearchProduct) => {
    const matchIndex = product.name.toLowerCase().indexOf(searchQuery.toLowerCase());
    if (matchIndex === -1) {
      return (
        <Text fontSize={17} color="#85858533">
          {product.name}
        </Text>
      );
    }
    const match = product.name.substring(0, matchIndex + searchQuery.length);
    const rest = product.name.substring(matchIndex + searchQuery.length);
    return (
      <Text fontSize={17} color="#85858533">
        <Text color="#868889">{match}</Text>
        {rest}
      </Text>
    );
  };

  return (
    <YStack>
      <XStack flex={1} alignItems="center" gap={14}>
        <XStack
          backgroundColor="#F5F5F7"
          borderRadius={10}
          alignItems="center"
          height={50}
          px={20}
          flex={1}
          gap="$1.5">
          <SearchIcon size={20} color="#868889" />
          <Input
            flex={1}
            placeholder={translations.searchKeywords}
            borderWidth={0}
            placeholderTextColor="#868889"
            backgroundColor="transparent"
            fontSize={15}
            fontWeight="500"
            color="#000"
            value={searchQuery}
            onChangeText={handleSearch}
            // onFocus={() => setIsDropdownVisible(true)}
            // onBlur={() => setTimeout(() => setIsDropdownVisible(false), 150)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={handleCloseSearch}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <AntDesign name="close" size={20} color="black" />
            </TouchableOpacity>
          )}
        </XStack>
        <CartIcon backgroundColor="#F5F5F7" />
      </XStack>

      {(searchQuery.length > 0 || isSearching) && (
        <YStack style={[styles.dropdownContainer, { top: dropdownPosition }]}>
          <YStack
            borderTopColor="#85858533"
            borderTopWidth={1}
            gap={10}
            px={20}
            py={10}
            style={{ flex: 1 }}>
            {isSearching ? (
              // page === 1
              <SearchSkeleton />
            ) : products.length ? (
              <ScrollView
                ref={scrollRef}
                style={{ maxHeight: 180 }}
                contentContainerStyle={{ gap: 10, paddingBottom: 40 }}
                showsVerticalScrollIndicator
                bounces
                // onScroll={handleScroll}
                scrollEventThrottle={16}
                keyboardShouldPersistTaps="handled">
                {products.map((product, index) => (
                  <TouchableWithoutFeedback
                    key={index}
                    onPress={() => handleSuggestionSelect(product.name)}>
                    {renderSuggestion(product)}
                  </TouchableWithoutFeedback>
                ))}
              </ScrollView>
            ) : searchQuery ? (
              <Text fontSize={16} color="#B0B0B0">
                {translations.noResultsFound}
              </Text>
            ) : null}
          </YStack>
        </YStack>
      )}
    </YStack>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#F5F5F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 60,
    maxHeight: 250,
    overflow: 'hidden',
    paddingHorizontal: 10,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  },
});

export default ProductSearch;
