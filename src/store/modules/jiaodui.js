const jiaodui = {
    state: {
        confidence: {
            focusedItem: null
        }
    },
    mutations: {
        setFocusItem ({confidence: c}, item) {
            if (c.focusedItem) {
                c.focusedItem.resetFocus();
            }
            c.focusedItem = item;
        }
    }
};

export default jiaodui;