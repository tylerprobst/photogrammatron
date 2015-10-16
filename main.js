$(document).ready(function(){
	$('input#image-upload').on('change', function (event) {
		var canvas    = document.getElementById('image-workspace'),
			context   = canvas.getContext('2d'),
		    img 	  = new Image;
    	
    	img.src = URL.createObjectURL(event.target.files[0]);

    	img.onload = function() {
    		canvas.height = this.height;
    		canvas.width = this.width;
    		context.drawImage(img, 0, 0, img.width, img.height);	
    	}
	});

    $('canvas#image-workspace').on('mousedown', function (event) {
        var startTop = event.pageY,
            startLeft = event.pageX,
            $box = $('<div id="selection"></div>');

        $('#selection').remove();
        $('body').append($box);

        $(window).on('mousemove', function (event) {
            var top = startTop,
                left = startLeft,
                bottom = event.pageY,
                right = event.pageX,
                height = Math.abs(bottom - top),
                width = Math.abs(right - left);

            event.preventDefault();

            if (bottom < top) top = bottom;
            if (right < left) left = right;

            $box.css({
                top: top + 'px',
                left: left + 'px',
                height: height + 'px',
                width: width + 'px'
            })

            console.log(top, left, height, width);
        });

        $(window).one('mouseup', function (event){ //one instead of on to stop the possibility of MANY mouseup listeners
            $(window).off('mousemove');
        });
    });
});



