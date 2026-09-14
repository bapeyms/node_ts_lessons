export const getItemsBySearch = <T>(
    value: string, 
    items: T[], 
    getValue: (item: T) => string): T[] | null => {

    // trim() - видаляє пробіли
    const filteredItems = items.filter(item =>
        getValue(item).toLowerCase().trim().includes(value.toLowerCase().trim()));

    if (filteredItems.length > 0) {
        return filteredItems;
    }
    else {
        return null;
    }
};