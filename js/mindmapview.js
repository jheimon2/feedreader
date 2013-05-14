function MindmapView(el,root, items){
	
	this.rootel =el; 
	this.el = $('<div class="wrapper"/>');
	this.el.appendTo(this.rootel);
	this.el.hide();
	this.root=root;
	this.items=items;
	
	this.initialize = function(){
		
		this.el.append(root);
		root.css("position","absolute");
		root.css("display","inline-block");
		var self=this;
		_(items).each(function(val){
			self.el.append(val);
			val.css("position","absolute");
			val.css("display","inline-block");
		});
		this.position();
	}
	this.position=function(){
		var w = this.el.width();
		var h = this.el.height();
		
		root.css("top",h/2 - root.height()/2+"px");
		root.css("left",w/2 - root.width()/2+"px");
		
		//sit muiden sijoittelu, ekaks ympyrän kaarelle, sit evoluutio jos tila loppuu kesken
		var self=this;
		_(items).each(function(val,ind){
			val.css("top",(Math.cos(-2*Math.PI*ind/self.items.length)*0.7+1)*h/2 - val.height()/2+"px");
			val.css("left",(Math.sin(-2*Math.PI*ind/self.items.length)*0.7+1)*w/2 - val.width()/2+"px");
			
		});
		
		
		this.el.show();
	};
	
	this.initialize();
	
	
}