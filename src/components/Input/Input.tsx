import React from 'react';
import classNames from 'classnames';
import s from './Input.module.scss';

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
      s.input,
      className,
      {
        [s.disabled]: disabled
      }
    );

    const inputClassName = classNames(
      s.inputField,
      {
        [s.withAfterSlot]: afterSlot
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
        {afterSlot && <div className={s.inputAfterSlot}>{afterSlot}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;