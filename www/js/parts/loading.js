'use strict';

$(function() {
	$('body').append(
		'<div class="loading_root">' + 
		    '<div class="loading_home">' + 
		    	'<div class="loading_icon fa fa-spinner"></div>' + 
		    	'<div class="loading_label">Loading...</div>' + 
		    '</div>' + 
	    '</div>');
});

var Loading = {
	show:function() {
		$('.loading_root').removeClass('hide');
	}, 
	hide:function() {
		$('.loading_root').addClass('hide');
	}
};
