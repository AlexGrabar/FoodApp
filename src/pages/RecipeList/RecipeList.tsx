import React, { useEffect, useRef, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useSearchParams } from 'react-router-dom';
import { useStores } from '@/store/StoreProvider';
import Text from '@components/Text';
import Loader from '@components/Loader';
import { RecipeListHeader } from './components/RecipeListHeader';
import { RecipeListFilters } from './components/RecipeListFilters'; 
import { RecipeGrid } from './components/RecipeGrid'; 
import s from './RecipeList.module.scss';


const RecipeList: React.FC = observer(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { recipeStore } = useStores();
  const observer = useRef<IntersectionObserver>();
  const lastRecipeElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (recipeStore.isLoadingList) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && recipeStore.hasMore) {
          recipeStore.loadMoreRecipes();
        }
      });
      if (node) observer.current.observe(node);
    },
    [recipeStore] 
  );
   useEffect(() => {
     const query = searchParams.get('query');
     const typeString = searchParams.get('type');
     if (recipeStore.recipes.length === 0 || query !== recipeStore.appliedSearchQuery || typeString !== recipeStore.appliedTypes.join(',')) {
         recipeStore.initializeFromUrlParams(query, typeString);
     }
   }, []);

   useEffect(() => {
     const params = new URLSearchParams();
     if (recipeStore.appliedSearchQuery) {
       params.set('query', recipeStore.appliedSearchQuery);
     }
     if (recipeStore.appliedTypes.length > 0) {
       params.set('type', recipeStore.appliedTypes.join(','));
     }
     if (searchParams.toString() !== params.toString()) {
         setSearchParams(params, { replace: true });
     }
   }, [recipeStore.appliedSearchQuery, recipeStore.appliedTypes, setSearchParams, searchParams]);


  return (
    <div className={s.recipeList}>
      <RecipeListHeader />
      <RecipeListFilters />
      
      {recipeStore.recipes.length > 0 && (
         <RecipeGrid recipes={recipeStore.recipes} lastItemRef={lastRecipeElementRef} />
      )}

      {recipeStore.isLoadingList && (
        <div className={s.loaderContainer}>
          <Loader size="l" />
        </div>
      )}

      {recipeStore.errorList && !recipeStore.isLoadingList && recipeStore.recipes.length === 0 && (
        <div className={s.error}>
          <Text color="secondary">{recipeStore.errorList}</Text>
        </div>
      )}

      {!recipeStore.isLoadingList && !recipeStore.errorList && recipeStore.recipes.length === 0 && (
        <div className={s.noResults}>
          <Text view="p-18" weight="medium">
            No recipes found
          </Text>
          <Text view="p-16" color="secondary">
            Try adjusting your search or filters to find what you're looking for
          </Text>
        </div>
      )}

      {!recipeStore.hasMore && !recipeStore.isLoadingList && recipeStore.recipes.length > 0 && (
        <div className={s.noResults} style={{ padding: '24px 0' }}>
          <Text view="p-16" color="secondary">
            No more recipes to load.
          </Text>
        </div>
      )}
    </div>
  );
});

export default RecipeList;