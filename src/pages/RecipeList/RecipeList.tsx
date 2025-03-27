import React, { useState, useEffect, useRef, useCallback } from 'react'; 
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getRecipes } from '@api/recipes'; 
import { MEAL_TYPES, MealType } from '@configs/api'; 
import { RecipeCard } from '@typings/recipe';
import MultiDropdown, { Option } from '@components/MultiDropdown'; 
import Card from '@components/Card'; 
import Input from '@components/Input'; 
import Button from '@components/Button'; 
import Text from '@components/Text'; 
import Loader from '@components/Loader'; 
import styles from './RecipeList.module.scss';

const mealTypeOptions: Option[] = MEAL_TYPES.map((type) => ({
  key: type,
  value: type.charAt(0).toUpperCase() + type.slice(1),
}));

const RECIPES_PER_PAGE = 12; 

const RecipeList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState<RecipeCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalResults, setTotalResults] = useState(0); // Храним общее количество


  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('query') || '');
  const [selectedTypes, setSelectedTypes] = useState<Option[]>(() => {
    const typesParam = searchParams.get('type');
    if (typesParam) {
      const types = typesParam.split(',');
      return mealTypeOptions.filter((option) => types.includes(option.key));
    }
    return [];
  });


  const observer = useRef<IntersectionObserver>();
  const lastRecipeElementRef = useCallback( 
    (node: HTMLDivElement) => {
      if (loading) return; 
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {       
        if (entries[0].isIntersecting && hasMore && !loading) {
          setOffset((prevOffset) => prevOffset + RECIPES_PER_PAGE); 
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore] 
  );

 
  const updateSearchParams = (query: string, types: Option[]) => {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (types.length > 0) params.set('type', types.map((t) => t.key).join(','));
    setSearchParams(params);
    setRecipes([]);
    setOffset(0);
    setHasMore(true);
    setTotalResults(0); 
  };

 
  const fetchRecipes = useCallback(async (currentOffset: number, isInitialLoad: boolean = false) => {
    setLoading(true);
    setError(null);

    const query = searchParams.get('query') || undefined;
    const typesParam = searchParams.get('type');
    const typeParams = typesParam
      ? (typesParam.split(',') as MealType[])
      : undefined;
    try {
      const response = await getRecipes({
        query: query,
        type: typeParams,
        number: RECIPES_PER_PAGE,
        offset: currentOffset,
      });
      setRecipes((prevRecipes) =>
        isInitialLoad ? response.results : [...prevRecipes, ...response.results]
      );
      setTotalResults(response.totalResults); 
      setHasMore( (currentOffset + response.results.length) < response.totalResults );

    } catch (err) {
      setError('Failed to load recipes. Please try again later.');
      console.error('Error fetching recipes:', err);
      setHasMore(false); 
    } finally {
      setLoading(false);
    }
  }, [searchParams]); 

 
  useEffect(() => {
    setRecipes([]);
    setOffset(0);
    setHasMore(true);
    setTotalResults(0);
    fetchRecipes(0, true); 
  }, [searchParams, fetchRecipes]); 

  useEffect(() => {
    if (offset > 0) {
       fetchRecipes(offset);
    }
  }, [offset, fetchRecipes]); 

  const handleSearch = () => {
    updateSearchParams(searchQuery, selectedTypes);
  };

  const handleTypeChange = (newSelectedTypes: Option[]) => {
    setSelectedTypes(newSelectedTypes);
  };

  const getTypeTitle = (types: Option[]) => {
    return types.length === 0
      ? 'Select meal types'
      : types.map((t) => t.value).join(', ');
  };

  const handleRecipeClick = (id: number) => {
    navigate(`/recipes/${id}`);
  };

  return (
    <div className={styles.recipeList}>
     
      <div className={styles.header}>
        <Text tag="h1" view="title" className={styles.title}>
          Discover Delicious Recipes
        </Text>
        <Text view="p-16" className={styles.subtitle}>
          Find your favorite recipes and learn how to cook amazing meals
        </Text>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBar}>
          <Input
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={setSearchQuery}
            className={styles.searchInput}
          />
          <Button onClick={handleSearch} className={styles.searchButton}>
            Search
          </Button>
        </div>

        <div className={styles.typeFilter}>
          <MultiDropdown
            options={mealTypeOptions}
            value={selectedTypes}
            onChange={handleTypeChange}
            getTitle={getTypeTitle}
            className={styles.typeDropdown}
          />
          <Button onClick={handleSearch} className={styles.filterButton}>
            Apply Filters
          </Button>
        </div>
      </div>

    
      {recipes.length > 0 && (
        <div className={styles.grid}>
          {recipes.map((recipe, index) => {
            if (recipes.length === index + 1) {
              return (
                <div key={recipe.id} ref={lastRecipeElementRef} className={styles.gridItem}>
                  <Card
                    image={recipe.image}
                    title={recipe.title}
                    subtitle="Click to see details"
                    onClick={() => handleRecipeClick(recipe.id)}
                    actionSlot={
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRecipeClick(recipe.id);
                        }}
                      >
                        View
                      </Button>
                    }
                  />
                </div>
              );
            } else {
              return (
                <div key={recipe.id} className={styles.gridItem}>
                  <Card
                    image={recipe.image}
                    title={recipe.title}
                    subtitle="Click to see details"
                    onClick={() => handleRecipeClick(recipe.id)}
                    actionSlot={
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRecipeClick(recipe.id);
                        }}
                      >
                        View
                      </Button>
                    }
                  />
                </div>
              );
            }
          })}
        </div>
      )}

       
       {loading && (
         <div className={styles.loaderContainer}>
           <Loader size="l" />
         </div>
       )}

     
      {error && !loading && (
        <div className={styles.error}>
          <Text color="secondary">{error}</Text>
        </div>
      )}

      
      {!loading && !error && recipes.length === 0 && (
        <div className={styles.noResults}>
          <Text view="p-18" weight="medium">
            No recipes found
          </Text>
          <Text view="p-16" color="secondary">
            Try adjusting your search or filters to find what you&aposre looking for
          </Text>
        </div>
      )}

      
       {!hasMore && !loading && recipes.length > 0 && (
         <div className={styles.noResults} style={{ padding: '24px 0' }}>
           <Text view="p-16" color="secondary">
             No more recipes to load.
           </Text>
         </div>
       )}

    </div>
  );
};

export default RecipeList;