'use strict';

var Native = (function() {
	$(document).on('deviceready', function(event) {
		$(window).on('error', function(event) {
			var error = '';
			for (var key in event.originalEvent) {
				error += key + ':' + event.originalEvent[key] + '\n';
			}
			alert(error);
		});
	});
	var Native = {
		statusbar:function(overlay, background, color) {
			// アプリとの重複
			StatusBar.overlaysWebView(overlay);
			// 背景色
			StatusBar.backgroundColorByHexString(background);
			// 主に文字色に対するスタイル
			StatusBar['style' + color]();
		}, 
		splashscreen:{
			active:true, 
			show:function() {
				if (navigator.splashscreen && !this.active) {
					navigator.splashscreen.show();
					this.active = true;
				}
			}, 
			hide:function() {
				if (navigator.splashscreen && this.active) {
					navigator.splashscreen.hide();
					this.active = false;
				}
			}
		}, 
		admob:{
			active:true, 
			position:'8', 
			height:44, 
			ready:function(adId, position, autoShow) {
				window.AdMob && AdMob.createBanner({
					// AdmobのID
					adId:adId, 
					// アプリとの重複
					overlap:true, 
					// ステータスバーとの重複
					offsetTopBar:true, 
					// サイズ
					adSize:'CUSTOM', 
					height:this.height, 
					width:$(window).width(), 
					// 配置
					position:position, 
					// 自動表示
					autoShow:autoShow
				});
				autoShow && $('.native_root')[position === '2' ? 'prepend' : 'append']($('.native_head').css({'height':this.height + 'px'}));
			}, 
			show:function(position) {
				if (window.AdMob && (!this.active || this.position !== position)) {
					AdMob.showBanner(position);
					this.active = true;
					this.position = position;
				}
				$('.native_root')[position === '2' ? 'prepend' : 'append']($('.native_head').css({'height':this.height + 'px'}));
			}, 
			hide:function() {
				if (window.AdMob && this.active) {
					AdMob.hideBanner();
					this.active = false;
				}
				$('.native_head').css({'height':'0px'});
			}
		}, 
		purchase:{
			id:undefined, 
			owned:false, 
			info:{
				price:'', 
				title:'', 
				description:''
			}, 
			callback:undefined, 
			/**
			 * 購入前 ⇒ updated ⇒ loaded ⇒ updated ⇒ ready
			 * 購入時 ⇒ updated ⇒ updated ⇒ approved ⇒ updated ⇒ owned ⇒ updated ⇒ updated
			 * 購入後 ⇒ updated ⇒ loaded ⇒ updated ⇒ approved ⇒ updated ⇒ ready ⇒ owned ⇒ updated ⇒ updated
			 */
			ready:function(id, callback) {
				if (window.store) {
					this.id = id;
					this.callback = callback;
					// ログレベル(無効)
					store.verbosity = store.QUIET;
					// 製品登録
					store.register({
						// 識別子
						id:this.id, 
						// 製品タイプ（非消耗型）
						type:store.NON_CONSUMABLE
					});
					// 読込完了時
					store.when(this.id).loaded(function(product) {
						this.info.price = product.price;
						this.info.title = product.title;
						this.info.description = product.description;
					}.bind(this));
					// 注文承認時
					store.when(this.id).approved(function(product) {
						// 注文完了
						product.finish();
						this.owned = true;
						this.callback && this.callback();
					}.bind(this));
					// 準備完了時
					store.ready(function() {
						this.callback && this.callback();
					}.bind(this));
					// 製品情報取得
					store.refresh();
				}
			}, 
			/**
			 * 注文申込
			 */
			order:function() {
				window.store && store.order(this.id);
			}
		}
	};
	return Native;
})();
