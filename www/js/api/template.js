'use strict';

var Template = (function() {
	var Template = {
		get:function(id) {
			return $('#' + id).clone().removeAttr('id').addClass(id).removeClass('template');
		}, 
		empty:function(id) {
			$('.' + id).remove();
		}
	};
	return Template;
})();
