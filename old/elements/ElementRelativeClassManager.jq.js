/*
Class: ElementRelativeClassManager

Add classes to elements of a set based on their position in that set relative to a 'current' element

Dependencies:
	tmlib: isnumeric
	jquery
*/
/* global __, jQuery */

__.classes.ElementRelativeClassManager = function(_args){
		if(typeof _args == 'undefined'){
			_args = {};
		}

		//--optional attributes
		this.boot = _args.boot || {};
		this.classAfter = this.classAfter || 'after';
		this.classBefore = this.classBefore || 'before';
		this.classCurrent = _args.classCurrent || 'current';
		this.classFirst = _args.classFirst || 'first-child';
		this.classLast = _args.classLast || 'last-child';
		this.elements = _args.elements || Array();
		this.oninit = _args.oninit || null;
		this.onsetclassesall = _args.onsetclassesall || null;
		this.onsetclassesforcurrent = _args.onsetclassesforcurrent || null;

		//--derived attributes
		this.indexCurrent = -1;
		//--do something
		if(this.oninit){
			this.oninit.call(this);
		}
	};
	__.classes.ElementRelativeClassManager.prototype.getRelativePosition = function(_itemOrIndex){
		if(this.indexCurrent >= 0){
			if(__.lib.isNumeric(_itemOrIndex)){
				return _itemOrIndex - this.indexCurrent;
			}else{
				return this.elements.index(_itemOrIndex);
			}
		}else{
			return false;
		}
	};
	__.classes.ElementRelativeClassManager.prototype.setClassesAll = function(){
		if(this.elements.length > 0){
			this.elements.removeClass(this.classFirst).removeClass(this.classLast);
			this.elements.first().addClass(this.classFirst);
			this.elements.last().addClass(this.classLast);
			this.setClassesForCurrent();
			if(this.onsetclassesall){
				this.onsetclassesall.call(this);
			}
		}
	};
	__.classes.ElementRelativeClassManager.prototype.setClassesForCurrent = function(){
		if(this.elements.length > 0){
			this.indexCurrent = this.elements.index(this.elements.filter('.'+this.classCurrent));
			if(this.indexCurrent >= 0){
				jQuery(this.elements.get(this.indexCurrent)).removeClass(this.classBefore).removeClass(this.classAfter);
				this.elements.slice(0, this.indexCurrent).removeClass(this.classAfter).addClass(this.classBefore);
				this.elements.slice(this.indexCurrent + 1).removeClass(this.classBefore).addClass(this.classAfter);
			}
			if(this.onsetclassesforcurrent){
				this.onsetclassesforcurrent.call(this);
			}
		}
	};
