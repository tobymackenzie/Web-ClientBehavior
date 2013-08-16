/*
allow droppable element to be mutated dynamically allowing separate 'accept' selectors associated to be associated with their own sets of actions
-----dependencies
tmlib
jquery
jquery ui: droppable

-----parameters
-----instantiation
-----html
-----css
*/

/*-------
©HandlerDroppable
-------- */
__.classes.HandlerDroppable = function(args){
		this.element = args.element || null;
		this.arrOptionsEvent = args.arrOptionsEvent || [
			'activate'
			,'create'
			,'deactivate'
			,'drop'
			,'over'
			,'out'
		];
		this.addd(args);
	}
	__.classes.HandlerDroppable.prototype.addd = function(args){
		var lcl = {};
		if(!args.element)
			args.element = this.element;
		//--if already a droppable, add applicable old settings to new
		if(args.element.hasClass('ui-droppable')){
			//-#must punch first to keep accept intact
			for(var i=0; i<this.arrOptionsEvent.length; ++i){
				this.punchOption(this.arrOptionsEvent[i], args);
			}
			this.concatenateOption('accept', args);
			this.concatenateOption('activeClass', args, ' ');
			this.concatenateOption('hoverClass', args, ' ');
		}
		args.element.droppable(args);
	}
	__.classes.HandlerDroppable.prototype.concatenateOption = function(argName, argsObject, argJoinWith){
		if(typeof argJoinWith == 'undefined') var argJoinWith = ',';
		var lclOption = argsObject.element.droppable('option', argName);
		if(lclOption){
			if(argsObject[argName])
				argsObject[argName] += argJoinWith;
			argsObject[argName] += lclOption;
		}
	}
	__.classes.HandlerDroppable.prototype.punchOption = function(argName, argsObject){
		var lclOldOption = argsObject.element.droppable('option', argName);
		if(lclOldOption){
			if(argsObject[argName]){
				var lclNewOption = argsObject[argName];
				var lclSelector = argsObject['accept'];
				argsObject[argName] = function(argEvent, argUI){
					if(argUI.draggable.is(lclSelector))
						return lclNewOption.apply(this, arguments);
					else
						return lclOldOption.apply(this, arguments);
				}
			}else{
				argsObject[argName] = lclOldOption;
			}
		}
	}

