//hw: look into flask S3 module
//hw: make reusable function for determining which toggle buttons are turned on and when a new one is turned on turn off the others.

$(document).ready(function(){
	var canvas      = document.createElement('canvas'),
		context     = canvas.getContext('2d'),
		img         = $('img#image')[0],
		imgWrapper  = $('div#image-wrapper')[0],
		imgScale, 
		initHeight;

	//input, draw to canvas
	$('input#image-upload').on('change', function (event) {
    	
    	img.src = URL.createObjectURL(event.target.files[0]);
    	
    	img.removeAttribute('height');
    	img.removeAttribute('width');
    	imgScale = 1.00;


    	img.onload = function() {
    		initHeight = this.height;
			canvas.height = this.height;
			canvas.width = this.width;
			context.drawImage(img, 0, 0, this.width, this.height);
			changeCanvasCallback(canvas, context);
			this.height = this.height * imgScale;
			this.width = this.width * imgScale;
    	};
	});
	//rectangular selector
	$('button#rectangular-selector').on('click', function (event) {    
		var $this = $(this);
		
		if($this.val() === 'OFF') {
			$this.val('ON');
			document.getElementById('rectangular-selector').className = 'btn btn-success';
		}
		else {
			$this.val('OFF');
			document.getElementById('rectangular-selector').className = 'btn btn-danger';
		}
		if($this.val() === 'ON') {
		    $('div#image-wrapper').on('mousedown', function (event) {
		        var startTop  = event.pageY,
		            startLeft = event.pageX,
		            $box      = $('<div id="selection"></div>'),
		            $wrapper  = $('div#image-wrapper'),
		            offset    = $wrapper.offset(); 

		        $('#selection').remove();
		        $('div#image-wrapper').append($box);

		        $(window).on('mousemove', function (event) {
		            var top    = startTop,
		                left   = startLeft,
		                bottom = event.pageY,
		                right  = event.pageX,
		                height = Math.abs(bottom - top),
		                width  = Math.abs(right - left);

		            event.preventDefault();

		            if (bottom < top) top = bottom;
		            if (right < left) left = right;

		            $box.css({
		                top: (top - offset.top) + 'px',
		                left: (left - offset.left) + 'px',
		                height: height + 'px',
		                width: width + 'px'
		            })

		        });

		        $(window).one('mouseup', function (event) { 
		            $(window).off('mousemove');
		        });
	   		 });
		}
		else {
			$('div#image-wrapper').off('mousedown');
		}
	});
 
	$('button#zoom-in').on('click', function (event) {
		var $this = $(this);
		
		if($this.val() === 'OFF') {
			$this.val('ON');
			document.getElementById('zoom-in').className = 'btn btn-success';
		}
		else {
			$this.val('OFF');
			document.getElementById('zoom-in').className = 'btn btn-danger';
		}

		if ($this.val() === 'ON') {
			$('img#image').on('click', function (event) {	
				var resize   = 1.1,
					mouseX   = event.pageX,
					mouseY   = event.pageY,
					newH     = img.height * resize,
					newW     = img.width * resize,
					imgDiv   = img.parentNode;

				imgScale = newH/initHeight;

				event.preventDefault();

				img.height = newH;
				img.width = newW;
			});
		}

		else {
			$('img#image').off('click');
		}
	});

	$('button#zoom-out').on('click', function (event) {
		var $this = $(this);
		
		if($this.val() === 'OFF') {
			$this.val('ON');
			document.getElementById('zoom-out').className = 'btn btn-success';
		}
		else {
			$this.val('OFF');
			document.getElementById('zoom-out').className = 'btn btn-danger';
		};

		if ($this.val() === 'ON') {
			$('img#image').on('click', function (event) {	
				var resize = 0.9,
					mouseX = event.pageX,
					mouseY = event.pageY,
					newH   = img.height * resize,
					newW   = img.width * resize,
					imgDiv = img.parentNode;

				event.preventDefault();

				imgScale = newH/initHeight;

				img.height = newH;
				img.width = newW;
				
				//use jquery to get the workspace, use offset to get top and left and get height and width then depending on where you
				//click to zoom in or out use that info to recenter the image.
				// imgDiv.scrollLeft = (mouseX * resize) - (newW/2)/2;
				// imgDiv.scrollTop  = (mouseY * resize) - (newH/2)/2;
			});
		}

		else {
			$('img#image').off('click');
		};
	});

	//nav around image 
	$('button#nav').on('click', function (event) {
		var $this = $(this);
		
		if ($this.val() === 'OFF'){
			$this.val('ON');
			document.getElementById('nav').className = 'btn btn-success';
		}

		else {
			$this.val('OFF');
			document.getElementById('nav').className = 'btn btn-danger';
		}

		if ($this.val() === 'ON'){
			$('div#image-wrapper').on('mousedown', function (event) {
				var startX  = event.pageX,
					startY  = event.pageY;
					imgLeft = imgWrapper.offsetLeft,
					imgTop  = imgWrapper.offsetTop;

				event.preventDefault();

				$(window).on('mousemove', function (event) {
					var	clickX   = event.pageX,
						clickY   = event.pageY,
						offsetX  = clickX - startX,
						offsetY  = clickY - startY;

					event.preventDefault();
						
					imgWrapper.style.top = imgTop + offsetY + 'px';
					imgWrapper.style.left = imgLeft + offsetX + 'px';

				});

				$(window).one('mouseup', function (event) {
					$(window).off('mousemove');
				});
			});
		}

		else {
			$('div#image-wrapper').off('mousedown');
		}

	});
	

	function changeCanvasCallback (canvas, context) {
		var href = canvas.toDataURL('image/png');
		$('a#save').prop('href', href);
		// set listener on filename for change and set download property on a tag to change filename
	}

    $('button[name="crop-image"]').on('click', function (event) { //on clicking the crop button
        var $selection = $('#selection'),
            position   = $selection.position(),
            height     = $selection.height()/imgScale,
            width      = $selection.width()/imgScale,
            imgData    = context.getImageData(position.left/imgScale, position.top/imgScale, width, height);

        canvas.height = height;
        canvas.width  = width;
        img.height    = height;
        img.width	  = width;

        context.putImageData(imgData, 0, 0);

        img.src = canvas.toDataURL();
        imgWrapper.style.top = 0 + 'px';
        imgWrapper.style.left = 0 + 'px';
        $selection.remove();
    });
});
