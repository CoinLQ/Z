import util from "@/libs/util";

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
            state.curGlyph = null;
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
            state.curRect.kselmarked = true;
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

        /*
            op :=1 original state
            op :=2 modified
            op :=3 deleted
            op :=4 created, also set cc=0.5 by default, which will be replaced by OCR result.
        */
        startNewRect(state, payload) {
            let r = payload.rect;
            r.id = '';
            r.tempId = ~~(Math.random() * 100);
            r.w = 1;
            r.h = 1;
            r.op = 4;
            r.cc = 0.5;
            r.ch = '';
            r.deleted = false;
            r.created = true;
            state.rects.push(r);
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

        setImageAndRects(state, payload) {
            state.rects = payload.rects;
            state.image = payload.image;
            let idx = _.findIndex(state.rects, function(o){ return o.line_no ==1 && o.char_no ==1});
            if (idx != -1) {
                state.curRect = state.rects[idx];
                state.curRect.kselmarked = true; 
            }
            
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

            if (all || action == 'mov-down') {
                cur.h -= unit;
            }
            if (all || action == 'mov-left') {
                cur.w -= unit;
                cur.x += unit;
            }
            if (all || action == 'mov-up') {
                cur.y += unit;
                cur.h -= unit;
            }
            if (all || action == 'mov-right') {
                cur.w -= unit;
            }

            cur.op = 2;
        },

        moveRect(state, payload) {
            let cur = state.curRect;
            let unit = payload.unit;
            let action = payload.action;

            if (action == 'mov-up' || action == 'mov-up-w') {
                cur.y -= unit;
            }
            if (action == 'mov-right' || action == 'mov-right-d') {
                cur.x += unit;
            }
            if (action == 'mov-down' || action == 'mov-down-s') {
                cur.y += unit;
            }
            if (action == 'mov-left' || action == 'mov-left-a') {
                cur.x -= unit;
            }

            cur.op = 2;
        },

        correctCurRect(state, payload) {
            let cur = state.curRect;
            if (!cur) return;
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

        // setSelectState(state, payload) {
            // let cur = state.curRect;
            // if (cur.kselected) {  // selected by keydown operation
            //     cur.kselected = false;
            // }
            // else {
            //     cur.kselected = true;
            // }
        // },
        // enableSelectState(state, payload) {
        //     let cur = state.curRect;
        //     if (cur) cur.kselected = true;
        // },
        shiftCurRect(state, payload) {
            let next = 0;
            let action = payload.action;
            let line_offset = 0;
            let char_offset = 0;
            if (action == 'mov-up-w' || action == 'mov-up') char_offset -= 1;
            else if (action == 'mov-down-s' || action == 'mov-down') char_offset +=1;
            else if (action == 'mov-left-a' || action == 'mov-left') line_offset +=1;
            else if (action == 'mov-right-d' || action == 'mov-right') line_offset -=1;

            let nextRectPos = _.findIndex(state.rects, {'char_no': state.curRect.char_no + char_offset, 'line_no': state.curRect.line_no + line_offset});
            if (nextRectPos == -1 && (action == 'mov-left-a' || action == 'mov-right-d' || action == 'mov-left' || action == 'mov-right')) nextRectPos = _.findIndex(state.rects, {'char_no': 1, 'line_no': state.curRect.line_no + line_offset});
            if (nextRectPos == -1 && (action == 'mov-down-s' || action == 'mov-down')) nextRectPos = _.findIndex(state.rects, {'char_no': 1, 'line_no': state.curRect.line_no + 1});

            if (nextRectPos == -1 && (action == 'mov-up-w' || action == 'mov-up')) {
               let max_char = _.maxBy(_.filter(state.rects, {'line_no': state.curRect.line_no - 1}, 'char_no'));
               let max_char_no = max_char && max_char['char_no'];
               nextRectPos = _.findIndex(state.rects, {'char_no': max_char_no || 1, 'line_no': state.curRect.line_no - 1});
            } 
            if (nextRectPos == -1) nextRectPos = _.findIndex(state.rects, {'char_no': 1, 'line_no': 1});
            
            if (nextRectPos != -1) next = nextRectPos - _(state.rects).indexOf(state.curRect);
            else if (action == 'mov-left-a' || action == 'mov-up-w' || action == 'mov-left' || action == 'mov-up') next = 1;
            else if (action == 'mov-right-d' || action == 'mov-down-s' || action == 'mov-right' || action == 'mov-down') next = -1;
            
            let index = _(state.rects).indexOf(state.curRect) + next;
            let len = state.rects.length;
            index = index < 0 ? len + index : (index >= len ? index - len : index);
            state.curRect = state.rects[index];
            state.curRect.kselmarked = true;
        }
    },
    actions: {
        handleKeyDownEvent({commit, state}, payload) {
            // console.log(payload);
            let action = payload.action;
            let cur = state.curRect.empty? state.rects[0] : state.curRect;

            if (!cur) return;

            if (_(action).startsWith('scale')) {
                let newScale=parseInt(action[action.length-1])
                if(payload.modify.ctrlKey){
                    newScale=Math.min(newScale,3);
                    switch (newScale){
                        case 2:
                            newScale=0.5;break;
                        case 3:
                            newScale=0.25;break;
                    }
                }

                commit('setScale', {scale: newScale});
            }

            if (action == 'delete') {
                commit('deleteCurRect');
                commit('correctCurRect');
                commit('updateItemRect');
            }

            if (action == 'noop' && payload.modify.step) {
                commit('setCtrlState', {press: true});
            }

            // if (action == 'select') {
            //     commit('setSelectState');
            // }

            //移动
            if (["mov-left", "mov-right", "mov-up", "mov-down"].includes(action)) {
                let all = action == 'drul';
                let unit = payload.modify.step ? 10 : 2;

                if (payload.modify.enlarge) {
                    // commit('enableSelectState');
                    commit('enlargeRect', {action: action, unit: unit, all: all});

                } else if (payload.modify.shrink) {
                    // commit('enableSelectState');
                    commit('shrinkRect', {action: action, unit: unit, all: all});

                }
                // else if (!cur.kselected) {
                //     commit('shiftCurRect', {action: action});
                //
                // }
                else { // Move
                    commit('moveRect', {action: action, unit: unit});
                }
                commit('correctCurRect');
                commit('updateItemRect');
                return
            }

            if (["mov-left-a", "mov-right-d", "mov-up-w", "mov-down-s"].includes(action)) {
                let all = action == 'drul';
                let unit = payload.modify.step ? 10 : 2;

                commit('shiftCurRect', {action: action});

                commit('correctCurRect');
                commit('updateItemRect');
            }
        },

        handleKeyUpEvent({commit, state}, payload) {
            let action = payload.action;

            if (action == 'noop' && payload.modify.step) {
                commit('setCtrlState', {press: false});
            }

        },

        closeNewRect({commit, state}, payload) {
            let r = payload.rect;
            if (r.w < 0) {
                r.x += r.w;
                r.w *= -1;
            }
            if (r.h < 0) {
                r.y += r.h;
                r.h *= -1;
            }
            if (r.w + r.h < 12) {
                // too small to be valuable for use
                return _.pull(state.rects, r);
            }


            // let clip = util.getImageClip(state.image, r.w, r.h, r.x, r.y, 1);
            // //console.log(clip)
            // clip = clip.substr(clip.indexOf(',')+1);
            // util.ajax.post('/api/rect/get_ocr_text/', {id: r.tempId, img_data: clip})
            // .then(function (response) {
            //     // console.log(response.data)
            //     if (response.data.status != 0)
            //         throw response.data;

            //     if (response.data.rects.length == 1) {
            //         Object.assign(_.cloneDeep(r), response.data.rects[0]);
            //         r.x += r.x;
            //         r.y += r.y;
            //         state.curRect = r;
            //     } else if (response.data.rects.length > 1) {
            //         // Now here are a column of glyphs returned.
            //         // save them and mark the last one curRect.
            //         _.pull(state.rects, r);
            //         _.forEach(response.data.rects, function(newR) {
            //             let final = Object.assign(_.cloneDeep(r), newR);
            //             final.x += r.x;
            //             final.y += r.y;
            //             state.rects.push(final);
            //             payload.canvas.redraw_canvas();
            //         })
            //         // state.curRect = state.rects[state.rects.length-1];
            //     }
            // })
            // .catch(function (error) {
            //     console.log("读取识别过程中出错了 " + error);
            // })
        }
    }
};

export default canvas;
