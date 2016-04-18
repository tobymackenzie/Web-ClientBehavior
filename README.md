TJMLib Client Behavior Library
==============================

This is a library or collection of various JavaScript functions and classes that I ([Toby Mackenzie](https://www.tobymackenzie.com)) uses for my work at my job and for personal web projects.  It has no particular limit of scope beyond that.  Most or all of this has been used on some web projects I've done, though some parts have been used much more than others.  It is always in flux and may experience some significant backward compatibility breaks including large changes in interface and conventions in the near future.

src
------------

All current development is in the `src` folder.  Files are set up as AMD modules, so you can just `require()` whichever you need with your AMD loader of choice.  Most are dependent on my [class library](https://github.com/tobymackenzie/js-tmclasses), which must be pointed to as 'tmclasses/tmclasses' for AMD.  JQuery is also often used, and must be pointed to as 'jquery'.


old
------------

I haven't really used or updated stuff in the old folder in a couple years.  All new development has moved to the `src folder.  There are still some interesting things in there though, and every once in a while I find enough need for one that I move it `src` and update it.

Building things in the `old` folder is more manual.  You have to copy `base.js` into a file, remove what you don't need, and copy in whatever other files you want.  You then do any initialization in a callback passed to the `__.ready()` method.  Some of these scripts make use of other libraries such as jQuery or XUI.  They will almost always note this in the comments, but I also try to remember to give such files a sub-extension denoting this dependency.  They'll be named like

* jQuery: [filename].jq.js
* XUI: [filename].xui.js

Future plans
------------

- There is some things in `src` that are old and no longer used.  I need to figure out which modules these are and remove them.
- The good stuff in `old` should be ported to `src` as needed.
- Tests should be simplified.
- Tests need to be made for more of the modules.
- I would like to split this up into multiple libraries with more narrow purposes.
- Eventually I can migrate this stuff to ES6 modules.
