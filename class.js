/*
class library for creating classes
@TODO a lot
-----dependencies
tmlib: each, merge, isarray
*/

/*-------
©Class
-------- */
//-- define a class
__.class.define = function(args, argName){
	//-- class/constructor
	var lclClass = function(){
		if(arguments.length == 0 || arguments[0] !== false){
			var lclThis = this;
			var lclArguments = (arguments.length > 0)? arguments: [{}];
			var lclIsValid = true;
			//-- set attributes to args values or defaults
			this._instance = {data: {}};
			__.lib.each(this.__.def.attributes, function(argValue, argKey){
				var lopOptions = __.lib.merge(
					this.defaultAttributeOptions
					,(typeof argValue == "object" && argValue.hasOwnProperty("default"))? argValue: {default: argValue}
				);
				//- if passed in argument map, use that value
				if(typeof lclArguments[0][argKey] != "undefined"){
					var lclValue = lclArguments[0][argKey];
				//- if function, run function for default value
				}else if(__.lib.isFunction(lopOptions.default)){
					var lclValue = lopOptions.default.call(lclThis, lclArguments);
				//- default set to value
				}else{
					var lclValue = lopOptions.default;
				}
				//-- setter for each attribute
				lclThis[argKey].call(lclThis, lclValue);
				//-- check if set if required
				if(lopOptions.required && lclThis[argKey].call(lclThis) === null){
					lclIsValid = false;
					return false;
				}
			});
			//-- set instance to null and return if object invalid
			//-!@TODO need a better way to handle this
			if(!lclIsValid){
				this._instance = null;
				return false;
			}
			//-- apply init if defined
			if(typeof this.__.def.init != "undefined"){
				this.__.def.init.apply(this, arguments);
			}
		}
	};
	//-- set parent if one exists
	switch(typeof args.parent){
		case "string":
			var lclParent = __.objects[args.parent];
		break;
		case "object":
		case "function":
			var lclParent = args.parent;
		break;
		default:
			var lclParent = null;
		break;
	}
	//-- extend parent prototype
	if(lclParent){
		lclClass.prototype = new lclParent(false);
	}
	//-- create storage of class related data in prototype
	lclClass.prototype.__ = {};
	//-- store def in class prototype
	lclClass.prototype.__.def = args;
	//- extend parent def, important parts only
	if(lclParent){
		var lclDef = lclClass.prototype.__.def;
		if(typeof lclParent.prototype.__.def.attributes != "undefined" || typeof lclDef.attributes != "undefined"){
			lclDef.attributes = __.lib.merge(
				(typeof lclParent.prototype.__.def.attributes != "undefined")? lclParent.prototype.__.def.attributes: {}
				,(typeof lclDef.attributes != "undefined")? lclDef.attributes: {}
			);
		}
		if(typeof lclParent.prototype.__.def.methods != "undefined" || typeof lclDef.methods != "undefined"){
			lclDef.methods = __.lib.merge(
				(typeof lclParent.prototype.__.def.methods != "undefined")? lclParent.prototype.__.def.methods: {}
				,(typeof lclDef.methods != "undefined")? lclDef.methods: {}
			);
		}
	}
	//-- set parent if one exists
	if(lclParent){
		lclClass.prototype.__.parent = lclParent.prototype;
	}
	//-- add getters and setters
	__.lib.each(lclClass.prototype.__.def.attributes, function(argValue, argKey){
		lclClass.prototype[argKey] = __.class.newAttribute(argKey, argValue);
	});
	//-- add methods
	__.lib.each(lclClass.prototype.__.def.methods, function(argValue, argKey){
		lclClass.prototype[argKey] = __.class.newMethod(argKey, argValue);
	});
	//-- place in objects bucket if name set
	if(typeof argName != "undefined")
		__.objects[className] = lclClass;
	return lclClass;
}
__.class.defaultAttributeOptions = {
	"default": null
	,"required": false
}
//-- create a class attribute
__.class.newAttribute = function(argName, args){
	return function(){
		if(arguments.length > 0){
			//-- set
			this._instance.data[argName] = arguments[0];
			//-- return this for chaining
			return this;
		}else{
			//-- get
			return this._instance.data[argName];
		}
	}
}
//-- create a class method
__.class.newMethod = function(argName, args){
	return args;
}

