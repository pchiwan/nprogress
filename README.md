NProgress-X
===========

Slim progress bars that you can append to any part of your DOM.

Inspired by Google, YouTube, and Medium. Based on and forked from [Rico Sta. Cruz](http://ricostacruz.com)'s [NProgress](http://github.com/rstacruz).


# Introduction
I came across [Rico Sta. Cruz](http://ricostacruz.com)'s awesome [NProgress](http://github.com/rstacruz) while searching the web for cool tools to improve the 
looks and responsiveness of the web application my colleague [codecoding](http://github.com/codecoding) and I were working on at the time. 
We had many many screens that displayed multiple controls which loaded data dynamically through AJAX requests. All these controls were
independent from one another, and we thought it would be cool to display an animated progress bar on top of each of them. So we took 
[Rico Sta. Cruz](http://ricostacruz.com)'s [NProgress](http://github.com/rstacruz), forked it, refactored it, added to it, and created our very own 
NProgress-X: a progress bar that you can append to any part of your DOM.

NOTE: NProgress-X is so different to the original NProgress (and purposely so) that I have never thought of doing a pull request on GitHub, and never will.


# Installation
Add jQuery (1.8 or above), [nprogress.js] and [nprogress.css] to your project.


# Basic usage
I refactored the original NProgress mainly for the purpose of having multiple instances of it at once on the same page, so NProgress-X must be instantiated in order to be used. Like this:

```javascript
var np = new NProgress();
```


# Configuration
I've kept most of the original settings and added a few more. Check them out.

### minimum
Minimum percentage of increment. Default value is 0.05.

### easing
CSS easing string for the animation settings. Default value is 'ease'.

### speed
Animation speed in milliseconds. Default value is 200.

### trickle
Set to false to turn off the trickling (automatic progress increment). True by default.

### trickleRate
How much to increase per trickle. Default value is 0.02.

### trickleSpeed
How often to trickle, in milliseconds. Default value is 800.

### container
jQuery selector of the container DOM element. The progress bar will be PREPENDED TO this container (this means it will be inserted as the first child of the container element). 
If you do not set this parameter -or if you use the selector 'body'- the progress bar will be inserted BEFORE the body (on the very top of the page).

### renderOnInit
Set to true to render the progress bar upon instantiation (though it will remain hidden until the progress is set). False by default.

### removeOnFinish
Set to true to remove the progress bar from the DOM when it reaches 100%. If you're gonna be reusing it a lot, you might as well leave it there -hidden- rather than creating it
every time you want to display it. True by default.

### randomTrickle
Set to true to use random trickle increments. False by default.

### startOnInit
Set to true to start running the progress bar's progress upon instantiation. False by default.

### template
HTML markup used to render the progress bar. To keep the progress bar working, keep an element with `role='bar'` in there.


Example:
```javascript
var np = new NProgress({
	minimum: 0.08,
	easing: 'linear',
	speed: 500,
	trickle: true,
	trickleRate: 0.05,
	trickleSpeed: 500,
	container: '#divContainer',
	renderOnInit: true,
	removeOnFinish: false,
	startOnInit: true,
	template: '<div class="foo" role="bar"></div>'
});
```

# Methods



# Ideas
 * Add progress to your Ajax calls! Bind it to the jQuery `ajaxStart` and
 `ajaxStop` events.

 * Make a fancy loading bar even without Turbolinks/Pjax! Bind it to
 `$(document).ready` and `$(window).load`.


# Customization
Just edit `nprogress.css` to your liking. Tip: you probably only want to find
and replace occurances of `#29d`.

The included CSS file is pretty minimal... in fact, feel free to scrap it and
make your own!


# Acknowledgements
Give credit where it's due!

The original [NProgress](http://github.com/rstacruz) is authored and maintained by [Rico Sta. Cruz](http://ricostacruz.com) with help from 
his [contributors](http://github.com/rstacruz/nprogress/contributors).
