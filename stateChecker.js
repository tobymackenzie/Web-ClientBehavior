/*
interface for monitoring the state of a collection of entities
-----dependencies
tmlib
(jQuery - if using defaultOninit)

-----parameters

-----instantiation
$(document).ready(function(){
    var collection = new __.classes.collection();
    var inputs = $('input, select, textarea');
    inputs.each(function(){
        collection.add($(this));
    });
    __.stateChecker = new __.classes.stateChecker({
        collection: collection
        ,callbackCheckState: function(args){
            var lclReturn = '';
            this.collection.each(function(args){
                lclReturn += this.val();
            });
            return lclReturn
        }
    });
    __.stateChecker.on('change', function(argEvent, argData){
__.message(this);
__.message(argData);
        __.message('change: '+argData.new);
    });

	//--complicated
        __.colInputsTax = new __.classes.collection();
        __.colInputsTax.add(__.elmFormCheckout.find('#fld\\[checkout\\]\\[address1\\]'), 'address1');
        __.colInputsTax.add(__.elmFormCheckout.find('#fld\\[checkout\\]\\[city\\]'), 'city');
        __.colInputsTax.add(__.elmFormCheckout.find('#fld\\[checkout\\]\\[state\\]'), 'state');
        __.colInputsTax.add(__.elmFormCheckout.find('#fld\\[checkout\\]\\[zip\\]'), 'zip');
        __.colInputsTax.add(__.elmFormCheckout.find('#fld\\[checkout\\]\\[sameasbilling\\]'), 'sameasbilling');
        __.colInputsTax.add(__.elmFormCheckout.find('#fld\\[checkout\\]\\[shippingaddress1\\]'), 'shippingaddress1');
        __.colInputsTax.add(__.elmFormCheckout.find('#fld\\[checkout\\]\\[shippingcity\\]'), 'shippingcity');
        __.colInputsTax.add(__.elmFormCheckout.find('#fld\\[checkout\\]\\[shippingstate\\]'), 'shippingstate');
        __.colInputsTax.add(__.elmFormCheckout.find('#fld\\[checkout\\]\\[shippingzip\\]'), 'shippingzip');
        __.stateCheckerTaxFields = new __.classes.stateChecker({
            collection: __.colInputsTax
            ,callbackCheckState: function(args){
                var lclReturn = '';
                if(this.collection.get('sameasbilling').filter(':checked').length > 0)
                    var fields = this.boot.fieldsBillingAddress;
                else
                    var fields = this.boot.fieldsShippingAddress;
                for(var key in fields){
                    if(fields.hasOwnProperty(key)){
                        lclReturn += this.collection.get(fields[key]).val();
                    }
                }
                return lclReturn;

            }
            ,boot: {
                fieldsBillingAddress: [
                    'address1'
                    ,'city'
                    ,'state'
                    ,'zip'
                ]
                ,fieldsShippingAddress: [
                    'shippingaddress1'
                    ,'shippingcity'
                    ,'shippingstate'
                    ,'shippingzip'
                ]
            }
        });
        __.stateCheckerTaxFields.on('change', function(argEvent, argData){
            //--do ajax query to change taxes
            __.orderAddressManager.store();
            //--modify 'data-taxes' on '.mainhead .cost' on change
            //!__.orderManager.serviceRequest(null, 'read', ['order']);
        });
});

-----html
-----css
*/

/*-------
©stateChecker
-------- */
__.classes.stateChecker = function(args){
        if(typeof args == 'undefined') var args = {};
        var fncThis = this;
		//--required attributes
//->return

		//--optional attributes
		this.boot = args.boot || {};
		this.callbackCheckState = args.callbackCheckState || function(){ return false; }
        this.collection = args.collection || new __.classes.collection();
		this.eventsForBinding = args.eventsForBinding || 'change';
		this.oninit = args.oninit || this.defaultOnInit;

		//--derived attributes
		this.jq = jQuery({});
		this.state = null;

		//--do something
        if(this.oninit)
            this.oninit.call(this);
	}
	__.classes.stateChecker.prototype.defaultOnInit = function(){
		var lcThis = this;
		//--by default, check state on change event of each item
		//-#requires every collection item to have a on method
		var lcFnCallback = function(){
			lcThis.checkState();
		};
		this.collection.each(function(args){
			this.on(lcThis.eventsForBinding, lcFnCallback);
		});
		this.checkState();
	}
	__.classes.stateChecker.prototype.checkState = function(){
	   var stateNew = this.callbackCheckState.call(this);
	   if(this.state != stateNew){
	       var stateOld = this.state;
	       this.state = stateNew;
	       this.jq.trigger('change', {'old': this.state, 'new': stateNew});
	   }
	}
	__.classes.stateChecker.prototype.on = function(){
		this.jq.on.apply(this.jq, arguments);
	}

