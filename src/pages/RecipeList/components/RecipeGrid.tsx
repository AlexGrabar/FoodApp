import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useStores } from '@/store/StoreProvider';
import type { RecipeCard as RecipeCardType } from '@typings/recipe';
import Card from '@components/Card';
import s from '../RecipeList.module.scss';

type RecipeGridProps = {
    recipes: RecipeCardType[];
    lastItemRef: (node: HTMLDivElement | null) => void;
};

export const RecipeGrid: React.FC<RecipeGridProps> = observer(({ recipes, lastItemRef }) => {
    const navigate = useNavigate();
    const { favoritesStore } = useStores();

    const handleRecipeClick = useCallback((id: number) => { navigate(`/recipes/${id}`); }, [navigate]);
    const handleToggleFavorite = useCallback((recipe: RecipeCardType) => { favoritesStore.toggleFavorite(recipe); }, [favoritesStore]);

    return (
        <div className={s.grid}>
            {recipes.map((recipe, index) => {
                const isLastElement = recipes.length === index + 1;
                const isFavorite = favoritesStore.isFavorite(recipe.id);

                return (
                    <div key={recipe.id} ref={isLastElement ? lastItemRef : null} className={s.gridItem}>
                        <Card
                            recipe={recipe}
                            onClick={() => handleRecipeClick(recipe.id)}
                            isFavorite={isFavorite}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    </div>
                );
            })}
        </div>
    );
});