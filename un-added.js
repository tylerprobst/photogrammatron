$('button#crop-image').on('click', function (event) {
		var $selection = $('div#selection'),
			position   = $selection.position(),
			width      = $selection.width(),
			height     = $selection.height(),
			imgData    = context.getImageData(position.left, position.top, width, height);

		canvas.width  = width;
		canvas.height = height;

		context.putImageData(imgData, 0, 0);

    	img.src = canvas.toDataURL();

    	$selection.remove();
	});