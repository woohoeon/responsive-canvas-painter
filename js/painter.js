/**
 * painter.js
 */

const _touch = 'click', 
_start = 'mousedown', 
_move = 'mousemove',
_end = 'mouseup',
_out = 'mouseout',
red = '#ff0000',
blue = '#00b1ff',
yellow = '#ffe600',
green = '#00ff00',
black = '#1a1a1a',
VERTICALITY = 'verticality',
HORIZONTALITY = 'horizontality';

const pen = (function() {
	
	let initialized = null,
	color = red,
	weight = 3,
	type = 'pen',
	join = 'round',
	cap = 'round',
	mode = null;
	
	return {
	    getType : function() {
	    	return type;
		},
		getColor : function() {
			return color;
		},
		getWeight : function() {
			return weight;
		},
		getJoin : function() {
			return join;
		},
		getCap : function() {
			return cap;
		}
	};
}());

const controller = (function() {
	
	const canvas = document.getElementById('canvasLayer'),
	canvasI = document.getElementById('canvasInterfaceLayer');
	$canvasLayer = $('#canvasLayer'),
	$canvasInterfaceLayer = $('#canvasInterfaceLayer'),
	ctx = canvas.getContext('2d'),
	ctxI = canvasI.getContext('2d');
	
	let section = document.getElementById('section'), 
	paintStyle = getComputedStyle(section),
	mouse = { x : 0, y : 0 },
	lines = [ ],
	lineOptions = [ ],
	modes = [ ],
	canvasOffset = $canvasInterfaceLayer.offset(),
	offsetX = canvasOffset.left,
	offsetY = canvasOffset.top,
    offsetw = 0,
    offseth = 0,
	startX, startY, mouseX, mouseY,
    resizescale = 0,
	isDown = false;
	
	if ($canvasLayer.hasClass('canvas-layer-disable')) {
		$canvasLayer.removeClass('canvas-layer-disable');
	}
	if ($canvasInterfaceLayer.hasClass('canvas-layer-disable')) {
		$canvasInterfaceLayer.removeClass('canvas-layer-disable');
	}
	
	canvas.width = parseInt(paintStyle.getPropertyValue('width'));
	canvas.height = parseInt(paintStyle.getPropertyValue('height')) ? 0 : window.innerHeight;
	canvasI.width = parseInt(paintStyle.getPropertyValue('width'));
	canvasI.height = parseInt(paintStyle.getPropertyValue('height')) ? 0 : window.innerHeight;
	
	function penHandleMouseDown(e) {
		ctx.beginPath();
        if (resizescale === 0) {
            ctx.moveTo(mouse.x, mouse.y);
        } else {
            if (offsetw !== 0) {
                ctx.moveTo(((mouse.x - offsetw) / resizescale), (mouse.y / resizescale));
            } else if (offseth !== 0) {
                ctx.moveTo((mouse.x / resizescale), ((mouse.y - offseth) / resizescale));
            } else {
                ctx.moveTo((mouse.x / resizescale), (mouse.y / resizescale));
            }
        }
        canvas.addEventListener(_move, onPaint, false);
    };
    
    function penHandleMouseUp() {
        canvas.removeEventListener(_move, onPaint, false);
    };
    
    function onPaint() {
         let pointerX = 0, 
         pointerY = 0;
         
         if (resizescale === 0) {
             pointerX = mouse.x;
             pointerY = mouse.y;
         } else {
             if (offsetw !== 0) {
                 pointerX = ((mouse.x - offsetw) / resizescale);
                 pointerY = (mouse.y / resizescale);
             } else if (offseth !== 0) {
                 pointerX = (mouse.x / resizescale);
                 pointerY = ((mouse.y - offseth) / resizescale);
             } else {
                 pointerX = (mouse.x / resizescale);
                 pointerY = (mouse.y / resizescale);
             }
         }
         
         if (pen.getType() === 'pen'){
             ctx.globalCompositeOperation = 'source-over';
             ctx.lineTo(pointerX, pointerY);
             ctx.stroke();
         }
    }
    
    function getPageX(e) {
    	let pageX = 0;
    	pageX = e.pageX;
    	return pageX;
    }
    
    function getPageY(e) {
    	let pageY = 0;
    	pageY = e.pageY;
    	return pageY;    
    }
    
	return {
		init : function() {
		    ctx.lineWidth = pen.getWeight(),
		    ctx.lineJoin = pen.getJoin(),
		    ctx.lineCap = pen.getCap();
		    ctx.strokeStyle = pen.getColor();
		    
		    $canvasLayer.show();
		    $canvasInterfaceLayer.addClass('canvas-layer-disable');
		    
            canvas.removeEventListener(_start, function(e) {
            	penHandleMouseDown(e);
            }, false);
            canvas.removeEventListener(_move, function(e) {
            	mouse.x = getPageX(e) - this.offsetLeft;
            	mouse.y = getPageY(e) - this.offsetTop;
            }, false);
            canvas.removeEventListener(_end, function(e) {
            	penHandleMouseUp();
            }, false);
            canvas.removeEventListener(_out, function(e) {
            	penHandleMouseUp();
            }, false);
            
            canvas.addEventListener(_start, function(e) {
            	penHandleMouseDown(e);
            }, false);
            canvas.addEventListener(_move, function(e) {
            	mouse.x = getPageX(e) - this.offsetLeft;
            	mouse.y = getPageY(e) - this.offsetTop;
            }, false);
            canvas.addEventListener(_end, function(e) {
            	penHandleMouseUp();
            }, false);
            canvas.addEventListener(_out, function(e) {
            	penHandleMouseUp();
            }, false);
		}
	}
}());

(function() {
	controller.init();
})();