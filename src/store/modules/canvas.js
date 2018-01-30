const canvas = {
    state: {
        // for glyph block callback
        curGlyph: null,

        // for data sync between canvas, keyeventopt and mouseeventopt
        curRect: {empty: true},
        rects: [],
        rectsOfDel: [],
        refRects: [],
        scale: 1,
        image: {empty: true},
        cover: false,
        ctrlPressed: false,
    },
    getters: {
        curRect: state => {
            return state.curRect;
        },
        rects: state => {
            return state.rects;
        },
        solidRects: state => {
            let r = _.forEach(_.cloneDeep(state.rects), function (item) {
                if (item.deleted) item.op = 3;
            })
            return r;
        },
        refRects: state => {
            return state.refRects;
        },
        scale: state => {
            return state.scale;
        },
        image: state => {
            return state.image;
        },
        delRects: state => {
            return state.rectsOfDel;
        },
        curGlyph: state => {
            return state.curGlyph;
        },
        cover: state => {
            return state.cover;
        },
        ctrlPressed: state => {
            return state.ctrlPressed;
        }

    },
    mutations: {
        resetAll (state) {
            state.curRect = {empty: true};
            state.rects.length = 0;
            state.scale = 1;
            state.image = {empty: true};
            state.cover = false;
            state.refRects.length = 0;
        },

        setCurGlyph (state, payload) {
            state.refRects = payload.refRects;
            if (state.curGlyph === payload.glyph) return;

            if (state.curGlyph) {
                state.curGlyph.resetFocus();
            }
            state.curGlyph = payload.glyph;
            state.curRect = payload.curRect;
            state.rects = [payload.curRect];
            state.image = payload.image;
        },

        updateItemRect (state, payload) {
            if (state.curGlyph) {
                state.curGlyph.updateClip(state.curRect);
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

        setScaleForward(state, payload) {
            state.scale += payload.forward
            if (state.scale < 1) state.scale = 1;
            else if (state.scale > 9) state.scale = 9;
        },

        pushRects(state, payload) {
            // here rect was marked as created and not deleted
            state.rects.push(payload.rect);
        },

        pullRect(state, payload) {
            _.pull(state.rects, payload.rect);
        },

        setImage(state, payload) {
            state.image = payload.image;
        },

        setCover(state, payload) {
            state.cover = payload.cover;
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
            let all = payload.all;

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
            let all = payload.all;

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
            if (state.curRect.created) {
                let cur = state.curRect;
                let index = _(state.rects).indexOf(cur)

                _.pull(state.rects, cur);

                index = index >= state.rects.length? state.rects.length -1 : index;

                state.curRect = state.rects[index] || {empty:true};
            } else if (state.curRect.deleted)
                state.curRect.deleted = false;
            else
                state.curRect.deleted = true;
        },

        setCtrlState(state, payload) {
            state.ctrlPressed = payload.press;
            console.log('set ctrlPressed ' + state.ctrlPressed)
        },

        setSelectState(state, payload) {
            let cur = state.curRect;
            if (cur.kselected) {  // selected by keydown operation
                cur.kselected = false;
            }
            else {
                cur.kselected = true;
            }
        },

        shiftCurRect(state, payload) {
            let next = 0;
            let action = payload.action;

            if (action == 'mov-left' || action == 'mov-up') next = -1;
            else if (action == 'mov-right' || action == 'mov-down') next = 1;
            else return

            let index = _(state.rects).indexOf(state.curRect) + next;
            let len = state.rects.length;
            index = index < 0 ? len + index : (index >= len ? index - len : index);
            state.curRect = state.rects[index];
        }
    },
    actions: {
        handleKeyDownEvent({commit, state}, payload) {
            let action = payload.action;
            let cur = state.curRect.empty? state.rects[0] : state.curRect;

            if (!cur) return;

            if (_(action).startsWith('scale')) {
                commit('setScale', {scale: parseInt(action[action.length-1])});
            }

            if (action == 'delete') {
                commit('deleteCurRect');
                commit('updateItemRect');
            }

            if (action == 'noop' && payload.modify.step) {
                commit('setCtrlState', {press: true});
            }

            if (action == 'select') {
                commit('setSelectState');
            }

            if (_(action).startsWith('mov')) {
                let all = action == 'drul';
                let unit = payload.modify.step ? 10 : 2;

                if (!cur.kselected) {
                    commit('shiftCurRect', {action: action});

                } else if (payload.modify.enlarge) {
                    commit('enlargeRect', {action: action, unit: unit, all: all});

                } else if (payload.modify.shrink) {
                    commit('shrinkRect', {action: action, unit: unit, all: all});

                } else { // Move
                    commit('moveRect', {action: action, unit: unit});
                }
                commit('correctCurRect');
                commit('updateItemRect');
            }
        },

        handleKeyUpEvent({commit, state}, payload) {
            let action = payload.action;

            if (action == 'noop' && payload.modify.step) {
                commit('setCtrlState', {press: false});
            }

        }
    }
};

export default canvas;
