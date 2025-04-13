import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/store/StoreProvider';
import MultiDropdown from '@components/MultiDropdown';
import type { Option } from '@components/MultiDropdown';
import Input from '@components/Input';
import Button from '@components/Button';
import { MEAL_TYPES } from '@configs/api';
import s from '../RecipeList.module.scss';

const mealTypeOptions: Option[] = MEAL_TYPES.map((type) => ({
    key: type,
    value: type.charAt(0).toUpperCase() + type.slice(1),
}));

type RecipeListFiltersProps = {
    onApplyFilters: () => void;
    isLoading?: boolean;
};

export const RecipeListFilters: React.FC<RecipeListFiltersProps> = observer(({ onApplyFilters, isLoading }) => {
    const { queryStore } = useStores();
    const handleSearchChange = (value: string) => {
        queryStore.setSearchQuery(value);
    };

    const handleTypeChange = (newSelectedTypes: Option[]) => {
        queryStore.setSelectedTypes(newSelectedTypes);
    };

    const handleApplyClick = () => {
        onApplyFilters();
    };

     const getTypeTitle = (types: Option[]) => {
        return types.length === 0
        ? 'Select meal types'
        : types.length > 3
            ? `${types.length} types selected`
            : types.map((t) => t.value).join(', ');
    };

    return (
        <div className={s.filters}>
            <div className={s.searchBar}>
            <Input
                placeholder="Search recipes..."
                value={queryStore.searchQuery}
                onChange={handleSearchChange}
                className={s.searchInput}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyClick()}
                disabled={isLoading}
            />
            </div>

            <div className={s.typeFilter}>
            <MultiDropdown
                options={mealTypeOptions}
                value={queryStore.selectedTypes}
                onChange={handleTypeChange}
                getTitle={getTypeTitle}
                className={s.typeDropdown}
                disabled={isLoading}
            />
            <Button onClick={handleApplyClick} className={s.filterButton} disabled={isLoading}>
                Apply Filters
            </Button>
            </div>
        </div>
    );
});