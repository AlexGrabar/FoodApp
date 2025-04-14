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

const RecipeList: React.FC = observer(() => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { queryStore } = useStores();
    const recipeListStore = useLocalStore(() => new RecipeListStore());
    const observerRef = useRef<IntersectionObserver | null>(null);
    const initialUrlProcessed = useRef(false);
    const prevSearchParamsString = useRef(searchParams.toString());

    const loadRecipesFromQueryStore = useCallback(() => {
        const params: RecipeListExternalParams = {
            query: queryStore.searchQuery || undefined,
            type: queryStore.selectedMealTypes.length > 0 ? queryStore.selectedMealTypes : undefined,
        };
        recipeListStore.loadInitialRecipes(params);
    }, [queryStore, recipeListStore]);

    useEffect(() => {
        if (initialUrlProcessed.current) return;
        initialUrlProcessed.current = true;
        const query = searchParams.get('query');
        const typeString = searchParams.get('type');
        queryStore.setParamsFromUrl(query, typeString);

        loadRecipesFromQueryStore();

        prevSearchParamsString.current = searchParams.toString();

    }, [queryStore, recipeListStore, loadRecipesFromQueryStore]);

    useEffect(() => {
        if (!initialUrlProcessed.current) return;
        const params = new URLSearchParams();
        if (queryStore.searchQuery) params.set('query', queryStore.searchQuery);
        if (queryStore.selectedTypes.length > 0) params.set('type', queryStore.selectedMealTypes.join(','));
        const newSearchString = params.toString();
        const currentSearchString = searchParams.toString();

        if (currentSearchString !== newSearchString) {
            setSearchParams(params, { replace: true });
            prevSearchParamsString.current = newSearchString;
        }

    }, [queryStore.searchQuery, queryStore.selectedTypes, queryStore.selectedMealTypes, setSearchParams, searchParams]);

    useEffect(() => {
        if (!initialUrlProcessed.current) return;
        const currentSearchString = searchParams.toString();
        if (currentSearchString !== prevSearchParamsString.current) {
            const query = searchParams.get('query');
            const typeString = searchParams.get('type');
            queryStore.setParamsFromUrl(query, typeString);
            loadRecipesFromQueryStore();
            prevSearchParamsString.current = currentSearchString;
        }
    }, [searchParams, queryStore, loadRecipesFromQueryStore]);

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

    const handleApplyFilters = () => {
        loadRecipesFromQueryStore();
    };

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
             {!recipeListStore.hasMore && !recipeListStore.isLoading && recipeListStore.recipes.length > 0 && ( <div className={s.noResults} style={{ padding: '24px 0' }}><Text view="p-16" color="secondary">You&apos;ve reached the end!</Text></div> )}
        </div>
    );
});

export default RecipeList;