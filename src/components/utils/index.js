import {fabric} from 'fabric';

export const setArrowAlignment = (x, y, tempVal) => {
    if (tempVal === -1.57) {
        // 90 degrees
        x = x - 2
    }
    else if (-1.57 < tempVal && tempVal < 0) {
        // between 0 and 90 degrees
        x = x - 1.75;
        y = y - 2;
    }
    else if (tempVal < -1.57) {
        // between 90 and 180 degrees
        y = y + 2;
        x = x - 1.75;
    }
    else if (tempVal <= 3.14 && tempVal > 1.57) {
        // between 180 and 270 degrees
        x = x + 1.75;
        y = y + 2;
    }
    else if (tempVal === 1.57) {
        // 360 degrees
        x = x + 2;
    }
    else {
        x = x + 2;
        y = y - 2;
    }

    return {
        x, y
    }
}

export const moveEnd = (obj, is_set,canvas) => {
    var x1, y1, x2, y2;
    if (obj.pointType === 'arrow_end') {
        obj.line.set('x2', obj.get('left'));
        obj.line.set('y2', obj.get('top'));
    } else {
        obj.line.set('x1', obj.get('left'));
        obj.line.set('y1', obj.get('top'));
    }
    obj.line._setWidthHeight();
    x1 = obj.line.get('x1');
    y1 = obj.line.get('y1');
    x2 = obj.line.get('x2');
    y2 = obj.line.get('y2');

    var angle = calcArrowAngle(x1, y1, x2, y2);
    if (obj.pointType === 'arrow_end') {
        if (obj.arrow) obj.arrow.set('angle', angle - 90);
        if (obj.arrow1) obj.arrow1.set('angle', angle + 90);
    } else obj.set('angle', angle - 90);
    obj.line.setCoords();
    if (is_set) {
        obj.square2.set('left', obj.get("left"));
        obj.square2.set('top', obj.get('top'));
        obj.square2.setCoords();
    }
    else {
        if (obj.arrow) {
            obj.arrow.set('left', obj.get("left"));
            obj.arrow.set('top', obj.get('top'));
        }
        obj.line._setWidthHeight();
        if (obj.arrow) obj.arrow.set('angle', angle - 90);
        if (obj.arrow1) obj.arrow1.set('angle', angle + 90);
        if (obj.arrow) obj.arrow.setCoords();
        if (obj.arrow1) obj.arrow1.setCoords();
    }
    canvas.renderAll();
}
export const moveEnd2 = (obj,canvas) => {
    let x1, y1, x2, y2;
    if (obj.pointType === 'arrow_end') {
        obj.line.set('x2', obj.get('left'));
        obj.line.set('y2', obj.get('top'));
    } else {
        obj.line.set('x1', obj.get('left'));
        obj.line.set('y1', obj.get('top'));
    }
    obj.line._setWidthHeight();
    x1 = obj.line.get('x1');
    y1 = obj.line.get('y1');
    x2 = obj.line.get('x2');
    y2 = obj.line.get('y2');
    var angle = calcArrowAngle(x1, y1, x2, y2);
    if (obj.pointType === 'arrow_end') {
        if (obj.arrow) obj.arrow.set('angle', angle - 90);
        if (obj.arrow1) obj.arrow1.set('angle', angle + 90);
    } else obj.set('angle', angle - 90);
    obj.line.setCoords();
    if (obj.arrow1) {
        obj.arrow1.set('left', obj.get("left"));
        obj.arrow1.set('top', obj.get('top'));
    }
    obj.line._setWidthHeight();
    obj.arrow && obj.arrow.setCoords();
    obj.arrow && obj.arrow1.setCoords();
    canvas.renderAll();
}
export const calcArrowAngle = (x1, y1, x2, y2) => {
    var angle = 0, x, y;
    x = (x2 - x1);
    y = (y2 - y1);
    if (x === 0) {
        angle = (y === 0) ? 0 : (y > 0) ? Math.PI / 2 : Math.PI * 3 / 2;
    } else if (y === 0) angle = (x > 0) ? 0 : Math.PI;
    else angle = (x < 0) ? Math.atan(y / x) + Math.PI : (y < 0) ? Math.atan(y / x) + (2 * Math.PI) : Math.atan(y / x);
    return (angle * 180 / Math.PI);
}
export const moveLine = (line, type) => {
    var oldCenterX = (line.x1 + line.x2) / 2,
        oldCenterY = (line.y1 + line.y2) / 2,
        deltaX = line.left - oldCenterX,
        deltaY = line.top - oldCenterY;
    if (line.arrow) {
        line.arrow.set({
            'left': line.x1 + deltaX,
            'top': line.y1 + deltaY
        }).setCoords();
    }
    if (line.arrow1) {
        line.arrow1.set({
            'left': line.x2 + deltaX,
            'top': line.y2 + deltaY
        }).setCoords();
    }

    line.square1.set({
        'left': line.x2 + deltaX,
        'top': line.y2 + deltaY
    }).setCoords();

    line.square2.set({
        'left': line.x1 + deltaX,
        'top': line.y1 + deltaY
    }).setCoords();

    line.set({
        'x1': line.x1 + deltaX,
        'y1': line.y1 + deltaY,
        'x2': line.x2 + deltaX,
        'y2': line.y2 + deltaY
    });

    line.set({
        'left': (line.x1 + line.x2) / 2,
        'top': (line.y1 + line.y2) / 2
    });
}

export const transformedPoint = (target) => {
    const points = [];
    const path = target.path;
    points.push(new fabric.Point(path[0][1], path[0][2]));
    points.push(new fabric.Point(path[1][3], path[1][4]));
    points.push(new fabric.Point(path[1][1], path[1][2]));
    const matrix = target.calcTransformMatrix();
    const xArray = [path[0][1], path[1][3], path[1][1]];
    const yArray = [path[0][2], path[1][4], path[1][2]];
    const minX = Math.min(...xArray);
    const maxX = Math.max(...xArray);
    const maxY = Math.max(...yArray);
    const minY = Math.min(...yArray);
    return points
        .map(p => {
                let pointX, pointY;
                if (path[1][1] >= path[0][1]) {
                    pointX = p.x - minX - (target.width / 2);
                } else {
                    pointX = p.x - maxX + (target.width / 2);
                }
                if (path[1][2] >= path[0][2]) {
                    pointY = p.y - minY - (target.height / 2);
                } else {
                    pointY = p.y - maxY + (target.height / 2);
                }
                return new fabric.Point(pointX, pointY)
            }
        ).map(p => fabric.util.transformPoint(p, matrix));
}

