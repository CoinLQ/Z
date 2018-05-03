import _ from 'lodash';

let line_util = {

};

line.most_rtop_rect = function(rects) {
    let x1 = _.maxBy(rects, 'x').x;
    return {'x': x1, 'y': 0, 'w': width, 'h': height} 
}


line.inside_with = function(large_rect, rect2) {
    if ((large_rect.x <= rect2.x) && (large_rect.x + large_rect.w >= rect2.x + rect2.w) && 
        (large_rect.y <= rect2.y) && (large_rect.y + large_rect.h >= rect2.y + rect2.h)) {
        console.log("hint: inner case!")
        return true
    }
    return false
}

line.intersects_with = function(rect1, rect2) {
    if ((rect2.x < rect1.x + rect1.w) && (rect1.x < rect2.x + rect2.w) &&
            (rect2.y <= rect1.y + rect1.h)) {
        return rect1.y <= rect2.y + rect2.h;
    }
    return line.inside_with(rect1, rect2);
}

line.pick_one_column = function(rects) {
    let _rect = line.most_rtop_rect(rects)
    let col_rects = _.dropWhile(rects, function(o) { return line.intersects_with(o, _rect); });
    return col_rects.sort(function(a, b) {return a.y - b.y})
}

line.by_columns = function(rects) {
    let columns = [];
    while (rects.length > 0) {
        columns.append(line.pick_one_column(rects))
    }
    return columns
} 

            