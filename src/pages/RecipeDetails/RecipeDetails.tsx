import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { useStores } from '@/store/StoreProvider';
import Text from '@components/Text';
import Button from '@components/Button';
import Loader from '@components/Loader';
import { RecipeDetailHeader } from './components/RecipeDetailHeader';
import { RecipeDetailContent } from './components/RecipeDetailContent';
import s from './RecipeDetails.module.scss';

const RecipeDetails: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recipeStore } = useStores();

  useEffect(() => {
     if (id) {
      const recipeId = parseInt(id);
      if (!isNaN(recipeId)) {
        recipeStore.loadRecipeDetails(recipeId);
      } else {
        console.error('Invalid recipe ID in URL');
      }
    }
    return () => {
      recipeStore.clearRecipeDetails();
    };
  }, [id, recipeStore]);

  const handleBackClick = () => {
    navigate(-1);
  };

  if (recipeStore.isLoadingDetails) {
    return <div className={s.loaderContainer}><Loader size="l" /></div>;
  }

  if (recipeStore.errorDetails || !recipeStore.currentRecipe) {
    return (
      <div className={s.error}>
        <Text view="p-18" weight="medium">
          {recipeStore.errorDetails || 'Recipe not found'}
        </Text>
        <Button onClick={handleBackClick}>Back to recipes</Button>
      </div>
    );
  }

  const recipe = recipeStore.currentRecipe;

  return (
    <div className={s.recipeDetails}>
      <Button onClick={handleBackClick} className={s.backButton}>
        ← Back to recipes
      </Button>
      <RecipeDetailHeader recipe={recipe} />
      <RecipeDetailContent recipe={recipe} />
    </div>
  );
});

export default RecipeDetails;