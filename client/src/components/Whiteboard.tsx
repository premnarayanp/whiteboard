import React, { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';

import io from 'socket.io-client';
import './Whiteboard.css';

const socket = io('http://localhost:5000');

const Whiteboard = () => {
    const canvasRef = useRef<fabric.Canvas | null>(null);
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);

    useEffect(() => {
        const canvas = new fabric.Canvas('canvas', {
            isDrawingMode: true,
        });
        canvas.freeDrawingBrush.color = color;
        canvas.freeDrawingBrush.width = brushSize;
        canvasRef.current = canvas;

        // Socket event listeners
        socket.on('draw', (data) => {
            canvas.loadFromJSON(data);
        });

        // Sending drawing data to other clients
        canvas.on('path:created', () => {
            const drawingData = canvas.toJSON();
            socket.emit('draw', drawingData);
        });

        return () => {
            socket.disconnect();
        };
    }, [color, brushSize]);

    const undo = () => {
        // Implement undo functionality
    };

    const redo = () => {
        // Implement redo functionality
    };

    const saveAsImage = () => {
        const dataURL = canvasRef.current?.toDataURL();
        const link = document.createElement('a');
        link.href = dataURL!;
        link.download = 'whiteboard.png';
        link.click();
    };

    return (
        <div className="whiteboard-container">
            <div className="toolbar">
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                />
                <input
                    type="range"
                    min="1"
                    max="50"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                />
                <button onClick={undo}>Undo</button>
                <button onClick={redo}>Redo</button>
                <button onClick={saveAsImage}>Save</button>
            </div>
            <canvas id="canvas" width="800" height="600"></canvas>
        </div>
    );
};

export default Whiteboard;
