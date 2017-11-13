'use strict';

window.Util = (function() {
	return {
		animationEnd:'webkitAnimationEnd mozAnimationEnd msAnimationEnd animationEnd', 
		isSmart:function() {
			return $(window).width() < 600;
		}, 
		getMax:function(value) {
			var result = undefined;
			if ($.type(value) === 'object') {
				result = Math.max.apply(null, Object.keys(value));
			} else if ($.type(value) === 'array') {
				result = Math.max.apply(null, value);
			}
			!isFinite(result) && (result = 0);
			return result;
		}
	};
})();