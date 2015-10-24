$(document).ready(function(){
	var canvas      = document.createElement('canvas'),
        context     = canvas.getContext('2d'),
		img         = $('img#image')[0],
		imgWrapper  = $('div#image-wrapper')[0],
		imgScale, 
		initHeight;

   
	//input. draw to canvas
	$('input#image-upload').on('change', function (event) {
    	
    	img.src = URL.createObjectURL(event.target.files[0]);
    	
    	img.removeAttribute('height');
    	img.removeAttribute('width');
    	imgScale = 1.00;

    	img.onload = function() {
            // first load
            initHeight = this.height;
            canvas.height = this.height;
            canvas.width = this.width
            context.drawImage(img, 0, 0, this.width, this.height);
            updateImage.call(this);
            // reset for subsequest loads
            this.onload = updateImage;
    	};

        function updateImage () {
            changeCanvasCallback(canvas, context);
            this.height = canvas.height * imgScale;
            this.width  = canvas.width * imgScale;
        }
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
    //zoom in
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
    //zoom out
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

    // circular selector
    /*$('div#image-wrapper').on('mousedown', function (event){

    })*/

    //image crop
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
    })

    //image rotation clockwise (can we put an image in there the circle rotating arrow thing)
    $('button#clockwise').on('click', function (event) {
        var angleInDegrees = 0;

        angleInDegrees = (angleInDegrees + 90) % 360;
        drawRotated(angleInDegrees);
    })

    $('button#counter-clockwise').on('click', function (event) {
        var angleInDegrees = 0;

        angleInDegrees = (angleInDegrees - 90) % 360;
        drawRotated(angleInDegrees);
    })

    function drawRotated (degrees) {
        var temp = canvas.width;

        canvas.width = canvas.height;
        canvas.height = temp;

        if (degrees > 0) {
            context.translate(canvas.width, 0);
        }
        else {
            context.translate(0, canvas.height);
        }
        context.rotate(degrees*Math.PI/180);
        context.drawImage(img, 0, 0);
        img.src = canvas.toDataURL();
        img.height = canvas.height * imgScale;
        img.width = canvas.width * imgScale;
    }
});

//why is it shrinking while it rotates??
// set height and width before it gets to the onload. (not have it degrade)
//rotate the image. circular selector??
