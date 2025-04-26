import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/store/StoreProvider';
import MultiDropdown, { Option } from '@components/MultiDropdown';
import Dropdown, { DropdownOption } from '@components/Dropdown';
import Input from '@components/Input';
import Button from '@components/Button';
import { MEAL_TYPES, SORT_OPTIONS, DIET_OPTIONS, CUISINE_OPTIONS, RecipeSortOption } from '@configs/api';
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

    const handleSortChange = (selected: DropdownOption<RecipeSortOption> | null) => {
        queryStore.setSelectedSort(selected?.key ?? null);
    };
    const handleDietChange = (newSelectedDiets: Option[]) => {
        queryStore.setSelectedDiets(newSelectedDiets);
    };
    const handleCuisineChange = (newSelectedCuisines: Option[]) => {
        queryStore.setSelectedCuisines(newSelectedCuisines);
    };

    const handleApplyClick = () => {
        onApplyFilters();
    };
    const getTypeTitle = (types: Option[]) => types.length === 0 ? 'Select meal types' : types.map(t => t.value).join(', ');
    const getDietTitle = (diets: Option[]) => diets.length === 0 ? 'Select diets' : diets.map(d => d.value).join(', ');
    const getCuisineTitle = (cuisines: Option[]) => cuisines.length === 0 ? 'Select cuisines' : cuisines.map(c => c.value).join(', ');

    const selectedSortOption = SORT_OPTIONS.find(opt => opt.key === queryStore.selectedSort) || null;

    return (
        <div className={s.filtersContainer}>
            <div className={s.searchRow}>
                <Input
                    placeholder="Search recipes by name..."
                    value={queryStore.searchQuery}
                    onChange={handleSearchChange}
                    className={s.searchInput}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyClick()}
                    disabled={isLoading}
                />
            </div>
            <div className={s.controlsRow}>
                <MultiDropdown
                    options={mealTypeOptions}
                    value={queryStore.selectedTypes}
                    onChange={handleTypeChange}
                    getTitle={getTypeTitle}
                    className={s.controlItem}
                    disabled={isLoading}
                />
                <MultiDropdown
                    options={DIET_OPTIONS}
                    value={queryStore.selectedDiets}
                    onChange={handleDietChange}
                    getTitle={getDietTitle}
                    className={s.controlItem}
                    disabled={isLoading}
                />
                <MultiDropdown
                    options={CUISINE_OPTIONS}
                    value={queryStore.selectedCuisines}
                    onChange={handleCuisineChange}
                    getTitle={getCuisineTitle}
                    className={s.controlItem}
                    disabled={isLoading}
                />
                <Dropdown<RecipeSortOption>
                    options={SORT_OPTIONS}
                    value={selectedSortOption}
                    onChange={handleSortChange}
                    placeholder="Sort by..."
                    className={s.controlItem}
                    disabled={isLoading}
                />
                <Button
                    onClick={handleApplyClick}
                    className={s.applyButton}
                    disabled={isLoading}
                >
                    Apply
                </Button>
            </div>
        </div>
    );
});