/**
 * painter.js
 */
'use strict';

const _start = 'mousedown', 
_move = 'mousemove',
_end = 'mouseup',
_out = 'mouseout';

const Pen = (() => {
	
	const operation = 'source-over';
	
	let color, 
	weight, 
	cap;
	
	return {
		getOperation : () => operation,
		getColor : () => color,
		getWeight : () => weight,
		getCap : () => cap,
		setWeight : w => {
			weight = w;
		},
		setData : data => {
			color = data.color;
			weight = data.weight;
			cap = data.cap;
		}
	};
	
})();

const canvasPainter = (id, interfaceId, canvasW, canvasH) => {
	
	const canvas = document.getElementById(id),
	canvasI = document.getElementById(interfaceId),
	ctx = canvas.getContext('2d'),
	ctxI = canvasI.getContext('2d');

	canvas.width = canvasW;
	canvas.height = canvasH;
	canvasI.width = canvasW;
	canvasI.height = canvasH;
	
	let chose,
	drawData,
	lineScale = 1,
	mouse = { x : 0, y : 0 },
	windowW = window.innerWidth,
	windowH = window.innerHeight,
	offsetLeft = canvas.offsetLeft,
	offsetTop = canvas.offsetTop;
	
	const _onPaint = () => {
		const mouseX = canvas.offsetLeft !== 0 ? (mouse.x - canvas.offsetLeft) : mouse.x; 
		const mouseY = canvas.offsetTop !== 0 ? (mouse.y - canvas.offsetTop) : mouse.y; 
		ctx.lineTo(mouseX, mouseY);
		ctx.stroke();
	};
	
	const _handleMouseDown = () => {
		ctx.beginPath();
		const mouseX = canvas.offsetLeft !== 0 ? (mouse.x - canvas.offsetLeft) : mouse.x; 
		const mouseY = canvas.offsetTop !== 0 ? (mouse.y - canvas.offsetTop) : mouse.y; 
		ctx.moveTo(mouseX, mouseY);
		canvas.addEventListener(_move, _onPaint, false);
	};
	
	const _handleMouseMove = (e) => {
		mouse.x = e.pageX;
		mouse.y = e.pageY;
	};
	
	const _handleMouseUp = () => {
		canvas.removeEventListener(_move, _onPaint, false);
		drawData = canvas.toDataURL();
	};
		
	const _setCtx = () => {
		ctx.globalCompositeOperation = chose.getOperation();
		ctx.strokeStyle = chose.getColor();
		ctx.lineWidth = (chose.getWeight() * lineScale);
		ctx.lineCap = chose.getCap();
		
		Pen.setWeight((chose.getWeight() * lineScale));
	};
	
	const _resizeCanvas = () => {
		
		setTimeout(() => {
			
			const canvasW = canvas.width,
			canvasH = canvas.height,
			newW = window.innerWidth,
			newH = window.innerHeight,
			scaleW = (newW / windowW),
			scaleH = (newH / windowH),
			newX = (canvasW * scaleW),
			newY = (canvasH * scaleH);
			
			canvas.width = newX;
			canvas.height = newY;
			canvasI.width = newX;
			canvasI.height = newY;
			windowW = newW;
			windowH = newH;
			offsetLeft = canvas.offsetLeft;
			offsetTop = canvas.offsetTop;
			
			if (scaleW >= 1 && scaleH >= 1) {
				lineScale = scaleW > scaleH ? scaleW : scaleH; 
			}
			
			if (scaleW <= 1 && scaleH <= 1) {
				lineScale = scaleW > scaleH ? scaleH : scaleW; 
			}
			
			_setCtx();
			
			if (drawData) {
				const img = new Image();
				img.onload = () => {
					canvas.getContext('2d').drawImage(img, 0, 0, newX, newY);
				};
				img.src = drawData;
			}
			
		}, 250);
		
	};

	window.addEventListener('resize', _resizeCanvas, false);
	
	return {
		init : (data = { type : 'pen', weight : 1, cap : 'round', color : '#000' }) => {
			
			switch (data.type) {
			case 'pen':
				Pen.setData(data);
				chose = Pen;
				canvas.style.display = 'block';
				canvasI.style.display = 'none';
				break;
			}
			
			_setCtx();
			
			canvas.addEventListener(_start, _handleMouseDown, false);
			canvas.addEventListener(_move, _handleMouseMove, false);
			canvas.addEventListener(_end, _handleMouseUp, false);
			canvas.addEventListener(_out, _handleMouseUp, false);
		}
	};
	
};