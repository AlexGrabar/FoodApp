import React, { memo } from 'react';
import cn from 'classnames';
import Text from '@components/Text';
import s from './Card.module.scss';

export type CardProps = {
  className?: string;
  image: string;
  captionSlot?: React.ReactNode;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  contentSlot?: React.ReactNode;
  onClick?: React.MouseEventHandler;
  actionSlot?: React.ReactNode;
};

const Card: React.FC<CardProps> = ({
  className,
  image,
  captionSlot,
  title,
  subtitle,
  contentSlot,
  onClick,
  actionSlot
}) => {
  const cardClasses = cn(s.card, className);

  return (
    <div className={cn(s.card, className)} onClick={onClick}>
      <div className={s.cardHeader}>
        <img src={image} alt="" className={s.cardImage} />
      </div>
      <div className={s.cardBody}>
        <div className={s.cardContent}>
          {captionSlot && (
            <div className={s.cardCaption}>
              {captionSlot}
            </div>
          )}
          <Text 
            view="p-20" 
            weight="medium" 
            className={s.cardTitle} 
            maxLines={2}
          >
            {title}
          </Text>
          <Text 
            view="p-16" 
            weight="normal" 
            className={s.cardSubtitle} 
            maxLines={3}
          >
            {subtitle}
          </Text>
        </div>
        
        {(contentSlot || actionSlot) && (
          <div className={s.cardFooter}>
            {contentSlot && (
              <div className={s.cardContentSlot}>
                {contentSlot}
              </div>
            )}
            {actionSlot && (
              <div className={s.cardActionSlot}>
                {actionSlot}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;