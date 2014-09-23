QuickNote-jQuery-Plugin
=======================

 jQuery plugin that lets you add quick note or todo note. Actually, its my first developed plugin :).
 

How To Use
=======================

 Add css: `<link type="text/css" rel="stylesheet" href="jquery.quicknote.css" />`
 
 Add js after jquery: `<script type="text/javascript" src="assets/js/jquery.quicknote.js"></script>`
 
 Add empty element (preferably DIV) like: `<div id="qn"></div>`
 
 Then at the bottom of the body tag:
 ```
 $(function(){
     $('#qn').quicknote();
 });
 ```
 Options are:
 ```
 theme: 'dark' or 'light'` # default is dark
 pos: 'right' or 'left' # default is right
 storage: true or false # default is true
 ```
 
Demo
=======================

 http://pantuts.com/demos/jquery.quicknote/index.html
 
 http://pantuts.com/demos/jquery.quicknote/index2.html
