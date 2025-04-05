import React from 'react';
import Text from '@components/Text';
import s from '../RecipeList.module.scss';

export const RecipeListHeader: React.FC = () => {
    return (
         <div className={s.header}>
            <Text tag="h1" view="title" className={s.title}>
                Discover Delicious Recipes
            </Text>
            <Text view="p-16" className={s.subtitle}>
                Find your favorite recipes and learn how to cook amazing meals
            </Text>
        </div>
    );
}