const canvas = {
    state: {
        // for glyph block callback
        focusedItem: null,

        // for data sync between canvas, keyeventopt and mouseeventopt
        curRect: {empty: true},
        rects: [],
        rectsOfDel: [],
        scale: 1,
        image: {empty: true}
    },
    getters: {
        curRect: state => {
            return state.curRect;
        },
        rects: state => {
            return state.rects;
        },
        scale: state => {
            return state.scale;
        },
        image: state => {
            return state.image;
        },
        delRects: state => {
            return state.rectsOfDel;
        }

    },
    mutations: {
        resetAll (state) {
            state.curRect = {empty: true};
            state.rects.length = 0;
            state.scale = 1;
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
                state.focusedItem.updateClip(state.curRect);
            }
        },

        setCurRect(state, payload) {
            state.curRect = payload.rect;
        },

        setRects(state, payload) {
            let rects = _.forEach(_.deepClone(payload.rects), function(rect) {
                if (rect.w<0) {
                    rect.x = rect.x + rect.w
                    rect.w = Math.abs(rect.w)
                }
                if (rect.h<0) {
                    rect.y = rect.y + rect.h
                    rect.h = Math.abs(rect.h)
                }
                if (rect.w <5) {
                    rect.w = 5;
                }
                if (rect.h <5){
                    rect.h = 5;
                }
            }
            );
            state.rects = rects;
        },

        setScale(state, payload) {
            state.scale = payload.scale;
        },

        pushRects(state, payload) {
            state.rects.push(payload.rect);
        },

        pullRect(state, payload) {
            _.pull(state.rects, payload.rect);
        },

        setImage(state, payload) {
            state.image = payload.image;
        },

        setNextCurRect(state, payload) { // TODO: deprecated
            let index = _(state.rects).indexOf(state.curRect) + payload.next;
            let len = state.rects.length;
            index = index < 0 ? 0 : (index >= len ? len - 1 : index);
            state.curRect = state.rects[index];
        },

        setImageAndRects(state, payload) {
            state.rects = payload.rects;
            state.image = payload.image;
            state.curRect = state.rects[0];
        },

        enlargeRect(state, payload) {
            let cur = state.curRect;
            let unit = payload.unit;
            let action = payload.action;

            if (all || action == 'mov-up') {
                cur.y -= unit;
                cur.h += unit;
            }
            if (all || action == 'mov-right') {
                cur.w += unit;
            }
            if (all || action == 'mov-down') {
                cur.h += unit;
            }
            if (all || action == 'mov-left') {
                cur.x -= unit;
                cur.w += unit;
            }

            cur.op = 2; // mark for changed
        },

        shrinkRect(state, payload) {
            let cur = state.curRect;
            let unit = payload.unit;
            let action = payload.action;

            if (all || action == 'mov-up') {
                cur.h -= unit;
            }
            if (all || action == 'mov-right') {
                cur.w -= unit;
                cur.x += unit;
            }
            if (all || action == 'mov-down') {
                cur.y += unit;
                cur.h -= unit;
            }
            if (all || action == 'mov-left') {
                cur.w -= unit;
            }

            cur.op = 2;
        },

        moveRect(state, payload) {
            let cur = state.curRect;
            let unit = payload.unit;
            let action = payload.action;

            if (action == 'mov-up') {
                cur.y -= unit;
            }
            if (action == 'mov-right') {
                cur.x += unit;
            }
            if (action == 'mov-down') {
                cur.y += unit;
            }
            if (action == 'mov-left') {
                cur.x -= unit;
            }

            cur.op = 2;
        },

        correctCurRect(state, payload) {
            let cur = state.curRect;
            // validate and correct rect parameters
            if (cur.x < 0 ) cur.x = 0;
            if (cur.y < 0 ) cur.y = 0;
            if (cur.y + cur.h > state.image.height) cur.y = state.image.height - cur.h;
            if (cur.x + cur.w > state.image.width) cur.x = state.image.width - cur.w;
        },

        deleteCurRect(state, payload) {
            let cur = state.curRect;
            let index = _(state.rects).indexOf(cur)

            cur.op = 3;

            _.pull(state.rects, cur);

            index = index >= state.rects.length? state.rects.length -1 : index;

            state.rectsOfDel.push(cur);

            state.curRect = state.rects[index] || {empty:true};
        }
    },
    actions: {
        handleKeyEvent({commit, state}, payload) {
            let action = payload.action;
            if (_(action).startsWith('scale')) {
                commit('setScale', {scale: parseInt(action[action.length-1])});
                return;
            }

            // TODO: move below code into commits.
            let cur = state.curRect.empty? state.rects[0] : state.curRect;
            if (!cur) return;


            let unit = payload.modify.step ? 10 : 2;
            let all = action == 'drul';

            if (action == 'select') {
                if (cur.kselected) {  // selected by keydown operation
                    cur.kselected = false;
                }
                else {
                    cur.kselected = true;
                }
                return
            }

            // key-mov will change focused rect
            if (!cur.kselected && _.startsWith(action, 'mov')) {

                let next = (action == 'mov-left' || action == 'mov-up') ? -1 : 1;
                let index = _(state.rects).indexOf(state.curRect) + next;
                let len = state.rects.length;
                index = index < 0 ? len + index : (index >= len ? index - len : index);
                state.curRect = state.rects[index];

                return
            }

            if (action == 'delete') {
                commit('deleteCurRect');

                return
            }


            if (payload.modify.enlarge) {
                commit('enlargeRect', {action: action, unit: unit});

            } else if (payload.modify.shrink) {
                commit('shrinkRect', {action: action, unit: unit});

            } else { // Move
                commit('moveRect', {action: action, unit: unit});
            }
            commit('correctCurRect');
            commit('updateItemRect');
        }
    }
};

export default canvas;