(function(__deps, undefined){
	/*=====
	==dependencies
	Allow injection of dependencies so they can be theoretically modified for testing.
	Local names allow them to be minified.
	=====*/
	var $, globals, __head, __jQuery, window;
	if(!__deps){
		__deps = {};
	}

	window = globals = __deps.globals || this;

	__head = __deps.head || window.head;
	__jQuery = $ = __deps.jQuery || window.jQuery;

	/*=====
	==tmlib
	=====*/

	var __;
	if(typeof window.__ === 'undefined'){
		window.__ = {ua: {}, cfg: {}, 'class': {}, classes: {}, core: {}, 'data': {}, lib: {}, mixins: {}, objects: {}};
	}
	__ = window.__;

	//==core
	__.core.Functions={configuration:{duckPunchKey:"__original"},contains:(/xyz/.test(function(){xyz}))?function(a,b){if(!(b instanceof RegExp)){b=new RegExp(b,"i")}return b.test(a)}:function(){return true},duckPunch:function(d,a,c){var c=c||{};c.autoApply=c.autoApply||false;var e=(c.autoApply)?function(f){return d.apply(this,f)}:d;switch(c.type||null){case"this":var b=c.key||this.configuration.duckPunchKey;return function(){var g=this[b]||undefined;this[b]=e;var f=a.apply(this,arguments);if(g===undefined){delete this[b]}else{this[b]=g}return f};break;default:return function(){Array.prototype.unshift.call(arguments,e);return a.apply(this,arguments)};break}}};__.core.Objects={addProperties:function(c,a){for(var b in a){if(a.hasOwnProperty(b)){this.addProperty(c,b,a[b])}}},addProperty:function(b,c,a){if(typeof a=="object"){}else{b[c]=a}},getLength:function(d,a){if(a===undefined){a=false}var c=0;for(var b in d){if(d.hasOwnProperty(b)||a){++c}}return c},hasKey:function(b,a){var c=a;if(!__.lib.isArray(b)){b=[b]}__.lib.each(b,function(d,e){if(c.hasOwnProperty(d)){return true}});return false},hasKeys:function(b,a){var d=a;var c=true;if(!__.lib.isArray(b)){b=[b]}__.lib.each(b,function(e,f){if(!(c&&d.hasOwnProperty(e))){c=false}});return c},merge:function(){var c={};for(var a=0;a<arguments.length;++a){for(var b in arguments[a]){if(arguments[a].hasOwnProperty(b)){c[b]=arguments[a][b]}}}return c},mergeInto:function(){var c=arguments[0];for(var a=1;a<arguments.length;++a){for(var b in arguments[a]){if(arguments[a].hasOwnProperty(b)){c[b]=arguments[a][b]}}}return c}};__.core.Classes={configuration:{autoApplyForFunctionInheritance:true,overriddenParentKey:"__base"},creationPlugins:{addParentAccessToMethods:function(g){var b=g["class"];var a=g.parent;var d=g.prototype;var h=g.options;var f=(typeof h.properties=="object")?__.core.Objects.merge(h.properties):{};if(typeof h.init!="undefined"){f.init=h.init}for(var c in f){if(typeof d[c]=="function"&&typeof a.prototype[c]=="function"&&__.core.Functions.contains(d[c],"\\b"+this.configuration.overriddenParentKey+"(\\(|\\.apply|\\.call)\\b")){var e=d[c]=__.core.Functions.duckPunch(a.prototype[c],d[c],{autoApply:this.configuration.autoApplyForFunctionInheritance,key:this.configuration.overriddenParentKey,name:c,type:"this"})}}}},create:function(e){if(typeof e=="undefined"){var e={}}var b;switch(typeof e.parent){case"string":b=window[e.parent];break;case"function":case"object":b=e.parent;break;default:if(typeof __.core.Classes.BaseClass!="undefined"){b=__.core.Classes.BaseClass}else{b=window.Object}break}var a=this.createConstructor(b);var d=this.createPrototype(b);__.core.Objects.mergeInto(a,b);if(typeof e.statics=="object"){a=__.core.Objects.mergeInto(a,e.statics)}this.mixIn(e,d,a);if(typeof e.init=="function"){__.core.Objects.addProperty(d,"init",e.init)}for(var c in this.creationPlugins){if(this.creationPlugins.hasOwnProperty(c)){this.creationPlugins[c].call(this,{"class":a,parent:b,prototype:d,options:e})}}a.prototype=d;a.prototype.constructor=a;if(e.name){window[e.name]=a}return a},createConstructor:function(b){return function a(){if(!__.core.Classes.__isCreatingPrototype){switch(typeof this.init){case"function":this.init.apply(this,arguments);break;case"undefined":b.apply(this,arguments);break}}}},createPrototype:function(a){this.__isCreatingPrototype=true;var b=new a();this.__isCreatingPrototype=false;return b},mixIn:function(d,e,f){if(typeof d=="object"){if(d instanceof Array){for(var c=0,a=d.length;c<a;++c){this.mixIn(d[c],e,f)}}else{if(typeof d.preMixins=="object"){this.mixIn(d.preMixins,e,f)}if(typeof d.mixins=="object"){this.mixIn(d.mixins,e,f)}if(typeof d.statics=="object"&&typeof f=="function"){for(var b in d.statics){if(d.statics.hasOwnProperty(b)){f[b]=d.statics[b]}}}if(typeof d.properties=="object"){for(var b in d.properties){if(d.properties.hasOwnProperty(b)){e[b]=d.properties[b]}}}if(typeof d.postMixins=="object"){this.mixIn(d.postMixins,e,f)}}}},pluginize:function(d){var c=d.type||"method";var e=d.jQuery||window.jQuery;var a={mapToThis:"elements"};e.extend(a,d);var b=function(){var g=arguments;if(typeof b.instance=="undefined"||typeof g[0]=="undefined"){switch(typeof a.mapToThis){case"string":if(typeof g[0]!="object"){g[0]={}}g[0][a.mapToThis]=this;break;case"number":g[a.mapToThis]=this;break;default:throw new Error('Pluginize does not support a "mapToThis" type of '+typeof a.mapToThis)}if(typeof a.object=="object"){b.instance=a.object}else{b.instance=new a["class"](g[0],g[1],g[2],g[3],g[4],g[5],g[6],g[7],g[8],g[9])}}else{if(typeof g[0]=="string"){var f=Array.prototype.shift.call(g);if(typeof b.instance[f]=="function"){return b.instance[f].apply(b.instance,g)}else{return b.instance[f]}}else{throw new Error("Must pass name of function to call for plugin.")}}};switch(c){case"method":return b;break;case"jQuery":e.fn[a.name]=b;break;default:throw new Error("Pluginize doesn't support type "+c);break}}};__.core.Classes.BaseClass=__.core.Classes.create({init:function(b){var c=b||{};for(var a in c){if(c.hasOwnProperty(a)){this.__setInitial(a,c[a])}}},properties:{__setInitial:function(b,a){this[b]=a}}});


	/*===
	==lib
	===*/
	__.ready = function(_function){
		if(__jQuery){
			__jQuery(_function);
		}else if(__head){
			__head.ready(_function);
		}else if(__.lib.addListeners){
			__.lib.addListeners(window, 'load', _function, false);
		}else{
			_function.call(this);
		}
	};

	var clog = __.message = function(){
		if(window.console && window.console.log){
			if(window.console.log.apply){
				window.console.log.apply(window.console, arguments);
			}else{ //--ie 8+, doesn't support multi-argument console.log, so we will loop through the arguments and log each one
				window.console.log('-----message:');
				for(var key in arguments){
					window.console.log(arguments[key]);
				}
			}
		}//else alert(arg); //-# for ielte7, other old browsers
	};


	/*=====
	==mixins
	=====*/


	/*===
	==classes
	===*/


	/*=====
	==config
	=====*/


	/*=====
	==main onload
	=====*/

	__.ready(function(){

	});
})();
