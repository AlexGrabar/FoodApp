import React from 'react';
import classNames from 'classnames';
import styles from './Text.module.scss';

export type TextProps = {
  className?: string;
  view?: 'title' | 'button' | 'p-20' | 'p-18' | 'p-16' | 'p-14';
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'span';
  weight?: 'normal' | 'medium' | 'bold';
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'accent';
  maxLines?: number;
};

const Text: React.FC<TextProps> = ({
  className,
  view,
  tag = 'p',
  weight,
  children,
  color,
  maxLines,
}) => {
  const Tag = tag;

  let style: React.CSSProperties = {};

  if (maxLines) {
    style = {
      ...style,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: maxLines,
      WebkitBoxOrient: 'vertical',
    };
  }

  return (
    <Tag
      className={classNames(
        styles.text,
        className,
        view && styles[`view${view}`],
        weight && styles[`weight${weight}`],
        color && styles[`color${color}`],
      )}
      style={style}
    >
      {children}
    </Tag>
  );
};

export default Text;