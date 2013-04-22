TJMLib Client Behavior Library
==============================

This is a library or collection of various JavaScript functions and classes that [Toby Mackenzie](http://www.tobymackenzie.com) (me) uses for my work at my job and for personal web projects.  It has no particular limit of scope beyond that.  Most or all of this has been used on some web projects I've done, though some parts have been used much more than others.  It is always in flux and may experience some significant backward compatabilty breaks including large changes in interface and conventions in the near future.

## Useage

The build process is far from automated.  You create a JavaScript file, copy in the stuff from /base.js and remove or add what you need to give you a starting point.  You can add whatever 'main' type functionality you want to 'scrOnload'.  For any of the library functionality you want, you have to copy and paste each class/function manually into your file.  Most of them will note dependencies in comments at the top of the file for classes or above the functions, though there are problem some with this missing.

Note: This is changing.  I am modifying things to use require.js, but this is far from complete.  I will be moving more over time.  I also intend to make a minified build that has a minimal part of the library and then a wrapper to copy and paste in functions in the old way for those who don't want to use require.js.

## External Dependencies
Many of these scripts and functions are able to be used independently, pure JS.  Some of them make use of other libraries such as jQuery or XUI.  They will almost always note this in the comments, but I also try to remember to give such files a sub-extension denoting this depency.  They'll be named like

* jQuery: [filename].jq.js
* XUI: [filename].xui.js

## Future Plans

* come up with a cohesive and thought out set of conventions to follow for naming (files, classes, arguments, etc), commenting, interfaces, organization, etc
* separate out functionality of some classes so each class does a limited set of functionality that can easily be combined with other classes.  create classes the combine these other classes for frequently used functionality
* move to using a class creation system.  Hopefully this will make it easier to develop, better enforce conventions, and potentially make individual classes smaller by removing repeated code (Built, just have to move classes over to it)
* figure out better way to note/include dependencies (moving to require.js)
* figure out way to automate builds (will use require.js, perhaps with the help of Grunt)
