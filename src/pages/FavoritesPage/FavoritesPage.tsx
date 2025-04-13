import React from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useStores } from '@/store/StoreProvider';
import Text from '@components/Text';
import Card from '@components/Card';
import Button from '@components/Button';
import s from './FavoritesPage.module.scss';

const FavoritesPage: React.FC = observer(() => {
    const { favoritesStore } = useStores();
    const navigate = useNavigate();

    const handleRecipeClick = (id: number) => {
        navigate(`/recipes/${id}`);
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <div className={s.favoritesPage}>
            <Button onClick={handleBackClick} className={s.backButton}>
                ← Back
            </Button>

            <Text tag="h1" view="title" className={s.title}>
                Favorite Recipes
            </Text>

            {favoritesStore.favoritesList.length > 0 ? (
                <div className={s.grid}>
                    {favoritesStore.favoritesList.map((recipe) => (
                        <div key={recipe.id} className={s.gridItem}>
                            <Card
                                recipe={recipe}
                                onClick={() => handleRecipeClick(recipe.id)}
                                isFavorite={true}
                                onToggleFavorite={() => favoritesStore.removeFavorite(recipe.id)}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <Text view="p-18" className={s.emptyMessage}>
                    I hope you haven&apost saved any favorite recipes yet.
                </Text>
            )}
        </div>
    );
});

export default FavoritesPage;