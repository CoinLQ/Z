const confidence = {
    state: {
        focusedItem: null,
    },
    mutations: {
        setFocusItem (state, payload) {
            if (state.focusedItem) {
                state.focusedItem.resetFocus();
            }
            state.focusedItem = payload.item;
        },

        setNewRect (state, payload) {
            if (state.focusedItem) {
                state.focusedItem.rect = payload.rect;
                state.focusedItem.updateClip(payload.rect);
            }
        }
    }
};

export default confidence;