import React from 'react';
import { observer } from 'mobx-react-lite';
import type { RecipeDetails, Ingredient } from '@typings/recipe';
import Text from '@components/Text';
import Button from '@components/Button';
import { useStores } from '@/store/StoreProvider';
import s from '../RecipeDetails.module.scss';

type RecipeDetailContentProps = {
  recipe: RecipeDetails;
  servings: number;
  scaledIngredients: Ingredient[];
};

export const RecipeDetailContent: React.FC<RecipeDetailContentProps> = observer(
    ({ recipe, servings, scaledIngredients }) => {
    const { shoppingListStore } = useStores();
    const allAdded = shoppingListStore.areAllIngredientsAdded(recipe.extendedIngredients, recipe.id);

    const handleAddAllClick = () => {
        shoppingListStore.addAllItems(recipe.extendedIngredients, recipe);
    };

    return (
        <div className={s.recipeContent}>
             <div className={s.recipeSummary}>
                 <Text tag="h2" view="p-20" weight="medium" className={s.sectionTitle}>
                     About this recipe
                 </Text>
                 <div className={s.summaryText} dangerouslySetInnerHTML={{ __html: recipe.summary }} />
             </div>

            <div className={s.recipeIngredients}>
                <div className={s.ingredientsHeader}>
                    <Text tag="h2" view="p-20" weight="medium" className={s.sectionTitle}>
                        Ingredients
                    </Text>
                     {!allAdded && recipe.extendedIngredients.length > 0 && (
                         <Button
                             onClick={handleAddAllClick}
                             className={s.addAllButton}
                         >
                             Add All to Shopping List
                         </Button>
                     )}
                     <Text view="p-14" color="secondary" className={s.servingsInfo}>
                         Calculated for {servings} {servings === 1 ? 'serving' : 'servings'}
                     </Text>
                </div>

                <ul className={s.ingredientsList}>
                    {scaledIngredients.map((ingredient) => {
                       return (
                            <li key={`${ingredient.id}-${ingredient.originalName}`} className={s.ingredientItem}>
                                <Text view="p-16">
                                    {ingredient.amount % 1 === 0 ? ingredient.amount : ingredient.amount.toFixed(1)}{' '}
                                    {ingredient.unit} {ingredient.nameClean || ingredient.name}
                                </Text>
                            </li>
                       );
                    })}
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