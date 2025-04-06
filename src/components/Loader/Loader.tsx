import React from 'react';
import cn from 'classnames';
import s from './Loader.module.scss';

export type LoaderProps = {
  size?: 's' | 'm' | 'l';
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Loader: React.FC<LoaderProps> = ({ size = 'm', className, ...rest }) => {
  return (
    <div
      className={cn(
        s.loaderContainer,
        s[`loaderContainer_size_${size}`],
        className
      )}
      {...rest}
    >
      <div className={s.spinner} />
    </div>
  );
};

export default Loader;