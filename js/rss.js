var FEEDS =[];
FEEDS["ampparit"]="http://feeds.feedburner.com/ampparit-kaikki";
FEEDS["stackoverflow"]="http://stackoverflow.com/feeds";
function RSSLoader(rssfeed, loadCallback){//callback ei tee mit‰‰n atm, TODO:fix
	window.RSS=this;
	this.rssfeed=rssfeed;
	this.data = [];
	this.cur=-1;
	var pilu = this;
	this.load = function(rssfeed,callback){
		
			
		if(FEEDS[rssfeed])
			rssfeed=FEEDS[rssfeed];
		
		var kyrpa=pilu;
		
		/*
		$.get(

			rssfeed,

			function(data){
				console.log(data);
				$(data).find("entry").each(
					
					function (i, post) {
						var el= $(this);
						console.log(el);
						var l = {
							title:el.find("title").text(),
							author:el.find("author").text(),
							description:el.find("description").text(),
							url:el.find("link").attr("href")
							
						};
						
						kyrpa.data[kyrpa.data.length]=l;
						console.log(l);
						//kyrpa.from=post.data.name;
					}
				)
			}
		).done(
			function() { 
				window.main.next();
			}
		).fail(
			function(data){ 
				alert("error"); 
				console.log(data);
				console.log(rssfeed);
				//console.log("http://www.reddit.com/"+rssfeed+".json?jsonp="+from);
			}
		);
		*/
		
		$.jGFeed(rssfeed,
			function(feeds){
				// Check for errors
				if(!feeds){
				// there was an error
					return false;
				}
					
				// do whatever you want with feeds here
				for(var i=0; i<feeds.entries.length; i++){
					var el = feeds.entries[i];
					// Entry title
					
					var l = {
							title:el.title,
							author:el.author,
							description:el.description,
							url:el.link
							
						};
						
					kyrpa.data[kyrpa.data.length]=l;
				}
			},100 
		);

		callback();
			
		//this.data[this.data.length]=newData;
		
		
	};
	this.listFeeds = function(){
		var ret = {};
		for(var i in FEEDS){
			ret[i] = "#/rss/"+i;
		}
		return ret;
		
	}
	
	this.reset = function(){
		this.cur=-1;
		this.load(this.rssfeed,function(){window.main.next();});
	}
	this.next = function(){
		this.cur++;
		if(this.cur>=this.data.length-1){
			this.load(this.rssfeed,this.from);
		}
		//console.log(this.data);
		//console.log(this.data[this.cur]);
		var ret= [this.data[this.cur-1], this.data[this.cur], this.data[this.cur+1]];
		return ret;
		
	}
	this.prev = function(){
		this.cur--;
		if(this.cur<0)
			this.cur=0;
		if(this.cur>=this.data.length-1){
			this.load(this.rssfeed,this.from);
		}
		//console.log(this.data);
		//console.log(this.data[this.cur]);
		var ret= [this.data[this.cur-1], this.data[this.cur], this.data[this.cur+1]];
		return ret;
		
	}
	
	
	this.load(rssfeed);
	
	
}