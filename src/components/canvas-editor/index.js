import React, {useEffect, useRef, useState} from "react";
import {fabric} from 'fabric';
import '../fabric-overrids'
import './index.css'
import {calcArrowAngle, moveEnd, moveEnd2, moveLine, setArrowAlignment, setCanvasBackgroundImage} from "../utils";
import questionMarkIcon from "../../assets/question-mark.png"
import uploadImg from "../../assets/Upload-img.png"
import questionMarkIcon1 from "../../assets/question-mark-icon.png"
import ColorsPanel from "./colorsPanel";
import DimChangePopup from "./DimensionChangePopup/DimChangePopup";
import ZoomInBox from "./ZoomInBox/ZoomInBox";
import DeleteConfirmPopup from "./DeleteConfirmPopup/DeleteConfirmPopup";
import plusIcon from "../../assets/plus-5-128.png"
import saveIcon from "../../assets/save-128.png"
import deleteIcon from "../../assets/delete-128.png"
import settingIcon from "../../assets/settings-14-48.png"
import editIcon from "../../assets/edit-2-128.png"
import tickIcon from "../../assets/checkmark-128.png"
import Button from "../common/Button";
import SideZooms from "./SideZooms/SideZooms";
import Input from "../common/Input";
import DimDropDown from "./DimensionDropDown/DimDropDown";
import UpdateDimPopup from "./UpdateDimPopup/UpdateDimPopup";
let canvas,selectedShapeType = '',isAddingShape = false, objectOldValues = {},
    initialPointers = {}, selectedQMarkRefId = "", arrowWidth=18, arrowHeight = 15,isClickedOnCanvas=false;
const CanvasEditor = () => {

    // Declare and initialize component states.
    const [isImageLoaded, setIsImageLoaded] = useState(false)
    const [dimensionInputText, setDimensionInputText] = useState("")
    const [openDimensionPopup, setOpenDimensionPopup] = useState(false)
    const [isDimensionPopup, setIsDimensionPopup] = useState(false)
    const [selectedDimension, setSelectedDimension] = useState("cm")
    const [showDropDownList, setShowDropDownList] = useState(false)
    const [zoomAreaImgSrc, setZoomAreaImgSrc] = useState("")
    const [isMobileView, setIsMobileView] = useState(false);
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
    const [isObjectSelected,setIsObjectSelected] = useState(false);
    const [showZoomBox,setShowZoomBox] = useState(false);
    const [currentFontSize,setCurrentFontSize] = useState(18);
    const [currentThickness,setCurrentThickness] = useState(18);

    const uploadImgInput = useRef();


    useEffect(() => {
        // Initialize canvas and set dimension.
        inItCanvas();
        if (window.innerWidth < 1100 || isMobile()) {
            setIsMobileView(true)
        }
    }, []);
    useEffect(() => {
        if (!isObjectSelected) setOpenDimensionPopup(false)
    }, [isObjectSelected]);

    const inItCanvas = () => {
        // Initialize fabric canvas
        canvas = new fabric.Canvas('canvas', {
            allowTouchScrolling: true,
            preserveObjectStacking: true,
            backgroundColor: 'grey',
            selection: false,
        })

        window.canvas = canvas;

        // On canvas events
        subscribeEvents(canvas)
        // set canvas height and width
        adjustCanvasDimensions()
        canvas.renderAll();
    }
    const adjustCanvasDimensions = () => {
        let elHeight = 0, elWidth = 0;
        // get height and width of canvas-main-wrapper div.
        document.querySelectorAll('div').forEach((el) => {
            if (el.classList.contains('canvas-main-wrapper')) {
                elWidth = el.clientWidth;
                elHeight = el.clientHeight;
            }
        })
        let width = elWidth,
            height = elHeight;
        canvas.setWidth(width) // set canvas width
        canvas.setHeight(height) // set canvas height
        canvas.renderAll();
    }

    function subscribeEvents(canvas) {
        canvas.on({
            'object:added': added,
            'object:modified': objectModified,
            'object:scaling': objectScaling,
            'object:scaled': objectScaled,
            'object:moving': objectMoving,
            'object:removed': added,
            'selection:created': selectionCreated,
            'selection:updated': selectionUpdated,
            'selection:cleared': cleared,
            'mouse:up': mouseUp,
            'mouse:down': mouseDown,
            'mouse:move': mouseMove,
            "mouse:wheel": onMouseWheel,
        });
    }
    function unSubscribeEvents(canvas) {
        canvas.off({
            'object:added': added,
            'object:modified': objectModified,
            'object:scaling': objectScaling,
            'object:scaled': objectScaled,
            'object:moving': objectMoving,
            'object:removed': added,
            'selection:created': selectionCreated,
            'selection:updated': selectionUpdated,
            'selection:cleared': cleared,
            'mouse:up': mouseUp,
            'mouse:down': mouseDown,
            'mouse:move': mouseMove,
            "mouse:wheel": onMouseWheel,
        });
        canvas.__eventListeners = null
    }

    const deleteObject = (obj) => {
        if (!obj) return;
        const objs = canvas.getObjects();
        const line = objs.find(o => o.name === "arrow_line" && o.ref_id === obj.ref_id)
        const qMark = objs.find(o => (o.name === "question-mark" || o.name === "dimension-text") && o.ref_id === obj.ref_id)
        canvas.remove(line.arrow)
        canvas.remove(line.arrow1)
        canvas.remove(line.square1)
        canvas.remove(line.square2)
        canvas.remove(line)
        canvas.remove(qMark)
        canvas.renderAll();
        setZoomAreaImgSrc(canvas.toDataURL({
            left: 0,
            top: 0,
            width: 300,
            height: 300
        }));
    }

// MOUSEWHEEL ZOOM
    const onMouseWheel = (opt) => {
        var delta = opt.e.deltaY;
        var zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        canvas.zoomToPoint({x: opt.e.offsetX, y: opt.e.offsetY}, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
        // var vpt = this.viewportTransform;
        // if (zoom < 400 / 1000) {
        //     vpt[4] = 200 - 1000 * zoom / 2;
        //     vpt[5] = 200 - 1000 * zoom / 2;
        // } else {
        //     if (vpt[4] >= 0) {
        //         vpt[4] = 0;
        //     } else if (vpt[4] < canvas.getWidth() - 1000 * zoom) {
        //         vpt[4] = canvas.getWidth() - 1000 * zoom;
        //     }
        //     if (vpt[5] >= 0) {
        //         vpt[5] = 0;
        //     } else if (vpt[5] < canvas.getHeight() - 1000 * zoom) {
        //         vpt[5] = canvas.getHeight() - 1000 * zoom;
        //     }
        // }
        canvas.renderAll();
        canvas.calcOffset();

        const objs = canvas.getObjects();
        for (let i = 0; i < objs.length; i++) {
            objs[i].setCoords();
        }
        canvas.renderAll();

    }

    const added = () => {
    }
    const objectModified = () => {
        const actObj = canvas.getActiveObject();
        if (!actObj) return;
        updateArrowObject(actObj, "moving");
    }
    const objectScaling = () => {
    }
    const objectMoving = (e) => {
        const obj = e.target;
        updateArrowObject(obj, "moving")
        if (obj.name === "arrow_line" || obj.name === "square1" || obj.name === "square2") {
            const objs = canvas.getObjects();
            const line = objs.find(o => o.name === "arrow_line" && o.ref_id === obj.ref_id)
            const qMark = objs.find(o => (o.name === "question-mark" || o.name === "dimension-text") && o.ref_id === obj.ref_id)
            if (qMark && line) {
                const {x, y} = line.getCenterPoint(),
                    {x1, y1, x2, y2} = line,
                    angle = calcArrowAngle(x1, y1, x2, y2);
                qMark.set({
                    left: x,
                    top: y + 15,
                    angle
                })
                qMark.setCoords();
            }
            canvas.renderAll()
        }
    }
    const objectScaled = () => {
    }
    const selectionCreated = (e) => {
        const actObj = e.selected[0];
        if (!actObj) return;
        updateArrowObject(actObj, "selected");
        setIsObjectSelected(true)
        updateValuesForSelected("",true)
        // if (actObj.name === "square1" || actObj.name === "square2") {
            // const {x, y} = canvas.getPointer(e.e, true), zoom = canvas.getZoom();
            // setZoomAreaImgSrc(canvas.toDataURL({
            //     left: x - (obj.width * zoom)/2,
            //     top: y - (obj.height * zoom)/2,
            //     width: obj.width * zoom,
            //     height: obj.height * zoom
            // }));
            // setShowZoomBox(true)
        // }
    }
    const updateValuesForSelected = (value="",isSelectedFirstTime=false) => {
        const actObj = canvas.getActiveObject();
        if (!actObj) return;
        const refID = actObj.ref_id;
        const objs = canvas.getObjects();
        const line = objs.find(o => o.name === "arrow_line" && o.ref_id === refID)
        const qMark = objs.find(o => o.name === "question-mark" && o.ref_id === refID)
        const text = objs.find(o => o.name === "dimension-text" && o.ref_id === refID)
        if (text || qMark) {
            let dimSym = ""
            if (text?.text && !value) {
                let t = text.text;
                dimSym = t.slice(-2);
                setSelectedDimension(dimSym)
                t = t.replace(` ${dimSym}`,"")
                value = t;
            }
            setDimensionInputText(value)
            if (!isSelectedFirstTime) addTextOnObject(line,qMark,text,value,refID)
            else {
                if (text) {
                    objectOldValues = {
                        line: {
                            stroke: line.fill,
                            strokeWidth: line.strokeWidth,
                        },
                        arrow: {fill: line.arrow.fill, scaledWidth: line.arrow.width},
                        square: {scaledWidth: line.square1.getScaledWidth()},
                        text: {text: value, sym: dimSym, color: text.fill, fontSize: text.fontSize}
                    }
                }
            }
        }
    }
    const addTextOnObject =(line,qMark,text,value,refID)=>{
        value = `${value} ${selectedDimension}`
        if (qMark) {
            canvas.remove(qMark);
            addDimensionText(value, refID, line);
        } else if (text) {
            text.set("fill", line.stroke)
            text.set("text", value)
        }
        canvas.renderAll();
    }

    const updateArrowObject = (obj, state) => {
        switch (state) {
            case "selected":
                switch (obj.name) {
                    case "arrow_line":
                        obj.square1.opacity = .5
                        obj.square2.opacity = .5
                        obj.square1.selectable = true
                        obj.square2.selectable = true
                        obj.square1.hoverCursor = obj.square2.hoverCursor = "pointer"
                        canvas.bringToFront(obj.square1)
                        canvas.bringToFront(obj.square2)
                        canvas.renderAll();
                        break;
                    case "arrow":
                        const line = canvas.getObjects().find(o => o.name === "arrow_line" && o.ref_id === obj.ref_id)
                        if (line) {
                            canvas.setActiveObject(line)
                            canvas.renderAll()
                        }
                        break;
                }
                break;
            case "moving":
                switch (obj.name) {
                    case "arrow_line":
                        obj.square1.opacity = 0
                        obj.square2.opacity = 0
                        obj.square1.selectable = false
                        obj.square2.selectable = false
                        moveLine(obj)
                        break;
                    case "square1":
                        moveEnd2(obj, canvas)
                        break;
                    case "square2":
                        moveEnd(obj, "", canvas)
                        break;
                }
                break;
        }
        canvas.renderAll()
    }

    const selectionUpdated = (e) => {
        const activeObject = e.selected[0];
        if (!activeObject) return;
        updateArrowObject(activeObject, "selected")
        setOpenDeleteConfirmation(false)
    }
    const cleared = () => {
        clearSelection()
        setOpenDeleteConfirmation(false)
        setShowZoomBox(false)
        setIsObjectSelected(false)
        setDimensionInputText("")
        closeDimPopup()

    }
    const clearSelection = () => {
        for (var i = 0; i < canvas._objects.length; i++) {
            var obj = canvas._objects[i]
            obj.shadow = ""
            if (obj.name === 'arrow_line') {
                obj.square1.opacity = 0
                obj.square2.opacity = 0
                obj.square1.selectable = false
                obj.square2.selectable = false
                obj.square1.hoverCursor = obj.square2.hoverCursor = "default"
                canvas.sendToBack(obj.square1)
                canvas.sendToBack(obj.square2)
                canvas.renderAll()
            }
        }
        canvas.renderAll();
    }
    const handleChangeColor = (color) => {
        const activeObject = canvas.getActiveObject();
        if (!activeObject) return;
        const objs = canvas.getObjects()
        const line = objs.find(o => o.name === "arrow_line" && o.ref_id === activeObject.ref_id)
        const qMark = objs.find(o => (o.name === "dimension-text") && o.ref_id === activeObject.ref_id)
        line.set({stroke: color})
        if (line.arrow && line.arrow1) {
            line.arrow.set({fill: color})
            line.arrow1.set({fill: color})
        }
        qMark && qMark.set({fill: color})
        canvas.renderAll();
    }
    const mouseUp = (e) => {
        isClickedOnCanvas = false
        if (isAddingShape) {
            const objs = canvas.getObjects();
            const lineGroupInd = objs.findIndex(o => o.isAddingMode);
            if (lineGroupInd > -1) {
                const lineGroup = objs[lineGroupInd];
                if (lineGroup.type !== "group") return;
                const line = lineGroup._objects[0];
                const arrow = lineGroup._objects[1];
                const {x1, y1, x2, y2} = line;
                lineGroup.isAddingMode = false;
                lineGroup.evented = true;
                const uuid = require("uuid");
                const id = uuid.v4();
                addArrow({
                    color: "#33333",
                    is_dashed: false,
                    x1, y1, x2, y2, id,
                    left: lineGroup.left,
                    top: lineGroup.top,
                    angle: arrow.angle,
                    scaleProps: {
                        fontWeight: 500,
                        height: 40,
                        lineHeight: 81.36,
                        lineSelectorHeight: 30.51,
                        strokeWidth: 6,
                        width: 56,
                        top: 407
                    }
                })
                canvas.remove(lineGroup)
            }
        }
        isAddingShape = false
        initialPointers = {}
        selectedShapeType = ''
        const obj = canvas.getActiveObject();
        if (obj) updateArrowObject(obj, "selected")
    }

    const addQuestionMark = (line) => {
        const {x: left, y: top} =line.getCenterPoint();
        var angle = calcArrowAngle(line.x1, line.y1, line.x2, line.y2);
        let img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function () {
            let imgInstance = new fabric.Image(img, {
                crossOrigin: "Anonymous",
                ref_id: line.ref_id,
                left, top:top + 15,
                originX: 'center',
                originY: 'center',
                evented:false,
                selectable:false,
                name: "question-mark",
                angle
            });
            imgInstance.scaleToHeight(20)
            canvas.add(imgInstance);
            canvas.bringToFront(imgInstance)
            canvas.renderAll();
        };
        img.src = questionMarkIcon1;
    }
    const mouseDown = (e) => {
        if (isMobile()) return;
        isClickedOnCanvas = true
        if (!selectedShapeType) return;
        const {x, y} = canvas.getPointer(e.e, false);
        initialPointers = {x, y}
        if (selectedShapeType === "arrowLine") {
            addArrowLine({x, y}, x, y)
            isAddingShape = true
        }
    }
    const panningCanvas =(e)=>{
        const obj = e.target;
        if (!isClickedOnCanvas || obj) return;
        var units = 10;
        var delta = new fabric.Point(e.e.movementX, e.e.movementY);
        canvas.relativePan(delta);
    }
    const zoomBySideBtn =(e,type)=>{
        switch (type){
            case "left":
                canvas.relativePan(new fabric.Point(10, 0));
                break;
            case "right":
                canvas.relativePan(new fabric.Point(-10, 0));
                break;
            case "top":
                canvas.relativePan(new fabric.Point(0, 10));
                break;
            case "bottom":
                canvas.relativePan(new fabric.Point(0, -10));
                break;
        }
    }
    const mouseMove = (e) => {
        const obj = e.target;
        if (!obj) setShowZoomBox(false)
        if (obj?.name === "square1" || obj?.name === "square2") {
            const {x, y} = canvas.getPointer(e.e, true), zoom = canvas.getZoom();
            setZoomAreaImgSrc(canvas.toDataURL({
                left: x - (obj.width * zoom)/2,
                top: y - (obj.height * zoom)/2,
                width: obj.width * zoom,
                height: obj.height * zoom
            }));
            setShowZoomBox(true)
        }
        if (isAddingShape) {
            const actObj = canvas.getObjects().find(o => o.name === selectedShapeType && o.isAddingMode);
            if (actObj) {
                const {x, y} = canvas.getPointer(e.e, false);
                const calcOffsetX = x - initialPointers.x;
                const calcOffsetY = y - initialPointers.y;
                if (actObj.name === "circle" || actObj.name === "crossShape") actObj.scaleToHeight(calcOffsetY * 2)
                if (actObj.name === "arrowLine") {
                    addArrowLine(initialPointers, x, y)
                }
                canvas.renderAll();
            }
        }else panningCanvas(e)
    }

    const addArrowLine = ({x, y}, newX2, newY2) => {
        const arrowLineInd = canvas.getObjects().findIndex(o => o.name === "arrowLine" && o.opacity);
        if (arrowLineInd > -1) {
            canvas.remove(canvas.getObjects()[arrowLineInd])
            canvas.renderAll();
        }
        const uuid = require("uuid");
        let id = uuid.v4();
        let x1 = x;
        let y1 = y;
        let x2 = newX2;
        let y2 = newY2;
        var angle = Math.atan2(y2 - y1, x2 - x1);
        let tempVal = Number.parseFloat(angle).toFixed(2);
        var line = new fabric.Line([x1, y1, x2, y2], {
            stroke: 'black',
            strokeWidth: 6,
            originX: 'center',
            originY: 'center',
            name: "arrow_line",
            custom: {
                linePoints: {x1, y1, x2, y2}
            }
        });


        x2 = setArrowAlignment(x2, y2, tempVal).x;
        y2 = setArrowAlignment(x2, y2, tempVal).y;
        const calcAngle = (angle * (180 / (3.142))) - 30;
        var arrow = new fabric.Triangle({
            left: x2,
            top: y2,
            angle: calcAngle,
            width: arrowWidth,
            height: arrowHeight,
            originX: 'center',
            originY: 'center',
            fill: 'black',
            name: "arrow",
        });
        var arrow1 = new fabric.Triangle({
            left: x1,
            top: y1,
            angle: calcAngle + 62,
            width: arrowWidth,
            height: arrowHeight - 3,
            originX: 'center',
            originY: 'center',
            fill: 'black',
            name: "arrow1",
        });
        const group = new fabric.Group([line, arrow, arrow1], {
            name: "arrowLine",
            originX: 'center',
            originY: 'center',
            isAddingMode: true,
            ref_id: id,
        });
        canvas.add(group)
        canvas.renderAll();
    }
    const isMobile = (userAgent = navigator.userAgent) => /Mobi/.test(userAgent);

    const setObjectPadding = (obj, val, val2) => {
        if (window.innerWidth < 1100 || isMobile()) {
            obj.set("padding", val)
        } else {
            obj.set("padding", val2)
        }
        canvas.renderAll()
    }

    const addArrow = (props) => {
        let x1 = props.x1;
        let y1 = props.y1;
        let x2 = props.x2;
        let y2 = props.y2;
        let id = props.id;
        var line = new fabric.Line([x1, y1, x2, y2], {
            stroke: props.color,
            strokeWidth: (props.scaleProps.strokeWidth) - 1,
            hasBorders: false,
            hasControls: false,
            originX: 'center',
            originY: 'center',
            lockScalingX: true,
            lockScalingY: true,
            left: props.left,
            top: props.top,
            name: "arrow_line",
            perPixelTargetFind: true,
            objecttype: "arrow_line",
            custom: {
                linePoints: {x1, y1, x2, y2}
            }
        });
        setObjectPadding(line, 20, 10)
        if (props.is_dashed) {
            line.set({strokeDashArray: [5, 5]})
        }
        var centerX = (line.x1 + line.x2) / 2,
            centerY = (line.y1 + line.y2) / 2,
            deltaX = line.left - centerX,
            deltaY = line.top - centerY;


        var arrow = new fabric.Triangle({
            left: line.get('x1') + deltaX,
            top: line.get('y1') + deltaY,
            originX: 'center',
            originY: 'center',
            hasBorders: false,
            hasControls: false,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            // selectable: false,
            pointType: 'arrow_start',
            angle: props.angle,
            width: (props.scaleProps.height / 2) - 8,
            height: (props.scaleProps.height / 2) - 4,
            fill: props.color,
            objecttype: "arrow_line",
            name: "arrow",
        });
        arrow.line = line;

        var arrow1 = new fabric.Triangle({
            left: line.get('x2') + deltaX,
            top: line.get('y2') + deltaY,
            originX: 'center',
            originY: 'center',
            hasBorders: false,
            hasControls: false,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            // selectable: false,
            pointType: 'arrow_start',
            angle: props.angle,
            width: (props.scaleProps.height / 2) - 8,
            height: (props.scaleProps.height / 2) - 4,
            fill: props.color,
            objecttype: "arrow_line",
            name: "arrow",
        });
        arrow1.line = line;
        var square1 = new fabric.Circle({
            left: line.get('x2') + deltaX,
            top: line.get('y2') + deltaY,
            radius: props.scaleProps.lineSelectorHeight * .75,
            fill: "#9a5f5f",
            padding: 10,
            strokeWidth: 1,
            originX: 'center',
            originY: 'center',
            hasBorders: false,
            hasControls: false,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            selectable: false,
            pointType: 'arrow_end',
            opacity: 0,
            name: 'square1',
            objecttype: "arrow_line",
            hoverCursor: "default",
        });
        setObjectPadding(square1, 5, 2)
        square1.line = line;

        var square2 = new fabric.Circle({
            left: line.get('x2') + deltaX,
            top: line.get('y2') + deltaY,
            radius: props.scaleProps.lineSelectorHeight * .75,
            fill: "#9a5f5f",
            padding: 10,
            strokeWidth: 1,
            originX: 'center',
            originY: 'center',
            hasBorders: false,
            hasControls: false,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            selectable: false,
            pointType: 'arrow_start',
            opacity: 0,
            name: 'square2',
            objecttype: "arrow_line",
            hoverCursor: "default",
        });
        setObjectPadding(square2, 5, 2)
        square2.line = line;
        line.ref_id = arrow.ref_id = arrow1.ref_id = square1.ref_id = square2.ref_id = id
        line.square1 = arrow.square1 = square2.square1 = square1;
        line.square2 = arrow.square2 = square1.square2 = square2;
        arrow1.square1 = square1
        arrow1.square2 = square2
        line.arrow = square1.arrow = square2.arrow = arrow;
        line.arrow1 = square1.arrow1 = square2.arrow1 = arrow1;
        canvas.add(line, arrow, arrow1, square1, square2);
        moveLine(line, canvas)
        moveEnd2(square1, canvas)
        addQuestionMark(line)
        canvas.setActiveObject(line)
        canvas.renderAll()

        objectOldValues = {
            line: {
                stroke: line.fill,
                strokeWidth: line.strokeWidth,
            },
            arrow: {fill: line.arrow.fill, scaledWidth: line.arrow.width},
            square: {scaledWidth: line.square1.getScaledWidth()},
            text: ""
        }
    }

    const closeDimPopup = () => {
        if (!objectOldValues?.hasOwnProperty("line")) {
            setOpenDimensionPopup(false)
            return;
        }
        const lineProps = objectOldValues.line
        const arrowProps = objectOldValues.arrow
        const squareProps = objectOldValues.square
        const textProps = objectOldValues.text
        const actObj = canvas.getActiveObject();
        if (!actObj) return;
        const refID = actObj.ref_id;
        const objs = canvas.getObjects();
        const line = objs.find(o => o.name === "arrow_line" && o.ref_id === refID)
        const qMark = objs.find(o => o.name === "question-mark" && o.ref_id === refID)
        const text = objs.find(o => o.name === "dimension-text" && o.ref_id === refID)
        const zoom  =canvas.getZoom()
        if (line){
            line.set({
                stroke:lineProps.stroke,
                strokeWidth:lineProps.strokeWidth * zoom
            })
            line.arrow.set("fill", arrowProps.fill)
            line.arrow1.set("fill", arrowProps.fill)
              line.arrow.scaleToWidth((arrowProps.scaledWidth * zoom) * 1.6)
            line.arrow1.scaleToWidth((arrowProps.scaledWidth * zoom) * 1.6)
            line.square1.scaleToWidth(squareProps.scaledWidth * zoom)
            line.square2.scaleToWidth(squareProps.scaledWidth * zoom)
            qMark && qMark.scaleToHeight(20 * zoom)
        }
        if (textProps){
            text.set({
                fill:textProps.color,
                text:`${textProps.text} ${textProps.sym}`,
                fontSize:textProps.fontSize
            })
        }else{
            if (text && !qMark) {
                canvas.remove(text)
                addQuestionMark(line)
            }
        }
        canvas.renderAll();
        setOpenDimensionPopup(false)
        objectOldValues={}
    }
    const addShapeOnCanvas = (e,type) => {
        if (isMobile()) {
            const uuid = require("uuid");
            const id = uuid.v4(),canvasZoom = canvas.getZoom();
            let {x, y} = canvas.getCenterPoint()
            x *= canvasZoom
            y *= canvasZoom
            const canHalf = (canvas.getWidth() / canvasZoom) / 2;
            const lineWidth = canHalf * 0.015
            addArrow({
                color: "#33333",
                is_dashed: false,
                x1: x, y1: y, x2: x + (canHalf * 0.7), y2: y, id,
                left:x,top:y,
                scaleProps: {
                    fontWeight: 500,
                    height: 40 / canvasZoom,
                    lineHeight: 81.36,
                    lineSelectorHeight: 30.51,
                    strokeWidth: 6 / canvasZoom,
                    width: 56 / canvasZoom,
                }
            })
        }else selectedShapeType = type;
    }
    const handleUploadImage = (e) => {
        const file = e.target.files[0]
        loadImageIntoCanvas(file)
    }

    const handleChangeDimension = (e) => {
        updateDimensionText(e.target.value)
    }

    const updateDimensionText = (value) => {
        updateValuesForSelected(value)
    }

    const addDimensionText = (val, refId, line) => {
        if (!line) return;
        const {x,y} = line.getCenterPoint();
        const {x1, y1, x2, y2} = line;
        const angle = calcArrowAngle(x1, y1, x2, y2);
        let text = new fabric.Text(val, {
            left: x, top: y + 15, ref_id: refId,
            name: "dimension-text",
            fill:line.stroke,
            originX: "center",
            originY: "center",
            // backgroundColor: "white",
            // hoverCursor: "pointer",
            fontSize: 18,
            angle,
            evented:false,
            selectable:false
        })
        canvas.add(text);
        canvas.bringToFront(text)
        canvas.renderAll();

    }

    const loadImageIntoCanvas = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async (e) => {
            await setCanvasBackgroundImage(reader.result,canvas)
            setZoomAreaImgSrc(canvas.toDataURL({
                left: 0,
                top: 0,
                width: 300,
                height: 300
            }));
            setIsImageLoaded(true)
        };
    }

    const changeDimensionSymbol = (dim) => {
        setSelectedDimension(dim)
        setShowDropDownList(false)
    }
    const enableUploadHandler = (e) => {
        uploadImgInput.current.click();
    }
    const handleDeleteObject = () => {
        let obj = canvas.getActiveObject();
        if (!obj) return;
        setOpenDeleteConfirmation(true)
    }
    const confirmDeleteObject = (e, isNo = false) => {
        let obj = canvas.getActiveObject();
        if (!obj) return;
        if (isNo) setOpenDeleteConfirmation(false)
        else deleteObject(obj)
    }
    const setZoom =(canvas, value)=> {
        const focusObject = canvas.getActiveObject()
        const zoom = value / 100 || 1

        if (focusObject) {
            canvas.zoomToPoint(
                new fabric.Point(focusObject.getCenterPoint().x, focusObject.getCenterPoint().y),
                zoom
            )
        } else {
            canvas.zoomToPoint(
                new fabric.Point(canvas.width / 2, canvas.height / 2),
                zoom
            )
        }
    }
    const zoomIn = () => {
        const zoom = canvas.getZoom()
        const value = (zoom * 100) + 10
        setZoom(canvas,value)
    }
    const zoomOut = () => {
        const zoom = canvas.getZoom()
        const value = (zoom * 100) - 10
        if (value < 20) return;
        setZoom(canvas,value)
    }
    const showDimPopup = (e,isDimProp=false) => {
        setIsDimensionPopup(isDimProp)
        if (!openDimensionPopup) setOpenDimensionPopup(true)
    }
    const onDoneUpdate = () => {
        updateDimensionText()
        objectOldValues={}
        if (openDimensionPopup) setOpenDimensionPopup(false)
    }
    const onChangeTextSize = (e) => {
        const val = e.target.value;
        const activeObject = canvas.getActiveObject();
        if (!activeObject) return;
        const objs = canvas.getObjects()
        const text = objs.find(o => (o.name === "dimension-text") && o.ref_id === activeObject.ref_id)
        setCurrentFontSize(val)
        if (text) {
            text.set({fontSize:val})
            canvas.renderAll();
        }
    }
    const onChangeThickness = (e) => {
        const val = e.target.value;
        const activeObject = canvas.getActiveObject();
        if (!activeObject) return;
        const objs = canvas.getObjects()
        const line = objs.find(o => o.name === "arrow_line" && o.ref_id === activeObject.ref_id)
        const qMark = objs.find(o => o.name === "question-mark" && o.ref_id === activeObject.ref_id)
        const text = objs.find(o => (o.name === "dimension-text") && o.ref_id === activeObject.ref_id)
        setCurrentThickness(val)
        if (line) {
            line.set({
                strokeWidth:val * 0.5,
            })
            line.arrow.scaleToWidth(val * 2.5)
            line.arrow1.scaleToWidth(val * 2.5)
            line.square1.scaleToWidth(val * 3)
            line.square2.scaleToWidth(val * 3)

        }
        if (qMark) {
            qMark.scaleToWidth(val * 2)
        }
        if (text) {
            text.set({
                fontSize:val
            })
        }
        canvas.renderAll();

    }
    return (
        <div className="editor-main-wrapper">
            <div className="canvas-main-wrapper">
                <canvas id="canvas"/>
            </div>
            {openDimensionPopup && <UpdateDimPopup isDimPop = {isDimensionPopup} closeDimPopup={closeDimPopup} showDropDownList={showDropDownList} setShowDropDownList={setShowDropDownList} selectedDimension={selectedDimension}
                handleChangeDimension={handleChangeDimension} currentThickness={currentThickness} onChangeThickness={onChangeThickness} currentFontSize={currentFontSize} onChangeTextSize={onChangeTextSize} handleChangeColor={handleChangeColor} dimensionInputText={dimensionInputText} changeDimensionSymbol={changeDimensionSymbol}/>}
            <div className="properties-section-wrapper" style={{backgroundColor:`${isObjectSelected ? "#373737" : "#0077ff"}`}}>
                {
                    isObjectSelected ? <>
                        <div className="main-btn content-center" onClick={handleDeleteObject}>
                            <img className="main-btn-img" src={deleteIcon} height="35" width="35" alt="plus icon"/>
                        </div>
                        <div className="main-btn content-center" onClick={()=>showDimPopup("",true)}>
                            <img className="main-btn-img" src={settingIcon} height="35" width="35" alt="plus icon"/>
                        </div>
                        <div className="main-btn content-center" onClick={showDimPopup}>
                            <img className="main-btn-img" src={editIcon} height="35" width="35" alt="plus icon"/>
                        </div>
                        <div className="main-btn content-center" onClick={onDoneUpdate}>
                            <img className="main-btn-img" src={tickIcon} height="35" width="35" alt="plus icon"/>
                        </div>
                    </> : <>
                        <div className="main-btn content-center">
                            <img className="main-btn-img" src={plusIcon} height="35" width="35" alt="plus icon" onClick={() => addShapeOnCanvas("","arrowLine")}/>
                            <span className="btn-span">Ajouter une flèche</span>
                        </div>
                        <div className="main-btn content-center">
                            <img className="main-btn-img" src={saveIcon} height="35" width="35" alt="plus icon"/>
                            <span className="btn-span">Sauvegarder et quitter</span>
                        </div></>
                }
            </div>
            {
                showZoomBox && <ZoomInBox imageData={zoomAreaImgSrc || questionMarkIcon}/>
            }
            <div className="zoom-in-out-btn-wrapper">
                <Button customClass="zoomin-out-btn" text="-" onClicked={zoomOut}/>
                <Button customClass="zoomin-out-btn" text="+" onClicked={zoomIn}/>
            </div>
            <SideZooms zoomBySideBtn={zoomBySideBtn}/>


            {
                !isImageLoaded && <div className="upload-img-popup content-center" onClick={enableUploadHandler}>
                    <div className="upload-inner-wrapper">
                        <img className="upload-img" src={uploadImg} alt="uploadImg"/>
                        <span className="uploadImgText">UPLOAD IMAGE</span>
                        <input ref={uploadImgInput} className="d-none" id="image-upload" type="file" accept=".png, .jpg, .jpeg"
                               onChange={handleUploadImage}/>
                    </div>


                </div>
            }
            {openDeleteConfirmation && <DeleteConfirmPopup handleClick={confirmDeleteObject}/>}
        </div>
    );
}
export default CanvasEditor;
