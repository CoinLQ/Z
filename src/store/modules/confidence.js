const confidence = {
    state: {
        // for glyph block callback
        focusedItem: null,
            
        // for data sync between canvas, keyeventopt and mouseeventopt
        curRect: {},
        rects: [],
        ratio: 1,
        image: {empty: true}
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
        },
        image: state => {
            return state.image;
        }

    },
    mutations: {
        resetAll (state) {
            state.curRect = {};
            state.rects = [];
            state.ratio = 4;
            state.image = {empty: true};
        },
        
        setFocusItem (state, payload) {
            if (state.focusedItem === payload.item) return;

            if (state.focusedItem) {
                state.focusedItem.resetFocus();
            }
            state.focusedItem = payload.item;
            state.curRect = payload.curRect;
            state.rects = [payload.curRect];
            state.image = payload.image;
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
        },

        setImage(state, payload) {
            state.image = payload.image;
        },

        setNextCurRect(state, payload) {
            let index = _(state.rects).findIndex({cc: state.curRect.cc}) + payload.next;
            let len = state.rects.length;
            index = index < 0 ? 0 : (index >= len ? len - 1 : index);
            state.curRect = state.rects[index];
        },

        setImageAndRects(state, payload) {
            state.rects = payload.rects;
            state.image = payload.image;
            state.curRect = state.rects[0];
        }
    },
    actions: {
        setCurRect({commit}, payload) {
            commit('updateItemRect', payload);
            commit('setCurRect', payload)
        },
    }
};

export default confidence;