import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { RecipeDetailsStore } from '@/store/RecipeDetailsStore';
import Text from '@components/Text';
import Button from '@components/Button';
import Loader from '@components/Loader';
import { RecipeDetailHeader } from './components/RecipeDetailHeader';
import { RecipeDetailContent } from './components/RecipeDetailContent';
import s from './RecipeDetails.module.scss';

const RecipeDetails: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipeDetailsStore] = useState(() => new RecipeDetailsStore());

  useEffect(() => {
    let recipeId: number | undefined = undefined;
    if (id) {
      recipeId = parseInt(id, 10);
      if (!isNaN(recipeId)) {
        recipeDetailsStore.loadRecipeDetails(recipeId);
      } else {
        console.error('Invalid recipe ID in URL:', id);
        recipeDetailsStore.setError("Invalid Recipe ID");
      }
    } else {
         recipeDetailsStore.setError("Recipe ID not provided");
    }
  }, [id, recipeDetailsStore]);

  const handleBackClick = () => { navigate(-1); };
  if (recipeDetailsStore.isLoading) {
    return <div className={s.loaderContainer}><Loader size="l" /></div>;
  }

  if (recipeDetailsStore.error || !recipeDetailsStore.recipe) {
    return (
      <div className={s.error}>
        <Text view="p-18" weight="medium">{recipeDetailsStore.error || 'Recipe not found'}</Text>
        <Button onClick={handleBackClick}>Back to recipes</Button>
      </div>
    );
  }

  const recipe = recipeDetailsStore.recipe;

  return (
    <div className={s.recipeDetails}>
      <Button onClick={handleBackClick} className={s.backButton}>← Back</Button>
      <RecipeDetailHeader recipe={recipe} />
      <RecipeDetailContent recipe={recipe} />
    </div>
  );
});

export default RecipeDetails;