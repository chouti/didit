/*========================================================
	This is the main javascript file for Did it.
========================================================*/
/*Common URL*/
var task_url='https://openapi.doit.im/v1/tasks'
var user_url='https://openapi.doit.im/v1/settings'

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
								$('#slogan').fadeIn('fast',function(){
									$('#logo').css('float','left');
								});
								GetProfile();
								ShowToday();
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
		$('#intro').show();
		$('#intro-up').show();
		$('#intro-down').show();
		$('#container').hide();
		$('#slogan').fadeOut('fast',function(){
			$('#logo').css('float','none');
		});
	} else {
		$('#intro').hide();
		$('#intro-up').hide();
		$('#intro-down').hide();
		$('#slogan').show();
		$('#slogan').fadeIn('fast',function(){
			$('#logo').css('float','left');
		});
		GetProfile();
	}
}

/* Clear input text field place holder with on focus */
function ClearInput(){
	$('input[name="did_title"]').focus(function(){
		$(this).attr('value', "");
		$('.counter').empty();
		$("form input").counter();
	});
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
	$('#todayul').empty();
	$('#today_head').empty();
	$('#input').show();
	$('#today').show();
	$('#yesterday').hide();
	$('#thisweek').hide();
	$('#lastweek').hide();
	$('#thismonth').hide();
	$('#today_head').append('<h3>'+today_title+'</h3>');
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
										$('#todayul').append('<li class="task_main" name="today_list" id="'+items[i].id+'">'+items[i].title+'<img name="delete" class="right action" id="'+items[i].id+'" src="/images/delete.png" /></li>');
									}
								}
						}
					}
				}
			}
			DelTasks();
		}
		if ($('li[name*="_list"]:visible').length==0){
			$('#todayul').append('<p class="center">No achievements for today</p>');
		}
	});
}

function ShowYesterday(){
	$('#yesterdayul').empty();
	$('#yesterday_head').empty();
	$('#input').hide();
	$('#today').hide();
	$('#yesterday').show();
	$('#thisweek').hide();
	$('#lastweek').hide();
	$('#thismonth').hide();
	$('#yesterday_head').append('<h3>'+yesterday+'</h3>');
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
										$('#yesterdayul').append('<li class="task_main" name="yesterday_list" id="'+items[i].id+'">'+items[i].title+'<img name="delete" class="right action" id="'+items[i].id+'" src="/images/delete.png" /></li>');
									}
								}
						}
					}
				}
			}
			DelTasks();
		}
		if ($('li[name*="_list"]:visible').length==0){
			$('#yesterdayul').append('<p class="center">No achievements for yesterday</p>');
		}
	});
}

function ShowThisweek(){
	$('#thisweekul').empty();
	$('#thisweek_head').empty();
	$('#input').show();
	$('#today').hide();
	$('#yesterday').hide();
	$('#thisweek').show();
	$('#lastweek').hide();
	$('#thismonth').hide();
	$('#thisweek_head').append('<h3>from '+sunday_string+' to '+today+'</h3>');
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
										$('#thisweekul').append('<li class="task_main" name="thisweek_list" id="'+items[i].id+'">'+items[i].title+'<img name="delete" class="right action" id="'+items[i].id+'" src="/images/delete.png" /></li>');
									}
								}
						}
					}
				}
			}
			DelTasks();
		}
		if ($('li[name*="_list"]:visible').length==0){
			$('#thisweekul').append('<p class="center">No achievements for this week</p>');
		}
	});
}

function ShowLastweek(){
	$('#lastweekul').empty();
	$('#lastweek_head').empty();
	$('#input').hide();
	$('#today').hide();
	$('#yesterday').hide();
	$('#thisweek').hide();
	$('#lastweek').show();
	$('#thismonth').hide();
	$('#lastweek_head').append('<h3>from '+week_before_string+' to '+saturday_string+'</h3>');
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
										$('#lastweekul').append('<li class="task_main" name="lastweek_list" id="'+items[i].id+'">'+items[i].title+'<img name="delete" class="right action" id="'+items[i].id+'" src="/images/delete.png" /></li>');
									}
								}
						}
					}
				}
			}
			DelTasks();
		}
		if ($('li[name*="_list"]:visible').length==0){
			$('#lastweekul').append('<p class="center">No achievements for last week</p>');
		}
	});
}

function ShowThismonth(){
	$('#thismonthul').empty();
	$('#thismonth_head').empty();
	$('#input').show();
	$('#today').hide();
	$('#yesterday').hide();
	$('#thisweek').hide();
	$('#lastweek').hide();
	$('#thismonth').show();
	$('#thismonth_head').append('<h3>from '+month_start_string+' to '+today+'</h3>');
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
										$('#thismonthul').append('<li class="task_main" name="thismonth_list" id="'+items[i].id+'">'+items[i].title+'<img name="delete" class="right action" id="'+items[i].id+'" src="/images/delete.png" /></li>');
									}
								}
						}
					}
				}
			}
			DelTasks();
		}
		if ($('li[name*="_list"]:visible').length==0){
			$('#thismonthul').append('<p class="center">No achievements for this month</p>');
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

/*Add tasks to list*/
function AddTasks(){
	var title = $("input[name='did_title']").val();
	task_data = JSON.stringify({'title':title,'start_at':today,'completed':today,'tags':['didit']});
	$.post(task_url,task_data);
}

/*Get User profile*/
function GetProfile(){
	$.get(user_url, function(data){
		var email=data.remind_email;
		var username=data.account;
		var hash= MD5(jQuery.trim(email).toLowerCase());
		var gravatar_url='http://www.gravatar.com/avatar/'+hash+'?s=80&d=mm';
		$('#gravater').empty();
		$('#welcome').empty();
		$('#gravatar').append("<img src='"+gravatar_url+"' />");
		$('#welcome').append("<p>Welecome&nbsp&nbsp&nbsp&nbsp"+username+".<br />Nice to see you again.</p><p><a href='#' id='logout'>Logout</a>")
		$('#logout').click(function(){
			localStorage.clear();
			$('#profile').empty();
			//console.log(localStorage.user_token)
			CheckToken();
		});
	})
}

/*Delete tasks*/
function DelTasks(){
	$('img[name="delete"]').click(function(){
		var task_id=$(this).attr('id');
		//console.log(task_id);
		DelTask(task_id);
		$(this).parent('li').slideUp(function(){
			if($('li[name*="_list"]:visible').length==0){
				SwitchCases();
			}
		});
	});
}

function DelTask(task_id){
	$.get(task_url, function(data){
	for(var i=0; i<data.entries.length; i++){
		if(data.entries[i].id==task_id){
		 var origin = data.entries[i];
		 origin.deleted=week_today;
		 var updated=JSON.stringify(origin);
		 //console.log(updated);
		 $.ajax({
		 	type: "PUT",
		 	url: task_url,
			data: updated
		 });
		}
	}
	});
}

/* Word counter*/
jQuery.fn.counter = function() {
  $(this).each(function() {
	var max = $(this).attr('maxlength');
	var val = $(this).attr('value');
	var cur = 0;
	if(val) // value="", or no value at all will cause an error
	  cur = val.length;
	var left = max-cur;
	$('.counter').remove();
	$(this).after("<section class='counter'>"
	  + left.toString()+"&nbspcharacters left.</section>");
	// You can use something like this to align the
	// counter to the right of the input field.
	var c = $(this).next('.counter');
	c.width(542);
	c.css("position","relative");
	c.css("text-align","right");
	//c.css("top",-$(this).height()-8);
	//c.css("left",$(this).width()+8);

	$(this).keyup(function(i) {
	  var max = $(this).attr('maxlength');
	  var val = $(this).attr('value');
	  var cur = 0;
	  if(val)
		cur = val.length;
	  var left = max-cur;
	  $(this).next(".counter").text(left.toString()+" characters left.");
	  return this;
	});
  });
  return this;
}

/*===================================
	Final
===================================*/
$(document).ready(function(){
	$("form input").counter();
	CheckToken();
	ClearInput();
	TurnGreen();
	ShowToday();
	$('#add_task').keydown(function(event){
		if(event.keyCode==13){
			AddTasks();
		}
	});
})