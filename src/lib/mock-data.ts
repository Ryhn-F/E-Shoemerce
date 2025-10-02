// Mock data for development when database connection is unstable
// This data matches the new eCommerce schema structure

export const mockGenders = [
  { id: "550e8400-e29b-41d4-a716-446655440201", label: "Men", slug: "men" },
  { id: "550e8400-e29b-41d4-a716-446655440202", label: "Women", slug: "women" },
  { id: "550e8400-e29b-41d4-a716-446655440203", label: "Kids", slug: "kids" },
  { id: "550e8400-e29b-41d4-a716-446655440204", label: "Unisex", slug: "unisex" },
];

export const mockColors = [
  { id: "550e8400-e29b-41d4-a716-446655440501", name: "Black", slug: "black", hexCode: "#000000" },
  { id: "550e8400-e29b-41d4-a716-446655440502", name: "White", slug: "white", hexCode: "#FFFFFF" },
  { id: "550e8400-e29b-41d4-a716-446655440503", name: "Red", slug: "red", hexCode: "#FF0000" },
  { id: "550e8400-e29b-41d4-a716-446655440504", name: "Blue", slug: "blue", hexCode: "#0000FF" },
  { id: "550e8400-e29b-41d4-a716-446655440505", name: "Gray", slug: "gray", hexCode: "#808080" },
];

export const mockSizes = [
  { id: "550e8400-e29b-41d4-a716-446655440601", name: "7", slug: "7", sortOrder: 1 },
  { id: "550e8400-e29b-41d4-a716-446655440602", name: "8", slug: "8", sortOrder: 2 },
  { id: "550e8400-e29b-41d4-a716-446655440603", name: "9", slug: "9", sortOrder: 3 },
  { id: "550e8400-e29b-41d4-a716-446655440604", name: "10", slug: "10", sortOrder: 4 },
  { id: "550e8400-e29b-41d4-a716-446655440605", name: "11", slug: "11", sortOrder: 5 },
  { id: "550e8400-e29b-41d4-a716-446655440606", name: "12", slug: "12", sortOrder: 6 },
];

export const mockBrands = [
  { 
    id: "550e8400-e29b-41d4-a716-446655440301", 
    name: "Nike", 
    slug: "nike", 
    logoUrl: "/brands/nike-logo.png",
    createdAt: new Date(),
    updatedAt: new Date()
  },
];

export const mockCategories = [
  { 
    id: "550e8400-e29b-41d4-a716-446655440101", 
    name: "Running", 
    slug: "running", 
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: "550e8400-e29b-41d4-a716-446655440102", 
    name: "Lifestyle", 
    slug: "lifestyle", 
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: "550e8400-e29b-41d4-a716-446655440103", 
    name: "Basketball", 
    slug: "basketball", 
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
];

export const mockCollections = [
  { 
    id: "550e8400-e29b-41d4-a716-446655440701", 
    name: "Air Max Collection", 
    slug: "air-max-collection",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: "550e8400-e29b-41d4-a716-446655440702", 
    name: "Jordan Collection", 
    slug: "jordan-collection",
    createdAt: new Date(),
    updatedAt: new Date()
  },
];

export const mockProducts = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Nike Air Max 270",
    description: "The Nike Air Max 270 delivers visible cushioning under every step with the largest heel Air unit yet.",
    categoryId: "550e8400-e29b-41d4-a716-446655440101", // Running
    genderId: "550e8400-e29b-41d4-a716-446655440201", // Men
    brandId: "550e8400-e29b-41d4-a716-446655440301", // Nike
    isPublished: true,
    defaultVariantId: "550e8400-e29b-41d4-a716-446655440401",
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Nike Air Force 1 '07",
    description: "The radiance lives on in the Nike Air Force 1 '07, the basketball original that puts a fresh spin on what you know best.",
    categoryId: "550e8400-e29b-41d4-a716-446655440102", // Lifestyle
    genderId: "550e8400-e29b-41d4-a716-446655440204", // Unisex
    brandId: "550e8400-e29b-41d4-a716-446655440301", // Nike
    isPublished: true,
    defaultVariantId: "550e8400-e29b-41d4-a716-446655440402",
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Nike React Infinity Run Flyknit 3",
    description: "A running shoe designed to help reduce injury and keep you on the run. More foam and improved upper details provide a secure and cushioned feel.",
    categoryId: "550e8400-e29b-41d4-a716-446655440101", // Running
    genderId: "550e8400-e29b-41d4-a716-446655440202", // Women
    brandId: "550e8400-e29b-41d4-a716-446655440301", // Nike
    isPublished: true,
    defaultVariantId: "550e8400-e29b-41d4-a716-446655440403",
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "Nike Dunk Low Retro",
    description: "Created for the hardwood but taken to the streets, the '80s b-ball icon returns with classic details and throwback hoops flair.",
    categoryId: "550e8400-e29b-41d4-a716-446655440102", // Lifestyle
    genderId: "550e8400-e29b-41d4-a716-446655440201", // Men
    brandId: "550e8400-e29b-41d4-a716-446655440301", // Nike
    isPublished: true,
    defaultVariantId: "550e8400-e29b-41d4-a716-446655440404",
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "Nike Air Max 90 SE",
    description: "Nothing as fly, nothing as comfortable, nothing as proven. The Nike Air Max 90 stays true to its OG running roots.",
    categoryId: "550e8400-e29b-41d4-a716-446655440101", // Running
    genderId: "550e8400-e29b-41d4-a716-446655440202", // Women
    brandId: "550e8400-e29b-41d4-a716-446655440301", // Nike
    isPublished: true,
    defaultVariantId: "550e8400-e29b-41d4-a716-446655440405",
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    name: "Nike Blazer Low '77 Jumbo",
    description: "The Nike Blazer Low '77 Jumbo channels vintage style back onto the streets while its padded, low-cut collar lets you take your game anywhere.",
    categoryId: "550e8400-e29b-41d4-a716-446655440102", // Lifestyle
    genderId: "550e8400-e29b-41d4-a716-446655440202", // Women
    brandId: "550e8400-e29b-41d4-a716-446655440301", // Nike
    isPublished: true,
    defaultVariantId: "550e8400-e29b-41d4-a716-446655440406",
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    name: "Nike SB Zoom Janoski OG+",
    description: "The Nike SB Zoom Janoski OG+ brings back the iconic skate shoe with updated comfort and style.",
    categoryId: "550e8400-e29b-41d4-a716-446655440102", // Lifestyle
    genderId: "550e8400-e29b-41d4-a716-446655440201", // Men
    brandId: "550e8400-e29b-41d4-a716-446655440301", // Nike
    isPublished: true,
    defaultVariantId: "550e8400-e29b-41d4-a716-446655440407",
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440008",
    name: "Jordan Series ES",
    description: "Inspired by the original AJ1, the Jordan Series ES offers classic Jordan DNA in a fresh, modern package.",
    categoryId: "550e8400-e29b-41d4-a716-446655440103", // Basketball
    genderId: "550e8400-e29b-41d4-a716-446655440201", // Men
    brandId: "550e8400-e29b-41d4-a716-446655440301", // Nike
    isPublished: true,
    defaultVariantId: "550e8400-e29b-41d4-a716-446655440408",
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440009",
    name: "Nike Legend Essential 3 Next Nature",
    description: "Versatile and durable, the Nike Legend Essential 3 supports all your workouts with a flexible design.",
    categoryId: "550e8400-e29b-41d4-a716-446655440101", // Running
    genderId: "550e8400-e29b-41d4-a716-446655440203", // Kids
    brandId: "550e8400-e29b-41d4-a716-446655440301", // Nike
    isPublished: true,
    defaultVariantId: "550e8400-e29b-41d4-a716-446655440409",
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
  },
];

export const mockProductVariants = [
  {
    id: "550e8400-e29b-41d4-a716-446655440401",
    productId: "550e8400-e29b-41d4-a716-446655440001",
    sku: "AIRMAX270-BK-9",
    price: "150.00",
    salePrice: null,
    colorId: "550e8400-e29b-41d4-a716-446655440501", // Black
    sizeId: "550e8400-e29b-41d4-a716-446655440603", // 9
    inStock: 25,
    weight: 1.5,
    dimensions: { length: 12.5, width: 4.2, height: 5.1 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440402",
    productId: "550e8400-e29b-41d4-a716-446655440002",
    sku: "AF1-WH-10",
    price: "110.00",
    salePrice: null,
    colorId: "550e8400-e29b-41d4-a716-446655440502", // White
    sizeId: "550e8400-e29b-41d4-a716-446655440604", // 10
    inStock: 30,
    weight: 1.3,
    dimensions: { length: 12.8, width: 4.1, height: 4.9 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440403",
    productId: "550e8400-e29b-41d4-a716-446655440003",
    sku: "REACT-BK-9",
    price: "160.00",
    salePrice: "136.00",
    colorId: "550e8400-e29b-41d4-a716-446655440501", // Black
    sizeId: "550e8400-e29b-41d4-a716-446655440603", // 9
    inStock: 20,
    weight: 1.4,
    dimensions: { length: 12.3, width: 4.0, height: 5.2 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440404",
    productId: "550e8400-e29b-41d4-a716-446655440004",
    sku: "DUNK-WH-10",
    price: "100.00",
    salePrice: null,
    colorId: "550e8400-e29b-41d4-a716-446655440502", // White
    sizeId: "550e8400-e29b-41d4-a716-446655440604", // 10
    inStock: 15,
    weight: 1.2,
    dimensions: { length: 12.0, width: 4.0, height: 4.8 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440405",
    productId: "550e8400-e29b-41d4-a716-446655440005",
    sku: "AM90-RD-8",
    price: "130.00",
    salePrice: "104.00",
    colorId: "550e8400-e29b-41d4-a716-446655440503", // Red
    sizeId: "550e8400-e29b-41d4-a716-446655440602", // 8
    inStock: 18,
    weight: 1.4,
    dimensions: { length: 11.8, width: 4.1, height: 5.0 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440406",
    productId: "550e8400-e29b-41d4-a716-446655440006",
    sku: "BLAZER-BL-9",
    price: "100.00",
    salePrice: null,
    colorId: "550e8400-e29b-41d4-a716-446655440504", // Blue
    sizeId: "550e8400-e29b-41d4-a716-446655440603", // 9
    inStock: 22,
    weight: 1.1,
    dimensions: { length: 11.5, width: 3.9, height: 4.7 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440407",
    productId: "550e8400-e29b-41d4-a716-446655440007",
    sku: "JANOSKI-GR-11",
    price: "85.00",
    salePrice: null,
    colorId: "550e8400-e29b-41d4-a716-446655440505", // Gray
    sizeId: "550e8400-e29b-41d4-a716-446655440605", // 11
    inStock: 12,
    weight: 1.0,
    dimensions: { length: 12.2, width: 3.8, height: 4.5 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440408",
    productId: "550e8400-e29b-41d4-a716-446655440008",
    sku: "JORDAN-BK-10",
    price: "70.00",
    salePrice: null,
    colorId: "550e8400-e29b-41d4-a716-446655440501", // Black
    sizeId: "550e8400-e29b-41d4-a716-446655440604", // 10
    inStock: 28,
    weight: 1.3,
    dimensions: { length: 12.0, width: 4.2, height: 5.0 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440409",
    productId: "550e8400-e29b-41d4-a716-446655440009",
    sku: "LEGEND-WH-7",
    price: "60.00",
    salePrice: null,
    colorId: "550e8400-e29b-41d4-a716-446655440502", // White
    sizeId: "550e8400-e29b-41d4-a716-446655440601", // 7
    inStock: 35,
    weight: 0.9,
    dimensions: { length: 10.5, width: 3.5, height: 4.2 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockProductImages = [
  {
    id: "550e8400-e29b-41d4-a716-446655440801",
    productId: "550e8400-e29b-41d4-a716-446655440001",
    variantId: "550e8400-e29b-41d4-a716-446655440401",
    url: "/shoes/shoe-1.jpg",
    sortOrder: 0,
    isPrimary: true,
    createdAt: new Date(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440802",
    productId: "550e8400-e29b-41d4-a716-446655440002",
    variantId: "550e8400-e29b-41d4-a716-446655440402",
    url: "/shoes/shoe-2.webp",
    sortOrder: 0,
    isPrimary: true,
    createdAt: new Date(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440803",
    productId: "550e8400-e29b-41d4-a716-446655440003",
    variantId: "550e8400-e29b-41d4-a716-446655440403",
    url: "/shoes/shoe-3.webp",
    sortOrder: 0,
    isPrimary: true,
    createdAt: new Date(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440804",
    productId: "550e8400-e29b-41d4-a716-446655440004",
    variantId: "550e8400-e29b-41d4-a716-446655440404",
    url: "/shoes/shoe-4.webp",
    sortOrder: 0,
    isPrimary: true,
    createdAt: new Date(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440805",
    productId: "550e8400-e29b-41d4-a716-446655440005",
    variantId: "550e8400-e29b-41d4-a716-446655440405",
    url: "/shoes/shoe-5.avif",
    sortOrder: 0,
    isPrimary: true,
    createdAt: new Date(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440806",
    productId: "550e8400-e29b-41d4-a716-446655440006",
    variantId: "550e8400-e29b-41d4-a716-446655440406",
    url: "/shoes/shoe-6.avif",
    sortOrder: 0,
    isPrimary: true,
    createdAt: new Date(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440807",
    productId: "550e8400-e29b-41d4-a716-446655440007",
    variantId: "550e8400-e29b-41d4-a716-446655440407",
    url: "/shoes/shoe-7.avif",
    sortOrder: 0,
    isPrimary: true,
    createdAt: new Date(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440808",
    productId: "550e8400-e29b-41d4-a716-446655440008",
    variantId: "550e8400-e29b-41d4-a716-446655440408",
    url: "/shoes/shoe-8.avif",
    sortOrder: 0,
    isPrimary: true,
    createdAt: new Date(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440809",
    productId: "550e8400-e29b-41d4-a716-446655440009",
    variantId: "550e8400-e29b-41d4-a716-446655440409",
    url: "/shoes/shoe-9.avif",
    sortOrder: 0,
    isPrimary: true,
    createdAt: new Date(),
  },
];

// Helper function to get enriched product data with relationships
export function getEnrichedProducts() {
  return mockProducts.map(product => {
    const category = mockCategories.find(c => c.id === product.categoryId);
    const brand = mockBrands.find(b => b.id === product.brandId);
    const gender = mockGenders.find(g => g.id === product.genderId);
    const variants = mockProductVariants.filter(v => v.productId === product.id);
    
    const enrichedVariants = variants.map(variant => {
      const color = mockColors.find(c => c.id === variant.colorId);
      const size = mockSizes.find(s => s.id === variant.sizeId);
      const images = mockProductImages.filter(i => i.variantId === variant.id);
      
      return {
        ...variant,
        color,
        size,
        images,
      };
    });

    return {
      ...product,
      category,
      brand,
      gender,
      variants: enrichedVariants,
    };
  });
}