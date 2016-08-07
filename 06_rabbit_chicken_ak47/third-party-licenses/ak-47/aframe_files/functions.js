// Main JS File

// Start Wrapper
jQuery(document).ready(function ($) {
	$(window).load(function () {

// Mobile Nav Menu
$(function htMenuToggle() {

	$("#ht-nav-toggle").click(function () {
        $("#nav-primary-menu").animate({
            height: "toggle",
            opacity: "toggle"
        }, 400);
    });
	
});

// HT fade in #ht-to-top
$(function () {
	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			$('#ht-to-top').fadeIn('1000');
		} else {
			$('#ht-to-top').fadeOut('1000');
		}
	});

	// scroll body to 0px on click
	$('#ht-to-top').click(function () {
		$('body,html').animate({
			scrollTop: 0
		}, 800);
		return false;
	});	
});
	

// Responsive Images
$(function(){
    $('picture').picture();
});




	});	
})
//  End Wrapper