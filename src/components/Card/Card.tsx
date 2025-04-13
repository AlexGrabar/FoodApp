import React from 'react';
import cn from 'classnames';
import Text from '@components/Text';
import s from './Card.module.scss';
import type { RecipeCard as RecipeCardType } from '@typings/recipe';

export type CardProps = {
    className?: string;
    recipe: RecipeCardType;
    captionSlot?: React.ReactNode;
    contentSlot?: React.ReactNode;
    onClick?: React.MouseEventHandler;
    actionSlot?: React.ReactNode;
    isFavorite?: boolean;
    onToggleFavorite?: (recipe: RecipeCardType) => void;
};

const Card: React.FC<CardProps> = ({
    className,
    recipe,
    captionSlot,
    contentSlot,
    onClick,
    actionSlot,
    isFavorite,
    onToggleFavorite,
}) => {
    const cardClasses = cn(s.card, className);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleFavorite?.(recipe);
    };

    return (
        <div className={cardClasses} onClick={onClick}>
            <div className={s.cardHeader}>
                <img src={recipe.image} alt={recipe.title} className={s.cardImage} />
            </div>
            <div className={s.cardBody}>
                <div className={s.cardContent}>
                    {captionSlot && ( <div className={s.cardCaption}>{captionSlot}</div> )}
                    <Text view="p-20" weight="medium" className={s.cardTitle} maxLines={2}>
                        {recipe.title}
                    </Text>
                    <Text view="p-16" weight="normal" className={s.cardSubtitle} maxLines={3}>
                        Click to see details
                    </Text>
                </div>

                <div className={s.cardFooter}>
                    {contentSlot && ( <div className={s.cardContentSlot}>{contentSlot}</div> )}
                    {onToggleFavorite && (
                        <div className={s.cardActionSlot}>
                            <button onClick={handleFavoriteClick} className={s.favoriteButton}>
                                {isFavorite ? 'Unsave' : 'Save'}
                            </button>
                        </div>
                    )}
                    {actionSlot && !onToggleFavorite && ( <div className={s.cardActionSlot}>{actionSlot}</div> )}
                </div>
            </div>
        </div>
    );
};

export default Card;