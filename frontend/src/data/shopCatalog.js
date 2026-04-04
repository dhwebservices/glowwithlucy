export const SIZE_PRICES = {
  small: 1800,
  medium: 2400,
  large: 3200,
};

export const DELIVERY_PRICE_PENCE = 320;

export const COLOUR_OPTIONS = [
  { id: "black-grey", label: "Black / Grey" },
  { id: "blue-light", label: "Blue Light" },
  { id: "blue-dark", label: "Blue Dark" },
  { id: "purple", label: "Purple" },
  { id: "pink", label: "Pink" },
  { id: "red", label: "Red" },
  { id: "yellow", label: "Yellow" },
  { id: "orange", label: "Orange" },
  { id: "green-light", label: "Green Light" },
  { id: "green-dark", label: "Green Dark" },
  { id: "olive", label: "Olive" },
  { id: "coral", label: "Coral" },
];

export const SCENT_OPTIONS = [
  { id: "geranium", label: "Geranium" },
  { id: "sandal-wood", label: "Sandal wood" },
  { id: "clary-sage", label: "Clary sage" },
  { id: "cinnamon", label: "Cinnamon" },
  { id: "lemmon-grass", label: "Lemmon grass" },
  { id: "rose", label: "Rose" },
  { id: "patchouli", label: "Patchouli" },
  { id: "bergamot", label: "Bergamot" },
  { id: "tea-tree", label: "Tea tree" },
  { id: "jasmine", label: "Jasmine" },
  { id: "peppermint", label: "Peppermint" },
  { id: "ylang-ylang", label: "Ylang ylang" },
  { id: "camomile", label: "Camomile" },
  { id: "rosemary", label: "Rosemary" },
  { id: "lavender", label: "Lavender" },
  { id: "citronella", label: "Citronella" },
  { id: "vanilla", label: "Vanilla" },
  { id: "sweet-orange", label: "Sweet orange" },
  { id: "eucalyptus", label: "Eucalyptus" },
  { id: "frankincense", label: "Frankincense" },
];

export const SHOP_PRODUCTS = [
  {
    id: 101,
    slug: "heart-bears",
    name: "Heart Bears",
    subtitle: "A playful sculpted candle for gifting and shelves.",
    description:
      "Choose your bear shape, colour, and scent to build a candle that feels personal from the moment it arrives.",
    imageUrl: "/assets/site/candle-small.jpg",
    sizes: [
      {
        id: "small",
        label: "Small",
        dimensions: "4.9cm by 3.9cm by 5.9cm",
        pricePence: SIZE_PRICES.small,
      },
      {
        id: "medium",
        label: "Medium",
        dimensions: "6.5cm by 5.5cm by 8cm",
        pricePence: SIZE_PRICES.medium,
      },
      {
        id: "large",
        label: "Large",
        dimensions: "8cm by 6.5cm by 7cm",
        pricePence: SIZE_PRICES.large,
      },
    ],
  },
  {
    id: 102,
    slug: "rose",
    name: "Rose",
    subtitle: "A floral silhouette with a soft, romantic finish.",
    description:
      "Rose candles bring a delicate profile to bedside tables, dressing areas, and thoughtful gift boxes.",
    imageUrl: "/assets/site/candle-medium.jpg",
    sizes: [
      {
        id: "small",
        label: "Small",
        dimensions: "4cm by 2.8cm",
        pricePence: SIZE_PRICES.small,
      },
      {
        id: "medium",
        label: "Medium",
        dimensions: "5.6cm by 4cm",
        pricePence: SIZE_PRICES.medium,
      },
      {
        id: "large",
        label: "Large",
        dimensions: "7cm by 5cm",
        pricePence: SIZE_PRICES.large,
      },
    ],
  },
  {
    id: 103,
    slug: "spirals",
    name: "Spirals",
    subtitle: "An architectural spiral shape with a modern finish.",
    description:
      "This twisted style works beautifully as a statement piece, especially in layered colour palettes.",
    imageUrl: "/assets/site/candle-large.jpg",
    sizes: [
      {
        id: "small",
        label: "Small",
        dimensions: "5.7cm by 6cm",
        pricePence: SIZE_PRICES.small,
      },
      {
        id: "medium",
        label: "Medium",
        dimensions: "7.2cm by 7.5cm",
        pricePence: SIZE_PRICES.medium,
      },
      {
        id: "large",
        label: "Large",
        dimensions: "9cm by 8.9cm",
        pricePence: SIZE_PRICES.large,
      },
    ],
  },
  {
    id: 104,
    slug: "bubble-cubes",
    name: "Bubble Cubes",
    subtitle: "A cube-circle mould with a bold, tactile shape.",
    description:
      "Bubble cubes add a sculptural feel to coffee tables and gifting sets, with compact or fuller sizing.",
    imageUrl: "/assets/site/candle-medium.jpg",
    sizes: [
      {
        id: "small",
        label: "Small",
        dimensions: "4cm by 4cm",
        pricePence: SIZE_PRICES.small,
      },
      {
        id: "large",
        label: "Large",
        dimensions: "6cm by 6cm",
        pricePence: SIZE_PRICES.large,
      },
    ],
  },
];

export function getProductById(productId) {
  return SHOP_PRODUCTS.find((product) => product.id === Number(productId)) || null;
}

export function getProductBySlug(slug) {
  return SHOP_PRODUCTS.find((product) => product.slug === String(slug || "").trim()) || null;
}

export function getSizeOption(product, sizeId) {
  if (!product) return null;
  return product.sizes.find((size) => size.id === sizeId) || null;
}

export function getColourOption(colourId) {
  return COLOUR_OPTIONS.find((colour) => colour.id === colourId) || null;
}

export function getScentOption(scentId) {
  return SCENT_OPTIONS.find((scent) => scent.id === scentId) || null;
}

export function buildCartItemId({ productId, sizeId, colourId, scentId }) {
  return [productId, sizeId, colourId, scentId].join(":");
}

export function formatSizeLabel(size) {
  return `${size.label} · ${size.dimensions}`;
}
