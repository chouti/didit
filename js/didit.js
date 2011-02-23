/*========================================================
	This is the main javascript file for Did it.
========================================================*/
/*Common URL*/
var task_url='https://openapi.doit.im/v1/tasks'

var addHeaders = function(token){
	var token=localStorage.user_token;
	return "OAuth "+token;
}

$.ajaxSetup({
	dataType: 'json',
	beforeSend: function(req){
		req.setRequestHeader('Authorization', addHeaders())
	},
	contentType: "application/json; charset=utf-8"
});


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

/* Turn on traffic light */
function TurnGreen(){
	if($('li[class="selected"]'))
	$('li[id*="nav"]').click(function(){
		if($(this).attr('class')=='not_selected'){
			$('li[class="selected"]').attr({
				class:'not_selected',
				state:'off'
				});
			$(this).attr({
				class: 'selected',
				state: 'on'
			});
		}
		SwitchCases();
	});
}

/*Date JS Module*/
var today_title = new Date.today().setTimeToNow();
var today = new Date.today().toString("yyyy-MM-dd");
var yesterday = new Date.today().addDays(-1).toString("yyyy-MM-dd");
var last_sunday = new Date.last().sunday();
var sunday_string = new Date.last().sunday().toString("yyyy-MM-dd");
var week_today = new Date.today();
var last_saturday = new Date.last().saturday();
var saturday_string = new Date.last().saturday().toString("yyyy-MM-dd");
var week_before = new Date.last().sunday().addDays(-7);
var week_before_string = new Date.last().sunday().addDays(-7).toString("yyyy-MM-dd");
var month_start = new Date.today().moveToFirstDayOfMonth();
var month_start_string = new Date.today().moveToFirstDayOfMonth().toString("yyyy-MM-dd");

/* Switch date ranges */
function ShowToday(){
	$('#today').empty();
	$('#input').show();
	$('#today').show();
	$('#yesterday').hide();
	$('#thisweek').hide();
	$('#lastweek').hide();
	$('#thismonth').hide();
	$('#today').append('<h3>'+today_title+'</h3>');
	GetToday();
}

/*Get Today's task list*/
function GetToday(){
	$.get(task_url, function(data){
		if(data.entries.length!=null){
			var items=data.entries;
			for (var i=0; i<items.length; i++){
				var tags=items[i].tags;
				if(tags!=[]){
					for (var t=0; t<tags.length; t++){
						if(tags[t]=='didit'){
							//console.log(items[i].title)
							if(items[i].completed!=null&&
								items[i].trashed==null){
									var completed_date = items[i].completed.split(' ')[0];
									//console.log(completed_date)
									if(completed_date==today){
										$('#today').append('<li name="today_list">'+items[i].title+'</li>');
									}
								}
						}
					}
				}
			}
		}
		if ($('li[name="today_list"]').length==0){
			$('#today').append('<p class="center">No archivements for today</p>');
		}
	});
}

function ShowYesterday(){
	$('#yesterday').empty();
	$('#input').hide();
	$('#today').hide();
	$('#yesterday').show();
	$('#thisweek').hide();
	$('#lastweek').hide();
	$('#thismonth').hide();
	$('#yesterday').append('<h3>'+yesterday+'</h3>');
	GetYesterday();
}

function GetYesterday(){
	$.get(task_url, function(data){
		if(data.entries.length!=null){
			var items=data.entries;
			for (var i=0; i<items.length; i++){
				var tags=items[i].tags;
				if(tags!=[]){
					for (var t=0; t<tags.length; t++){
						if(tags[t]=='didit'){
							//console.log(items[i].title)
							if(items[i].completed!=null&&
								items[i].trashed==null){
									var completed_date = items[i].completed.split(' ')[0];
									//console.log(completed_date)
									if(completed_date==yesterday){
										$('#yesterday').append('<li name="yesterday_list">'+items[i].title+'</li>');
									}
								}
						}
					}
				}
			}
		}
		if ($('li[name="yesterday_list"]').length==0){
			$('#yesterday').append('<p class="center">No archivements for yesterday</p>');
		}
	});
}

function ShowThisweek(){
	$('#thisweek').empty();
	$('#input').show();
	$('#today').hide();
	$('#yesterday').hide();
	$('#thisweek').show();
	$('#lastweek').hide();
	$('#thismonth').hide();
	$('#thisweek').append('<h3>from '+sunday_string+' to '+today+'</h3>');
	GetThisweek();
}

function GetThisweek(){
	$.get(task_url, function(data){
		if(data.entries.length!=null){
			var items=data.entries;
			for (var i=0; i<items.length; i++){
				var tags=items[i].tags;
				if(tags!=[]){
					for (var t=0; t<tags.length; t++){
						if(tags[t]=='didit'){
							//console.log(items[i].title)
							if(items[i].completed!=null&&
								items[i].trashed==null){
									var completed_date = items[i].completed.split(' ')[0];
									//console.log(completed_date)
									var newdate = Date.parse(completed_date);
									if(newdate.between(last_sunday,week_today)){
										$('#thisweek').append('<li name="thisweek_list">'+items[i].title+'</li>');
									}
								}
						}
					}
				}
			}
		}
		if ($('li[name="thisweek_list"]').length==0){
			$('#thisweek').append('<p class="center">No archivements for this week</p>');
		}
	});
}

function ShowLastweek(){
	$('#lastweek').empty();
	$('#input').hide();
	$('#today').hide();
	$('#yesterday').hide();
	$('#thisweek').hide();
	$('#lastweek').show();
	$('#thismonth').hide();
	$('#lastweek').append('<h3>from '+week_before_string+' to '+saturday_string+'</h3>');
	GetLastweek();
}

function GetLastweek(){
	$.get(task_url, function(data){
		if(data.entries.length!=null){
			var items=data.entries;
			for (var i=0; i<items.length; i++){
				var tags=items[i].tags;
				if(tags!=[]){
					for (var t=0; t<tags.length; t++){
						if(tags[t]=='didit'){
							//console.log(items[i].title)
							if(items[i].completed!=null&&
								items[i].trashed==null){
									var completed_date = items[i].completed.split(' ')[0];
									//console.log(completed_date)
									var newdate = Date.parse(completed_date);
									if(newdate.between(week_before,last_saturday)){
										$('#lastweek').append('<li name="lastweek_list">'+items[i].title+'</li>');
									}
								}
						}
					}
				}
			}
		}
		if ($('li[name="lastweek_list"]').length==0){
			$('#lastweek').append('<p class="center">No archivements for last week</p>');
		}
	});
}

function ShowThismonth(){
	$('#thismonth').empty();
	$('#input').show();
	$('#today').hide();
	$('#yesterday').hide();
	$('#thisweek').hide();
	$('#lastweek').hide();
	$('#thismonth').show();
	$('#thismonth').append('<h3>from '+month_start_string+' to '+today+'</h3>');
	GetThismonth();
}

function GetThismonth(){
	$.get(task_url, function(data){
		if(data.entries.length!=null){
			var items=data.entries;
			for (var i=0; i<items.length; i++){
				var tags=items[i].tags;
				if(tags!=[]){
					for (var t=0; t<tags.length; t++){
						if(tags[t]=='didit'){
							//console.log(items[i].title)
							if(items[i].completed!=null&&
								items[i].trashed==null){
									var completed_date = items[i].completed.split(' ')[0];
									//console.log(completed_date)
									var newdate = Date.parse(completed_date);
									if(newdate.between(month_start,week_today)){
										$('#thismonth').append('<li name="thismonth_list">'+items[i].title+'</li>');
									}
								}
						}
					}
				}
			}
		}
		if ($('li[name="thismonth_list"]').length==0){
			$('#thismonth').append('<p class="center">No archivements for this month</p>');
		}
	});
}

/* Switch Cases from different date range */
function SwitchCases(){
	var dateRange = $('li[class="selected"]').attr('id');
	switch(dateRange)
	{
		case 'nav1':
			ShowToday();
			break;
		case 'nav2':
			ShowYesterday();
			break;
		case 'nav3':
			ShowThisweek();
			break;
		case 'nav4':
			ShowLastweek();
			break;
		case 'nav5':
			ShowThismonth();
			break;
		default:
			ShowToday();
	}
}
$(document).ready(function(){
	CheckToken();
	ClearInput();
	TurnGreen();
	ShowToday();
})