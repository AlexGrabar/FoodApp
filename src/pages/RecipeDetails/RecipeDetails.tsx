import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { RecipeDetailsStore } from '@/store/RecipeDetailsStore';
import Text from '@components/Text';
import Button from '@components/Button';
import Loader from '@components/Loader';
import Input from '@components/Input';
import { RecipeDetailHeader } from './components/RecipeDetailHeader';
import { RecipeDetailContent } from './components/RecipeDetailContent';
import s from './RecipeDetails.module.scss';
import { useLocalStore } from '@/hooks/useLocalStore';
import type { Ingredient } from '@typings/recipe';

const RecipeDetails: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const recipeDetailsStore = useLocalStore(() => new RecipeDetailsStore());
  const [desiredServings, setDesiredServings] = useState<number>(0);
  const [servingsInput, setServingsInput] = useState<string>('');

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
    setDesiredServings(0);
    setServingsInput('');
  }, [id, recipeDetailsStore]);

  useEffect(() => {
      if (recipeDetailsStore.recipe && desiredServings === 0) {
          const initialServings = recipeDetailsStore.recipe.servings;
          setDesiredServings(initialServings);
          setServingsInput(String(initialServings));
      }
  }, [recipeDetailsStore.recipe, desiredServings]);

  const scaledIngredients = useMemo((): Ingredient[] => {
      if (!recipeDetailsStore.recipe || desiredServings <= 0) {
          return recipeDetailsStore.recipe?.extendedIngredients || [];
      }
      const originalServings = recipeDetailsStore.recipe.servings;
      if (originalServings <= 0) return recipeDetailsStore.recipe.extendedIngredients;

      const scaleFactor = desiredServings / originalServings;

      return recipeDetailsStore.recipe.extendedIngredients.map(ingredient => ({
          ...ingredient,
          amount: ingredient.amount * scaleFactor,
      }));
  }, [recipeDetailsStore.recipe, desiredServings]);


  const handleServingsInputChange = useCallback((value: string) => {
      setServingsInput(value);
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue > 0) {
          setDesiredServings(numValue);
      } else if (value === '') {
      }
  }, []);


  const handleBackClick = () => { navigate(-1); };

  if (recipeDetailsStore.isLoading || (recipeDetailsStore.recipe && desiredServings === 0)) {
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
      <RecipeDetailHeader recipe={recipe}>
         <div className={s.metadataItem}>
            <Text view="p-14" color="secondary" className={s.metadataLabel}>
                Adjust Servings
            </Text>
            <div className={s.servingsControlContainer}>
                 <Input
                     type="number"
                     value={servingsInput}
                     onChange={handleServingsInputChange}
                     min="1"
                     step="1"
                     className={s.servingsInput}
                     aria-label="Number of servings"
                 />
             </div>
         </div>
      </RecipeDetailHeader>

      <RecipeDetailContent
         recipe={recipe}
         servings={desiredServings > 0 ? desiredServings : recipe.servings}
         scaledIngredients={scaledIngredients}
      />
    </div>
  );
});

export default RecipeDetails;