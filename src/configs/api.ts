export const API = {
    BASE_URL: 'https://api.spoonacular.com',
    API_KEY: 'a0a633ad4cf648b0b40e684c819d4050',
    ENDPOINTS: {
      RECIPES: '/recipes/complexSearch',
      RECIPE_DETAILS: (id: number) => `/recipes/${id}/information`,
    },
  };
  
  export const MEAL_TYPES = [
    'main course',
    'side dish',
    'dessert',
    'appetizer',
    'salad',
    'bread',
    'breakfast',
    'soup',
    'beverage',
    'sauce',
    'marinade',
    'fingerfood',
    'snack',
    'drink'
  ] as const;
  
  export type MealType = typeof MEAL_TYPES[number];