function FirstSelect(){
	if(localStorage.user_token==undefined){
		$('#nav_about').removeClass('not_select').addClass('select')
	} else {
		$('#nav_home').removeClass('not_select').addClass('select')
	}
}

$(document).ready(function() {
	FirstSelect();
});
