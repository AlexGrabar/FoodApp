import type { SortOptionType, RecipeSortOption } from '@typings/recipe';
import { Option } from '@components/MultiDropdown';

export const API = {
    BASE_URL: 'https://api.spoonacular.com',
    ENDPOINTS: {
      RECIPES: '/recipes/complexSearch',
      RECIPE_DETAILS: (id: number) => `/recipes/${id}/information`,
      RANDOM_RECIPES: '/recipes/random',
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

  export const SORT_OPTIONS: SortOptionType[] = [
      { key: 'popularity', value: 'Popularity' },
      { key: 'healthiness', value: 'Healthiness' },
      { key: 'price', value: 'Price' },
      { key: 'time', value: 'Ready Time' },
      { key: 'calories', value: 'Calories' },
      { key: 'protein', value: 'Protein' },
  ];

  export const DIET_OPTIONS: Option[] = [
      { key: 'Gluten Free', value: 'Gluten Free' },
      { key: 'Ketogenic', value: 'Ketogenic' },
      { key: 'Vegetarian', value: 'Vegetarian' },
      { key: 'Lacto-Vegetarian', value: 'Lacto-Vegetarian' },
      { key: 'Ovo-Vegetarian', value: 'Ovo-Vegetarian' },
      { key: 'Vegan', value: 'Vegan' },
      { key: 'Pescetarian', value: 'Pescetarian' },
      { key: 'Paleo', value: 'Paleo' },
      { key: 'Primal', value: 'Primal' },
      { key: 'Low FODMAP', value: 'Low FODMAP' },
      { key: 'Whole30', value: 'Whole30' },
  ];

  export const CUISINE_OPTIONS: Option[] = [
    { key: 'African', value: 'African' },
    { key: 'Asian', value: 'Asian' },
    { key: 'American', value: 'American' },
    { key: 'British', value: 'British' },
    { key: 'Cajun', value: 'Cajun' },
    { key: 'Caribbean', value: 'Caribbean' },
    { key: 'Chinese', value: 'Chinese' },
    { key: 'Eastern European', value: 'Eastern European' },
    { key: 'European', value: 'European' },
    { key: 'French', value: 'French' },
    { key: 'German', value: 'German' },
    { key: 'Greek', value: 'Greek' },
    { key: 'Indian', value: 'Indian' },
    { key: 'Irish', value: 'Irish' },
    { key: 'Italian', value: 'Italian' },
    { key: 'Japanese', value: 'Japanese' },
    { key: 'Jewish', value: 'Jewish' },
    { key: 'Korean', value: 'Korean' },
    { key: 'Latin American', value: 'Latin American' },
    { key: 'Mediterranean', value: 'Mediterranean' },
    { key: 'Mexican', value: 'Mexican' },
    { key: 'Middle Eastern', value: 'Middle Eastern' },
    { key: 'Nordic', value: 'Nordic' },
    { key: 'Southern', value: 'Southern' },
    { key: 'Spanish', value: 'Spanish' },
    { key: 'Thai', value: 'Thai' },
    { key: 'Vietnamese', value: 'Vietnamese' },
  ];

export type { RecipeSortOption };