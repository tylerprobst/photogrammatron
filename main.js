$(document).ready(function(){
	$('form#add').on('change', '#image-upload', function() {
		var canvas    = document.getElementById('image-workspace');
		var	context   = canvas.getContext('2d');
		// var	imgUpload = document.getElementById('image-upload');
		var img = new Image;
    	img.src = URL.createObjectURL(event.target.files[0]);
    	// canvas.height = img.height
    	// canvas.width = img.width

    	img.onload = function() {
    		context.drawImage(img, 0, 0, canvas.width, canvas.height);	
    	}
		
	});
});
