'use strict';

var App = (function() {
	var local = {
		label:{
			head_name:{jap:'Qmemo', eng:'Qmemo'}, 
			head_config:{jap:'設定', eng:'config'}, 
			head_back:{jap:'戻る', eng:'back'}, 
			head_add:{jap:'追加', eng:'add'}, 
			head_edit:{jap:'編集', eng:'edit'}, 
			head_view:{jap:'編集', eng:'edit'}, 
			head_remove:{jap:'削除', eng:'remove'}, 
			remove_title:{jap:'削除確認', eng:'Confirm Delete'}, 
			remove_message:{jap:'メモを削除します。<br>よろしいですか？', eng:'Delete this note.<br>Are you ok?'}
		}
	};
	$(function() {
		$(document).on("deviceready", function(event) {
			Native.statusbar(false, '#3d6387', 'LightContent');
			Native.admob.ready('ca-app-pub-4073573623418382/6373479151', Config.backup.banner, Config.backup.edition === 'free');
			Native.purchase.ready('fulledition2', function() {
				Config.backup.edition = Native.purchase.owned ? 'full' : 'free';
				App.drawAdmob();
			});
		});
		$(document).on('click', '.appli_head_config', function(event) {
			Config.open();
		});
		$(document).on('click', '.appli_body_list_unit', function(event) {
			if (App.status.select !== $(event.currentTarget).data('id')) {
				App.status.select = $(event.currentTarget).data('id');
				Route.page('appli_body', '.appli_body_view', 
					Config.backup.animate === 'slide' ? 'slidel' : Config.backup.animate, 
					Config.backup.animate === 'none' ? 0 : Config.backup.speed, 
					function() {
						App.drawList();
						App.drawView();
					}
				);
				Route.page('appli_head', '.appli_head_wrap', 
					Config.backup.animate === 'none' ? 'none' : 'fade', 
					Config.backup.animate === 'none' ? 0 : Config.backup.speed, 
					function() {
						App.drawHead();
					}
				);
			}
		});
		$(document).on('click', '.appli_head_back', function(event) {
			App.status.select = undefined;
			Route.page('appli_body', '.appli_body_list', 
				Config.backup.animate === 'slide' ? 'slider' : Config.backup.animate, 
				Config.backup.animate === 'none' ? 0 : Config.backup.speed, 
				function() {
					App.drawList();
				}
			);
			Route.page('appli_head', '.appli_head_wrap', 
				Config.backup.animate === 'none' ? 'none' : 'fade', 
				Config.backup.animate === 'none' ? 0 : Config.backup.speed, 
				function() {
					App.drawHead();
				}
			);
		});
		$(document).on('click', '.appli_head_add', function(event) {
			App.contentsDB.next('contents', 'id', function(result) {
				App.status.select = result;
				App.contentsDB.update({'contents':[{id:result, head:'', body:'', time:moment().format('YYYY/MM/DD HH:mm:ss')}]});
				Route.page('appli_body', '.appli_body_edit', 
					Config.backup.animate === 'slide' ? 'slidel' : Config.backup.animate, 
					Config.backup.animate === 'none' ? 0 : Config.backup.speed, 
					function() {
						App.drawList();
						App.drawEdit(function() {
							$(Config.backup.title === 'show' ? '.appli_body_edit_head' : '.appli_body_edit_body').focus();
						});
					}
				);
				Route.page('appli_head', '.appli_head_wrap', 
					Config.backup.animate === 'none' ? 'none' : 'fade', 
					Config.backup.animate === 'none' ? 0 : Config.backup.speed, 
					function() {
						App.drawHead();
					}
				);
			}.bind(this));
		});
		$(document).on('click', '.appli_head_edit', function(event) {
			if (App.status.select) {
				Route.page('appli_body', '.appli_body_edit', 
					Config.backup.animate === 'none' ? 'none' : 'fade', 
					Config.backup.animate === 'none' ? 0 : Config.backup.speed, 
					function() {
						App.drawEdit(function() {
							$($('.appli_body_edit_head').val() ? '.appli_body_edit_body' : '.appli_body_edit_head').each(function(i) {
								this.selectionStart = this.selectionEnd = Config.backup.cursor === 'first' ? 0 : $(this).val().length;
								this.focus();
							});
						});
					}
				);
				Route.page('appli_head', '.appli_head_wrap', 
					Config.backup.animate === 'none' ? 'none' : 'fade', 
					Config.backup.animate === 'none' ? 0 : Config.backup.speed, 
					function() {
						App.drawHead();
					}
				);
			}
		});
		$(document).on('click', '.appli_body_view_head, .appli_body_view_body', function(event) {
			if (App.status.select && event.target.tagName.toLowerCase() !== 'a') {
				Route.page('appli_body', '.appli_body_edit', 
					Config.backup.animate === 'none' ? 'none' : 'fade', 
					Config.backup.animate === 'none' ? 0 : Config.backup.speed, 
					function(selection) {
						App.drawEdit(function() {
							$($(event.currentTarget).hasClass('appli_body_view_body') ? '.appli_body_edit_body' : '.appli_body_edit_head').each(function(i) {
								this.selectionStart = this.selectionEnd = selection;
								this.focus();
							});
						});
					}.bind(this, (function() {
						var selection = undefined;
						$(event.currentTarget).children().each(function(i) {
							if ($(this).offset().top <= event.pageY && $(this).offset().top + $(this).outerHeight() >= event.pageY) {
								selection === undefined && (selection = $(this).data('char'));
								$(this).offset().left + $(this).outerWidth() / 2 < event.pageX && 
									(selection = $(this).data('char') + $(this).text().length);
							}
							i === $(event.currentTarget).children().length - 1 && selection === undefined && 
								(selection = $(this).offset().top < event.pageY ? $(this).data('char') + $(this).text().length : 0);
						});
						return selection;
					})())
				);
				Route.page('appli_head', '.appli_head_wrap', 
					Config.backup.animate === 'none' ? 'none' : 'fade', 
					Config.backup.animate === 'none' ? 0 : Config.backup.speed, 
					function() {
						App.drawHead();
					}
				);
			}
		});
		$(document).on('click', '.appli_head_view', function(event) {
			if (App.status.select) {
				Route.page('appli_body', '.appli_body_view', 
					Config.backup.animate === 'none' ? 'none' : 'fade', 
					Config.backup.animate === 'none' ? 0 : Config.backup.speed, 
					function() {
						App.drawView();
					}
				);
				Route.page('appli_head', '.appli_head_wrap', 
					Config.backup.animate === 'none' ? 'none' : 'fade', 
					Config.backup.animate === 'none' ? 0 : Config.backup.speed, 
					function() {
						App.drawHead();
					}
				);
			}
		});
		$(document).on('click', '.appli_head_remove', function(event) {
			Dialog.confirm(
				local.label.remove_title[Config.backup.lang],  
				local.label.remove_message[Config.backup.lang], 
				'OK', 
				'Cancel', 
				function() {
					Dialog.close();
					App.contentsDB.update({'contents':[App.status.select]}, function() {
						App.status.select = undefined;
						Route.page('appli_body', Util.isSmart() ? '.appli_body_list' : '.appli_body_view', 
							Config.backup.animate === 'slide' ? 'slider' : Config.backup.animate, 
							Config.backup.animate === 'none' ? 0 : Config.backup.speed, 
							function() {
								App.drawList();
								App.drawView();
							}
						);
						Route.page('appli_head', '.appli_head_wrap', 
							Config.backup.animate === 'none' ? 'none' : 'fade', 
							Config.backup.animate === 'none' ? 0 : Config.backup.speed, 
							function() {
								App.drawHead();
							}
						);
					});
				}, 
				function() {
					Dialog.close();
				});
		});
		$(document).on('input', '.appli_body_edit_head, .appli_body_edit_body', function(event) {
			var bodyArray = $('.appli_body_edit_body').val().split('\n');
			App.contentsDB.update({'contents':[{
				id:App.status.select, 
				head:Config.backup.title === 'show' ? $('.appli_body_edit_head').val() : bodyArray.shift(), 
				body:Config.backup.title === 'show' ? $('.appli_body_edit_body').val() : bodyArray.join('\n'),
				time:moment().format('YYYY/MM/DD HH:mm:ss')}]});
			App.drawList();
		});
		App.ready();
	});
	var App = {
		backup:new Object(), 
		status:{
			select:undefined
		}, 
		contentsDB:undefined, 
		ready:function() {
			this.contentsDB = new Indexdb('qmemo_contents', 1, {
				'contents':{
					key:'id', 
					increment:false, 
					store:[
						{name:'id', option:{unique:true}}, 
						{name:'head', option:{unique:false}}, 
						{name:'body', option:{unique:false}}, 
						{name:'time', option:{unique:false}}
					]
				}
			}, function() {
				Config.ready(function() {
					$('.appli_body_view').attr('id', Util.isSmart() ? 'route_hide' : '');
					$('.appli_body_edit').attr('id', 'route_hide');
					Route.page('appli_body', Util.isSmart() ? '.appli_body_list' : '.appli_body_view', 'none', 0, function() {
						App.drawList();
						App.drawView();
					});
					Route.page('appli_head', '.appli_head_wrap', 'none', 0, function() {App.drawHead();});
					Loading.hide();
				});
			});
		}, 
		drawAdmob:function() {
			Native.admob[Config.backup.edition === 'full' || 
				(Util.isSmart() && Route.page('appli_body') === '.appli_body_edit') ? 'hide' : 'show'](Config.backup.banner);
		}, 
		drawHead:function() {
			this.drawAdmob();
			var $fragment = $('.appli_head').remove();
			var $fragmentWrap = $fragment.children('.appli_head_wrap');
			$fragmentWrap.children('.appli_head_name').text(local.label.head_name[Config.backup.lang]);
			$fragmentWrap.children('.appli_head_back')
				[Util.isSmart() && Route.page('appli_body') !== '.appli_body_list' ? 'removeClass' : 'addClass']('none')
				.children('div:last-child').text(local.label.head_back[Config.backup.lang]);
			$fragmentWrap.children('.appli_head_config')
				[Util.isSmart() && Route.page('appli_body') !== '.appli_body_list' ? 'addClass' : 'removeClass']('none')
				.children('div:last-child').text(local.label.head_config[Config.backup.lang]);
			$fragmentWrap.children('.appli_head_add').children('div:last-child').text(local.label.head_add[Config.backup.lang]);
			$fragmentWrap.children('.appli_head_edit')
				[Route.page('appli_body') === '.appli_body_view' ? 'removeClass' : 'addClass']('none')
				.children('div:last-child').text(local.label.head_edit[Config.backup.lang]);
			$fragmentWrap.children('.appli_head_view')
				[Route.page('appli_body') === '.appli_body_edit' ? 'removeClass' : 'addClass']('none')
				.children('div:last-child').text(local.label.head_view[Config.backup.lang]);
			$fragmentWrap.children('.appli_head_remove')
				[Route.page('appli_body') !== '.appli_body_list' ? 'removeClass' : 'addClass']('none')
				.children('div:last-child').text(local.label.head_remove[Config.backup.lang]);
			$('.appli_root')[Config.backup.header === 'top' ? 'prepend' : 'append']($fragment);
		}, 
		drawList:function(callback) {
			var $fragment = $(document.createDocumentFragment());
			this.contentsDB.select({'contents':{index:Config.backup.order, range:undefined, sort:Config.backup.sort}}, function(result) {
				if (result) {
					var $element = Template.get('appli_body_list_unit');
					$element.data('id', result.value.id);
					$element.children('.appli_body_list_name').text(result.value.head);
					$element.children('.appli_body_list_time').text(result.value.time);
					this.status.select == result.value.id && $element.addClass('theme_select');
					$fragment.append($element);
				} else {
					Template.empty('appli_body_list_unit');
					$('.appli_body_list').append($fragment);
					callback && callback();
				}
			}.bind(this));
		}, 
		drawView:function(callback) {
			this.contentsDB.get('contents', 'id', this.status.select, function(result) {
				var headHtml = '', bodyHtml = '';
				if (result) {
					var headText = result ? result.head : '';
					for (var i = 0, l = headText.length; i < l; i++) {
						headHtml += '<span data-char="' + i + '">' + (headText[i] === ' ' ? '&nbsp;' : headText[i]) + '</span>';
					}
					bodyHtml = Config.backup.title === 'hide' && headHtml ? headHtml + '<br>' : '';
					var bodyText = result ? result.body
						.split(/([0-9]{2,4}-[0-9]{2,4}-[0-9]{3,4}|https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&amp;amp;=+\$,%#]+)/g) : new Array();
					for (var i = 0, l = bodyText.length, c = Config.backup.title === 'hide' ? headText.length + 1 : 0; i < l; i++) {
						if (bodyText[i].match(/[0-9]{2,4}-[0-9]{2,4}-[0-9]{3,4}/) !== null) {
							bodyHtml += '<a data-char="' + c + '" href="tel:' + bodyText[i] + '">' + bodyText[i] + '</a>';
						} else if (bodyText[i].match(/https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&amp;amp;=+\$,%#]+/) !== null) {
							bodyHtml += '<a data-char="' + c + '" href="' + bodyText[i] + '" target="_blank">' + bodyText[i] + '</a>';
						} else {
							for (var j = 0, m = bodyText[i].length; j < m; j++) {
								if (bodyText[i][j] === '\n') {
									bodyHtml += '<br data-char="' + (c + j) + '">';
								} else if (bodyText[i][j] === ' ') {
									bodyHtml += '<span data-char="' + (c + j) + '">&nbsp;</span>';
								} else {
									bodyHtml += '<span data-char="' + (c + j) + '">' + bodyText[i][j] + '</span>';
								}
							}
						}
						c += bodyText[i].length;
					}
				}
				$('.appli_body_view_head')[Config.backup.title === 'hide' ? 'addClass' : 'removeClass']('none').html(headHtml);
				$('.appli_body_view_body').html(bodyHtml);
				callback && callback();
			}.bind(this));
		}, 
		drawEdit:function(callback) {
			this.contentsDB.get('contents', 'id', this.status.select, function(result) {
				$('.appli_body_edit_head')[Config.backup.title === 'hide' ? 'addClass' : 'removeClass']('none').val(result ? result.head : '');
				$('.appli_body_edit_body').val(function() {
					var html = '';
					result && result.head && Config.backup.title === 'hide' && (html += result.head + '\n');
					result && (html += result.body);
					return html;
				});
				callback && callback();
			}.bind(this));
		}
	};
	return App;
})();
