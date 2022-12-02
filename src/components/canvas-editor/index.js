import React, {useEffect, useState} from "react";
import {fabric} from 'fabric';
import '../fabric-overrids'
import './index.css'
import {moveEnd, moveEnd2, moveLine, setArrowAlignment, transformedPoint} from "../utils";

import questionMarkIcon from "../../assets/question-mark.png"
import ColorsPanel from "./colorsPanel";
let canvas, colors=['red','green', 'blue', 'purple'],selectedShapeType = '',isAddingShape = false, initialPointers = {};
const CanvasEditor = () =>{

    // Declare and initialize component states.
    const [isImageLoaded, setIsImageLoaded] = useState(false) // has one yard value

    useEffect(() => {
        // Initialize canvas and set dimension.
        inItCanvas();
    },[]);

    const inItCanvas =()=>{
        // Initialize fabric canvas
        canvas = new fabric.Canvas('canvas',{
            allowTouchScrolling: true,
            backgroundColor:'white',
            selection: false,
        })

        window.canvas = canvas;

        // On canvas events
        onCanvasEvents(canvas)
        // set canvas height and width
        adjustCanvasDimensions()
        canvas.renderAll();
    }
    const adjustCanvasDimensions=()=>{
        let elHeight = 0, elWidth = 0;
        // get height and width of canvas-main-wrapper div.
        document.querySelectorAll('div').forEach((el)=>{
            if (el.classList.contains('canvas-main-wrapper')){
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

    function onCanvasEvents(canvas){
        // canvas events
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
            'mouse:up':mouseUp,
            'mouse:down':mouseDown,
            'mouse:move':mouseMove,
        })
    }
    const added=()=>{}
    const objectModified=()=>{
        const actObj = canvas.getActiveObject();
        if (!actObj) return;
        updateArrowObject(actObj, "moving");
    }
    const objectScaling=()=>{}
    const objectMoving=(e)=>{
        const obj = e.target;
        updateArrowObject(obj, "moving")
        if (obj.name === "arrow_line"){
            const qMark = canvas.getObjects().find(o=>o.name === "question-mark" && o.ref_id === obj.ref_id )
            if (qMark){
                const {x1,y1,x2,y2} = obj.custom.linePoints;
                qMark.set({
                    left:(x1 + x2) / 2,
                    top:(y1 + y2) / 2
                })
                qMark.setCoords();
            }
            canvas.renderAll()
        }
    }
    const objectScaled=()=>{}
    const selectionCreated=()=>{
        const actObj = canvas.getActiveObject();
        if (!actObj) return;
        updateArrowObject(actObj, "selected");
    }

    const updateArrowObject = (obj, state, multiSelection = false) => {
        switch (state) {
            case "selected":
                switch (obj.name) {
                    case "arrow_line":
                        if (multiSelection) break;
                        obj.square1.opacity = .5
                        obj.square2.opacity = .5
                        obj.square1.selectable = true
                        obj.square2.selectable = true
                        obj.square1.hoverCursor = obj.square2.hoverCursor = "pointer"
                        break;
                    case "line":
                        if (multiSelection) {
                            if (obj.pa) {
                                obj.pa.opacity = 1
                                obj.pa.selectable = false
                                obj.pa.hoverCursor = "pointer"
                            }
                            break;
                        }
                        const middlePointActInd = canvas._objects.findIndex((o) => o.ref_id.includes(obj.ref_id) && o.name === "pX");
                        const lineInd = canvas._objects.findIndex((o) => (o.name === "shadow-line" || o.name === "line") && o.ref_id.includes(obj.ref_id));
                        if (middlePointActInd > -1 && lineInd > -1) {
                            canvas._objects[middlePointActInd].opacity = .5;
                            canvas._objects[middlePointActInd].selectable = true;
                            canvas._objects[middlePointActInd].hoverCursor = "pointer"
                            canvas._objects[middlePointActInd].bringForward()
                            canvas._objects[lineInd].sendToBack();
                        }
                        obj.p0.opacity = obj.p2.opacity = .5
                        obj.p0.selectable = obj.p2.selectable = true
                        obj.p0.hoverCursor = obj.p2.hoverCursor = "pointer"
                        if (obj.pa) {
                            obj.pa.opacity = 1
                            obj.pa.selectable = false
                            obj.pa.hoverCursor = "pointer"
                        }
                        break;
                    case "shadow-line":
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

                        moveEnd2(obj,canvas)
                        break;
                    case "square2":
                        moveEnd(obj,"",canvas)
                        break;
                    case "pa":
                        break;
                    case "p0":
                    case "p2":
                        var p1 = obj.p1
                        p1.opacity = 0
                        p1.selectable = false

                        if (obj.line1) {
                            obj.line1.path[0][1] = obj.left;
                            obj.line1.path[0][2] = obj.top;
                        } else if (obj.line3) {
                            obj.line3.path[1][3] = obj.left;
                            obj.line3.path[1][4] = obj.top;
                        }

                        break;
                    case "p1":
                        if (obj.ref_id.includes('shadow')) {
                            obj.line2.path[1][1] = obj.left;
                            obj.line2.path[1][2] = obj.top;
                            break;
                        }
                        obj.p1 = {
                            ...obj.p1,
                            opacity: 1,
                            hoverCursor: "pointer",
                        }
                        if (obj.pa) {
                            obj.pa.opacity = 1
                            obj.pa.selectable = false
                            obj.pa.hoverCursor = "pointer"
                        }
                        if (obj.line2) {
                            obj.line2.path[1][1] = obj.left;
                            obj.line2.path[1][2] = obj.top;
                        }
                        break;
                    case "line":
                        const middlePointActInd = canvas._objects.findIndex((o) => o.ref_id.includes(obj.ref_id) && o.name === "pX");
                        if (middlePointActInd > -1) {
                            canvas._objects[middlePointActInd].opacity = 0;
                            canvas._objects[middlePointActInd].selectable = false;
                        }
                        obj.p0.opacity = obj.p1.opacity = obj.p2.opacity = 0
                        obj.p0.selectable = obj.p1.selectable = obj.p2.selectable = false
                        if (obj.pa) {
                            obj.pa.opacity = 0
                            obj.pa.selectable = true
                        }
                        var transformedPoints = transformedPoint(obj);
                        obj.p0.left = transformedPoints[0].x;
                        obj.p0.top = transformedPoints[0].y;
                        obj.p2.left = transformedPoints[1].x;
                        obj.p2.top = transformedPoints[1].y;
                        obj.p1.left = transformedPoints[2].x;
                        obj.p1.top = transformedPoints[2].y;
                        if (obj.pa) {
                            obj.pa.left = transformedPoints[0].x;
                            obj.pa.top = transformedPoints[0].y;
                        }
                        break;
                    case "shadow-line":
                        break;
                    case "player":
                        break;
                }
                break;
        }
        canvas.renderAll()
    }

    const selectionUpdated=()=>{
        const activeObject = canvas.getActiveObject();
        if (!activeObject) return;
        updateArrowObject(activeObject, "selected")
    }
    const cleared=()=>{
        clearSelection()

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
            }
        }
        canvas.renderAll();
    }
    const handleChangeColor=(color)=>{
        const activeObject = canvas.getActiveObject();
        if (!activeObject) return;
        if (activeObject.name === 'arrow_line') {
            activeObject.set({ stroke: color })
            if (activeObject.arrow) {
                activeObject.arrow.set({ fill: color })
            }
        }
        if (activeObject.name === 'square1' || activeObject.name === 'square2') {
            activeObject.line.set({ stroke: color })
            if (activeObject.arrow) {
                activeObject.arrow.set({ fill: color })
            }
        }
        canvas.renderAll();
    }
    const mouseUp =()=>{
        if (isAddingShape){
            const objs = canvas.getObjects();
            const lineGroupInd = objs.findIndex(o=>o.isAddingMode);
            if (lineGroupInd > -1){
                const lineGroup = objs[lineGroupInd];
                if (lineGroup.type !== "group") return;
                const line = lineGroup._objects[0];
                const arrow = lineGroup._objects[1];
                const {x1,y1,x2,y2} = line;
                lineGroup.isAddingMode = false;
                lineGroup.evented = true;
                const uuid = require("uuid");
                const id = uuid.v4();
                addQuestionMark((line.x1 + line.x2) / 2,(line.y1 + line.y2) / 2,arrow.angle,id)
                addArrow({
                    color:"#33333",
                    is_dashed:false,
                    x1,y1,x2,y2,id,
                    left:lineGroup.left,
                    top:lineGroup.top,
                    angle:arrow.angle,
                    scaleProps:{
                        fontWeight:500,
                        height:40.68,
                        lineHeight:81.36,
                        lineSelectorHeight:30.51,
                        strokeWidth:6,
                        width:56.5,
                        top:407
                    }})
                canvas.remove(lineGroup)
            }
        }
        isAddingShape = false
        initialPointers = {}
        selectedShapeType = ''
        const obj = canvas.getActiveObject();
        if (obj) updateArrowObject(obj, "selected")
    }
    const addQuestionMark =(left,top,angle,refId)=> {
        let img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function () {
            let imgInstance = new fabric.Image(img, {
                crossOrigin: "Anonymous",
                ref_id: refId,
                left, top,
                originX: 'center',
                originY: 'center',
                evented:false,
                selectable:false,
                name: "question-mark",
            });
            imgInstance.set("angle",angle)
            imgInstance.scaleToHeight(40)
            canvas.add(imgInstance);
            canvas.setActiveObject(imgInstance);
            canvas.renderAll();
        };
        img.src = questionMarkIcon;
    }
    const mouseDown =(e)=>{
        if (!selectedShapeType) return;
        const {x,y} = e.pointer;
        initialPointers = e.pointer
        if (selectedShapeType === "arrowLine"){
            addArrowLine({x,y},x,y)
            isAddingShape = true
        }
    }
    const mouseMove =(e)=>{
        if (isAddingShape){
            const actObj = canvas.getObjects().find(o=>o.name === selectedShapeType && o.isAddingMode);
            if (actObj){
                const {x,y} = e.pointer;
                const calcOffsetX = x - initialPointers.x;
                const calcOffsetY = y - initialPointers.y;
                if (actObj.name === "circle" || actObj.name === "crossShape") actObj.scaleToHeight(calcOffsetY * 2)
                if (actObj.name === "arrowLine") {
                    addArrowLine(initialPointers,x,y)
                }
                canvas.renderAll();
            }
        }
    }


    const addArrowLine = ({x,y},newX2,newY2) => {
        const arrowLineInd = canvas.getObjects().findIndex(o=>o.name === "arrowLine" && o.opacity);
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
            strokeWidth: 3,
            originX:'center',
            originY:'center',
            name: "arrow_line",
            custom:{
                linePoints:{x1, y1, x2, y2}
            }
        });


        x2 = setArrowAlignment(x2, y2, tempVal).x2;
        y2 = setArrowAlignment(x2, y2, tempVal).y2;

        var arrow = new fabric.Triangle({
            left: x2,
            top: y2,
            angle: (angle * (180 / (3.142))) - 30,
            width: 15,
            height: 15,
            originX:'center',
            originY:'center',
            fill: 'black',
            name: "arrow",
        });
        const group = new fabric.Group([line,arrow], {
            name: "arrowLine",
            originX:'center',
            originY:'center',
            isAddingMode:true,
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
            isAddingMode:true,
            // perPixelTargetFind: true,
            objecttype: "arrow_line",
            custom:{
                linePoints:{x1, y1, x2, y2}
            }
        });
        setObjectPadding(line, 20, 10)
        if (props.is_dashed) {
            line.set({ strokeDashArray: [5, 5] })
        }
        var centerX = (line.x1 + line.x2) / 2,
            centerY = (line.y1 + line.y2) / 2,
            deltaX = line.left - centerX,
            deltaY = line.top - centerY;


        var arrow = new fabric.Triangle({
            left: line.get('x2') + deltaX,
            top: line.get('y2') + deltaY,
            originX: 'center',
            originY: 'center',
            hasBorders: false,
            hasControls: false,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            selectable: false,
            pointType: 'arrow_start',
            angle: props.angle,
            width: (props.scaleProps.height / 2) - 2,
            height: (props.scaleProps.height / 2) - 2,
            fill: props.color,
            objecttype: "arrow_line",
            name: "arrow",
        });
        arrow.line = line;
        // var arrow1 = new fabric.Triangle({
        //     left: line.get('x2') + deltaX,
        //     top: line.get('y2') + deltaY,
        //     originX: 'center',
        //     originY: 'center',
        //     hasBorders: false,
        //     hasControls: false,
        //     lockScalingX: true,
        //     lockScalingY: true,
        //     lockRotation: true,
        //     selectable: false,
        //     pointType: 'arrow_start',
        //     angle: props.angle,
        //     width: (props.scaleProps.height / 2) - 2,
        //     height: (props.scaleProps.height / 2) - 2,
        //     fill: props.color,
        //     objecttype: "arrow_line",
        //     name: "arrow",
        // });
        // arrow1.line = line;
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
        //
        // line.ref_id = arrow.ref_id = arrow1.ref_id = square1.ref_id = square2.ref_id = id
        // line.square1 = arrow.square1 = arrow1.square1 = square2.square1 = square1;
        // line.square2 = arrow.square2 = arrow1.square2 = square1.square2 = square2;
        // line.arrow = square1.arrow = square2.arrow = arrow;
        // line.arrow1 = square1.arrow1 = square2.arrow1 = arrow1;
        // canvas.add(line, arrow,arrow1, square1, square2);

        line.ref_id = arrow.ref_id = square1.ref_id = square2.ref_id = id
        line.square1 = arrow.square1 = square2.square1 = square1;
        line.square2 = arrow.square2 = square1.square2 = square2;
        line.arrow = square1.arrow = square2.arrow = arrow;
        canvas.add(line, arrow, square1, square2);
        moveLine(line,canvas)
        moveEnd2(square1,canvas)
        canvas.setActiveObject(line)
        canvas.renderAll()
    }


    const addShapeOnCanvas =(type)=>{
        selectedShapeType = type
        // const uuid = require("uuid");
        // const id = uuid.v4();
        // addArrow({color:"#33333",is_dashed:false,left:300,top:200,ref_id:id,scaleProps:{fontWeight:500,height:40.68,lineHeight:81.36, lineSelectorHeight:30.51,strokeWidth:4.0357,width:56.5,top:407}})

    }
    const handleUploadImage =(e)=>{
        const file = e.target.files[0]
        loadImageIntoCanvas(file)
    }

    const loadImageIntoCanvas =(file)=>{
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload =async (e)=> {
            addImage(reader.result)
        };
    }
    const addImage = (src,left,top) => {
        const uuid = require("uuid");
        const id = uuid.v4();
        let img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function () {
            let imgInstance = new fabric.Image(img, {
                crossOrigin: "Anonymous",
                ref_id: id,
                left: canvas.getWidth()/2,
                top: canvas.getHeight()/2,
                originX: 'center',
                originY: 'center',
                evented:false,
                selectable:false,
                name: "bg-image",
            });

            imgInstance.scaleToHeight(canvas.getHeight() * 0.8)

            canvas.add(imgInstance);
            canvas.setActiveObject(imgInstance);
            canvas.renderAll();
            setIsImageLoaded(true)
        };
        img.src = src;
    };

    return (
        <div className="editor-main-wrapper">
            <div className="canvas-main-wrapper">
                <canvas id="canvas"/>
            </div>
            <div className="zoomin-arrow"/>
            <ColorsPanel colors={colors} handleChangeColor={handleChangeColor}/>
            <button className="drawBtn" onClick={()=>addShapeOnCanvas("arrowLine")}>Draw Arrow</button>
            {
                !isImageLoaded && 
                // <div className="upload-img-popup content-center">
                //     <span>UPLOAD IMAGE</span>
                //     <input id="image-upload" type="file" onChange={handleUploadImage}/>
                // </div>
                <div className="upload-image-container upload-img-popup">
                    <label className="upload-label">
                    <div>
                        <img src="/images/upload.png" alt="Upload Image" width="150px" />
                    </div>
                    Upload Image
                    <input type="file" id="image-upload"  accept="image/*" onChange={handleUploadImage} />
                    </label>
                </div>
            }
        </div>
    );
}
export default CanvasEditor;
