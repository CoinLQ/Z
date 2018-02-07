let tripitaka = {}

tripitaka.count_ch = function (s, ch) {
    var count = 0;
    for (var i = 0; i < s.length; ++i) {
        if (s[i] == ch) {
            ++count;
        }
    }
    return count;
};

tripitaka.pad = function (num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

tripitaka.setImg = function (img_url, x, y, w, h) {
    var canvas = document.getElementById("page-canvas");
    var context = canvas.getContext("2d");
    var image = new Image();
    image.onload = function () {
        canvas.width = canvas.width;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, 800, 1080);
        var xratio = 800 / image.width;
        var yratio = 1080 / image.height;
        x = parseInt(x * xratio);
        y = parseInt(y * yratio);
        w = parseInt(w * xratio);
        h = parseInt(h * yratio);
        context.moveTo(x, y);
        context.lineTo(x + w, y);
        context.lineTo(x + w, y + h);
        context.lineTo(x, y + h);
        context.lineTo(x, y);
        //设置样式
        context.lineWidth = 1;
        context.strokeStyle = "#F5270B";
        //绘制
        context.stroke();
    };
    image.src = img_url;
}

tripitaka.extract_separators = function (text) {
    var pages = text.replace(/\r\n/g, '\n').split('\np\n');
    if (pages[0].substr(0, 2) == 'p\n') {
        pages[0] = pages[0].substr(2);
    }
    var new_separators = [];
    var pos = 0;
    var page_index = 0;
    while (page_index < pages.length) {
        var lines = pages[page_index].split('\n');
        var i = 0;
        while (i < lines.length) {
            pos += lines[i].length;
            if (i == (lines.length - 1) && page_index != (pages.length - 1)) {
                new_separators.push([pos, 'p']);
            } else {
                new_separators.push([pos, '\n']);
            }
            ++i;
        }
        ++page_index;
    }
    return new_separators;
};

tripitaka.judge_merge_text_punct1 = function (text, diffseg_pos_lst, punct_lst) {
    var lines = [];
    var line = [];
    var i = 0;
    var diffseg_idx = 0;
    var punct_idx = 0;
    var diffseg_endpos = text.length + 1;
    while (i < text.length) {
        var pos = diffseg_endpos;
        if (diffseg_idx < diffseg_pos_lst.length) {
            if (pos > diffseg_pos_lst[diffseg_idx].base_pos) {
                pos = diffseg_pos_lst[diffseg_idx].base_pos;
            }
        }
        if (punct_idx < punct_lst.length) {
            if (pos > punct_lst[punct_idx][0]) {
                pos = punct_lst[punct_idx][0];
            }
        }
        if (pos <= text.length && pos > i) {
            line.push(text.substr(i, pos-i));
            i = pos;
        } else if (pos > text.length) {
            line.push(text.substr(i));
            i = text.length;
        }

        if (i == diffseg_endpos) {
            line.push('</a>');
            diffseg_endpos = text.length + 1;
        }

        // 处理标点
        while (punct_idx < punct_lst.length) {
            if (punct_lst[punct_idx][0] == i) {
                var punct_ch = punct_lst[punct_idx][1];
                if (punct_ch == '\n') {
                    lines.push(line.join(''));
                    //console.log('line: ', line.join(''));
                    line = [];
                } else {
                    line.push(punct_ch);
                }
                ++punct_idx;
            } else {
                break;
            }
        }

        if (diffseg_idx < diffseg_pos_lst.length) {
            var pos = diffseg_pos_lst[diffseg_idx].base_pos;
            if (pos == i) {
                diffseg_endpos = pos + diffseg_pos_lst[diffseg_idx].base_length;
                if (pos == diffseg_endpos) {
                    line.push('<a href="#" class="diffseg-tag diffseg-tag-notext" id="diffseg-tag-'
                     + diffseg_pos_lst[diffseg_idx].diffseg_id + '" v-on:click="click">');
                    line.push('<span class="diffseg-tag-white"></span>');
                } else {
                    line.push('<a href="#" class="diffseg-tag" id="diffseg-tag-' + diffseg_pos_lst[diffseg_idx].diffseg_id + '">');
                }
                //console.log(line);

                if (diffseg_endpos == i) {
                    line.push('</a>');
                    diffseg_endpos = text.length + 1;
                }
                ++diffseg_idx;
            }

        }
    }
    return lines;
}

tripitaka.judge_merge_text_punct = function (text, diffseg_pos_lst, punct_lst) {
    var TEXT = 0;
    var LINE_FEED = 1;
    var SEG_NOTEXT = 2;
    var SEG_TEXT = 3;
    var SEG_LINES = 4;

    var result = [];
    var i = 0;
    var diffseg_idx = 0;
    var punct_idx = 0;
    var diffseg_endpos = text.length + 1;
    var obj = null;
    while (i < text.length) {
        var pos = diffseg_endpos;
        if (diffseg_idx < diffseg_pos_lst.length) {
            if (pos > diffseg_pos_lst[diffseg_idx].base_pos) {
                pos = diffseg_pos_lst[diffseg_idx].base_pos;
            }
        }
        if (punct_idx < punct_lst.length) {
            if (pos > punct_lst[punct_idx][0]) {
                pos = punct_lst[punct_idx][0];
            }
        }
        if (pos <= text.length && pos > i) {
            if (obj != null) {
                obj['text'].push(text.substr(i, pos-i));
            } else {
                obj = {
                    'type': TEXT, // text
                    'text': [ text.substr(i, pos-i) ]
                };
            }
            i = pos;
        } else if (pos > text.length) {
            if (obj != null) {
                obj['text'].push(text.substr(i));
            } else {
                obj = {
                    'type': TEXT, // text
                    'text': [ text.substr(i) ]
                };
            }
            obj['text'] = obj['text'].join('');
            result.push(obj);
            obj = null;
            i = text.length;
        }

        if (i == diffseg_endpos) {
            if (obj != null) {
                obj['text'] = obj['text'].join('');
                if ('lines' in obj) {
                    obj['lines'].push(obj['text']);
                    obj['text'] = [];
                }
                result.push(obj);
            }
            obj = null;
            diffseg_endpos = text.length + 1;
        }

        // 处理标点
        while (punct_idx < punct_lst.length) {
            if (punct_lst[punct_idx][0] == i) {
                var punct_ch = punct_lst[punct_idx][1];
                if (punct_ch == '\n') {
                    if (obj != null) {
                        if (obj['type'] == TEXT) {
                            obj['text'] = obj['text'].join('');
                            result.push(obj);
                            obj = null;
                            result.push({
                                'type': LINE_FEED //'\n'
                            });
                        } else if (obj['type'] == SEG_TEXT) {
                            obj['type'] = SEG_LINES;
                            obj['lines'] = [obj['text'].join('')]
                            obj['text'] = [];
                        } else if (obj['type'] == SEG_LINES) {
                            obj['lines'].push(obj['text'].join(''));
                            obj['text'] = [];
                        }
                    } else {
                        result.push({
                            'type': LINE_FEED
                        });
                    }
                } else {
                    if (obj != null) {
                        obj['text'].push(punct_ch);
                    } else {
                        obj = {
                            'type': TEXT,
                            'text': [ punct_ch ]
                        }
                    }
                }
                ++punct_idx;
            } else {
                break;
            }
        }

        if (diffseg_idx < diffseg_pos_lst.length) {
            var pos = diffseg_pos_lst[diffseg_idx].base_pos;
            if (pos == i) {
                diffseg_endpos = pos + diffseg_pos_lst[diffseg_idx].base_length;
                if (obj != null) {
                    if (obj['type'] == TEXT || obj['type'] == SEG_TEXT) {
                        obj['text'] = obj['text'].join('');
                    } else if (obj['type'] == SEG_LINES) {
                        obj['lines'].push(obj['text'].join(''));
                        obj['text'] = [];
                    }
                    result.push(obj);
                    obj = null;
                }
                if (pos == diffseg_endpos) {
                    obj = {
                        'diffseg_no': diffseg_pos_lst[diffseg_idx].diffseg_no,
                        'type': SEG_NOTEXT
                    };
                    result.push(obj);
                    obj = null;
                    diffseg_endpos = text.length + 1;
                } else {
                    obj = {
                        'diffseg_no': diffseg_pos_lst[diffseg_idx].diffseg_no,
                        'type': SEG_TEXT,
                        'text': []
                    };
                }
                ++diffseg_idx;
            }

        }
    }
    return result;
}

export default tripitaka;
