$(function(){
	
	$(".search_show span").click(function(){
		$(".search form").slideToggle();
	});
	
	
	$(".nav_s span").click(function(){
		$(".navS_con").addClass("active");
		$(".bg_box").click(function(){
			$(".navS_con").removeClass("active");
		});
	})
	
	
})
