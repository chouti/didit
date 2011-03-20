function MenuMark(){
	$('#header_menu > ul > li').click(function(){
		$(this).removeClass('not_select').addClass('select')
	});
}

$(document).ready(function() {
	MenuMark();
});
