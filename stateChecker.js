/*
interface for monitoring the state of a collection of entities
-----dependencies
tmlib
(jQuery - if using defaultOninit)

-----parameters

-----instantiation
$(document).ready(function(){
    var collection = new __.classes.collection();
    var inputs = $("input, select, textarea");
    inputs.each(function(){
        collection.add($(this));
    });
    __.stateChecker = new __.classes.stateChecker({
        collection: collection
        ,callbackCheckState: function(args){
            var lclReturn = "";
            this.collection.each(function(args){
                lclReturn += this.val();
            });
            return lclReturn
        }
    });
    __.stateChecker.bind("change", function(argEvent, argData){
__.message(this);
__.message(argData);
        __.message("change: "+argData.new);
    });
});

-----html
-----css
*/

/*-------
©stateChecker
-------- */
__.classes.stateChecker = function(args){
        if(typeof args == "undefined") var args = {};
        var fncThis = this;
		//--required attributes
//->return

		//--optional attributes
		this.boot = args.boot || {};
		this.callbackCheckState = args.callbackCheckState || function(){ return false; }
        this.collection = args.collection || new __.classes.collection();
		this.oninit = args.oninit || this.defaultOninit;

		//--derived attributes
		this.jq = jQuery({});
		this.state = null;
        this.checkState();

		//--do something		
        if(this.oninit)
            this.oninit.call(this);
	}
	__.classes.stateChecker.prototype.defaultOninit = function(){
	   var lcThis = this;
	   //--by default, check state on change event of each item
	   //-#requires every collection item to have a bind method
	   this.collection.each(function(args){
	       this.bind("change", function(){
	           lcThis.checkState();
	       });
	   });
	}
	__.classes.stateChecker.prototype.checkState = function(){
	   var stateNew = this.callbackCheckState.call(this);
	   if(this.state != stateNew){
	       var stateOld = this.state;
	       this.state = stateNew;
	       this.jq.trigger("change", {old: this.state, new: stateNew});
	   }
	}
	__.classes.stateChecker.prototype.bind = function(){
		this.jq.bind.apply(this.jq, arguments);
	}

