
/*-------------
©objectMonitor
------------*/
__.classes.objectMonitor = function(arguments){
		//--optional arguments
		if(arguments.object)
			this.setObject(arguments.object);
		
		//--derived members
		this.rules = {};
	}
	__.classes.objectMonitor.prototype.setObject = function(argObject){
		this.object = arguments.object;
//->return no object
		if(!this.object) return false;
		
		//--set old rules to unapplied
		for(var key in localvars.rules){
			if(localvars.rules.hasOwnProperty(key){
				localvars.rules[key].applied = false;
			}
		}
		
		//--apply rules
		this.applyRules();
	}
	__.classes.objectMonitor.prototype.applyRules = function(arguments){
		var localvars = {};
		localvars.object = arguments.object || this.object;
		localvars.rules = arguments.rules || this.rules;
		for(var key in localvars.rules){
			if(localvars.rules.hasOwnProperty(key){
				var lopRule = localvars.rules[key];
				if(lopRule.applied == false){
					localvars.object.bind(lopRule.event, lopRule.handler);
					localvars.rules[key].applied = true;
				}
			}
		}
	}
	__.classes.objectMonitor.prototype.addRule = function(arguments){
		if(!__.lib.isArray(arguments))
			var rules = new Array(arguments);
		else
			var rules = arguments;
		for(var key in rules){
//->return missing required arguments
			if(rules.hasOwnProperty(key) && typeof rules[key].event != "undefined" || typeof rules[key].handler != "undefined"){
				rules[key].applied = false;
				this.rules.push(rules[key]);
				this.applyRules(rules[key]);
			}
		}
	}

