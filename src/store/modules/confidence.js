const confidence = {
    state: {
        focusedItem: null,
        curRect: {},
        rects: [],
        ratio: 4
    },
    getters: {
        curRect: state => {
            return state.curRect;
        },
        rects: state => {
            return state.rects;
        },
        ratio: state => {
            return state.ratio;
        }

    },
    mutations: {
        setFocusItem (state, payload) {
            if (state.focusedItem === payload.item) return;

            if (state.focusedItem) {
                state.focusedItem.resetFocus();
            }
            state.focusedItem = payload.item;
        },

        updateItemRect (state, payload) {
            if (state.focusedItem) {
                state.focusedItem.updateClip(payload.rect);
            }
        },

        setCurRect(state, payload) {
            state.curRect = payload.rect;
        },

        setRects(state, payload) {
            state.rects = payload.rects;
        },

        setRatio(state, payload) {
            state.ratio = payload.ratio;
        },

        pushRects(state, payload) {
            state.rects.push(payload.rect);
        }
    },
    actions: {
        setFocusItem({commit}, payload) {
            commit('setFocusItem', payload);
        },

        setCurRect({commit}, payload) {
            commit('updateItemRect', payload);
            commit('setCurRect', payload)
        }
    }
};

export default confidence;