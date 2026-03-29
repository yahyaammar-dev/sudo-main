import { use$ } from '@legendapp/state/react';
import { Lock1 } from 'iconsax-react-nativejs';
import { Text, XStack } from 'tamagui';

import userStore from '../store/userStore';

export function formatCurrency(
  price?: number | null,
  currency?: string,
  size: number = 14
): string | React.ReactNode {
  const { account } = use$(userStore);
  const isVerified = account?.isVerified || false;
  const currencyCode = currency || 'USD';
  if (price === undefined || price === null) {
    return '';
  }

  if (!isVerified) {
    return (
      <XStack alignItems="center" gap={2}>
        <Text fontSize={size} color="#6CC51D">
          {getCurrencySymbol(currencyCode)}
        </Text>
        <Lock1 size={size} strokeWidth={2} color="#6CC51D" />
      </XStack>
    );
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  } catch (error) {
    console.log({ error });
    const currencySymbols: Record<string, string> = {
      // Major currencies
      USD: '$', // US Dollar
      EUR: '€', // Euro
      GBP: '£', // British Pound
      JPY: '¥', // Japanese Yen
      CNY: '¥', // Chinese Yuan
      INR: '₹', // Indian Rupee

      // Americas
      CAD: 'C$', // Canadian Dollar
      AUD: 'A$', // Australian Dollar
      NZD: 'NZ$', // New Zealand Dollar
      BRL: 'R$', // Brazilian Real
      MXN: '$', // Mexican Peso
      ARS: '$', // Argentine Peso
      CLP: '$', // Chilean Peso
      COP: '$', // Colombian Peso
      PEN: 'S/', // Peruvian Sol
      UYU: '$U', // Uruguayan Peso
      VES: 'Bs.', // Venezuelan Bolívar

      // Europe
      CHF: 'Fr.', // Swiss Franc
      SEK: 'kr', // Swedish Krona
      NOK: 'kr', // Norwegian Krone
      DKK: 'kr', // Danish Krone
      PLN: 'zł', // Polish Zloty
      CZK: 'Kč', // Czech Koruna
      HUF: 'Ft', // Hungarian Forint
      RON: 'lei', // Romanian Leu
      BGN: 'лв', // Bulgarian Lev
      HRK: 'kn', // Croatian Kuna
      RSD: 'дин', // Serbian Dinar
      BAM: 'КМ', // Bosnia and Herzegovina Convertible Mark
      MKD: 'ден', // Macedonian Denar
      ALL: 'L', // Albanian Lek
      MDL: 'L', // Moldovan Leu
      UAH: '₴', // Ukrainian Hryvnia
      BYN: 'Br', // Belarusian Ruble
      RUB: '₽', // Russian Ruble
      GEL: '₾', // Georgian Lari
      AMD: '֏', // Armenian Dram
      AZN: '₼', // Azerbaijani Manat

      // Asia-Pacific
      KRW: '₩', // South Korean Won
      SGD: 'S$', // Singapore Dollar
      HKD: 'HK$', // Hong Kong Dollar
      TWD: 'NT$', // Taiwan Dollar
      THB: '฿', // Thai Baht
      MYR: 'RM', // Malaysian Ringgit
      IDR: 'Rp', // Indonesian Rupiah
      PHP: '₱', // Philippine Peso
      VND: '₫', // Vietnamese Dong
      LAK: '₭', // Lao Kip
      KHR: '៛', // Cambodian Riel
      MMK: 'K', // Myanmar Kyat
      BDT: '৳', // Bangladeshi Taka
      PKR: '₨', // Pakistani Rupee
      LKR: '₨', // Sri Lankan Rupee
      NPR: '₨', // Nepalese Rupee
      BTN: 'Nu.', // Bhutanese Ngultrum
      MVR: '.ރ', // Maldivian Rufiyaa
      AFN: '؋', // Afghan Afghani

      // Middle East
      SAR: '﷼', // Saudi Riyal
      AED: 'د.إ', // UAE Dirham
      QAR: '﷼', // Qatari Riyal
      KWD: 'د.ك', // Kuwaiti Dinar
      BHD: '.د.ب', // Bahraini Dinar
      OMR: '﷼', // Omani Rial
      JOD: 'د.ا', // Jordanian Dinar
      LBP: '£', // Lebanese Pound
      SYP: '£', // Syrian Pound
      IQD: 'د.ع', // Iraqi Dinar
      IRR: '﷼', // Iranian Rial
      TRY: '₺', // Turkish Lira
      ILS: '₪', // Israeli Shekel

      // Africa
      ZAR: 'R', // South African Rand
      EGP: '£', // Egyptian Pound
      NGN: '₦', // Nigerian Naira
      KES: 'KSh', // Kenyan Shilling
      UGX: 'USh', // Ugandan Shilling
      TZS: 'TSh', // Tanzanian Shilling
      ETB: 'Br', // Ethiopian Birr
      GHS: '₵', // Ghanaian Cedi
      MAD: 'د.م.', // Moroccan Dirham
      TND: 'د.ت', // Tunisian Dinar
      DZD: 'د.ج', // Algerian Dinar
      LYD: 'ل.د', // Libyan Dinar
      SDG: 'ج.س.', // Sudanese Pound
      SSP: '£', // South Sudanese Pound
      ERN: 'Nfk', // Eritrean Nakfa
      DJF: 'Fdj', // Djiboutian Franc
      SOS: 'S', // Somali Shilling
      RWF: 'FRw', // Rwandan Franc
      BIF: 'FBu', // Burundian Franc
      CDF: 'FC', // Congolese Franc
      AOA: 'Kz', // Angolan Kwanza
      ZMW: 'ZK', // Zambian Kwacha
      BWP: 'P', // Botswana Pula
      SZL: 'L', // Swazi Lilangeni
      LSL: 'L', // Lesotho Loti
      NAD: 'N$', // Namibian Dollar
      MZN: 'MT', // Mozambican Metical
      MWK: 'MK', // Malawian Kwacha
      ZWL: 'Z$', // Zimbabwean Dollar
      MUR: '₨', // Mauritian Rupee
      SCR: '₨', // Seychellois Rupee
      MGA: 'Ar', // Malagasy Ariary
      KMF: 'CF', // Comorian Franc
      CVE: '$', // Cape Verdean Escudo
      STP: 'Db', // São Tomé and Príncipe Dobra
      GMD: 'D', // Gambian Dalasi
      SLL: 'Le', // Sierra Leonean Leone
      LRD: 'L$', // Liberian Dollar
      GNF: 'FG', // Guinean Franc
      CFA: 'CFA', // West African CFA Franc (XOF) and Central African CFA Franc (XAF)
      XOF: 'CFA', // West African CFA Franc
      XAF: 'FCFA', // Central African CFA Franc

      // Pacific
      FJD: 'FJ$', // Fijian Dollar
      TOP: 'T$', // Tongan Paʻanga
      WST: 'WS$', // Samoan Tala
      VUV: 'VT', // Vanuatu Vatu
      SBD: 'SI$', // Solomon Islands Dollar
      PGK: 'K', // Papua New Guinean Kina

      // Other notable currencies
      ISK: 'kr', // Icelandic Krona
      XCD: 'EC$', // East Caribbean Dollar
      BBD: 'Bds$', // Barbadian Dollar
      JMD: 'J$', // Jamaican Dollar
      TTD: 'TT$', // Trinidad and Tobago Dollar
      BZD: 'BZ$', // Belize Dollar
      GTQ: 'Q', // Guatemalan Quetzal
      HNL: 'L', // Honduran Lempira
      NIO: 'C$', // Nicaraguan Córdoba
      CRC: '₡', // Costa Rican Colón
      PAB: 'B/.', // Panamanian Balboa
      HTG: 'G', // Haitian Gourde
      DOP: 'RD$', // Dominican Peso
      CUP: '₱', // Cuban Peso

      // Cryptocurrency (bonus)
      BTC: '₿', // Bitcoin
      ETH: 'Ξ', // Ethereum

      XPF: '₣',
    };

    const symbol = currencySymbols[currencyCode] || currencyCode + ' ';
    return `${symbol}${price.toFixed(2)}`;
  }
}

export function getCurrencySymbol(currencyCode: string): string {
  const currencySymbols: Record<string, string> = {
    // Major currencies
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    INR: '₹',
    // Americas
    CAD: 'C$',
    AUD: 'A$',
    NZD: 'NZ$',
    BRL: 'R$',
    MXN: '$',
    ARS: '$',
    CLP: '$',
    COP: '$',
    PEN: 'S/',
    UYU: '$U',
    VES: 'Bs.',
    // Europe
    CHF: 'Fr.',
    SEK: 'kr',
    NOK: 'kr',
    DKK: 'kr',
    PLN: 'zł',
    CZK: 'Kč',
    HUF: 'Ft',
    RON: 'lei',
    BGN: 'лв',
    HRK: 'kn',
    RSD: 'дин',
    BAM: 'КМ',
    MKD: 'ден',
    ALL: 'L',
    MDL: 'L',
    UAH: '₴',
    BYN: 'Br',
    RUB: '₽',
    GEL: '₾',
    AMD: '֏',
    AZN: '₼',
    // Asia-Pacific
    KRW: '₩',
    SGD: 'S$',
    HKD: 'HK$',
    TWD: 'NT$',
    THB: '฿',
    MYR: 'RM',
    IDR: 'Rp',
    PHP: '₱',
    VND: '₫',
    LAK: '₭',
    KHR: '៛',
    MMK: 'K',
    BDT: '৳',
    PKR: '₨',
    LKR: '₨',
    NPR: '₨',
    BTN: 'Nu.',
    MVR: '.ރ',
    AFN: '؋',
    // Middle East
    SAR: '﷼',
    AED: 'د.إ',
    QAR: '﷼',
    KWD: 'د.ك',
    BHD: '.د.ب',
    OMR: '﷼',
    JOD: 'د.ا',
    LBP: '£',
    SYP: '£',
    IQD: 'د.ع',
    IRR: '﷼',
    TRY: '₺',
    ILS: '₪',
    // Africa
    ZAR: 'R',
    EGP: '£',
    NGN: '₦',
    KES: 'KSh',
    UGX: 'USh',
    TZS: 'TSh',
    ETB: 'Br',
    GHS: '₵',
    MAD: 'د.م.',
    TND: 'د.ت',
    DZD: 'د.ج',
    LYD: 'ل.د',
    SDG: 'ج.س.',
    SSP: '£',
    ERN: 'Nfk',
    DJF: 'Fdj',
    SOS: 'S',
    RWF: 'FRw',
    BIF: 'FBu',
    CDF: 'FC',
    AOA: 'Kz',
    ZMW: 'ZK',
    BWP: 'P',
    SZL: 'L',
    LSL: 'L',
    NAD: 'N$',
    MZN: 'MT',
    MWK: 'MK',
    ZWL: 'Z$',
    MUR: '₨',
    SCR: '₨',
    MGA: 'Ar',
    KMF: 'CF',
    CVE: '$',
    STP: 'Db',
    GMD: 'D',
    SLL: 'Le',
    LRD: 'L$',
    GNF: 'FG',
    XOF: 'CFA',
    XAF: 'FCFA',
    // Pacific & Others
    FJD: 'FJ$',
    TOP: 'T$',
    WST: 'WS$',
    VUV: 'VT',
    SBD: 'SI$',
    PGK: 'K',
    ISK: 'kr',
    XCD: 'EC$',
    BBD: 'Bds$',
    JMD: 'J$',
    TTD: 'TT$',
    BZD: 'BZ$',
    GTQ: 'Q',
    HNL: 'L',
    NIO: 'C$',
    CRC: '₡',
    PAB: 'B/.',
    HTG: 'G',
    DOP: 'RD$',
    CUP: '₱',
    XPF: '₣',
    // Crypto
    BTC: '₿',
    ETH: 'Ξ',
  };

  return currencySymbols[currencyCode] || currencyCode;
}
