import React, { useEffect, useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useStores } from '@/store/StoreProvider';
import Text from '@components/Text';
import Loader from '@components/Loader';
import Card from '@components/Card';
import Button from '@components/Button';
import type { RecipeDetails } from '@typings/recipe';
import s from './RandomRecipePage.module.scss';

const RandomRecipePage: React.FC = observer(() => {
    const { apiStore, favoritesStore } = useStores();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState<RecipeDetails | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const fetchRandomRecipe = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setRecipe(null);
        try {
            const randomRecipes = await apiStore.getRandomRecipes();
            if (randomRecipes && randomRecipes.length > 0) {
                setRecipe(randomRecipes[0]);
            } else {
                setError('Could not find a random recipe. Please try again.');
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [apiStore]);

    useEffect(() => {
        fetchRandomRecipe();
    }, [fetchRandomRecipe]);

    const handleRecipeClick = (id: number) => {
        navigate(`/recipes/${id}`);
    };

    const handleToggleFavorite = useCallback((recipeData: RecipeDetails) => {
        const cardData = {
            id: recipeData.id,
            title: recipeData.title,
            image: recipeData.image,
            imageType: recipeData.image.split('.').pop() || 'jpg',
        };
        favoritesStore.toggleFavorite(cardData);
    }, [favoritesStore]);

    return (
        <div className={s.randomRecipePage}>
            <Text tag="h1" view="title" className={s.title}>
                Random Recipe Suggestion
            </Text>

            <div className={s.content}>
                {isLoading && (
                    <div className={s.loaderContainer}>
                        <Loader size="l" />
                    </div>
                )}

                {error && !isLoading && (
                    <Text view="p-18" className={s.error}>
                        Error: {error}
                    </Text>
                )}

                {recipe && !isLoading && !error && (
                    <Card
                        recipe={{
                            id: recipe.id,
                            title: recipe.title,
                            image: recipe.image,
                            imageType: recipe.image.split('.').pop() || 'jpg',
                        }}
                        onClick={() => handleRecipeClick(recipe.id)}
                        isFavorite={favoritesStore.isFavorite(recipe.id)}
                        onToggleFavorite={() => handleToggleFavorite(recipe)}
                        className={s.recipeCard}
                    />
                )}
                <Button
                    onClick={fetchRandomRecipe}
                    disabled={isLoading}
                    className={s.rerollButton}
                >
                    {isLoading ? 'Loading...' : 'Try Another One!'}
                </Button>
            </div>
        </div>
    );
});

export default RandomRecipePage;