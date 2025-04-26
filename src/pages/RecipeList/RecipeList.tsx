import React, { useEffect, useCallback, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useSearchParams } from 'react-router-dom';
import { useStores } from '@/store/StoreProvider';
import { RecipeListStore, RecipeListExternalParams } from '@/store/RecipeListStore';
import Text from '@components/Text';
import Loader from '@components/Loader';
import { RecipeListHeader } from './components/RecipeListHeader';
import { RecipeListFilters } from './components/RecipeListFilters';
import { RecipeGrid } from './components/RecipeGrid';
import s from './RecipeList.module.scss';
import { useLocalStore } from '@/hooks/useLocalStore';
import { RecipeSearchParams } from '@/types/recipe';

const RecipeList: React.FC = observer(() => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { queryStore } = useStores();
    const recipeListStore = useLocalStore(() => new RecipeListStore());
    const observerRef = useRef<IntersectionObserver | null>(null);
    const initialLoadDoneRef = useRef(false);
    const getApiParamsFromQueryStore = useCallback((): RecipeSearchParams => {
        const params: RecipeSearchParams = {
            query: queryStore.searchQuery || undefined,
            type: queryStore.selectedMealTypes.length > 0 ? queryStore.selectedMealTypes : undefined,
            sort: queryStore.selectedSort || undefined,
            cuisine: queryStore.selectedCuisineKeys.length > 0 ? queryStore.selectedCuisineKeys : undefined,
            diet: queryStore.selectedDietKeys.length > 0 ? queryStore.selectedDietKeys[0] : undefined,
        };
        return params;
    }, [queryStore]);

    useEffect(() => {
        const paramsChanged = queryStore.setParamsFromUrlIfNeeded(searchParams);
        if (!initialLoadDoneRef.current || paramsChanged) {
            const apiParams = getApiParamsFromQueryStore();
            recipeListStore.loadInitialRecipes(apiParams);
        }
        initialLoadDoneRef.current = true;

    }, [searchParams, queryStore, recipeListStore, getApiParamsFromQueryStore]);

    const handleApplyFilters = useCallback(() => {
        const newParams = new URLSearchParams();
        if (queryStore.searchQuery) newParams.set('query', queryStore.searchQuery);
        if (queryStore.selectedTypes.length > 0) newParams.set('type', queryStore.selectedMealTypes.join(','));
        if (queryStore.selectedSort) newParams.set('sort', queryStore.selectedSort);
        if (queryStore.selectedDiets.length > 0) newParams.set('diet', queryStore.selectedDietKeys.join(','));
        if (queryStore.selectedCuisines.length > 0) newParams.set('cuisine', queryStore.selectedCuisineKeys.join(','));
        setSearchParams(newParams, { replace: true });
        const loadParams = getApiParamsFromQueryStore();
        recipeListStore.loadInitialRecipes(loadParams);

    }, [queryStore, setSearchParams, recipeListStore, getApiParamsFromQueryStore]);

    const lastRecipeElementRef = useCallback((node: HTMLDivElement | null) => {
         if (recipeListStore.isLoading) return;
         if (observerRef.current) observerRef.current.disconnect();

         observerRef.current = new IntersectionObserver((entries) => {
             if (entries[0].isIntersecting && recipeListStore.hasMore) {
                 recipeListStore.loadMoreRecipes();
             }
         });

         if (node) observerRef.current.observe(node);
    }, [recipeListStore]);


    return (
        <div className={s.recipeList}>
            <RecipeListHeader />
            <RecipeListFilters
                onApplyFilters={handleApplyFilters}
                isLoading={recipeListStore.isLoading}
            />
            {recipeListStore.recipes.length > 0 && (
                 <RecipeGrid recipes={recipeListStore.recipes} lastItemRef={lastRecipeElementRef} />
             )}
             {recipeListStore.isInitialLoading && ( <div className={s.loaderContainer}><Loader size="l" /></div> )}
             {recipeListStore.isLoading && !recipeListStore.isInitialLoading && recipeListStore.recipes.length > 0 && ( <div className={s.loaderContainer} style={{ padding: '24px 0' }}><Loader size="m" /></div> )}
             {recipeListStore.error && recipeListStore.isListEmptyAndNotLoading && ( <div className={s.error}><Text color="secondary">{recipeListStore.error}</Text></div> )}
             {recipeListStore.isEmpty && !recipeListStore.error && !recipeListStore.isLoading && ( <div className={s.noResults}><Text view="p-18" weight="medium">No recipes found</Text><Text view="p-16" color="secondary">Try adjusting your search or filters...</Text></div> )}
             {!recipeListStore.hasMore && !recipeListStore.isLoading && recipeListStore.recipes.length > 0 && ( <div className={s.noResults} style={{ padding: '24px 0' }}><Text view="p-16" color="secondary">You've reached the end!</Text></div> )}
        </div>
    );
});

export default RecipeList;