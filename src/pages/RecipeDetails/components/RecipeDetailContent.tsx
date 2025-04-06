import React from 'react';
import { observer } from 'mobx-react-lite';
import type { RecipeDetails } from '@typings/recipe';
import Text from '@components/Text';
import s from '../RecipeDetails.module.scss';

type RecipeDetailContentProps = {
  recipe: RecipeDetails;
};

export const RecipeDetailContent: React.FC<RecipeDetailContentProps> = observer(({ recipe }) => {
  return (
    <div className={s.recipeContent}>
      <div className={s.recipeSummary}>
        <Text tag="h2" view="p-20" weight="medium" className={s.sectionTitle}>
          About this recipe
        </Text>
         <div className={s.summaryText} dangerouslySetInnerHTML={{ __html: recipe.summary }} />
      </div>

      <div className={s.recipeIngredients}>
        <Text tag="h2" view="p-20" weight="medium" className={s.sectionTitle}>
          Ingredients
        </Text>
        <ul className={s.ingredientsList}>
          {recipe.extendedIngredients.map((ingredient, index) => (
            <li key={index} className={s.ingredientItem}>
              <Text view="p-16">{ingredient.original}</Text>
            </li>
          ))}
        </ul>
      </div>

      {recipe.analyzedInstructions.length > 0 ? (
        <div className={s.recipeInstructions}>
          <Text tag="h2" view="p-20" weight="medium" className={s.sectionTitle}>
            Instructions
          </Text>
          <ol className={s.instructionsList}>
            {recipe.analyzedInstructions[0].steps.map((step) => (
              <li key={step.number} className={s.instructionItem}>
                <Text view="p-16" className={s.instructionStep}>
                  <span className={s.stepNumber}>{step.number}.</span> {step.step}
                </Text>
              </li>
            ))}
          </ol>
        </div>
      ) : recipe.instructions ? (
        <div className={s.recipeInstructions}>
          <Text tag="h2" view="p-20" weight="medium" className={s.sectionTitle}>
            Instructions
          </Text>
           <div className={s.instructionsText} dangerouslySetInnerHTML={{ __html: recipe.instructions }}/>
        </div>
      ) : null}
    </div>
  );
});