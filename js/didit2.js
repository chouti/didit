function FirstSelect(){
	if(localStorage.user_token==undefined){
		$('#nav_about').removeClass('not_select').addClass('select')
	} else {
		$('#nav_home').removeClass('not_select').addClass('select')
	}
}

function SignIn(){
	if(typeof(localStorage)=='undefined'){
		alert('Your browser does not support HTML5 localStorage. Try upgrading.');
	} else {
		var signin_url = 'https://openapi.doit.im/oauth/authorize?client_id=4d565f90194f9970e50000ba&redirect_uri=https%3A%2F%2Fopenapi.doit.im%2Foauth%2Fauth_result.html&response_type=token';
		var login_url = 'https://i.doit.im/signin';
		$('#signin_url').click(function(){
			chrome.tabs.create({
				url: signin_url,
				selected: true
			},
			function(tab){
				chrome.tabs.onUpdated.addListener(function(tabId, changeinfo, tab){
					if(tab.id==tabId &&
						changeinfo.url != signin_url &&
						changeinfo.url != undefined){
							var callback_url = changeinfo.url
							var token = callback_url.split('access_token=')[1].split('&')[0]
							localStorage.setItem("user_token", token);
							chrome.tabs.remove(tab.id,function(){
								$('#review').hide();
								$('#task_list').show();
								$('#nav_home').removeClass('not_select').addClass('select');
								$('#nav_about').removeClass('select').addClass('not_select');
							});
						}
				});
			});
		});
	}
}

$(document).ready(function() {
	FirstSelect();
	SignIn();
});
