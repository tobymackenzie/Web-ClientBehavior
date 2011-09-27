/*
add classes to elements of a set based on their position in that set relative to a "current" element
-----dependencies
tmlib: isnumeric
jquery

-----parameters
-----instantiation
-----html
-----css
*/

/*-------
©ElementRelativeClassManager
-------- */
__.classes.ElementRelativeClassManager = function(args){
		if(typeof args == "undefined") var args = {};
		//--required attributes
//->return

		//--optional attributes
		this.boot = args.boot || {};
		this.classAfter = this.classAfter || "after";
		this.classBefore = this.classBefore || "before";
		this.classCurrent = args.classCurrent || "current";
		this.classFirst = args.classFirst || "first-child";
		this.classLast = args.classLast || "last-child";
		this.elements = args.elements || Array();
		this.oninit = args.oninit || null;
		this.onsetclassesall = args.onsetclassesall || null;
		this.onsetclassesforcurrent = args.onsetclassesforcurrent || null;

		//--derived attributes
		this.indexCurrent = -1;
		//--do something
		if(this.oninit)
			this.oninit.call(this);
	}
	__.classes.ElementRelativeClassManager.prototype.getRelativePosition = function(argItemOrIndex){
		if(this.indexCurrent >= 0){
			if(__.lib.isNumeric(argItemOrIndex))
				return argItemOrIndex - this.indexCurrent;
			else
				return elements.index(argItemOrIndex);
		}else{
			return false;
		}
	}
	__.classes.ElementRelativeClassManager.prototype.setClassesAll = function(){
		if(this.elements.length > 0){
			this.elements.removeClass(this.classFirst).removeClass(this.classLast);
			this.elements.first().addClass(this.classFirst);
			this.elements.last().addClass(this.classLast);
			this.setClassesForCurrent();
			if(this.onsetclassesall)
				this.onsetclassesall.call(this);
		}
	}
	__.classes.ElementRelativeClassManager.prototype.setClassesForCurrent = function(){
		if(this.elements.length > 0){
			this.indexCurrent = this.elements.index(this.elements.filter("."+this.classCurrent));
			if(this.indexCurrent >= 0){
				jQuery(this.elements.get(this.indexCurrent)).removeClass(this.classBefore).removeClass(this.classAfter);
				this.elements.slice(0, this.indexCurrent).removeClass(this.classAfter).addClass(this.classBefore);
				this.elements.slice(this.indexCurrent + 1).removeClass(this.classBefore).addClass(this.classAfter);
			}
			if(this.onsetclassesforcurrent)
				this.onsetclassesforcurrent.call(this);
		}
	}

