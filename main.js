$(document).ready(function(){
	$('form#add').on('change', '#image-upload', function() {
		var canvas    = document.getElementById('image-workspace');
		var	context   = canvas.getContext('2d');
		// var	imgUpload = document.getElementById('image-upload');
		var img = new Image;
    	img.src = URL.createObjectURL(event.target.files[0]);

    	img.onload = function() {
    		canvas.height = this.height
    		canvas.width = this.width
    		context.drawImage(img, 0, 0, img.width, img.height);	
    	}
		
	});
});
