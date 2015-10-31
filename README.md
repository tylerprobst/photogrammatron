Photogrammatron

File/link/random upload

Do to pic: (features)

crop
resize
rotate
clone stamp (retouch)
levels
 - RGB
 - Hue
 - Contrast
filters (Sepia, sharpness, etc.)
drawing
text
color fill
((in layers?))


UI: (user interface)

zoom
make a selection
	-rectangular
	-circular
	-free hand
	-undo/redo (just save what pixels changed?)(save layers and all changes to layers?)(save simple data to what they have done)
	-save/download (to computer)(oauth to other applications to post to fb, twit, etc.)



Simplest implementation first


PHASE 1 MVP (Minimum Viable Product):

Features:
+ link upload (onto canvas display)

+ crop
+ save

UI:
+ rectangular selection


PHASE 2:

Features:
+ rotate 

UI:
+ zoom and navigate around
- circular selector 
+ text (similar to drawing)


PHASE 3:

Features:
- filters
- levels
- drawing
- clone stamp


PHASE 4:

- fb-integration
- undo/redo
- login/ save to our server


listen for click event. create div. position on page/picture LOOK AT ISSUES NOTE!!!!

- css class border for rectangle. mouse down or up, locations, h and w.

****MAKE IT CROP!!!!!!!!!!!!!!
- - maybe look at resize. ? not important.

+//add the button for the paint in the buttonController
+//prevent default. event.preventDefault() event.stopPropogation()
+
+//single object to hold all the arguments (a single array of coords.) (kind of like a dictionary)
