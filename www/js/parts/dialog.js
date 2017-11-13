'use strict';

$(function() {
	$('body').append(
		'<div class="dialog_root theme_speed">' + 
		    '<div class="dialog_home">' + 
		    	'<div class="dialog_head theme_head"></div>' + 
		    	'<div class="dialog_body theme_body"></div>' + 
		    	'<div class="dialog_foot">' + 
		    		'<button type="button" class="dialog_ok form_button"></button>' + 
		    		'<button type="button" class="dialog_cancel form_button"></button>' + 
		    	'</div>' + 
		    '</div>' + 
	    '</div>');
	$(document).on('click', '.dialog_ok', function(event) {
		Dialog.callback_ok();
	});
	$(document).on('click', '.dialog_cancel', function(event) {
		Dialog.callback_ng();
	});
	Dialog.ready();
});

var Dialog = {
	callback_ok:undefined, 
	callback_ng:undefined, 
	ready:function() {
		Route.hide('.dialog_root', 'none', 0);
	}, 
	confirm:function(title, message, button_ok, button_ng, callback_ok, callback_ng) {
		this.draw(title, message, button_ok, button_ng);
		this.entry(callback_ok, callback_ng);
		this.open();
	}, 
	open:function() {
		Route.show('.dialog_root', Config.backup.animate === 'none' ? 'none' : 'fade', Config.backup.speed);
	}, 
	close:function() {
		Route.hide('.dialog_root', Config.backup.animate === 'none' ? 'none' : 'fade', Config.backup.speed);
	}, 
	entry:function(callback_ok, callback_ng) {
		this.callback_ok = callback_ok;
		this.callback_ng = callback_ng;
	}, 
	draw:function(title, message, button_ok, button_ng) {
		$('.dialog_head').html(title);
		$('.dialog_body').html(message);
		$('.dialog_ok').html(button_ok);
		$('.dialog_cancel').html(button_ng);
	}
};
