//hw: make crop work relative to how far you're zoomed in or out
//hw: make nav work again 


$(document).ready(function(){
	var canvas      = document.createElement('canvas'),
		context     = canvas.getContext('2d'),
		img         = $('img#image')[0],
		$imgWrapper = $('div#image-workspace');

	//input, draw to canvas
	$('input#image-upload').on('change', function (event) {
    	
    	img.src = URL.createObjectURL(event.target.files[0]);

    	img.onload = function() {
			canvas.height = this.height;
			canvas.width = this.width;
			context.drawImage(img, 0, 0, img.width, img.height);
			changeCanvasCallback(canvas, context);
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
		                left: (left -offset.left) + 'px',
		                height: height + 'px',
		                width: width + 'px'
		            })

		        });

		        $(window).one('mouseup', function (event){ //.one instead of .on , to stop the possibility of MANY mouseup listeners
		            $(window).off('mousemove');
		        });
	   		 });
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
				var ratio  = img.height/img.width,
					resize = 1.1,
					mouseX = event.pageX,
					mouseY = event.pageY,
					newH   = img.height * resize,
					newW   = img.width * resize,
					imgDiv = img.parentNode;

				event.preventDefault();

				img.style.height = newH + 'px';
				img.style.width = newW + 'px';
				
				console.log(mouseX, mouseY);

				imgDiv.scrollLeft = (mouseX * resize) - (newW/2)/2;
				imgDiv.scrollTop  = (mouseY * resize) - (newH/2)/2;
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
				var ratio  = img.height/img.width,
					resize = 0.9,
					mouseX = event.pageX,
					mouseY = event.pageY,
					newH   = img.height * resize,
					newW   = img.width * resize,
					imgDiv = img.parentNode;

				event.preventDefault();

				img.style.height = newH + 'px';
				img.style.width = newW + 'px';
				
				//use jquery to get the workspace, use offset to get top and left and get height and width then depending on where you
				//click to zoom in or out use that info to recenter the image.
				imgDiv.scrollLeft = (mouseX * resize) - (newW/2)/2;
				imgDiv.scrollTop  = (mouseY * resize) - (newH/2)/2;
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
			$('img#image').on('mousedown', function (event) {
				var startX  = event.pageX,
					startY  = event.pageY;
					imgLeft = img.offsetLeft,
					imgTop  = img.offsetTop;

				event.preventDefault();

				$(window).on('mousemove', function (event) {
					var	clickX   = event.pageX,
						clickY   = event.pageY,
						offsetX  = clickX - startX,
						offsetY  = clickY - startY;

					event.preventDefault();
						
					img.style.position = 'absolute';
					img.style.top = imgTop + offsetY + 'px';
					img.style.left = imgLeft + offsetX + 'px';

				});

				$(window).one('mouseup', function (event) {
					$(window).off('mousemove');
				});
			});
		}

		else {
			$('img#image').off('mousedown');
		}

	});
	

	function changeCanvasCallback (canvas, context) {
		var href = canvas.toDataURL('image/png');
		$('a#save').prop('href', href);
		// set listener on filename for change and set download property on a tag to change filename
	}

});



