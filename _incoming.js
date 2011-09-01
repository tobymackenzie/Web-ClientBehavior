
/*-------------
©objectMonitor
------------*/
__.classes.objectMonitor = function(args){
		//--optional arguments
		if(args.object)
			this.setObject(args.object);
		
		//--derived members
		this.rules = {};
	}
	__.classes.objectMonitor.prototype.setObject = function(argObject){
		this.object = args.object;
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
	__.classes.objectMonitor.prototype.applyRules = function(args){
		var localvars = {};
		localvars.object = args.object || this.object;
		localvars.rules = args.rules || this.rules;
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
	__.classes.objectMonitor.prototype.addRule = function(args){
		if(!__.lib.isArray(args))
			var rules = new Array(args);
		else
			var rules = args;
		for(var key in rules){
//->return missing required arguments
			if(rules.hasOwnProperty(key) && typeof rules[key].event != "undefined" || typeof rules[key].handler != "undefined"){
				rules[key].applied = false;
				this.rules.push(rules[key]);
				this.applyRules(rules[key]);
			}
		}
	}

