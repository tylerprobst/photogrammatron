//HW: while drawing on an image; make canvas over top of image;
//HW: when done drawing img.src will = the new canvas.toDataURL();
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
            initHeight    = this.height;
            canvas.height = this.height;
            canvas.width  = this.width
            context.drawImage(img, 0, 0, this.width, this.height);
            updateImage.call(this);
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
		$this.buttonController();

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

		            if (bottom < top) top  = bottom;
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
		$this.buttonController();


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
				img.width  = newW;
			});
		}

		else {
			$('img#image').off('click');
		}
	});
    //zoom out
	$('button#zoom-out').on('click', function (event) {
		var $this = $(this);
		$this.buttonController();


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
				img.width  = newW;
				
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
		$this.buttonController();

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
						
					imgWrapper.style.top  = imgTop + offsetY + 'px';
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

    //crop
    $('button[name="crop-image"]').on('click', function (event) {
        var $selection = $('#selection'),
            position   = $selection.position(),
            height     = $selection.height()/imgScale,
            width      = $selection.width()/imgScale,
            imgData    = context.getImageData(position.left/imgScale, position.top/imgScale, width, height);

        canvas.height = height;
        canvas.width  = width;
        initHeight    = height;

        context.putImageData(imgData, 0, 0);

        img.src = canvas.toDataURL();
        imgWrapper.style.top = 0 + 'px';
        imgWrapper.style.left = 0 + 'px';
        $selection.remove();
    });

    //rotate clockwise
    $('button#clockwise').on('click', function (event) {
    	var angleInDegrees = 0;

    	angleInDegrees = (angleInDegrees + 90) % 360;
    	drawRotated(angleInDegrees);
    });

    //rotate counter clockwise
    $('button#counter-clockwise').on('click', function (event) {
    	var angleInDegrees = 0;

    	angleInDegrees = (angleInDegrees - 90) % 360;
    	drawRotated(angleInDegrees);
    });

    //paint things
    $('button#paint').on('click', function (event){
        var $this    = $(this),
            $wrapper = $('div#image-wrapper'),
            offset   = $wrapper.offset(),
            coords   = [];

        $this.buttonController();

        if($this.val() === 'ON') {
            $('img#image').on('mousedown', function (event) {
                var x = event.pageX - offset.left,
                    y = event.pageY - offset.top;

                event.preventDefault();
                paint = true;
                coords.push({ x: x, y: y, drag: false });
                reDraw(coords);

                $('img#image').on('mousemove', function (event) {
                    var x = event.pageX - offset.left,
                        y = event.pageY - offset.top;
                    if (paint) {
                        coords.push({ x: x, y: y, drag: true });
                        reDraw(coords);
                    }
                });
            });

            $('img#image').on('mouseup', function (event) {
                paint = false;          
            });
        }
        else {
            $('img#image').off('mousedown');
            $('img#image').off('mousemove');
        }
    });

    function reDraw (coords) {
        var i = coords.length - 1;
        context.strokeStyle = "#000";
        context.lineJoin = "round";
        context.lineWidth = 5;

        context.beginPath();
        if (coords[i].drag && i) {
            context.moveTo(coords[i-1].x, coords[i-1].y);
        }
        else {
            context.moveTo(coords[i].x-1, coords[i].y);
        }
        context.lineTo(coords[i].x, coords[i].y);
        context.closePath();
        context.stroke();

        img.src = canvas.toDataURL();
    }

    function drawRotated (degrees) {
    	var	temp = canvas.width;

    	context.save(); 

    	canvas.width  = canvas.height;
    	canvas.height = temp;
    	
    	if (degrees > 0) {
    	 context.translate(canvas.width, 0);
    	}
    	
    	else {
    	context.translate(0, canvas.height);
    	}

    	context.rotate(degrees * Math.PI/180);
    	context.drawImage(img, 0, 0);
    	context.restore();
    	img.src = canvas.toDataURL();

    	
    }

    $('button#text').on('click', function (event) {
    	var position     = $('#selection').position(),
    		text         = $('#text-content').val(),
    		fontSize     = $('#font-size').val(),
    		fontColor    = $('#font-color').val();

    	context.fillStyle = fontColor;
    	context.font = fontSize + "px sans-serif";
    	console.log(fontSize);
    	context.textBaseline = 'top';
    	context.fillText(text, position.left, position.top);
    	img.src = canvas.toDataURL();
		
    });


    function changeCanvasCallback (canvas, context) {
		var href = canvas.toDataURL('image/png');
		$('a#save').prop('href', href);
		$('#filename').on('change', function (event) {
			$('a#save').prop('download', $('#filename').val());
		});
	}

	$.fn.buttonController = function () { //refactor with a variable that holds the last button pressed and turn it and only it off  
		var $rectSelect = $('button#rectangular-selector'),
			$zoomIn     = $('button#zoom-in'),
			$zoomOut    = $('button#zoom-out'),
			$nav        = $('button#nav');

		if (this.val() === 'OFF') {
			
			$rectSelect.val('OFF');
			$rectSelect.removeClass('btn btn-success').addClass('btn btn-danger');
			$('div#image-wrapper').off('mousedown');

			$zoomIn.val('OFF');
			$zoomIn.removeClass('btn btn-success').addClass('btn btn-danger');
			$('img#image').off('click');

			$zoomOut.val('OFF');
			$zoomOut.removeClass('btn btn-success').addClass('btn btn-danger');
			$('img#image').off('click');

			$nav.val('OFF');
			$nav.removeClass('btn btn-success').addClass('btn btn-danger');
			$('div#image-wrapper').off('mousedown');

			this.val('ON');
			this.removeClass('btn btn-danger').addClass('btn btn-success');
		}
		else {
			this.val('OFF');
			this.removeClass('btn btn-success').addClass('btn btn-danger');
		}

	}
});
