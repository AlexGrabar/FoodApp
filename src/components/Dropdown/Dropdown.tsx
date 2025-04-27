import React, { useState, useEffect, useRef, useCallback } from 'react';
import cn from 'classnames';
import s from './Dropdown.module.scss';

export type DropdownOption<T = string> = {
  key: T;
  value: string;
};

export type DropdownProps<T = string> = {
  options: DropdownOption<T>[];
  value: DropdownOption<T> | null;
  onChange: (selected: DropdownOption<T> | null) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
};

const Dropdown = <T extends string | number>({
  options,
  value,
  onChange,
  disabled = false,
  className,
  placeholder = 'Select an option',
}: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  }, [disabled]);

  const handleOptionClick = (option: DropdownOption<T>) => {
    if (!disabled) {
      onChange(option);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={cn(s.dropdown, className)} ref={rootRef}>
      <div
        className={cn(s.dropdownInput, { [s.disabled]: disabled, [s.dropdownInputOpen]: isOpen })}
        onClick={toggleDropdown}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {value ? (
          <span className={s.dropdownValue}>{value.value}</span>
        ) : (
          <span className={s.dropdownPlaceholder}>{placeholder}</span>
        )}
        <div className={cn(s.dropdownArrow, {[s.dropdownArrowOpen]: isOpen})}>
             <div className={s.dropdownArrowIcon}></div>
        </div>
      </div>

      {isOpen && !disabled && (
        <div className={s.dropdownOptions} role="listbox">
          <div
             key="reset-option"
             className={cn(s.dropdownOption, { [s.dropdownOptionSelected]: value === null })}
             onClick={() => handleOptionClick(null as any)}
             role="option"
             aria-selected={value === null}
          >
             {placeholder}
          </div>
          {options.map((option) => (
            <div
              key={option.key}
              className={cn(s.dropdownOption, {
                [s.dropdownOptionSelected]: value?.key === option.key,
              })}
              onClick={() => handleOptionClick(option)}
              role="option"
              aria-selected={value?.key === option.key}
            >
              {option.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;