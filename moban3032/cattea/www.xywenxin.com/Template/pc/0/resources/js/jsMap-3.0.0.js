/*!
 *  jsMap v3.0.0
 *  Copyright (C) 2018-2019, ZhaoGang
 *  Released under the MIT license
 */
!(function ( global, factory ) {

    if ( typeof define === "function" && define.amd ) { 
        define( "jsmap", [ "jquery" ], factory );
    } else if ( typeof module !== "undefined" && typeof exports === "object" ) {
        module.exports = factory( require( "jquery" ) );
    } else {
        global.jsMap = factory( global.jQuery );
    }

})( typeof window !== "undefined" ? window : this, function ( $ ) {

	"use strict";

	// 不支持 ie9- 的浏览器
	if ( navigator.userAgent.toLowerCase().match( /msie (6|7|8|9)\.0/ ) ) {
		throw new Error( decodeURI( "jsMap%20%E4%B8%8D%E6%94%AF%E6%8C%81%20ie9-%20%E7%9A%84%E6%B5%8F%E8%A7%88%E5%99%A8" ) );
	}

	// 检测 jquery
	if ( typeof jQuery === "undefined" ) {
		throw new Error( decodeURI( "%E8%AF%B7%E5%9C%A8%20jsMap%20%E5%89%8D%E5%BC%95%E5%85%A5%20jQuery" ) );
	}
	var jqv = $.fn.jquery.split( "." );
    if ( ~~jqv[ 0 ] === 1 && ~~jqv[ 1 ] < 12 ) {
        throw new Error( decodeURI( "jsMap%20%E9%9C%80%E8%A6%81%201.12.0%20%E5%8F%8A%E4%BB%A5%E4%B8%8A%E7%89%88%E6%9C%AC%E7%9A%84%20jQuery" ) );
    }

	var $document = $( document );
	var $tip = $( "" );

	// 创建 jsMap
	var jsMap = {
		version: "3.0.0",
		json: function ( src, bool ) {

			// 传入 bool = true 则进行跨域请求
			return $.getJSON( src + ( bool ? "?callback=?" : "" ) );
		},
		config: function ( selector, json, options ) {
			var $body = $( "body" );

			// 配置
			var defaults = {
				name: "china",
				width: 900,
				height: 500,
				stroke: {
					width: 1,
					color: "#f3f3f3"
				},
				fill: {
					basicColor: "#3f99f9",
					hoverColor: "#0880ff",
					clickColor: "#006bde"
				},
				areaName: {
					show: false,
					size: 12,
					basicColor: "#333",
					clickColor: "#fff"
				},
				disabled: {
					color: "#bfbfbf",
					except: false,
					name: []
				},
				hide: [],
				multiple: false,
				tip: true,
				hoverCallback: $.noop,
				clickCallback: $.noop,
				defaultClick:''
			};
			var opt = $.extend( {}, defaults, options );

			if ( !json ) {
				return;
			}

			// 绘制地图
			var mapData = json[ opt.name ];
			var path = "",
				text = "",
				areaBox = [];
			$.each(mapData, function ( i, v ) {
				areaBox.push( i );
				path += '\
					<path \
						d="' + v.svg + '" \
						class="jsmap-' + i + '" \
						data-name="' + v.name + '" \
						data-id="' + i + '" \
						style="cursor:pointer;">\
					</path>\
				';
				text += '\
					<text \
						x="' + v.textPosition[ 0 ] + '" \
						y="' + v.textPosition[ 1 ] + '" \
						class="jsmap-' + i + '" \
						data-name="' + v.name + '" \
						data-id="' + i + '" \
						style="cursor:pointer;">\
						' + v.name + '\
					</text>\
				';
			});

			// 默认是否显示区域名称
			if ( !opt.areaName.show ) { 
				text = "";
			}

			path = '<div class="jsmap-svg-container" style="position:absolute;top:0;left:0;padding:0;margin:0;transform-origin:center"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 575 470">' + path + text + '</svg></div>';

			$( selector ).each(function () {
				var $this = $( this );
				$this.addClass( "map-container" ).width( opt.width ).height( opt.height ).css({
					padding: 0,
					position: "relative",
					userSelect: "none"
				}).empty().append( path ).data({
					cache_resource: json,
					cache_options: options
				});
				var $container = $this.children(),
					$svg = $this.find( "svg" ),
					$path = $svg.find( "path" ),
					$text = $svg.find( "text" ),
					$pathText = $path.add( $text );
				$container.width( opt.width ).height( opt.height );
				$svg.attr({
					width: opt.width,
					height: opt.height
				}).css({
					position: "relative",
					overflow: "hidden",
					marginLeft: opt.name === "china" ? "-50px" : 0
				});

				// 存储地区
				var allName = [];
				$path.each(function () {
					allName.push( $( this ).attr( "data-id" ) );
				})

				// 隐藏
				if ( Array.isArray( opt.hide ) && opt.hide.length ) {
					$.each(opt.hide, function ( i, v ) {
						$pathText.filter( '[data-id="' + v + '"], [data-name="' + v + '"]' ).hide();
					})
				}

				// 填充色
				var fillBasic = opt.fill.basicColor;
				if ( typeof fillBasic === "string" ) {
					$path.attr({
						fill: fillBasic || "#3f99f9",
						"data-fill": fillBasic || "#3f99f9"
					});
				}
				if ( $.isPlainObject( fillBasic ) && !$.isEmptyObject( fillBasic ) ) {
					$path.attr({
						fill: "#3f99f9",
						"data-fill": "#3f99f9"
					});
					$.each(fillBasic, function ( i, v ) {
						$path.filter( ".jsmap-" + i ).attr({
							fill: v || "#3f99f9",
							"data-fill": v || "#3f99f9"
						});
					})
				}

				window.setTimeout(function () {
					$path.css( "transition", ".25s" );
				});

				// 描边
				$path.attr({
					stroke: opt.stroke.color || "#fff",
					"stroke-width": opt.stroke.width || 1
				});

				// 文字颜色大小
				if ( opt.areaName.show ) {
					$text.attr({
						fill: opt.areaName.basicColor || "#333",
						"font-size": opt.areaName.size || 12
					});
				}

				// 禁用
				var disabledName = opt.disabled.name;
				if ( Array.isArray( disabledName ) && disabledName.length ) {
					function setDisabled ( selector ) {
						$( selector ).addClass( "jsmap-disabled" ).css( "cursor", "not-allowed" ).not( "text" ).attr( "fill", opt.disabled.color || "#bfbfbf" );
					}
					if ( opt.disabled.except ) {
						var result = [];
						$.each(disabledName, function ( i, v ) {
							if ( !v.match( /[a-z]/ ) ) {
								result.push( $path.filter( '[data-name="' + v + '"]' ).attr( "data-id" ) );
							} else {
								result.push( v );
							}
						})
						var cloneNames = $.extend( true, [], allName )
						$.each(result, function ( i, v ) {
							cloneNames.splice( cloneNames.indexOf( v ), 1 );
						})
						$.each(cloneNames, function ( i, v ) {
							setDisabled( $this.find( ".jsmap-" + v ) );
						})
					} else {
						$.each(disabledName, function ( i, v ) {
							if ( !v.match( /[a-z]/ ) ) {
								setDisabled( $this.find( '[data-name="' + v + '"]' ) );
							} else {
								setDisabled( $this.find( ".jsmap-" + v ) );
							}
						})
					}
				}

				// 悬浮提示层
				if ( opt.tip ) {
					if ( !$( "#jsmap-tip" ).length ) {
						$( "body" ).append( '<section id="jsmap-tip" style="-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;position:absolute;top:0;left:0;z-index:99;display:inline-block;width:auto;height:auto;overflow:hidden;display:none;"></section>' );
						$tip = $( "#jsmap-tip" );
					}
				}
				
				// 事件集合
				areaBox.forEach(function ( v ) {
					$this.find( ".jsmap-" + v ).each(function () {
						$( this ).on({
							mouseenter: function () { 

								// 如果此区域被禁用
								// 则无任何事件
								if ( $( this ).hasClass( "jsmap-disabled" ) ) {
									return;
								}

								var name = $( this ).attr( "data-id" );

								$this.find( ".jsmap-" + name ).each(function () {
									var _this = $( this );

									// 悬浮时的填充色
									if ( !_this.hasClass( "jsmap-clicked" ) ) {
										var cloneAllName = $.extend( true, [], allName );
										if ( !opt.fill.hoverColor ) {
											opt.fill.hoverColor = "#0880ff";
										}
										if ( $.type( opt.fill.hoverColor ) === "string" ) {
											_this.filter( "path" ).attr( "fill", opt.fill.hoverColor );
										}
										if ( $.isPlainObject( opt.fill.hoverColor ) && !$.isEmptyObject( opt.fill.hoverColor ) ) {
											$.each(opt.fill.hoverColor, function ( i, v ) {
												_this.filter( ".jsmap-" + i ).attr( "fill", v );
												cloneAllName.splice( cloneAllName.indexOf( i ), 1 );
											})
											if ( cloneAllName.indexOf( _this.attr( "data-id" ) ) > -1 ) {
												_this.attr( "fill", "#0880ff" );
											}
										}
									}

									// 悬浮回调事件
									opt.hoverCallback( _this.attr( "data-id" ), _this.attr( "data-name" ) );

									// 默认悬浮提示
									if ( opt.tip ) {
										if ( opt.tip === true ) {
											$tip.html( '<div style="padding:12px;color:#fff;font-size:14px;text-align:center;border-radius:4px;border:#777 solid 1px;background:rgba(0,0,0,.8);">' + _this.attr( "data-name" ) + '</div>' );
										}
										if ( $.isFunction( opt.tip ) ) {
											$tip.html( opt.tip( _this.attr( "data-id" ), _this.attr( "data-name" ) ) );
										}
										$document.on("mousemove", function ( event ) {
											var x = event.pageX + 12 + "px",
												y = event.pageY + 12 + "px";
											$tip.css( "transform", "translate3d(" + x + ", " + y + ", 0)" );
											$tip.show();
										})
									}
								})
							},
							mouseleave: function () {

								// 如果此区域被禁用
								// 则无任何事件
								if ( $( this ).hasClass( "jsmap-disabled" ) ) {
									return;
								}
								var name = $( this ).attr( "data-id" );
								$this.find( ".jsmap-" + name ).each(function () {
									var _this = $( this );
									if ( !_this.hasClass( "jsmap-clicked" ) ) {
										_this.filter( "path" ).attr( "fill", _this.attr( "data-fill" ) );
									}
									if ( opt.tip ) {
										$tip.empty().hide().css( "transform", "translate3d(0, 0, 0)" );
										$document.off( "mousemove" );
									}
								})
							},
							click: function () {
								if ( $( this ).hasClass( "jsmap-disabled" ) ) {
									return;
								}
								var name = $( this ).attr( "data-id" );
								$this.find( "path.jsmap-" + name ).each(function () {
									var _this = $( this );
									// 唯一选择
									_this.addClass( "jsmap-clicked" );
									if ( !opt.multiple ) {
										$pathText.not( ".jsmap-" + name ).not( ".jsmap-disabled" ).removeClass( "jsmap-clicked" ).each(function () {
											$( this ).attr( "fill", $( this ).attr( "data-fill" ) );
										});
									}

									// 点击回调事件
									opt.clickCallback( _this.attr( "data-id" ), _this.attr( "data-name" ) );
										
									// 点击后的填充色
									if ( opt.fill.clickColor === false ) {
										return;
									} else {
										var cloneAllName = $.extend( true, [], allName );
										if ( !opt.fill.clickColor ) {
											opt.fill.clickColor = "#006bde";
										}
										if ( typeof opt.fill.clickColor === "string" ) {
											_this.filter( "path" ).attr( "fill", opt.fill.clickColor );
										}
										if ( $.isPlainObject( opt.fill.clickColor ) && !$.isEmptyObject( opt.fill.clickColor ) ) {
											$.each(opt.fill.clickColor, function ( i, v ) {
												_this.filter( ".jsmap-" + i ).attr( "fill", v );
												cloneAllName.splice( cloneAllName.indexOf( i ), 1 );
											})
											if ( cloneAllName.indexOf( _this.attr( "data-id" ) ) > -1 ) {
												_this.attr( "fill", "#006bde" );
											}
										}
									}

									// 点击后的文字颜色
									if ( opt.areaName.clickColor !== false ) {
										if ( !opt.areaName.clickColor ) {
											opt.areaName.clickColor = "#fff";
										}

										if ( opt.areaName.show ) {
											var $el = $this.find( "text.jsmap-" + _this.attr( "data-id" ) );
											$el.attr( "fill", opt.areaName.clickColor );
											if ( !opt.multiple ) {
												$el.siblings( "text" ).attr( "fill", opt.areaName.basicColor || "#333" );
											}
										}
									}
								})
							}
						});
					})
				})
				
				
				if(opt.defaultClick){
					$this.find( "path.jsmap-" + opt.defaultClick ).trigger('click');
				}
			})
		},
		refresh: function ( selector ) {
			$( selector ).each(function () {
				var $this = $( this );
				if ( $this.data( "cache_resource" ) && $this.find( "div.jsmap-svg-container > svg" ).length ) {
					jsMap.config( $this, $this.data( "cache_resource" ), $this.data( "cache_options" ) );
				}
			})
		},
		remove: function ( selector ) {
			$( selector ).find( "div.jsmap-svg-container" ).remove();
		}
	};

	// 封存 jsMap
	!(function freezeJsMap ( obj ) {
        Object.freeze( obj );
        Object.keys( obj ).forEach(function ( v ) {
            if ( typeof obj[ v ] === "object" ) {
                freezeJsMap( obj[ v ] );
            }
        })
    })( jsMap );

	return jsMap;

});