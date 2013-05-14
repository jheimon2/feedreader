(function (jQuery){
	
    /**
	* 	lasketaan d:n maksikorkeus ja lasten kokonaispituus => itelle loput tästä
	*/
    jQuery.fn.fillVertical = function (d,margin){
		
		if(!d)
			d=this.parent();
		if(!margin)
			margin=0;
		var f = function(evt){
			var cont=evt.data.container;
			var el = evt.data.element;
			
			var lastH=jQuery.data(el,"lastH");
			
			var maxH = cont.height()-margin;
			
			if(maxH==lastH)
				return;
			else
				jQuery.data(el,"lastH",maxH);
			
			var totalH = 0;
			cont.children().each(function(ind,el){
				totalH+=$(el).outerHeight(true);
			});
			var dif = maxH-totalH;
			el.height(el.height()+dif);
			
		};
		
		d.resize({element:this,container:d},f);
		return this;
		
    };
	jQuery.fn.fillHorizontal = function (d,margin){
		
		if(!d)
			d=this.parent();
		if(!margin)
			margin=0;
		var f = function(evt){
			var cont=evt.data.container;
			var el = evt.data.element;
			
			var maxW = cont.width()-margin;
			var lastW=jQuery.data(el,"lastW");
			if(maxW==lastW)
				return;
			else
				jQuery.data(el,"lastW",maxW);
			var totalW = 0;
			cont.children().each(function(ind,el){
				totalW+=$(el).width();
			});
			var dif = maxW-totalW;
			el.width(el.width()+dif);
			
		};
				
		d.resize({element:this,container:d},f);
		return this;
		
    };
	
    return jQuery;
})(jQuery);
