import React, { useCallback, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/store/StoreProvider';
import { RecipeListStore, RecipeListExternalParams } from '@/store/RecipeListStore';
import Text from '@components/Text';
import Loader from '@components/Loader';
import { RecipeListHeader } from './components/RecipeListHeader';
import { RecipeListFilters } from './components/RecipeListFilters';
import { RecipeGrid } from './components/RecipeGrid';
import { useRecipeListSync } from '@/hooks/useRecipeListSync';
import s from './RecipeList.module.scss';

const RecipeList: React.FC = observer(() => {
    const { queryStore } = useStores();
    const [recipeListStore] = useState(() => new RecipeListStore());
    useRecipeListSync({ queryStore, recipeListStore });
    const observerRef = React.useRef<IntersectionObserver | null>(null);
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
        const params: RecipeListExternalParams = {
            query: queryStore.searchQuery || undefined,
            type: queryStore.selectedMealTypes.length > 0 ? queryStore.selectedMealTypes : undefined,
        };
        recipeListStore.loadInitialRecipes(params);
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
             {!recipeListStore.hasMore && !recipeListStore.isLoading && recipeListStore.recipes.length > 0 && ( <div className={s.noResults} style={{ padding: '24px 0' }}><Text view="p-16" color="secondary">You&aposve reached the end!</Text></div> )}
        </div>
    );
});

export default RecipeList;