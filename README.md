# responsive-canvas-painter
A responsive HTML5 canvas painter

#### [Online Demo](https://woohoeon.github.io/responsive-canvas-painter/)

## Example

**css:**

```html
<link rel="stylesheet" href="css/painter.css" type="text/css">
```

**html:**

```html
<div id="section">
	<canvas class="canvas-layer" id="canvasLayer"></canvas>
	<canvas class="canvas-layer" id="canvasInterfaceLayer"></canvas>
</div>
```

**javascript:**

```html
<script type="text/javascript" src="js/painter.js"></script>
```

It can be initialised with optional parameters.

```javascript
(() => {
	
	const painter = canvasPainter('canvasLayer', 'canvasInterfaceLayer', '700', '500');
	
	painter.init({
		type : 'pen', 
		weight : 3, 
		cap : 'round',
		color : '#ff2988'
	});
	
})();
```

or

```javascript
(() => {
	
	const painter = canvasPainter('canvasLayer', 'canvasInterfaceLayer', '700', '500');
	
	painter.init();
	
})();
```
