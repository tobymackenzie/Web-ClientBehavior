__.classes.simplePager = function(args){
		var fncThis = this;
		this.elmsPages = args.elmsPages || null; if(!this.elmsPages) return false;
		this.elmPagerControlSingle = args.elmPagerControlSingle || null;
		this.elmPagerControlsIndexed = args.elmPagerControlsIndexed || null;
		this.labelPrefix = args.labelPrefix || "";
		this.onchange = args.onchange || null;
		
		this.indexCurrent = null;
		this.indexPrevious = null;
		this.countPages = this.elmsPages.length;
		
		this.switchToPage(0);
		if(this.elmPagerControlSingle){
			__.addListener(this.elmPagerControlSingle, "click", function(){
				fncThis.toggle();
			});
			this.elmPagerControlSingle.style.cursor = "pointer";
		}
		__.message(this.elmPagerControlsIndexed);
		if(this.elmPagerControlsIndexed){
			__.message("indexed setup");
			this.elmPagerControlsIndexedItems = __.getElementsByClassName({"className":"item", "element": this.elmPagerControlsIndexed});
			for(var i = 0; i < this.elmsPages.length; ++i){
				var pageID = this.elmsPages[i].getAttribute("id");
				for(var j = 0; j < this.elmPagerControlsIndexedItems.length; ++j){
					__.message(this.elmPagerControlsIndexedItems[j].getAttribute("href")+" vs #"+pageID);
					if(this.elmPagerControlsIndexedItems[j].getAttribute("href") == pageID){
						__.message("if success");
						var thisElement = this.elmPagerControlsIndexedItems[j];
						var thisIndex = i;
						var handler = function(fncThis, thisIndex){
							return function(){
								__.message("Switch to "+thisIndex);
								fncThis.switchToPage(thisIndex);
								return false;
							}
						}(fncThis, thisIndex);
						__.addListener(thisElement, "click", handler);
						__.addListener(thisElement, "click", function(){__.message("clicked"); });
					}
				}
			}
		}
	}
	__.classes.simplePager.prototype.toggle = function(){
		this.switchToPage(this.getNextIndex());
	}
	__.classes.simplePager.prototype.switchToPage = function(argIndex){
		// set previous to noncurrent
		// set all to non-current if none have been current before
		if(this.indexCurrent === null){
			for(var i = 0; i < this.elmsPages.length; ++i){
				__.removeClass(this.elmsPages[i], "current");
				__.addClass(this.elmsPages[i], "noncurrent");
			}
		}else{
			__.removeClass(this.elmsPages[this.indexCurrent], "current");
			__.addClass(this.elmsPages[this.indexCurrent], "noncurrent");
		}
		__.removeClass(this.elmsPages[argIndex], "noncurrent");
		__.addClass(this.elmsPages[argIndex], "current");
		
		this.indexPrevious = this.indexCurrent;
		this.indexCurrent = argIndex;
		this.setControlLabelSingle();
		if(this.onchange)
			this.onchange.call(this);
	}
	__.classes.simplePager.prototype.setControlLabelSingle = function(){
		if(this.elmPagerControlSingle){
			var nextLabel = this.elmsPages[this.getNextIndex()].getAttribute("data-label");
			if(!nextLabel) nextLabel = "next page";
			this.elmPagerControlSingle.innerHTML = this.labelPrefix+nextLabel;
		}
	}
	__.classes.simplePager.prototype.getNextIndex = function(){
		if(this.indexCurrent >= this.countPages - 1){
			return 0;
		}else{
			return this.indexCurrent + 1;
		}
	}

