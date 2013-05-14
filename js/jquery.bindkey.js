(function (jQuery){
    
    var keyCodes={
	'a' : 65,
    'b' : 66,
    'c' : 67,
    'd' : 68,
    'e' : 69,
    'f' : 70,
    'g' : 71,
    'h' : 72,
    'i' : 73,
    'j' : 74,
    'k' : 75,
    'l' : 76,
    'm' : 77,
    'n' : 78,
    'o' : 79,
    'p' : 80,
    'q' : 81,
    'r' : 82,
    's' : 83,
    't' : 84,
    'u' : 85,
    'v' : 86,
    'w' : 87,
    'x' : 88,
    'y' : 89,
    'z' : 90,
    /* start number keys */
    '0' : 48,
    '1' : 49,
    '2' : 50,
    '3' : 51,
    '4' : 52,
    '5' : 53,
    '6' : 54,
    '7' : 55,
    '8' : 56,
    '9' : 57,
    /* start the f keys */
    'f1' : 112,
    'f2' : 113,
    'f3' : 114,
    'f4' : 115,
    'f5' : 116,
    'f6' : 117,
    'f7' : 118,
    'f8' : 119,
    'f9' : 120,
    'f10': 121,
    'f11': 122,
    'f12': 123,
    /* start the modifier keys */
    'shift' : 16,
    'ctrl' : 17,
    'control' : 17,
    'alt' : 18,
    'option' : 18, //Mac OS key
    'opt' : 18, //Mac OS key
    'cmd' : 224, //Mac OS key
    'command' : 224, //Mac OS key
    'fn' : 255, //tested on Lenovo ThinkPad
    'function' : 255, //tested on Lenovo ThinkPad
    /* Misc. Keys */
    'backspace' : 8,
    'osxdelete' : 8, //Mac OS version of backspace
    'enter' : 13,
    'return' : 13, //Mac OS version of "enter"
    'space':32,
    'spacebar':32,
    'esc':27,
    'escape':27,
    'tab':9,
    'capslock':20,
    'capslk':20,
    'super':91,
    'windows':91,
    'insert':45,
    'delete':46, //NOT THE OS X DELETE KEY!
    'home':36,
    'end':35,
    'pgup':33,
    'pageup':33,
    'pgdn':34,
    'pagedown':34,
    /* Arrow keys */
    'left' : 37,
    'up'   : 38,
    'right': 39,
    'down' : 40,
    /* Special char keys */
    '!':49,
    '@':50,
    '#':51,
    '$':52,
    '%':53,
    '^':54,
    '&':55,
    '*':56,
    '(':57,
    ')':48,
    '`':96,
    '~':96,
    '-':45,
    '_':45,
    '=':187,
    '+':187,
    '[':219,
    '{':219,
    ']':221,
    '}':221,
    '\\':220, //it's actually a \ but there's two to escape the original
    '|':220,
    ';':59,
    ':':59,
    "'":222,
    '"':222,
    ',':188,
    '<':188,
    '.':190,
    '>':190,
    '/':191,
    '?':191
	};
        
    var components ={};
	var defaults={
		type:'keypress', 
		preventDefault:true,
		escapeInput:true
	};
        
    jQuery.fn.unbindkey = function (key){
		if(!key){
			var el = this;
			$.each(components, function(key,val){
				el.unbindkey(key);
			});
			return;
		}
		if(!components[this].key)
			return;
        
		this.unbind(components[this].key.type,components[this].handler);
		
		components[this].key==null;
    };
    
    jQuery.fn.bindkey = function(key, fn, options){
		
        if(!components[this])
			components[this]={};
		var c = components[this];
		
		c.key = $.extend({},defaults, options,{fn:fn,key:key});
		
		
		c.key.keycode=keyCodes[key]||key;
		var el =this;
		
		var huora = c.key;
		
		c.key.handler = function(evt){
			this.k=huora;
			this.el=el;
			
			if(!keyMatches(this.k, evt.keyCode||evt.which))
				return;
			if(this.k.escapeInput){
				
				
				if($(evt.target).is("input") || $(evt.target).is("textarea")|| $(evt.target).hasClass("escapeinput"))
					return;
			}	
			if(this.k.preventDefault)
				evt.preventDefault();
				
			
			this.k.fn();
			
			
		};
		
		
		this.bind(c.key.type,c.key.handler);
			
    };
	function keyMatches(keyobj,keycode){
		
		
		return (keyobj.keycode==keycode||(keyobj.keycode>=65 && keyobj.keycode<=90 && (keyobj.keycode+32==keycode))
				);//|| (keyobj.keycode==27 && keycode==0));
		
		
	}
    
    return jQuery;
})(jQuery);
