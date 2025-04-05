import React from 'react';
import { observer } from 'mobx-react-lite';
import type { RecipeDetails } from '@typings/recipe';
import Text from '@components/Text';
import s from '../RecipeDetails.module.scss';

type RecipeDetailHeaderProps = {
  recipe: RecipeDetails;
};

export const RecipeDetailHeader: React.FC<RecipeDetailHeaderProps> = observer(({ recipe }) => {
  return (
    <> 
        <Text tag="h1" view="title" className={s.recipeTitle}>
            {recipe.title}
        </Text>
        <div className={s.recipeTags}>
            {recipe.vegetarian && <span className={s.recipeTag}>Vegetarian</span>}
            {recipe.vegan && <span className={s.recipeTag}>Vegan</span>}
            {recipe.glutenFree && <span className={s.recipeTag}>Gluten Free</span>}
            {recipe.dairyFree && <span className={s.recipeTag}>Dairy Free</span>}
            {recipe.veryHealthy && <span className={s.recipeTag}>Healthy</span>}
        </div>

        <div className={s.recipeHeader}>
            <div className={s.imageContainer}>
                <img src={recipe.image} alt={recipe.title} className={s.recipeImage} />
            </div>
            <div className={s.metadataContainer}>
                 <div className={s.metadataItem}>
                    <Text view="p-14" color="secondary" className={s.metadataLabel}>
                    Total time
                    </Text>
                    <Text view="p-16" weight="medium" className={s.metadataValue}>
                    {recipe.readyInMinutes} minutes
                    </Text>
                </div>
                 <div className={s.metadataItem}>
                    <Text view="p-14" color="secondary" className={s.metadataLabel}>
                    Servings
                    </Text>
                    <Text view="p-16" weight="medium" className={s.metadataValue}>
                    {recipe.servings} servings
                    </Text>
                </div>
                <div className={s.metadataItem}>
                    <Text view="p-14" color="secondary" className={s.metadataLabel}>
                    Price/serving
                    </Text>
                    <Text view="p-16" weight="medium" className={s.metadataValue}>
                    ${(recipe.pricePerServing / 100).toFixed(2)}
                    </Text>
                </div>
                <div className={s.metadataItem}>
                    <Text view="p-14" color="secondary" className={s.metadataLabel}>
                    Spoonacular Score
                    </Text>
                    <Text view="p-16" weight="medium" className={s.metadataValue}>
                    {Math.round(recipe.spoonacularScore)} / 100
                    </Text>
                </div>
                <div className={s.metadataItem}>
                    <Text view="p-14" color="secondary" className={s.metadataLabel}>
                    Health Score
                    </Text>
                    <Text view="p-16" weight="medium" className={s.metadataValue}>
                    {Math.round(recipe.healthScore)} / 100
                    </Text>
                </div>
                {recipe.sourceName && (
                    <div className={s.metadataItemWide}>
                    <Text view="p-14" color="secondary" className={s.metadataLabel}>
                        Source
                    </Text>
                    <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className={s.sourceLink}>
                        <Text view="p-16" weight="medium">
                            {recipe.sourceName}
                        </Text>
                    </a>
                    </div>
                )}
            </div>
        </div>
    </>
  );
});