export const categoriesKeyFactory = {
  categories: 'categories',
  category: (id: string) => ['category', id],
  subcategories: (parentId: string) => ['subcategories', parentId],
} as const;
