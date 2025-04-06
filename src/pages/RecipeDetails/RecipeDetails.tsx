import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeDetails } from '@api/recipes';
import type { RecipeDetails as RecipeDetailsType } from '@typings/recipe'; 
import Text from '@components/Text';
import Button from '@components/Button';
import Loader from '@components/Loader';
import styles from './RecipeDetails.module.scss';

const RecipeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<RecipeDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const recipeId = parseInt(id);
        const recipeData = await getRecipeDetails(recipeId);
        setRecipe(recipeData);
      } catch (err) {
        setError('Failed to load recipe details. Please try again later.');
        console.error('Error fetching recipe details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipeDetails();
  }, [id]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader size="l" />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className={styles.error}>
        <Text view="p-18" weight="medium">
          {error || 'Recipe not found'}
        </Text>
        <Button onClick={handleBackClick}>Back to recipes</Button>
      </div>
    );
  }

  
  return (
    <div className={styles.recipeDetails}>
      <Button onClick={handleBackClick} className={styles.backButton}>
        ← Back to recipes
      </Button>

      
      <Text tag="h1" view="title" className={styles.recipeTitle}>
        {recipe.title}
      </Text>

      
      <div className={styles.recipeTags}>
        {recipe.vegetarian && <span className={styles.recipeTag}>Vegetarian</span>}
        {recipe.vegan && <span className={styles.recipeTag}>Vegan</span>}
        {recipe.glutenFree && <span className={styles.recipeTag}>Gluten Free</span>}
        {recipe.dairyFree && <span className={styles.recipeTag}>Dairy Free</span>}
        {recipe.veryHealthy && <span className={styles.recipeTag}>Healthy</span>}
      </div>

      
      <div className={styles.recipeHeader}>
        <div className={styles.imageContainer}>
          <img src={recipe.image} alt={recipe.title} className={styles.recipeImage} />
        </div>
        <div className={styles.metadataContainer}>
          
          <div className={styles.metadataItem}>
            <Text view="p-14" color="secondary" className={styles.metadataLabel}>
              Total time
            </Text>
            <Text view="p-16" weight="medium" className={styles.metadataValue}>
              {recipe.readyInMinutes} minutes
            </Text>
          </div>
          <div className={styles.metadataItem}>
            <Text view="p-14" color="secondary" className={styles.metadataLabel}>
              Servings
            </Text>
            <Text view="p-16" weight="medium" className={styles.metadataValue}>
              {recipe.servings} servings
            </Text>
          </div>
           <div className={styles.metadataItem}>
            <Text view="p-14" color="secondary" className={styles.metadataLabel}>
              Price/serving
            </Text>
            <Text view="p-16" weight="medium" className={styles.metadataValue}>
              ${(recipe.pricePerServing / 100).toFixed(2)}
            </Text>
          </div>
          <div className={styles.metadataItem}>
            <Text view="p-14" color="secondary" className={styles.metadataLabel}>
              Spoonacular Score
            </Text>
            <Text view="p-16" weight="medium" className={styles.metadataValue}>
              {Math.round(recipe.spoonacularScore)} / 100
            </Text>
          </div>
           <div className={styles.metadataItem}>
            <Text view="p-14" color="secondary" className={styles.metadataLabel}>
              Health Score
            </Text>
            <Text view="p-16" weight="medium" className={styles.metadataValue}>
              {Math.round(recipe.healthScore)} / 100
            </Text>
          </div>
           {recipe.sourceName && (
            <div className={styles.metadataItemWide}> 
              <Text view="p-14" color="secondary" className={styles.metadataLabel}>
                Source
              </Text>
              <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
                 <Text view="p-16" weight="medium">
                    {recipe.sourceName}
                 </Text>
              </a>
            </div>
           )}
        </div>
      </div>

      
      <div className={styles.recipeContent}>
        <div className={styles.recipeSummary}>
          <Text tag="h2" view="p-20" weight="medium" className={styles.sectionTitle}>
            About this recipe
          </Text>
          <div className={styles.summaryText} dangerouslySetInnerHTML={{ __html: recipe.summary }} />
        </div>

        <div className={styles.recipeIngredients}>
          <Text tag="h2" view="p-20" weight="medium" className={styles.sectionTitle}>
            Ingredients
          </Text>
          <ul className={styles.ingredientsList}>
            {recipe.extendedIngredients.map((ingredient, index) => (
              <li key={index} className={styles.ingredientItem}>
                <Text view="p-16">{ingredient.original}</Text>
              </li>
            ))}
          </ul>
        </div>

        {recipe.analyzedInstructions.length > 0 ? (
          <div className={styles.recipeInstructions}>
            <Text tag="h2" view="p-20" weight="medium" className={styles.sectionTitle}>
              Instructions
            </Text>
            <ol className={styles.instructionsList}>
              {recipe.analyzedInstructions[0].steps.map((step) => (
                <li key={step.number} className={styles.instructionItem}>
                  <Text view="p-16" className={styles.instructionStep}>
                    <span className={styles.stepNumber}>{step.number}.</span> {step.step}
                  </Text>
                </li>
              ))}
            </ol>
          </div>
        ) : recipe.instructions ? ( 
          <div className={styles.recipeInstructions}>
            <Text tag="h2" view="p-20" weight="medium" className={styles.sectionTitle}>
              Instructions
            </Text>
            <div className={styles.instructionsText}>
              <Text view="p-16">{stripHtml(recipe.instructions)}</Text>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RecipeDetails;