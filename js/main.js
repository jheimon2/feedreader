if(!(window.mvc))window.mvc={};

include([
  "js/md5.js",
  "js/tools.js",
  "js/cookie.js",
  "js/jquery.bindkey.js",
  "js/jquery.layouthelper.js",
  "js/lib/jquery.ba-resize.min.js",
  "js/lib/detectmobilebrowser.js",
  "js/reddit.js",
  "js/rss.js"
  
  
],initialize);
var loginName=null;

window.logins = [];

function initialize(){

  if(jQuery.browser.mobile){
	$("body").addClass("mobile");
	window.usePreload=false;
  }
  else
	window.usePreload=true;
  
  
  window.onbeforeunload = function () {                       
         return "really leave?";
    }
  
  //$("#test").html("kiikikii");
  
  //tryLogin();
  //$(".blockingwait").fadeOut('slow');
  /*$("#main").animate({"background-color":"#5C4"},4200);*/
	window.main = new Main();
	
	$("body").keypress(function(evt) {
		if(evt.keyCode==37)
			window.main.prev();
		else if(evt.keyCode==39)
			window.main.next();
		/*

		else if(evt.keyCode==38)
			focusPage();
		else if(evt.keyCode==40)
			focusPage();
		*/
		
	});
}

function Main(){
	window.main=this;
	var feed;
	
	this.viewFeed = function viewFeed(feed){
		
		this.feed=feed;
		//this.next();
		
	}
		
	this.next = function next(){
		$("body").focus();//keystrokeja varten
		
		var data = window.main.feed.next();
		
		/*
		data = {
			title:"testicle",
			url:"http://example.org"
		
		};*/
		
		//pyöritellään iframeja
		
		var commentsVisible = $("#comments").is(":visible");
		
		$("#prevcomments").attr("id","prevcommentstmp");
		$("#prevpage").attr("id","prevpagetmp");
		
		
		
		$("#comments").attr("id","prevcomments");
		$("#page").attr("id","prevpage");
		
		$("#nextcomments").attr("id","comments");
		$("#nextpage").attr("id","page");
		
		if(commentsVisible){
			$("#comments").show();
			$("#page").hide();
		
		}
		else{
			$("#comments").hide();
			$("#page").show();
		}
		
		
		$("#prevcommentstmp").attr("id","nextcomments");
		$("#prevpagetmp").attr("id","nextpage");
		$("#nextcomments").attr("src","");
		$("#nextpage").attr("src","");
		
		
		
		$("#nextcomments").hide();
		$("#nextpage").hide();
		
		$("#prevcomments").hide();
		$("#prevpage").hide();
		
		this.updateView(data);
		
	}
	this.prev = function prev(){
		$("body").focus();//keystrokeja varten
		
		var data = window.main.feed.prev();
		
		
		
		//pyöritellään iframeja
		
		var commentsVisible = $("#comments").is(":visible");
		
		$("#nextcomments").attr("id","nextcommentstmp");
		$("#nextpage").attr("id","nextpagetmp");
		
		
		$("#comments").hide();
		$("#page").hide();
		
		$("#comments").attr("id","nextcomments");
		$("#page").attr("id","nextpage");
		
		$("#prevcomments").attr("id","comments");
		$("#prevpage").attr("id","page");
		
		if(commentsVisible){
			$("#comments").show();
			$("#page").hide();
		
		}
		else{
			$("#comments").hide();
			$("#page").show();
		}
		
		$("#nextcommentstmp").attr("id","prevcomments");
		$("#nextpagetmp").attr("id","prevpage");
		$("#prevcomments").attr("src","");
		$("#prevpage").attr("src","");
		
		
		
		$("#nextcomments").hide();
		$("#nextpage").hide();
		
		$("#prevcomments").hide();
		$("#prevpage").hide();
		
		this.updateView(data);
		
	}
	
	this.slidePagesNext=function(){
		$("#header").hide("slide", { direction: "left" }, 1000);
		//$(".curelem").hide("slide",{direction:"left"},420);
		//$("#curpage").effect("transfer",{to:$("#prevpage")},420);
	}
	
	this.updateView = function updateView(data){
		l = data[1];
		if(!l.score)
			l.score="";
		if(!l.subreddit)
			l.subreddit="";
		
		
		
		$("title").html(l.title);
		$("#title").html(l.title);
		$("#title").attr("href",l.url);
		
		$("#score").html(l.score);
		$("#subreddit").html(l.subreddit);
		$("#subreddit").attr("href","http://reddit.com/r/"+l.subreddit);
		
		
		
		var iframe = this.getIFrameSrc(l, $("#page"));
		
		if($("#page").attr("src")!=iframe);
			$("#page").attr("src",iframe);
		
		
		
		if(l.permalink)
			$("#comments").attr("src","http://www.reddit.com/"+l.permalink);
		else
			$("#comments").attr("src","about:blank");
		
		
		if(data[0]){
			var iframe = this.getIFrameSrc(data[0], $("#prevpage"));
			if( $("#prevpage").attr("src")!=iframe)
				$("#prevpage").attr("src",iframe);
			$("#prev").attr("title",data[0].title);	
		}
		if(data[2]){
			var iframe = this.getIFrameSrc(data[2], $("#nextpage"));
			if($("#nextpage").attr("src")!=iframe)
				$("#nextpage").attr("src",iframe);
			$("#next").attr("title",data[2].title);	
		}
		
		if(data[0])
			l=data[0];
		var newSrc;
		if(l.permalink)
			newSrc=("http://www.reddit.com/"+l.permalink);
		else
			newSrc="";
		
		if($("#prevcomments").attr("src")!=newSrc)
			$("#prevcomments").attr("src",newSrc);
		
		if(data[2])
			l=data[2];
		else
			return;
		
		
		if(l.permalink)
			newSrc=("http://www.reddit.com/"+l.permalink);
		else
			newSrc="";
		
		if($("#nextcomments").attr("src")!=newSrc)
			$("#nextcomments").attr("src",newSrc);
			
		if(l.permalink)
			$("#nextcomments").attr("src","http://www.reddit.com/"+l.permalink);
		else
			$("#nextcomments").attr("src","");
					
	}



	this.getIFrameSrc = function getIFrameSrc(l, frame){
		frame.removeClass("ytframe");
		
		tmpUrl = l.url;
		var ind = tmpUrl.indexOf("?");
		if(ind>=0)
			tmpUrl = tmpUrl.slice(0,ind);
		if(tmpUrl.toLowerCase().endsWith(".jpg")||tmpUrl.toLowerCase().endsWith(".gif")||tmpUrl.toLowerCase().endsWith(".png")){
			return "pictureframe.html?src="+l.url;
		}
		
		var c;
		if(l && l.media_embed)
			c= l.media_embed.content;
		
		
		if(!c)
			return l.url;
		var i = c.indexOf("src=\"")+5;
		if(i<0)
			return l.url;
		var j = c.indexOf("\"",i+1);
		if(j<0)
			return l.url;
		frame.addClass("ytframe");	
		return c.slice(i,j);
	
	}

	this.addFavorite=function(){
		if(!localStorage)
			return;
		
		var fav = localStorage.favorites;
		
		if(!fav)
			fav = {};
		else
			fav = JSON.parse(fav);
		var url = $("#page").attr("src");
		var title = $("title").html();
		
		
		
		fav[url]=title;
		
		//fav[1]=title;
		//console.log(fav[1]);
		
		
		
		localStorage.favorites=JSON.stringify(fav);
		
		
	}
	
	this.viewFavorites= function(){
		if(!localStorage || !localStorage.favorites)
			return;
		
		var d = $("<div/>",{
			class:"popup"
			
		});
		var fav = JSON.parse(localStorage.favorites);
		
		for(var i in fav){
			var a = $("<a/>", {
				href: i,
				html:fav[i]
			});
			a.appendTo(d);
			$("<br/>").appendTo(d);
		}
		
		d.appendTo($("#content"));
		d.one("click",function(){
			d.hide();
		});
		d.show();
	}
	
	this.viewFeeds= function(){
		
		var d = $("<div/>",{
			class:"popup"
			
		});
		
		d.append("<h1>Preset feeds:</h1>");
		
		if(!window.Reddit)
			window.Reddit = new RedditLoader();
		d.append("<h2>Reddit</h2>");
		var l = window.Reddit.listFeeds();
		for(var i in l){
			var a = $("<a/>", {
				href: l[i],
				html:i
			});
			a.appendTo(d);
			$("<br/>").appendTo(d);
		}
		
		
		d.append("<h2>RSS</h2>");
		
		if(!window.RSS)
			window.RSS = new RSSLoader();
		var l = window.RSS.listFeeds();
		for(var i in l){
			var a = $("<a/>", {
				href: l[i],
				html:i
			});
			a.appendTo(d);
			$("<br/>").appendTo(d);
		}
		
		
		
		d.appendTo($("#content"));
		d.one("click",function(){
			d.hide();
		});
		d.show();
	}

	this.toggleComments = function toggleComments(){
		if(!$("#comments").is(":visible")){
			
			$("#page").hide();
			$("#comments").show();
			$("#toggleComments").html("");
		}
	
		else{
			
			$("#comments").hide();
			$("#page").show();
			$("#toggleComments").html("");
		}
	}

	this.reset =function(){
		this.feed.reset();
	}
		
	window.mvc.Router = Backbone.Router.extend({
		routes:{
			"reddit/":				"loadReddit",
			"reddit/:subreddit": 	"loadReddit",
			
			"rss/:feedname":		"loadRSS",
			"testicle":				"testicle"
		
		},
		loadReddit: function(subreddit){
			if(!subreddit)
				subreddit="FRONTPAGE";
			
			window.main.viewFeed(new RedditLoader(subreddit, function(){window.main.next()}));	
		
		},
		loadRSS: function(feed){
			window.main.viewFeed(new RSSLoader(feed));
		
		},

		testicle: function(){
			$("#test").html("testicle");
		}

	});

	var router = new window.mvc.Router();
	Backbone.history.start();



}













function toggleSettings(){
	$("#settings").toggle();
}
function toggleHideControls(){
	$(".controls").toggle();
	$("#hidecontrols").toggleClass("selected");
}


//tauhkaa toisesta projektista, voi olla käyttöä jahka tehdään reggaus


function scrollPage(a){
	var d;
	if(!$("#comments").is(":visible"))
		d = $("#page").contents();
	else
		d = $("#comments").contents();
	d.scrollTop(d.scrollTop()+a);
	
}
function focusPage(){
	var d;
	if(!$("#comments").is(":visible"))
		d = $("#page");
	else
		d = $("#comments");
	d[0].contentWindow.focus();
	setTimeout(function(){$("body").focus();},10);
	
}



String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function createLogin(){
  /*
  if(tryLogin()){
    $(".loginform").hide("fast");
    return;
    
  } */
  
  $(".loginform").show("fast");
  
}
function showMain(){
	
}


function toggleRegister(b){
  $(".loginform .formerror").remove();
  if(!b){
    $(".loginform a:eq(0)").removeClass("selected");
    $(".loginform a:eq(1)").addClass("selected");
    $(".confirmpass").show('slow');
    $(".loginform #submitbutton").hide('fast');
    $(".loginform #submitbutton").val('register');
    $(".loginform #submitbutton").show('fast');
  }
  else{
    $(".loginform a:eq(1)").removeClass("selected");
    $(".loginform a:eq(0)").addClass("selected");
    $(".confirmpass").hide('slow');
    $(".loginform #submitbutton").hide('fast');
    $(".loginform #submitbutton").val('login');
    $(".loginform #submitbutton").show('fast');
    
  }
    
}
function tryLogin(){
  var l = $.cookie("login");
  if(!l)
    return false;
  var ll = l.split(":");                                                       
  this.loginName=ll[0];
  var data = loadFile("login.pg?user="+ll[0]+"&pwhash="+ll[1]);
  if(data=="OK"){
    
    login();
  }else{
      $(".loginform #password").after(
          $('<div class="formerror">'+data+'</div>')
      );
      $(".loginform .wait").hide();
      return false;
    
  } 
  
  //alert(loadFile("login.pg?user="+l[0]+"&pwhash="+l[1]));
  
  return true;
}
function loginFormSent(){
  $(".loginform .wait").show();
  var user = $(".loginform #username").val(); 
  var pwhash = getPWHash();
  $(".loginform .formerror").remove();
  if($(".loginform #submitbutton").val()=='register'){
    var error=false;
    
    if($(".loginform #password").val()!=$(".loginform #confirmpassword").val()){
          $(".loginform #confirmpassword").after(
          $('<div class="formerror">passwords not equal</div>')
        );
        error=true;
    }
    
    if(user!=user.replace(/[^a-zA-Z_0-9]/gi,'')){
        $(".loginform #username").after(
          $('<div class="formerror">username can contain only A-Z,a-z,0-9 and _</div>')
        );
        error=true;
    }
    if(user.length<4 || user.length>20){
        $(".loginform #username").after(
          $('<div class="formerror">username must be 4-20 chars</div>')
        );
        error=true;
    }
    
    if(error){
      $(".loginform .wait").hide();
      return;
    }
    if(!tryRegister(user,pwhash))
      return;
    
  }
  
  $.cookie("login",user+":"+pwhash);
  tryLogin();
  //...loginkiroukset  
}
function tryRegister(user, pwhash){
  var data = loadFile("register.pg?user="+user+"&pwhash="+pwhash);
  if(data=="OK")
    return true;
  else{
     $(".loginform #username").after(
          $('<div class="formerror">'+data+'</div>')
      );
      $(".loginform .wait").hide();
      return false;
  }
}
function getPWHash(pass){
  
  return b64_md5(pass||$(".loginform #password").val());
}
function login(){
  
  $(".loginform .wait").hide();
  $(".loginname").html(loginName);
  $(".visitorinfo").hide();
  $(".logininfo").show();
  $(".loginform").hide('fast');
  
}


function logout(){
  $.cookie("login",null);
  
  $(".logininfo").hide();
  $(".visitorinfo").show();
  
  
}


function cookieTest(){
  $.cookie("login","testi:KULLIHUORA");
  alert($.cookie("login"));
}
