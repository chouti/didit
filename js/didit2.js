function FirstSelect(){
	if(localStorage.user_token==undefined){
		$('#nav_about').removeClass('not_select').addClass('select');
		$('#review').show();
		$('#task_list').hide();
	} else {
		$('#nav_home').removeClass('not_select').addClass('select')
		$('#review').hide();
		$('#task_list').show();
	}
}

$(document).ready(function() {
	FirstSelect();
});
