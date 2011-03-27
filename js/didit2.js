var task_array = new Array();

function FirstSelect(){
	if(localStorage.user_token==undefined){
		$('li[class="select"]').attr('class','not_select');
		$('#nav_about').attr('class','select');
		$('#review').show();
		$('#task_list').hide();
	} else {
			$('li[class="select"]').attr('class','not_select');
			$('#nav_home').attr('class','select');
			$('#task_list').show();
			$('#review').hide();
			$('#list_view').show();
			$('#calendar_view').hide();
			$('#graph_view').hide();
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
								$('li[class="select"]').attr('class','not_select');
								$('#nav_home').attr('class','select');
							});
						}
				});
			});
		});
		SayHello();
	}
}

/*Make Ajax Base Setting*/
var task_url='https://openapi.doit.im/v1/tasks'
var setting_url='https://openapi.doit.im/v1/settings'
var addHeaders=function(token){
	var token = localStorage.user_token
	return "OAuth "+token;
}
$.ajaxSetup({
	beforeSend: function(req){
		req.setRequestHeader('Authorization', addHeaders())
	},
	dataType:'json',
	contentType: "application/json; charset=utf-8"	
});

/*SayHello to our user*/
function SayHello(){
	$.getJSON(setting_url, function(data){
		/*Get Gravatar Image*/
		gravatar_hash=MD5(data.username);
		/*Say Hello*/
		$('#user_panel').append("<img src='http://www.gravatar.com/avatar/"+gravatar_hash+"?s=24' class='gravatar'>"+"Hello "+data.account+"! Not you? "+"<a herf='#' id='signout'>Sign Out</a>");
		/*Add Sign Out function block*/
		$('#signout').click(function(){
			localStorage.clear();
			FirstSelect();
		});
	})
}

/*Switch with Menu*/
function NavMenu(){
	$('li[id^="nav_"]').click(function(){
		$('li[class="select"]').attr('class','not_select');
		$(this).attr('class','select');
	/*Render different views*/
	var view_type = $('li[class="select"]').attr("id");
	switch(view_type){
		case "nav_home":
			$('#task_list').show();
			$('#review').hide();
			$('#list_view').show();
			$('#calendar_view').hide();
			$('#graph_view').hide();
			break
		case "nav_calendar":
			$('#task_list').show();
			$('#review').hide();
			$('#list_view').hide();
			$('#calendar_view').show();
			$('#graph_view').hide();
			break
		case "nav_graphic":
			$('#task_list').show();
			$('#review').hide();
			$('#list_view').hide();
			$('#calendar_view').hide();
			$('#graph_view').show();
			break
		case "nav_about":
			$('#task_list').hide();
			$('#review').show();
			break
		default:
			$('#task_list').show();
			$('#review').hide();
			$('#list_view').show();
			$('#calendar_view').hide();
			$('#graph_view').hide();
	}
	});
}

/*Get all Tasks*/
function GetTasks(){
	$.getJSON(task_url,function(data){
		var items = data.entries;
		for(i=0; i< items.length; i++){
			if(items[i].completed!=null&&
				items[i].trashed==null){
				task_array.push(items[i]);
			}
		}
		ListView();
	});
}

/*Render List view*/
function ListView(){
	var completed_array = new Array();
	var title_array = new Array();
	var date_title_array = new Array();
	var uuid_array = new Array();
	for(var i=task_array.length-1; i>=0; i--){
		var completed_date=task_array[i].completed.split(' ')[0]
		var title=task_array[i].title;
		var uuid=task_array[i].id;
		completed_array.push(completed_date);
		title_array.push(title);
		uuid_array.push(uuid);
	}
	var sorted = completed_array.sort().reverse();
	for (var c=0; c<=sorted.length-1; c++){
		var year = sorted[c].split('-')[0]
		var month = sorted[c].split('-')[1]
		var date = sorted[c].split('-')[2]
		var day = Date.parse(sorted[c]).toString().split(' ')[0]
		var date_title = year+'-'+month
		date_title_array.push(date_title)
		$('#task_area').append('<div class="task_entry" id="'+uuid_array[c]+'"><div class="date_column"><div class="date_area">'+date+'</div><div class="week_area">'+day+'</div></div><div class="task_column">'+title_array[c]+'</div><div style="clear:both;"></div></div>');
	}
	/*Add year and month before task_entry list*/
	$('#list_view').append('<div style="clear:both;"></div>');
	$('#task_area').append('<div style="clear:both;"></div>');
	$('#task_area').jPaginate({items: 10});
}


/*Final load*/
$(document).ready(function() {
	FirstSelect();
	SignIn();
	NavMenu();
	GetTasks();
});
