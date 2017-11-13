'use strict';

window.Config = (function() {
	var configDB = undefined;
	var local = {
		label:{
			head_name:{jap:'設定', eng:'config'}, 
			head_back:{jap:'戻る', eng:'back'}, 
			head_close:{jap:'閉じる', eng:'close'}
		}, 
		theme:{
			white:{
				head_font:'#ffffff', head_back:'#3d6387', 
				body_font:'#333333', body_back:'#ffffff', 
				item_font:'#333333', item_back:'#e2e4e6'
			}, 
			dark:{
				head_font:'#ffffff', head_back:'#3d6387', 
				body_font:'#ffffff', body_back:'#39414a', 
				item_font:'#333333', item_back:'#e2e4e6'
			}
		}, 
		contents:{
			'theme':{
				mode:'radio', 
				title:{jap:'テーマ', eng:'Theme'}, 
				value:'white', 
				item:{
					white:{jap:'ホワイト', eng:'White'}, 
					dark:{jap:'ダーク', eng:'Dark'}
				}, 
				explain:{
					jap:'お好みのテーマを選択します。', 
					eng:'Choose your favorite theme.'
				}, 
				callback:function() {
					Config.drawList();
					local.style();
				}
			}, 
			'font':{
				mode:'radio', 
				title:{jap:'文字サイズ', eng:'Font Size'}, 
				value:'18', 
				item:{
					10:{jap:'最小', eng:'Max'}, 
					14:{jap:'小さく', eng:'Little'}, 
					18:{jap:'標準', eng:'Normal'}, 
					22:{jap:'大きく', eng:'Large'}, 
					26:{jap:'最大', eng:'Min'}
				}, 
				explain:{
					jap:'ご自身に合った最適な文字サイズを選択します。<br>' + 
						'文字を大きくすると見やすくなるだけでなく、タップがしやくすなります。逆に文字を小さくするとスクロールすることなく多くの情報を表示することが可能になります。', 
					eng:'Choose the optimum character size that suits your own.<br>' + 
						'If the character is increased not only easier to see, it will then tap and camphor. Makes it possible to display more information without scrolling the contrary Decrease text into.'
				}, 
				callback:function() {
					Config.drawList();
					local.style();
				}
			}, 
			'order':{
				mode:'radio', 
				title:{jap:'ソート対象', eng:'Sort Target'}, 
				value:'head', 
				item:{
					head:{jap:'タイトル', eng:'Title'}, 
					time:{jap:'時刻', eng:'Time'}
				}, 
				explain:{
					jap:'メモ一覧の表示順序を設定します。<br>' + 
						'例えば、ソート対象を「タイトル」、ソート順序を「昇順」に設定した場合、「タイトル」を「昇順」とした順序で並べ替えます。', 
					eng:'Set the display order of the memo list.<br>' + 
						'For example, the sort target "title", if you set the sort order to "Ascending" to sort in the order in which they are the "title" and "ascending order".'
				}, 
				callback:function() {
					Config.drawList();
					App.drawList();
				}
			}, 
			'sort':{
				mode:'radio', 
				title:{jap:'ソート順', eng:'Sort Order'}, 
				value:'next', 
				item:{
					next:{jap:'昇順', eng:'Ascending'}, 
					prev:{jap:'降順', eng:'Descending'}
				}, 
				explain:{
					jap:'メモ一覧の表示順序を設定します。<br>' + 
						'例えば、ソート対象を「タイトル」、ソート順序を「昇順」に設定した場合、「タイトル」を「昇順」とした順序で並べ替えます。', 
					eng:'Set the display order of the memo list.<br>' + 
						'For example, the sort target "title", if you set the sort order to "Ascending" to sort in the order in which they are the "title" and "ascending order".'
				}, 
				callback:function() {
					Config.drawList();
					App.drawList();
				}
			}, 
			'animate':{
				mode:'radio', 
				title:{jap:'アニメーション', eng:'Animation'}, 
				value:Util.isSmart() ? 'fade' : 'none', 
				item:Util.isSmart() ? 
					{none:{jap:'なし', eng:'None'}, fade:{jap:'フェード', eng:'Fade'}, slide:{jap:'スライド', eng:'Slide'}} : 
					{none:{jap:'なし', eng:'None'}, fade:{jap:'フェード', eng:'Fade'}}, 
				explain:{
					jap:'お好みのアニメーションを選択します。', 
					eng:'Choose your favorite animation.'
				}, 
				callback:function() {
					Config.drawList();
				}
			}, 
			'speed':{
				mode:'radio', 
				title:{jap:'アニメスピード', eng:'Animation Speed'}, 
				value:'1000', 
				item:{
					300:{jap:'高速', eng:'Max'}, 
					600:{jap:'速く', eng:'Fast'}, 
					1000:{jap:'標準', eng:'Normal'}, 
					1500:{jap:'ゆっくり', eng:'Slow'}, 
					2000:{jap:'低速', eng:'Min'}
				}, 
				explain:{
					jap:'お好みのアニメーションスピードを選択します。<br>' + 
						'アニメーションをさせたくない場合は「アニメーション」設定で「なし」を選択します。', 
					eng:'Choose your favorite animation speed.<br>' + 
						'If you do not want to the animation and select "None" in the setting of "animation".'
				}, 
				callback:function() {
					Config.drawList();
				}
			}, 
			'title':{
				mode:'radio', 
				title:{jap:'タイトルの有無', eng:'The presence or absence of title'}, 
				value:Util.isSmart() ? 'hide' : 'show', 
				item:{
					hide:{jap:'なし', eng:'Hide'}, 
					show:{jap:'あり', eng:'Show'}
				}, 
				explain:{
					jap:'タイトルの編集を行うかを選択します。<br>' + 
						'タイトルありの場合、タイトルと本文を区別することができるので、それぞれを分かりやすく表示することができます。' + 
						'また、タイトルなしの場合、タイトル表示領域を本文に割り当てることができるので、スマホなどの画面の小さい端末で有効です。', 
					eng:'Choose whether to edit the title.<br>' + 
						'Because when you edit in there title it is possible to distinguish between the title and body, you can see an easy-to-understand, respectively.' + 
						'In addition, since it is possible to assign and edit without a title the title display area in the body, it is effective on the screen of the small terminal, such as a smartphone.'
				}, 
				callback:function() {
					Config.drawList();
					App.drawView();
					App.drawEdit();
				}
			}, 
			'header':{
				mode:'radio', 
				title:{jap:'ヘッダー位置', eng:'Header Position'}, 
				value:'top', 
				item:{
					top:{jap:'トップ', eng:'Top'}, 
					bottom:{jap:'ボトム', eng:'Bottom'}
				}, 
				explain:{
					jap:'ヘッダーの位置を調整します。<br>' + 
						'デフォルトの「トップ」が一番自然な配置ですが、「ボトム」の方がタップしやすい場合があります。', 
					eng:'Adjust the position of the header.<br>' + 
						'Default of the "top" is the most natural arrangement, but there is a case where easy to tap more of the "bottom".'
				}, 
				callback:function() {
					Config.drawList();
					Config.drawHead();
					App.drawHead();
				}
			}, 
			'banner':{
				active:function() {return Config.backup.edition === 'free';}, 
				mode:'radio', 
				title:{jap:'バナー位置', eng:'Banner Position'}, 
				value:'8', 
				item:{
					'2':{jap:'トップ', eng:'Top'}, 
					'8':{jap:'ボトム', eng:'Bottom'}
				}, 
				explain:{
					jap:'バナーの位置を調整します。<br>' + 
						'デフォルトの「中央下」が一番自然な配置です。', 
					eng:'Adjust the position of the header.<br>' + 
						'Default of the "top" is the most natural arrangement, but there is a case where easy to tap more of the "bottom".'
				}, 
				callback:function() {
					Config.drawList();
					Native.admob.show(Config.backup.banner);
				}
			}, 
			'cursor':{
				mode:'radio', 
				title:{jap:'カーソル位置', eng:'Cursor Position'}, 
				value:'last', 
				item:{
					first:{jap:'先頭', eng:'First'}, 
					last:{jap:'末尾', eng:'Last'}
				}, 
				explain:{
					jap:'編集モードに切り替えた時のカーソル位置を指定します。', 
					eng:'To specify the position of the cursor when you switch to edit mode.'
				}, 
				callback:function() {
					Config.drawList();
				}
			}, 
			'lang':{
				mode:'radio', 
				title:{jap:'言語', eng:'Language'}, 
				value:'jap', 
				item:{
					jap:{jap:'日本語', eng:'日本語'}, 
					eng:{jap:'English', eng:'English'}
				}, 
				explain:{
					jap:'あなたの地域の言語を選択します。', 
					eng:'Choose your language for the region.'
				}, 
				callback:function() {
					Config.drawHead();
					Config.drawList();
					Config.drawFull();
					App.drawHead();
				}
			}, 
			'edition':{
				mode:'edition', 
				title:{jap:'エディション', eng:'Edition'}, 
				value:'free', 
				item:{
					free:{jap:'無料版', eng:'Free Edition'}, 
					full:{jap:'完全版', eng:'Full Edition'}
				}, 
				explain:{
					free:{
						jap:'完全版を購入すると、広告表示なしでご利用頂けます。<br>ぜひ、ご検討ください。', 
						eng:'When you purchase the full version, available without ads.<br>By all means, please consider.'
					}, 
					full:{
						jap:'完全版をご購入頂きありがとうございます。<br>現在、広告なしで利用可能です。', 
						eng:'Thank you for your purchase the full version.<br>Currently, available without advertising.'
					}
				}, 
				button:{
					jap:'完全版を購入', 
					eng:'Buy the full version'
				}
			}, 
			'what':{
				mode:'what', 
				title:{jap:'このアプリについて', eng:'What\'sThis'}, 
				value:'qmemo', 
				item:{qmemo:{jap:'Qmemo', eng:'Qmemo'}}, 
				version:'version 3.1.3', 
				mail:'develop0422@gmail.com'
			}
		}, 
		style:function() {
			$('.js_style_theme').remove();
			$('head').append(
				'<style class="js_style_theme">' + 
					'* {' + 
						'font-size: ' + Config.backup.font + 'px;' + 
					'}' + 
					'.theme_head {' + 
						'color: ' + local.theme[Config.backup.theme].head_font + ';' + 
						'background: ' + local.theme[Config.backup.theme].head_back + ';' + 
					'}' + 
					'.theme_body {' + 
						'color: ' + local.theme[Config.backup.theme].body_font + ';' + 
						'background: ' + local.theme[Config.backup.theme].body_back + ';' + 
					'}' + 
					'.theme_select {' + 
						'color: ' + local.theme[Config.backup.theme].item_font + ';' + 
						'background: ' + local.theme[Config.backup.theme].item_back + ';' + 
					'}' + 
				'</style>');
		}
	};
	$(function() {
		$('.appli_root').append(
			'<div class="config_root">' + 
				'<div class="config_mask"></div>' + 
				'<div class="config_home">' + 
					'<div class="config_head theme_head">' + 
						'<div class="config_head_wrap">' + 
			    			'<div class="config_head_name"></div>' + 
				    		'<div class="config_head_menu config_head_back">' + 
			    				'<div class="config_head_menu_icon fa fa-chevron-left"></div>' + 
			    				'<div class="config_head_menu_name"></div>' + 
			    			'</div>' + 
			    			'<div class="config_head_menu config_head_close">' + 
			    				'<div class="config_head_menu_icon fa fa-times"></div>' + 
			    				'<div class="config_head_menu_name"></div>' + 
			    			'</div>' + 
			    		'</div>' + 
					'</div>' + 
					'<div class="config_body theme_body">' + 
						'<div class="config_body_list theme_body">' + 
							'<div id="config_body_list_unit" class="template">' + 
								'<div class="config_body_list_label"></div>' + 
								'<div class="config_body_list_value"></div>' + 
							'</div>' + 
						'</div>' + 
						'<div class="config_body_full theme_body">' + 
							'<div id="config_body_full_radio" class="template">' + 
								'<div class="config_body_full_help"></div>' + 
								'<div id="config_body_full_radio_unit" class="template">' + 
									'<label class="form_radio">' + 
										'<input class="config_body_full_radio_input" type="radio" />' + 
										'<span class="config_body_full_radio_icon"></span>' + 
										'<span class="config_body_full_radio_name"></span>' + 
									'</label>' + 
								'</div>' + 
							'</div>' + 
							'<div id="config_body_full_range" class="template">' + 
								'<div class="config_body_full_help"></div>' + 
								'<input class="config_body_full_range_input" type="range" />' + 
							'</div>' + 
							'<div id="config_body_full_edition" class="template">' + 
								'<div class="config_body_full_help"></div>' + 
								'<button class="config_body_full_edition_button form_button form_primary"></button>' + 
							'</div>' + 
							'<div id="config_body_full_what" class="template">' + 
								'<div class="config_body_full_what_label"></div>' + 
								'<div class="config_body_full_what_version"></div>' + 
								'<div class="config_body_full_what_mail"></div>' + 
							'</div>' + 
						'</div>' + 
					'</div>' + 
				'</div>' + 
			'</div>');
		$('.config_root').attr('id', 'route_hide');
		$('.config_body_full').attr('id', Util.isSmart() ? 'route_hide' : '');
		$(document).on('click', '.config_mask, .config_head_close', function(event) {
			Config.close();
		});
		$(document).on('click', '.config_body_list_unit', function(event) {
			if (Config.status.select !== $(event.currentTarget).data('id')) {
				Config.status.select = $(event.currentTarget).data('id');
				Route.page('config_body', '.config_body_full', 
					Config.backup.animate === 'slide' ? 'slidel' : Config.backup.animate, 
					Config.backup.animate === 'none' ? 0 : Config.backup.speed, 
					function() {
						Config.drawList();
						Config.drawFull();
					}
				);
				Route.page('config_head', '.config_head_wrap', 
					Config.backup.animate === 'none' ? 'none' : 'fade', 
					Config.backup.animate === 'none' ? 0 : Config.backup.speed, 
					function() {
						Config.drawHead();
					}
				);
			}
		});
		$(document).on('click', '.config_head_back', function(event) {
			Config.status.select = undefined;
			Route.page('config_body', '.config_body_list', 
				Config.backup.animate === 'slide' ? 'slider' : Config.backup.animate, 
				Config.backup.animate === 'none' ? 0 : Config.backup.speed, 
				function() {
					Config.drawList();
				}
			);
			Route.page('config_head', '.config_head_wrap', 
				Config.backup.animate === 'none' ? 'none' : 'fade', 
				Config.backup.animate === 'none' ? 0 : Config.backup.speed, 
				function() {
					Config.drawHead();
				}
			);
		});
		$(document).on('change', '.config_body_full_range_input, .config_body_full_radio_input', function(event) {
			Config.backup[Config.status.select] = $(event.currentTarget).prop('value');
			Config.save(Config.status.select, $(event.currentTarget).prop('value'));
			local.contents[Config.status.select].callback();
		});
		$(document).on('click', '.config_body_full_edition_button', function(event) {
			Native.purchase.order();
		});
	});
	var Config = {
		backup:new Object(), 
		status:{
			select:undefined
		}, 
		ready:function(callback) {
			this.load(function() {
				local.style();
				callback && callback();
			});
		}, 
		open:function() {
			this.status.select = undefined;
			Route.show('.config_root', Config.backup.animate === 'none' ? 'none' : 'fade', Config.backup.speed, function() {
				Route.page('config_body', Util.isSmart() ? '.config_body_list' : '.config_body_full', 'none', 0, function() {
					Config.drawList();
					Config.drawFull();
					$('.config_body_list').scrollTop(0);
				});
				Route.page('config_head', '.config_head_wrap', 'none', 0, function() {Config.drawHead();});
			});
		}, 
		close:function() {
			this.status.select = undefined;
			Route.hide('.config_root', Config.backup.animate === 'none' ? 'none' : 'fade', Config.backup.speed);
		}, 
		load:function(callback) {
			configDB = new Indexdb('qmemo_config', 1, {
				'config':{
					key:'key', 
					increment:false, 
					store:[
						{name:'key', option:{unique:true}}, 
						{name:'value', option:{unique:false}}
					], 
					data:(function() {
						var dataArray = new Array();
						for (var key in local.contents) {
							dataArray.push({key:key, value:local.contents[key].value});
						}
						return dataArray;
					})()
				}
			}, function() {
				configDB.select({'config':undefined}, function(result) {
					if (result) {
						this.backup[result.value.key] = 
							((local.contents[result.value.key].mode === 'radio' && local.contents[result.value.key].item[result.value.value]) || 
							(local.contents[result.value.key].mode === 'range' && local.contents[result.value.key].min <= result.value.value && 
							local.contents[result.value.key].max >= result.value.value)) ? 
							result.value.value : local.contents[result.value.key].value;
					} else {
						callback && callback();
					}
				}.bind(this));
			}.bind(this));
		}, 
		save:function(key, value) {
			configDB.update({'config':[{key:key, value:value}]});
		}, 
		drawHead:function() {
			var $fragment = $('.config_head').remove();
			var $fragmentWrap = $fragment.children('.config_head_wrap');
			$fragmentWrap.children('.config_head_name').text(!Util.isSmart() || !this.status.select ? 
				local.label.head_name[this.backup.lang] : local.contents[this.status.select].title[this.backup.lang]);
			$fragmentWrap.children('.config_head_back')[Util.isSmart() && this.status.select ? 'removeClass' : 'addClass']('none')
				.children('div:last-child').text(local.label.head_back[this.backup.lang]);
			$fragmentWrap.children('.config_head_close').children('div:last-child').text(local.label.head_close[this.backup.lang]);
			$('.config_home')[this.backup.header === 'top' ? 'prepend' : 'append']($fragment);
		}, 
		drawList:function() {
			var $fragment = $(document.createDocumentFragment());
			for (var id in local.contents) {
				if (!local.contents[id].active || local.contents[id].active()) {
					var $element = Template.get('config_body_list_unit');
					$element.data('id', id).addClass(this.status.select == id ? ' theme_select' : '');
					$element.children('.config_body_list_label').text(local.contents[id].title[this.backup.lang]);
					$element.children('.config_body_list_value')
						.text(local.contents[id].item ? local.contents[id].item[this.backup[id]][this.backup.lang] : this.backup[id]);
					$fragment.append($element);
				}
			}
			Template.empty('config_body_list_unit');
			$('.config_body_list').append($fragment);
		}, 
		drawFull:function() {
			if (this.status.select) {
				var $element = undefined;
				if (local.contents[this.status.select].mode === 'radio') {
					$element = Template.get('config_body_full_radio');
					$element.children('.config_body_full_help').html(local.contents[this.status.select].explain[this.backup.lang]);
					for (var key in local.contents[this.status.select].item) {
						var $child = Template.get('config_body_full_radio_unit');
						$child.children('label').children('.config_body_full_radio_input').attr('name', 'config_' + this.status.select).val(key);
						this.backup[this.status.select] === key && $child.children('label').children('.config_body_full_radio_input').attr('checked', 'checked');
						$child.children('label').children('.config_body_full_radio_name').text(local.contents[this.status.select].item[key][this.backup.lang]);
						$element.append($child);
					}
				} else if (local.contents[this.status.select].mode === 'range') {
					$element = Template.get('config_body_full_range');
					$element.children('.config_body_full_help').html(local.contents[this.status.select].explain[this.backup.lang]);
					$element.children('.config_body_full_range_input').val(this.backup[this.status.select])
						.attr('min', local.contents[this.status.select].min).attr('max', local.contents[this.status.select].max);
				} else if (local.contents[this.status.select].mode === 'edition') {
					$element = Template.get('config_body_full_edition');
					$element.children('.config_body_full_help').html(local.contents.edition.explain[Config.backup.edition][Config.backup.lang]);
					$element.children('.config_body_full_edition_button')
						[local.contents.banner.active() ? 'removeClass' : 'addClass']('none')
						.text(local.contents.edition.button[Config.backup.lang] + '(' + Native.purchase.info.price + ')');
				} else if (local.contents[this.status.select].mode === 'what') {
					$element = Template.get('config_body_full_what');
					$element.children('.config_body_full_what_label').text(local.contents.what.item[local.contents.what.value][Config.backup.lang]);
					$element.children('.config_body_full_what_version').text(local.contents.what.version);
					$element.children('.config_body_full_what_mail').text(local.contents.what.mail);
				}
			}
			Template.empty('config_body_full_radio');
			Template.empty('config_body_full_range');
			Template.empty('config_body_full_edition');
			Template.empty('config_body_full_what');
			$('.config_body_full').append($element);
		}
	};
	return Config;
})();
