import React from 'react';
import classNames from 'classnames';
import styles from './Input.module.scss';

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> & {
  value: string;
  onChange: (value: string) => void;
  afterSlot?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, value, onChange, afterSlot, disabled, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled) {
        onChange(e.target.value);
      }
    };

    const containerClassName = classNames(
      styles.input,
      className,
      {
        [styles.disabled]: disabled
      }
    );

    const inputClassName = classNames(
      styles.inputField,
      {
        [styles.withAfterSlot]: afterSlot
      }
    );

    return (
      <div className={containerClassName}>
        <input
          type="text"
          className={inputClassName}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        {afterSlot && <div className={styles.inputAfterSlot}>{afterSlot}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;