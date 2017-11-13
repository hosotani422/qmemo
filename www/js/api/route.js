'use strict';

var Route = (function() {
	var local = {
		thisScreen:new Object(), 
		lastScreen:new Object(), 
		none:function(lastScreen, thisScreen, interval, callback) {
			$(lastScreen).attr('id', 'route_hide');
			$(thisScreen).attr('id', '');
			callback && callback();
		}, 
		fade:function(lastScreen, thisScreen, interval, callback) {
			if (lastScreen && thisScreen) {
				$(lastScreen).css('animation-duration', interval / 1000 / 2 + 's').attr('id', 'route_fade_out')
				.on('webkitAnimationEnd mozAnimationEnd msAnimationEnd animationEnd', function(event) {
					$(lastScreen).off('webkitAnimationEnd mozAnimationEnd msAnimationEnd animationEnd').attr('id', 'route_hide');
					$(thisScreen).css('animation-duration', interval / 1000 / 2 + 's').attr('id', 'route_fade_in');
					callback && callback();
				});
			} else if (!lastScreen && thisScreen) {
				$(thisScreen).css('animation-duration', interval / 1000 / 2 + 's').attr('id', 'route_fade_in');
				callback && callback();
			} else if (lastScreen && !thisScreen) {
				$(lastScreen).css('animation-duration', interval / 1000 / 2 + 's').attr('id', 'route_fade_out')
				.on('webkitAnimationEnd mozAnimationEnd msAnimationEnd animationEnd', function(event) {
					$(lastScreen).off('webkitAnimationEnd mozAnimationEnd msAnimationEnd animationEnd').attr('id', 'route_hide');
					callback && callback();
				});
			}
		}, 
		slidel:function(lastScreen, thisScreen, interval, callback) {
			$(lastScreen).css('animation-duration', interval / 1000 + 's').attr('id', 'route_slide_out_left')
			.on('webkitAnimationEnd mozAnimationEnd msAnimationEnd animationEnd', function(event) {
				$(lastScreen).off('webkitAnimationEnd mozAnimationEnd msAnimationEnd animationEnd').attr('id', 'route_hide');
			});
			$(thisScreen).css('animation-duration', interval / 1000 + 's').attr('id', 'route_slide_in_left');
			callback && callback();
		}, 
		slider:function(lastScreen, thisScreen, interval, callback) {
			$(lastScreen).css('animation-duration', interval / 1000 + 's').attr('id', 'route_slide_out_right')
			.on('webkitAnimationEnd mozAnimationEnd msAnimationEnd animationEnd', function(event) {
				$(lastScreen).off('webkitAnimationEnd mozAnimationEnd msAnimationEnd animationEnd').attr('id', 'route_hide');
			});
			$(thisScreen).css('animation-duration', interval / 1000 + 's').attr('id', 'route_slide_in_right');
			callback && callback();
		}
	};
	var Route = {
		page:function(id, screen, effect, interval, callback) {
			if (screen) {
				local.lastScreen[id] = local.thisScreen[id];
				local.thisScreen[id] = screen;
				local[effect](local.lastScreen[id], local.thisScreen[id], interval, callback);
			} else {
				return local.thisScreen[id];
			}
		}, 
		show:function(screen, effect, interval, callback) {
			local[effect](undefined, screen, interval, callback);
		}, 
		hide:function(screen, effect, interval, callback) {
			local[effect](screen, undefined, interval, callback);
		}
	};
	return Route;
})();
