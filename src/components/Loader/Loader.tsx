import React from 'react';
import classNames from 'classnames';
import styles from './Loader.module.scss';

export type LoaderProps = {
  size?: 's' | 'm' | 'l';
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Loader: React.FC<LoaderProps> = ({ size = 'm', className, ...rest }) => {
  return (
    <div 
      className={classNames(
        styles.loaderContainer,
        styles[`loaderContainer_size_${size}`],
        className
      )}
      {...rest}
    >
      <div className={styles.spinner} />
    </div>
  );
};

export default Loader;