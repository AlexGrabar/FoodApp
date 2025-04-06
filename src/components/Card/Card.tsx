import React from 'react';
import classNames from 'classnames';
import Text from '@components/Text';
import styles from './Card.module.scss';

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
  const cardClasses = classNames(styles.card, className);

  return (
    <div className={cardClasses} onClick={onClick}>
      <div className={styles.cardHeader}>
        <img src={image} alt="" className={styles.cardImage} />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardContent}>
          {captionSlot && (
            <div className={styles.cardCaption}>
              {captionSlot}
            </div>
          )}
          <Text 
            view="p-20" 
            weight="medium" 
            className={styles.cardTitle} 
            maxLines={2}
          >
            {title}
          </Text>
          <Text 
            view="p-16" 
            weight="normal" 
            className={styles.cardSubtitle} 
            maxLines={3}
          >
            {subtitle}
          </Text>
        </div>
        
        {(contentSlot || actionSlot) && (
          <div className={styles.cardFooter}>
            {contentSlot && (
              <div className={styles.cardContentSlot}>
                {contentSlot}
              </div>
            )}
            {actionSlot && (
              <div className={styles.cardActionSlot}>
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