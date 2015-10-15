$(document).ready(function(){
	$('input#image-upload').on('change', function() {
		var canvas    = document.getElementById('image-workspace'),
			context   = canvas.getContext('2d'),
		    img 	  = new Image;
    	
    	img.src = URL.createObjectURL(event.target.files[0]);

    	img.onload = function() {
    		canvas.height = this.height
    		canvas.width = this.width
    		context.drawImage(img, 0, 0, img.width, img.height);	
    	}
		
	});
});
