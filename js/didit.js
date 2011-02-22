/*========================================================
	This is the main javascript file for Did it.
========================================================*/

/* Authoriation function */
function GetAuth(){
	if(typeof(localStorage)=='undefined'){
		alert('Your browser does not support HTML5 localStorage. Try upgrading.');
	} else {
		var auth_url = 'https://openapi.doit.im/oauth/authorize?client_id=4d565f90194f9970e50000ba&redirect_uri=https%3A%2F%2Fopenapi.doit.im%2Foauth%2Fauth_result.html&response_type=token'
		var login_url = 'https://i.doit.im/signin'
		$('#container').hide();
		$('#auth_login').click(function(){
			chrome.tabs.create({
				url: auth_url,
				selected: true
			},
			function(tab){
				chrome.tabs.onUpdated.addListener(function(tabId, changeinfo, tab){
					if(tab.id == tabId &&
						changeinfo.url != login_url &&
						changeinfo.url != undefined){
							var token_url = changeinfo.url
							var token = token_url.split('access_token=')[1].split('&')[0]
							localStorage.setItem("user_token", token);
							chrome.tabs.remove(tab.id, function(){
								$('#intro').hide();
								$('#intro-up').hide();
								$('#intro-down').hide();
								$('#container').show();
							})
						}
				});
			});
		})
	}
}

/* Check if user token localStorage avaliable */
function CheckToken(){
	if(localStorage.user_token==undefined){
		GetAuth();
	} else {
		$('#intro').hide();
		$('#intro-up').hide();
		$('#intro-down').hide();
		$('#container').show();
	}
}

/* Clear input text field place holder with on focus */
function ClearInput(){
	$('input[name="did_title"]').focus(function(){
		$(this).attr('value', "");
	});
	$('input[name="did_title"]').blur(function(){
		$(this).attr('value', "What did you do today?")
	})
}

$(document).ready(function(){
	CheckToken();
	ClearInput();
})