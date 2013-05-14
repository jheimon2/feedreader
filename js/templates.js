(function(env){
	
	env.getTemplate = function (html, css, js){
		if(!env.templates)
			env.templates = {};
		if(!env.templates[html])
			env.templates[html] = loadFile(html);
		if(css){
			
			
			
			includeSync(css);
			
			
		}
		if(js)
			includeSync(js);
		
		return _.template(env.templates[html]);	
	
	}
	
	env.includeSync=function(f){
		
		var d  =$('script[src~="'+f+'"]');// //$('script [src~="'+f+'"]');
		
		if(d.length==0)
			d=$('link[href~="'+f+'"]');
		
		if(d.length){
			
			return;
		}
		if(f.lastIndexOf(".js")==f.length-3){
			var s = document.createElement( 'script' );
			s.type = 'text/javascript';
			s.src = f;
			
			
			document.getElementsByTagName("head")[0].appendChild(s)
			
			
		}
		else if(f.lastIndexOf(".css")==f.length-4){
			var s= $('<link/>',{
				href:f,
				type:"text/css",
				rel:"stylesheet"
				
			});
			var s = document.createElement( 'link' );
			s.type = 'text/css';
			s.href = f;
			s.rel="stylesheet";
			document.getElementsByTagName("head")[0].appendChild(s)
			
			
		}
		else{
			console.log("MITÄ VITTUA?");
		}

		
		
		
		
		
	}

})(this);