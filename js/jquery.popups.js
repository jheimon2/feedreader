(function (jQuery){
    
    var defaults ={
		title:'message',
		buttons:{
			'ok':function(){
				console.log("ok");
			},
			'cancel':function(){
				console.log("cancel");
			}
		},
		cl:'popup'
		
	};
	
	jQuery.fn.createError = function (message, cl){
		if(!cl)
			cl="popup errorpopup";
		this.createPopup(message,'error',null,{'ok': function(){}},cl,'erroricon');
	}
	
    jQuery.fn.createPopup = function (message, title,callback,buttons, cl, icon, fields){
		
		if(!title)
			title=defaults.title;
		if(!buttons)
			buttons=defaults.buttons;
		if(!cl)
			cl=defaults.cl;		
		
		//eka popupin runko
		var popup = $('<div/>',{
			class:cl,
			style:"z-index:666;min-height:100px;min-width:420px;border-radius:10px;border: 2px solid black;	background-color:#36C;\
				-moz-box-shadow: 10px 10px 5px rgba(0,0,0,0.5);-webkit-box-shadow: 10px 10px 5px rgba(0,0,0,0.5);box-shadow: 10px 10px 5px rgba(0,0,0,0.5);\
				position:fixed;color:#FD6;"
				
		});
		//sit sis�lmykset, title ensin
		var titlebar = $('<div/>',{
			class:'popuptitlebar',
			style:'border-bottom:2px solid white; text-align:center;width:100%;position:relative;'
			
		});
		
		var titleText = $('<span/>',{
			html:title
		});
		
		
		var closeButton = $('<div/>',{
			class:'popupclosebutton',
			style:"position:absolute;width:16px;height:16px;top:2px;right:2px;background-size:100%;cursor:pointer;\
				  background-image:url(img/close.png);"
			
			
		});
		closeButton.one('click',{callback:callback},function(evt){
			popup.fadeOut('fast',function(){
				if(evt.data.callback)
					evt.data.callback("close");
				popup.remove();
			});
			
			
		});
		
		titlebar.append(titleText);
		titlebar.append(closeButton);
		
		popup.append(titlebar);
		
		var data = $('<div/>',{
			class:"popupmessage padfix",
			style:"width:100%;height:100%;position:relative;padding:20px;",
			html:message
		});
		if(fields){
			for(var i in fields){
				data.append($("<div/>",{
					html:fields[i].name+' <input name="'+fields[i].name+'">'
				}));
			}
		}
		
		
		
		var btns = $('<div/>',{
			class:"popupbuttons",
			style:"text-align:center;"
			
		});

		var getFields = function(self,f){
			var ret ={};
			for(var i in f){
				var d =  self.find('[name="'+f[i].name+'"]');

				if(d.length>0)
					ret[f[i].name] =d.val();
 			}
			return ret;
		};
		
		for(var i in buttons){
		
			var btn = $('<button/>',{
				class:"popupbutton",
				style:"background-color:#4D9",
				html:i
				
			});
			btns.append(btn);
			
			if(!callback){
				btn.one('click',{curbtn:buttons[i]}, function(evt){
					evt.data.curbtn();
					popup.fadeOut('fast',function(){
						popup.remove();
					});
				});
			}
			else{
				btn.one('click',{curbtn:i,self:popup,callback:callback,fields:fields}, function(evt){
					evt.data.callback(evt.data.curbtn,getFields(evt.data.self,evt.data.fields));
					popup.fadeOut('fast',function(){
						popup.remove();
					});
				});
			}
			
		}
		
		
		
		
		data.append(btns);
		popup.append(data);
		//viel� asettelu p��komponentin keskelle
		popup.hide();
		$(this).append(popup);
		var cx  = $(window).width()/2;
		var cy  = $(window).height()/2;
		
		var x = cx- popup.width()/2;
		var y = cy- popup.height()/2;
		
		if(x<0){
			x=0;
			popup.width(cx*2);
		}
		if(y<0){
			y=0;
			popup.height(cy*2);
		}
		
		
		//console.log(cx +" "+cy+ " "+x +" "+y);
		popup.css("overflow","auto");
		popup.css("top",y);
		popup.css("left",x);
		
		
		
		
		popup.show('fast');
		
		
		return popup;
		
				
		
		
		
		
			
    };
	function keyMatches(keyobj,keycode){
		
		
		return (keyobj.keycode==keycode||(keyobj.keycode>=65 && keyobj.keycode<=90 && (keyobj.keycode+32==keycode))
				);//|| (keyobj.keycode==27 && keycode==0));
		
		
	}
    
    return jQuery;
})(jQuery);
