import React from 'react';
import classNames from 'classnames';
import s from './Button.module.scss';
import Loader from '@components/Loader';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  disabled = false,
  loading = false,
  ...rest
}) => {
  const buttonDisabled = disabled || loading;
  
  return (
    <button
      className={classNames(
        s.button,
        className,
        {
          [s.buttonLoading]: loading,
          [s.buttonDisabled]: disabled
        }
      )}
      disabled={buttonDisabled}
      {...rest}
    >
      {loading && <Loader data-testid="loader" size="s" />}
      <span className={s.buttonText}>{children}</span>
    </button>
  );
};

export default Button;