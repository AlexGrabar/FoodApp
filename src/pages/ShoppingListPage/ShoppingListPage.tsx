import React from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { useStores } from '@/store/StoreProvider';
import Text from '@components/Text';
import Button from '@components/Button';
import s from './ShoppingListPage.module.scss';

const ShoppingListPage: React.FC = observer(() => {
    const { shoppingListStore } = useStores();

    const groupedItems = shoppingListStore.itemsGroupedByRecipe;

    const handleToggle = (itemKey: string) => {
        shoppingListStore.toggleItemAdded(itemKey);
    };

    const handleDelete = (itemKey: string) => {
        shoppingListStore.removeItem(itemKey);
    };

    const handleClearList = () => {
        if (window.confirm('Are you sure you want to clear the entire shopping list?')) {
            shoppingListStore.clearList();
        }
    };

    return (
        <div className={s.shoppingListPage}>
            <div className={s.header}>
                <Text tag="h1" view="title" className={s.title}>Shopping List</Text>
                {shoppingListStore.itemsList.length > 0 && (
                    <Button
                        onClick={handleClearList}
                        className={s.clearButton}
                        title="Clear entire list"
                    >
                        Clear All
                    </Button>
                )}
            </div>

            {shoppingListStore.itemsList.length === 0 ? (
                <Text view="p-18" className={s.emptyMessage}>
                    Your shopping list is empty. Add ingredients from recipes!
                </Text>
            ) : (
                <div>
                    {Array.from(groupedItems.entries()).map(([recipeId, group]) => (
                        <div key={recipeId} className={s.recipeGroup}>
                            <Text tag="h2" className={s.recipeTitle}>
                                <Link to={`/recipes/${recipeId}`}>{group.title}</Link>
                            </Text>
                            <ul className={s.itemList}>
                                {group.items.map((item) => (
                                    <li key={item.key} className={s.item}>
                                        <input
                                            type="checkbox"
                                            checked={item.added}
                                            onChange={() => handleToggle(item.key)}
                                            className={s.checkbox}
                                            aria-label={`Mark ${item.name} as ${item.added ? 'not added' : 'added'}`}
                                        />
                                        <Text className={`${s.itemText} ${item.added ? s.itemTextAdded : ''}`}>
                                            {item.originalString}
                                        </Text>
                                        <button
                                            onClick={() => handleDelete(item.key)}
                                            className={s.deleteButton}
                                            aria-label={`Remove ${item.name}`}
                                            title={`Remove ${item.name}`}
                                        >
                                            ×
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});

export default ShoppingListPage;