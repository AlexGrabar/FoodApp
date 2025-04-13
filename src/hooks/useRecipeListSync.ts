import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QueryStore } from '@/store/QueryStore';
import { RecipeListStore, RecipeListExternalParams } from '@/store/RecipeListStore';

interface UseRecipeListSyncProps {
    queryStore: QueryStore;
    recipeListStore: RecipeListStore;
}

export function useRecipeListSync({ queryStore, recipeListStore }: UseRecipeListSyncProps): void {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialLoadInitiated = useRef(false);
    const lastKnownStoreParamsString = useRef('');

    useEffect(() => {
        if (initialLoadInitiated.current) return;
        initialLoadInitiated.current = true;
        const query = searchParams.get('query');
        const typeString = searchParams.get('type');
        queryStore.setParamsFromUrl(query, typeString);
        const initialParams: RecipeListExternalParams = {
            query: queryStore.searchQuery || undefined,
            type: queryStore.selectedMealTypes.length > 0 ? queryStore.selectedMealTypes : undefined,
        };
        recipeListStore.loadInitialRecipes(initialParams);
        const params = new URLSearchParams();
        if (queryStore.searchQuery) params.set('query', queryStore.searchQuery);
        if (queryStore.selectedTypes.length > 0) params.set('type', queryStore.selectedMealTypes.join(','));
        lastKnownStoreParamsString.current = params.toString();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!initialLoadInitiated.current) return;
        const params = new URLSearchParams();
        if (queryStore.searchQuery) {
            params.set('query', queryStore.searchQuery);
        }
        if (queryStore.selectedTypes.length > 0) {
            params.set('type', queryStore.selectedMealTypes.join(','));
        }
        const newStoreParamsString = params.toString();
        if (newStoreParamsString !== lastKnownStoreParamsString.current) {
            lastKnownStoreParamsString.current = newStoreParamsString;
            if (searchParams.toString() !== newStoreParamsString) {
                 setSearchParams(params, { replace: true });
            }
        }
    }, [queryStore.searchQuery, queryStore.selectedTypes, queryStore.selectedMealTypes, searchParams, setSearchParams, queryStore]);

    useEffect(() => {
        if (!initialLoadInitiated.current) return;
        const currentUrlParamsString = searchParams.toString();
        if (currentUrlParamsString !== lastKnownStoreParamsString.current) {
            const query = searchParams.get('query');
            const typeString = searchParams.get('type');
            queryStore.setParamsFromUrl(query, typeString);
            lastKnownStoreParamsString.current = currentUrlParamsString;
        }
    }, [searchParams, queryStore]);
}