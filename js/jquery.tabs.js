(function (jQuery){
    include("css/tabs.css");
	
    jQuery.fn.createTabHolder = function (){
		this.html("");
		var tbar = $("<div/>",{
			class:"tabbar padfix noselect"
		});
		
		tbar.appendTo(this);
		
		var tholder = $("<div/>",{
			class:"tabcontainer"
		});
		
		tholder.appendTo(this);
		
			
    };
	
	jQuery.fn.addTab = function(title,data,index, constructor,model,obj){
		var self=this;
		var ts = $("<span/>",{
			class:"tabselector",
			html:title,
			
		});
		
		var tab = $("<div/>",{
			class:"tabselector_tab"
			
		});
		if(data.jQuery)
			tab.append(data);
		else
			tab.html(data);
		tab.appendTo(this.find(".tabcontainer"));
		if(constructor)
			ts.one("click",{element:tab,model:model,obj:obj},constructor);
		
		ts.on("click",function(){
			self.find(".selectedtab").removeClass("selectedtab");
			tab.addClass("selectedtab");
			self.find(".activetabselector").removeClass("activetabselector");
			ts.addClass("activetabselector");
		});
		if(this.find(".activetabselector").length==0)
			ts.trigger("click");
		
		ts.appendTo(this.find(".tabbar"));
	}
	
    
    return jQuery;
})(jQuery);
