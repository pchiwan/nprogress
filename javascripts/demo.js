
$(document).ready(function () {

	//stick this one to the top of the body
	var npBody = new NProgress({
		container: '.body',
		renderOnInit: true,
		removeOnFinish: false
	});
	npBody.done(true);

	var npOne = new NProgress({
		renderOnInit: true,
		container: '.demoone',
		removeOnFinish: false
	});

	var npTwo = new NProgress({
		renderOnInit: true,
		container: '.demotwo'
	});

	var npThree = new NProgress({
		renderOnInit: true,
		container: '.demothree',
		trickleRate: 0.1,
		randomTrickle: true,
		removeOnFinish: false
	});

	var ViewModel = {
		npOne: npOne,
		npTwo: npTwo,
		npThree: npThree
	};

	//apply ko bindings
	ko.applyBindings(ViewModel);

});
