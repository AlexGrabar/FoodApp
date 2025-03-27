import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import Input from '@components/Input';
import styles from './MultiDropdown.module.scss';

export type Option = {
  key: string;
  value: string;
};

export type MultiDropdownProps = {
  className?: string;
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  disabled?: boolean;
  getTitle: (value: Option[]) => string;
};

const MultiDropdown: React.FC<MultiDropdownProps> = ({
  className,
  options,
  value,
  onChange,
  disabled,
  getTitle
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFilterText('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isSelected = (option: Option) => {
    return value.some(item => item.key === option.key);
  };

  const handleOptionSelect = (option: Option) => {
    if (disabled) return;
    
    let newValue;
    if (isSelected(option)) {
      newValue = value.filter(item => item.key !== option.key);
    } else {
      newValue = [...value, option];
    }
    
    onChange(newValue);
  };

  const handleInputChange = (text: string) => {
    setFilterText(text);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleInputClick = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  const title = getTitle(value);
  
  const inputValue = value.length === 0 ? filterText : (filterText ? filterText : title);
  const placeholder = value.length === 0 ? title : '';

  const filteredOptions = options.filter(option => {
    if (!filterText) return true;
    return option.value.toLowerCase().includes(filterText.toLowerCase());
  });

  return (
    <div 
      ref={dropdownRef}
      className={classNames(styles.multiDropdown, className)}
    >
      <div onClick={handleInputClick} className={styles.multiDropdownInput}>
        <Input 
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          afterSlot={
            <div className={styles.multiDropdownArrow}>
              <div className={styles.multiDropdownArrowIcon}></div>
            </div>
          }
        />
      </div>
      
      {isOpen && !disabled && (
        <div className={styles.multiDropdownOptions}>
          {filteredOptions.map(option => (
            <div
              key={option.key}
              className={classNames(
                styles.multiDropdownOption,
                {
                  [styles.multiDropdownOptionSelected]: isSelected(option),
                  [styles.multiDropdownOptionDisabled]: disabled
                }
              )}
              onClick={() => handleOptionSelect(option)}
            >
              {option.value}
            </div>
          ))}
          {filteredOptions.length === 0 && (
            <div className={classNames(styles.multiDropdownOption, styles.multiDropdownOptionDisabled)}>
              Нет совпадений
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiDropdown;