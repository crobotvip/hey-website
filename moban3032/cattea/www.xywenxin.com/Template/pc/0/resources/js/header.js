// 公共封装函数

/*滚动动画*/
function scrollAni(ele,_distance) {
	ele.each(function() {
	    var _this = $(this);
	    if (_this.offset().top > $(window).scrollTop() + $(window).height() || _this.offset().top < $(window).scrollTop() - _this.outerHeight()) {
	      // _this.removeClass('animate');
	    } else if ($(window).scrollTop() > _this.offset().top - $(window).height() * _distance) {
	      _this.addClass('animate');
	    }
	});
	$(window).scroll(function() {
	  	ele.each(function() {
		    var _this = $(this);
		    if (_this.offset().top > $(window).scrollTop() + $(window).height() || _this.offset().top < $(window).scrollTop() - _this.outerHeight()) {
		      // _this.removeClass('animate');
		    } else if ($(window).scrollTop() > _this.offset().top - $(window).height() * _distance) {
		      _this.addClass('animate');
		    }
		});
	});
}



// 让内页banner文字上下居中
function innerBanner() {
	var _w0 = $(window).width();
	if($('.pro-banner').length>0 && _w0 > 1023) {
		$(".pro-banner .table,.pro-banner .w1280").height($(".pro-banner").height());
	}
	if($('.other-banner').length>0) {
		var breadHeight = $('.bread-wrap').height();
		$(".other-banner .table,.other-banner .moudle-titles-wrap").height($(".other-banner").height() - breadHeight);
	}
	// 美味课堂banner轮播
	if($('.delicacy-banner').length>0 && _w0 > 1023) {
		$(".delicacy-list1 .delicacy-banner").height($(".list1-right").height());
	}
	if($('.welcome').length>0) {
		$('.footer').addClass('in2');
	}
}




// 头部和底部导航
function _showNavigation () {
	var _w = $(window).width();
	if(_w < 1024) {
		$('.header .nav-a').addClass('nav-a-m');
		$('.footer .nav-a').addClass('nav-a-m');
	}else {
		$('.header-nav .nav-item').hover(function(){
			$(this).find('.sub-hides').stop().slideDown().parent().siblings().find('.sub-hides').stop().slideUp();
		},function(){
			$(this).find('.sub-hides').stop().slideUp();
		});
	}
}

// 头底及公共函数
$(function(){
	innerBanner();
	_showNavigation();
	$(window).resize(function(){
		innerBanner();
		_showNavigation();
	});

	scrollAni($('.js-m'),.88);
	scrollAni($('.js-to-left'),.88);
	scrollAni($('.js-to-right'),.88);
	scrollAni($('.js-scale'),.88);
	scrollAni($('.js-scale2'),.88);

	$('.header-nav .nav-a-m').click(function(){
		var _this = $(this);
		if(_this.hasClass('cur')) {
			_this.toggleClass('cur').parent().toggleClass('cur').siblings().removeClass('cur').find('.nav-a').removeClass('cur');
	        $(".header-nav").find('.sub-hides').stop().slideUp();
		}else {
			_this.toggleClass('cur').parent().toggleClass('cur').siblings().removeClass('cur').find('.nav-a').removeClass('cur');
			_this.parent().find('.sub-hides').stop().slideDown().parent().siblings().find('.sub-hides').stop().slideUp();
		}
	});
	
	$('.footer .nav-a-m').click(function(){
		var _this = $(this);
		if(_this.hasClass('cur')) {
			_this.removeClass('cur');
	        $(".footer").find('.sub-hides').stop().slideUp();
		}else {
			_this.addClass('cur');
			_this.parent().find('.sub-hides').stop().slideDown().parent().siblings().find('.sub-hides').stop().slideUp();
		}
	});

	$('.header,.right-fixed').addClass('animate');
	$('.search-btn').click(function(){
		$('.header .logo').addClass('onlyPc');
		$('.m-nav-btn').addClass('hide2');
		$('.search-box,.close-form').addClass('show1');
		$('.header-nav,.header-right-img,.search-btn').addClass('hide1');
	});
	$('.close-form').click(function(){
		$('.m-nav-btn').removeClass('hide2');
		$('.header .logo').removeClass('onlyPc');
		$('.search-box,.close-form').removeClass('show1');
		$('.header-nav,.header-right-img,.search-btn').removeClass('hide1');
	});

	$(".header .m-nav-btn").on('click', function() {
		var _this = $(this);
		if(_this.hasClass('cur')) {
			_this.removeClass('cur');
	        $(".header").find('.header-nav').stop().slideUp();
		}else {
			$('.m-nav-btn').addClass('cur');
	        $(".header").find('.header-nav').stop().slideDown();
		}
	});

	
	
})
