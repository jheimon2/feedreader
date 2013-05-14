function RedditLoader(subreddit, loadCallback){
	window.Reddit = this;
	
	this.subreddit=subreddit;
	this.data = [];
	this.cur=-1;
	var pilu = this;
	
	this.aliases = {};
	
	this.aliases['420']='trees+treecomics+woahdude+stonedphilosphy+see';
	this.aliases['psy']='psychology+cogsci+neuro+nootropics+neurophilosphy+mathpsych+academicpsychology+musiccognition+psychscience+psychopathology+'
			  'cognitivelinguistics';
	this.aliases['humsciences']='linguistics+anthropology';
	this.aliases['physics']='physics+space+quantum+nanotech+astrobiology+strings';
	this.aliases['economics']='economics+behavioraleconomics';
	this.aliases['news']='worldnews';
	this.aliases['philosophy']='philosophy';
	this.aliases['politics']='politics+worldpolitics';
	this.aliases['sciences']='science+askscience+'+this.aliases['physics']+'+'+this.aliases['psy']+'+'+this.aliases['humsciences'];

	this.aliases['highbrow']=this.aliases['sciences']+'+'+this.aliases['economics']+'+'+this.aliases['politics']+'+'+this.aliases['news']+'+'+this.aliases['philosophy'];
	this.aliases['linda']= 'twoxchromosomes+parenting+aww+funny+pics+askreddit+askscience+videos+comics+treecomics+entwives+food+foodporn+earthporn+roomporn'+
		'+occupationaltherapy+psychology+finland+news+worldnews+frugal+lifeprotips+cooking+todayilearned+firstworldproblems+tifu';

	
	
	console.log(this.aliases);
	if(this.aliases[this.subreddit]){
		this.subreddit=this.aliases[this.subreddit];
		this.noExcludeSR=true;
	}
	
	console.log(this.subreddit);
	
	this.excludeSR = [
		'adviceanimals', 'fffffffuuuuuuuuuuuu', 'music', 'gaming', 'gameofthrones', 'pokemon', 'iama', 'leagueoflegends', 
		'doctorwho', 'starcraft', 'minecraft', 'gonewild', 'aww', 'dota2', 'warcraft', 'skyrim', 'circlejerk', 'movies', 
		'gifs', 'reactiongifs', 'thelastairbender', 'magictcg', 'ladyboners', 'masseffect', 'community', 'mylittlepony', 
		'emmawatson', 'ladybonersgw', 'breakingbad', 'guildwars2', 'tf2', 'nfl', 'arresteddevelopment', 'battlestations', 
		'lolcats', 'nfl', 'archerfx', 'keto', 'loseit', 'realgirls', 'batman', 'firefly', 'tattoos', 'cosplay', 'australia', 
		'gaymers', 'lgbt', 'battlefield3', 'harrypotter', 'games', 'gentlemanboners', 'rpg', 'topgear', 'startrek', 'wallpapers', 
		'anime', 'food', 'foodporn', 'wow', 'ctb', 'cfb', 'dayz', 'nofap', 'hardbodies', 'boobies', 'ass', 'nsfw', 'gaybros', 'dolan', 
		'spideymeme', 'milf', 'starwars', 'startrek', 'girlsinyogapants', 'baseball', 'soccer', 'hockey', 'baking', 'frugal', 'halo', 
		'naruto', 'apple', 'realgirls', 'cats', 'corgi', 'fancyfollicles', 'hiphopheads', 'startrek', 'ireland', 'canada', 'sweden', 
		'denmark', 'todayilearned', 'nba', 'sfgiants', 'zelda', 'cumsluts', 'thewalkingdead', 'nsfw_gif', 'halflife', 'hipstergurlz', 
		'mycherrycrush', 'realasians', 'amateur', 'globaloffensive', 'portal', 'futurama', 'simpsons', 'southpark', 'malefashionadvice', 
		'ginger', 'startrek', 'roosterteeth', 'mildlyinteresting', 'planetside', 'photoshopbattles', 'makeupaddiction', 'roomporn', 
		'mapporn', 'demotivational', 'cars', 'motorcycles', 'bicycling', 'zombies', 'girlgamers', 'shittyaskscience', 'pandr', 'borderlands', 
		'borderlands2', 'oldschoolcool', 'dexter', 'firstworldanarchists', 'sherlock', 'nigelthornberry', 'adventuretime', 'nosleep', 
		'london', 'campingandhiking', 'diablo', 'firstworldproblems', 'redditlaqueristas', 'onoff', 'somethingimade', 'iphone', 
		'fallout', 'machineporn', 'designporn', 'fitness', 'photography', 'mensrights', 'geek', 'spaceporn', 'scotch', 'cinemagraphs', 
		'wtsstadamit', 'dexter', 'guns', 'hifw', 'bacon', 'familyguy', 'portland', 'books', 'himym', 'eagles', 'cyberpunk', 
		'nyc', 'imaginarylandscapes', 'curvy', 'voluptuous', 'metal', 'diy', 'snsd', 'seinfeld', 'creepshots', 'prettygirls', 'philadelphia', 
		'mythbusters', 'nextdoorasians', 'therealzaxhanner', 'thick', 'supernatural', 'teenagers', 'running', 'pareidolia', 'cardinals', 
		'mma', 'boltedontits', 'gamegrumps', 'burstingout', 'legalteens', 'dundermifflin', 'vancouver', 'seattle', 'catpictures', 
		'alisonbrie', 'iasip', 'imaginarymonsters', 'fantheories', 'carporn', 'dogs', 'onetruegod', 'thesims', 'bayarea', 
		'futureporn', 'ucla', 	'eve', 	'birdswitharms', 	'formula', 'formula1', 'fantasyfootball', 'sandy', 'nsfw_gif', 
		'gonewildcurvy', 'asstastic', 'modern family', 'autos', '3ds', 'wiiu', 'civcraft', 'budgetfood', 'xbox360', 'randomsexiness', 
		'o_faces', 'nude', 'beagle', 'hotchickswithtattoos', 'atlanta', 'asianhotties', 'specart', 'tf2trade', 'minecraftsuggestions', 
		'collegebasketball', 'awwnime', 'liverpoolfc', 'gore', 'steampunk', 'rhodeisland', 'reddevils', 'nsfwhardcore', 'circlebroke', 
		'braveryjerk','sonsofanarchy', 'emmastone', 'nsfw_wallpapers', 'nsfw_gifs', 'emosluts', 'longboarding', 'sloths', 'blackops2', 
		'kerbalspaceprogram', 'lego', 'alienblue', 'drums', 'babybumps', 'stacked', 'doctorwhumour', 'tightshorts', 'christiangirls', 
		'asoiaf', 'movieposterporn', 'michigan', 'gamedeals', 'tattoo', 'datgap', 'emiliaclarke', 'subaru', 'kansascity', 'knives', 
		'hotties', 'bikinis', 'crotchet', 'tomhiddleston', 	'bigbangtheory', 'dogpictures', 'mindcrack', 'justrolledintotheshop', 'lotr', 
		'celebs', 'youtubehaiku', 'alternativeart', 'mls', 'cooking', 'modern_family', 'oliviawilde', 'totalwar', 'gifsound', 
		'climbing', 'grandtheftautov', 'pugs', 'fiftworldpics', 'wallpaper', 'lookatmydog', 'gonewildplus', 'cosplaygirls', 
		'marvel', 'davidtennant', 'hugeboobs', 'dirtysmall', 'buildapc', 'bass', 'drawing', 'redheads', 'volleyballgirls', 
		'losangeles', 'ainbow', 'ps3', 'theleaguefx', 'comicbooks', 'tall', 'deadpool', 'chicago', 'diablo3', 'boston', 
		'treesgonewild', 'imaginarytechnology', 'gaybears', 'ipad', 'calvinandhobbes', 'warhammer', 'eatsandwiches', 
		'dachshund', 'volkswagen', 'suicidegirls', 'homebrewing', 'progresspics', 'gamernews', 'nostalgia', 'gif', 
		'scifi', 'britishproblems', 'metalmemes', 'fantasy', 'tardcat', 'atheism', 'shorthairedhotties', 'simcity', 
		'blowjobs', 'bustypetite', 'cringepics', 'facepalm', 'wheredidthesodago', 'twoxchromosomes', 'thesimpsons', 
		'fiftyfifty', 'trollxchromosomes', 'netflixbestof', 'squaredcircle', 'thanksobama', 'beards', 'jenniferlawrence', 
		'fieldofkarmicglory', 'bioshock', 'pictureswithpatrick', 'bodybuilding', 'periwinkle', 'orangered', 'darksouls',
		'dwarffortress','sanjosesharks','toronto','ar-15','ladybonersgonecuddly','ladyladyboners','tittydrop','hentai',
		'prettygirlsuglyfaces', 'gaybrosgonewild','runescape','dnd','netherlands','hungergames','tinytits','grool',
		'dota2trade','cubeworld', 'gaybrosgonemild','swtor','melbourne','caps','upskirt','porn','gaymersgonewild','buffy',
		'morrowind','juicyasians','workaholics','daftpunk','bdsm'

	];
	this.excludeDomain = [
		'quickmeme', 'qkme.me', 'flickr'
	];
	this.excludeTitle = [
		'pokemon', 'look who i', 'look at what', 'look what', 'my girlfriend', 'highschool', 
		'dae ', 'how i felt ', 'cake day', 'harry potter', ' dog', ' cat', ' dogs', ' cats', 
		'karma', 'googled ', ' school\'s', 'whatcha', 'r/', 'nicki minaj', 'bieber', 'rihanna', 
		'snooki', 'jersey shore', 'graffiti', 'hifw', 'how i feel when', 'nsfl', ' prom ', 
		'costume', 'cosplay', 'halloween', 'photogenic', 'i see your', '[fixed]', 'emma watson', 
		'nintendo', 'spider', 'nope', ' gore', 'checkmate', 'yearbook', 'my favorite', 'my mom', 
		'my dad', 'my girlfriend', 'my boyfriend', 'my brother', 'my sister', 'myself', 'my grandfather', 
		'my grandmother', 'downvote', 'upvote', 'spongebob', 'alison brie', 'transformation', 'face swap', 
		'middle earth', 'gorillaz', 'periwinkle', 'orangered'
	];
	
	this.acceptLink = function(l){
		if(!this.noExcludeSR)
			for(var i in this.excludeSR){
				if(l.subreddit.toLowerCase()==this.excludeSR[i])
					return false;
			}
		for(var i in this.data){
			if(l.url.toLowerCase()==this.data[i].url.toLowerCase())
				return false;
		}
		for(var i in this.excludeDomain){
			if(l.url.toLowerCase().indexOf(this.excludeDomain[i])>=0)
				return false;
		}
		for(var i in this.excludeTitle){
			if(l.title.toLowerCase().indexOf(this.excludeTitle[i])>=0)
				return false;
		}
		
		return true;
	}
	
	this.load = function(subreddit,from, callback){
		var newData = {
			title:"testicle"+Math.random(),
			url:"http://example.org"
		
		};
		
		if(!subreddit)
			subreddit="r/all/";
			
		else if(subreddit==("FRONTPAGE"))
			subreddit="";
		else
			subreddit="r/"+subreddit+"/";
		
		
		if(!from)
			from=this.from;
		
		if(!from)
			from="";
		else
			from ="&after="+from;
		var kyrpa=pilu;
		var url = "http://www.reddit.com/"+subreddit+".json?jsonp=?"+from;
		console.log(url);
		$.getJSON(
			url,
			function(data){
				$.each(
					data.data.children,
					function (i, post) {
						//console.log(post.data);
						//console.log(kyrpa.data);
						//console.log(kyrpa.data.length);
						if(kyrpa.acceptLink(post.data))
							kyrpa.data[kyrpa.data.length]=post.data;
						kyrpa.from=post.data.name;
					}
				)
			}
		).done(
			callback
		).fail(
			function(data){ 
				alert("error"); 
				//console.log(data);
				//console.log(this.data);
				console.log("http://www.reddit.com/"+subreddit+".json?jsonp="+from);
			}
		);
		
		
		
		//this.data[this.data.length]=newData;
		
		
	};
	this.next = function(){
		this.cur++;
		if(this.cur>=this.data.length-5){
			this.load(this.subreddit,this.from);
		}
		var ret= [this.data[this.cur-1], this.data[this.cur], this.data[this.cur+1]];
		return ret;
		
	}
	this.prev = function(){
		this.cur--;
		if(this.cur<0)
			this.cur=0;
	
		if(this.cur>=this.data.length-5){
			this.load(this.subreddit,this.from);
		}
		var ret= [this.data[this.cur-1], this.data[this.cur], this.data[this.cur+1]];
		return ret;
		
	}
	this.load(this.subreddit, null,loadCallback);
	
	this.createLogin = function(){
		var user = "kullinaama420";
		var pw ="kullinaama";
		
		this.login(user,pw);
	}
	
	this.listFeeds = function(){
		var ret = {};
		ret.frontpage="#/reddit/";
		ret.all="#/reddit/all";
		for(var i in this.aliases){
			ret[i] = "#/reddit/"+i;
		}
		return ret;
		
	}
	
	this.login = function(user,passwd){
		var success = this.loginSuccess;
		/*
		data = {
			passwd:pw,
			user:user,
			rem:false,
			url:"https://ssl.reddit.com/api/login/"+user,
			api_type:"json",
			method:"POST"
		};
		console.log("logging in: "+user);
		$.getJSON({
			type: "POST",
			url: "api/ajaxproxy",
			data: data,
			success: success,
			crossDomain:true,
			error: function(data){
				console.log(data);
				alert("error logging in:"+user);
			}
			
		});
		*/
		url = "api/ajaxproxy/?url=https://ssl.reddit.com/api/login/"+user+"&user="+user+"&passwd="+passwd+"&api_type=json&rem=false";
		$.getJSON(
			url,
			function(data){
				pilu.modhash = data.json.data.modhash;
				pilu.cookie = data.json.data.cookie;
				$.cookie("reddit_session",pilu.cookie, {domain:"reddit.com",path:"/"});
				pilu.loginSuccess(data);
			}
		).done(
			function(data) { 
			}
		).fail(
			function(data){ 
				alert("error"); 
				//console.log(data);
				//console.log(this.data);
				console.log(url);
				console.log(data);
			}
		);
		
	};
	this.reset = function(){
		this.from="";
		this.data=this.data.slice(0,this.cur+1);
		this.load(this.subreddit,this.from,function(){window.main.next();});
	}
	
	this.loginSuccess = function(data){
		//console.log(data);
		$("#redditlogin").hide();
	
		$("#upvote").show();
		$("#downvote").show();
		$(".votediv").show();
	}
	
		
	this.vote = function(dir){
		var l = this.data[this.cur];
		url = "api/ajaxproxy/?url=https://ssl.reddit.com/api/vote/?dir="+dir+"&id="+l.name+"&uh="+this.modhash;
		
		$.getJSON(
			url,
			function(data){
				console.log("voting: success");
				console.log(url);
				console.log(data);
				
			}
		).done(
			function(data) { 
			}
		).fail(
			function(data){ 
				alert("error"); 
				//console.log(data);
				//console.log(this.data);
				console.log(url);
				console.log(data);
			}
		);
	}
	
	
}