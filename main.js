$(document).ready(function(){
	var canvas      = document.createElement('canvas'),
        context     = canvas.getContext('2d'),
        img        = $('img#image')[0],
        $imgWrapper = $('div#image-workspace');

    //upload image to canvas
    $('input#image-upload').on('change', function (event) {  	
    	img.src = URL.createObjectURL(event.target.files[0]);

    	img.onload = function() {
    		canvas.height = this.height;
    		canvas.width  = this.width;
    		context.drawImage(img, 0, 0, img.width, img.height);	
    	}
	});

    //rectangular selector
    $('div#image-wrapper').on('mousedown', function (event) {
        var startTop  = event.pageY,
            startLeft = event.pageX,
            $box      = $('<div id="selection"></div>'),
            $wrapper  = $('#image-wrapper'),
            offset    = $wrapper.offset();

        $('#selection').remove();
        $('#image-wrapper').append($box);

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
                top   : (top - offset.top) + 'px',
                left  : (left - offset.left) + 'px',
                height: height + 'px',
                width : width + 'px'
            })

            console.log(top, left, height, width);
        });

        $(window).one('mouseup', function (event){ //one instead of on to stop the possibility of MANY mouseup listeners
            $(window).off('mousemove');
        });
    });

    //image crop
    //find selector, find 
    $('button[name="crop-image"]').on('click', function (event) { //on clicking the crop button
        var $selection = $('#selection'),
            position   = $selection.position(),
            height     = $selection.height(),
            width      = $selection.width(),
            imgData    = context.getImageData(position.left, position.top, width, height);

        canvas.height = height;
        canvas.width  = width;

        context.putImageData(imgData, 0, 0)

        img.src = canvas.toDataURL();
        selection.remove()
    })

});

//to DataURL method to pull the box out. that will give you the url to put into the image.

//find the box with jQuery... Top and left are not going to be relative right now to the image workspace
//offSet on image workspace, subtract to find box.

//we do need a common function that will take the new data for the image, and then a callback.

//get EMILYSLIST working!!!!!!!!!!!!

//Amazon S3.