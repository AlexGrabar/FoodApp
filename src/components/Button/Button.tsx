import React from 'react';
import classNames from 'classnames';
import styles from './Button.module.scss';
import Loader from '@components/Loader';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  disabled,
  loading,
  ...rest
}) => {
  const buttonDisabled = disabled || loading;
  
  return (
    <button
      className={classNames(
        styles.button,
        className,
        {
          [styles.buttonLoading]: loading === true,
          [styles.buttonDisabled]: disabled === true
        }
      )}
      disabled={buttonDisabled}
      {...rest}
    >
      {loading === true && <Loader data-testid="loader" size="s" />}
      <span className={styles.buttonText}>{children}</span>
    </button>
  );
};

export default Button;