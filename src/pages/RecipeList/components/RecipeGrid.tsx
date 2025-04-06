import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import type { RecipeCard as RecipeCardType } from '@typings/recipe';
import Card from '@components/Card';
import Button from '@components/Button';
import s from '../RecipeList.module.scss';

type RecipeGridProps = {
    recipes: RecipeCardType[];
    lastItemRef: (node: HTMLDivElement) => void; 
};

export const RecipeGrid: React.FC<RecipeGridProps> = observer(({ recipes, lastItemRef }) => {
    const navigate = useNavigate();

    const handleRecipeClick = useCallback((id: number) => {
         navigate(`/recipes/${id}`);
    }, [navigate]);

    return (
        <div className={s.grid}>
            {recipes.map((recipe, index) => {
                const isLastElement = recipes.length === index + 1;
                return (
                    <div
                        key={recipe.id}
                        ref={isLastElement ? lastItemRef : null}
                        className={s.gridItem}
                    >
                        <Card
                            image={recipe.image}
                            title={recipe.title}
                            subtitle="Click to see details"
                            onClick={() => handleRecipeClick(recipe.id)}
                            actionSlot={
                                <Button
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    handleRecipeClick(recipe.id);
                                    }}
                                >
                                    View
                                </Button>
                            }
                        />
                    </div>
                );
            })}
        </div>
    );
});