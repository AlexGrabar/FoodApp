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

export const RecipeListFilters: React.FC = observer(() => {
    const { recipeStore } = useStores();

    const handleSearchChange = (value: string) => {
        recipeStore.setSearchQuery(value);
    };

    const handleTypeChange = (newSelectedTypes: Option[]) => {
        recipeStore.setSelectedTypes(newSelectedTypes);
    };

    const handleApplyFilters = () => {
        recipeStore.applyFiltersAndLoad();
    };

     const getTypeTitle = (types: Option[]) => {
        return types.length === 0
        ? 'Select meal types'
        : types.map((t) => t.value).join(', ');
    };

    return (
        <div className={s.filters}>
            <div className={s.searchBar}>
            <Input
                placeholder="Search recipes..."
                value={recipeStore.currentSearchQuery}
                onChange={handleSearchChange}
                className={s.searchInput}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                disabled={recipeStore.isLoadingList}
            />
            <Button onClick={handleApplyFilters} className={s.searchButton} disabled={recipeStore.isLoadingList}>
                Search
            </Button>
            </div>

            <div className={s.typeFilter}>
            <MultiDropdown
                options={mealTypeOptions}
                value={recipeStore.currentSelectedTypes}
                onChange={handleTypeChange}
                getTitle={getTypeTitle}
                className={s.typeDropdown}
                disabled={recipeStore.isLoadingList}
            />
            <Button onClick={handleApplyFilters} className={s.filterButton} disabled={recipeStore.isLoadingList}>
                Apply Filters
            </Button>
            </div>
        </div>
    );
});