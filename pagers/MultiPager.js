/*
Handles multiple pagers to be able to be able to coreograph timed activity between them.  Right now only the 'random' strategy is implemented, and only for pagers/pager.js.

-----dependencies
-----parameters
-----instantiation
*/
		__.bannerPager = new __.classes.MultiPager({
			delay: 600
			,pagers: __.bannerColumnPagers
			,strategy: 'random'
		});

/*

-----html
-----css
*/

/*-------
©MultiPager
-------- */
__.classes.MultiPager = function(args){
		this.delay = args.delay || 1000;
		this.pagers = args.pagers || null;
		this.strategy = args.strategy || null;

		//--derived attributes
		this.timeout = null;

		//--init
		this.start();
	}
	__.classes.MultiPager.prototype.start = function(){
		if(this.pagers){
			var lcThis = this;
			this.timeout = setTimeout(function(){
				lcThis.switche();
			}, this.delay);
		}else{
			__.message('MultiPager.start: no pagers, not starting');
		}
	}
	__.classes.MultiPager.prototype.switche = function(argStrategy){
		var lcThis = this;
		var strategy = (typeof argStrategy != 'undefined') ? argStrategy : this.strategy;
		if(this.pagers){
			switch(strategy){
				case 'random':
				default:
					var pagerIndex;
					if(this.pagers.length > 1){
						do{
							pagerIndex = Math.floor(Math.random() * this.pagers.length);
						}while(pagerIndex === this.lastPagerIndex);
						this.lastPagerIndex = pagerIndex;
					}else{
						pagerIndex = 0;
					}
					this.pagers[pagerIndex].switchTo('random');
					this.start(); //-! does not take into account animation time
				break;
			}
		}else{
			__.message('MultiPager.switche: no pagers');
		}
	}
