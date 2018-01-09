const confidence = {
    state: {
        focusedItem: null
    },
    mutations: {
        setFocusItem (c, item) {
            if (c.focusedItem) {
                c.focusedItem.resetFocus();
            }
            c.focusedItem = item;
        }
    }
};

export default confidence;