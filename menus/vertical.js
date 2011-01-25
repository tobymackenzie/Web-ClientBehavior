if($){
	$(document).ready(function(){
		//- handle menus
		var elmSidemenu = $("#sidebar .sectionnavigation");
		if(elmSidemenu.length > 0){
			__.sidemenu = new __.classes.verticalMenuAnimation({elmContainer: elmSidemenu, classToplevelitem: "toplevel", selectedName: __.lib.getCurrentSubsection(/subsection_([\w]+)/, 1), duration: 400, easing: "linear"});
		}
	});
}


/*------
verticalMenuAnimation
requires: jquery
------ */
__.classes.verticalMenuAnimation = function(arguments){
		this.elmContainer = arguments.elmContainer || document.body;
		this.classToplevelitem = arguments.classToplevelitem || "toplevelitem";
		this.elmsMenus = arguments.elmsMenus || this.elmContainer.find("."+this.classToplevelitem);
		this.classTopitem = arguments.classTopitem || "topitem";
		this.classSubmenu = arguments.classSubmenu || "submenu";
		this.nameAttribute = arguments.nameAttribute || "data-name";
		this.selectedName = arguments.selectedName || false;
		this.duration = arguments.duration || 500;
		this.classClosed = arguments.classClosed || "closed";
		this.classOpen = arguments.classOpen || "open";
		this.easing = arguments.easing || "swing";
		
		this.elmCurrent = false;
		//- remove elmsMenus without submenus
		this.elmsMenus = this.elmsMenus.has("."+this.classSubmenu);
		
		// set href of toplevel items to # so they are keyboard navigable but have no target for non-js browsers/bots
		this.elmsMenus.find("."+this.classTopitem).attr("href","javascript://openmenu();");
		// must set height so there is no jump
		this.elmsMenus.find("."+this.classSubmenu).each(function(){
			$(this).css("height", $(this).height());
		});
		//- init as closed
		this.elmsMenus.addClass(this.classClosed);
		//- open current item
		if(this.selectedName){
			var elmMenuSelected = this.elmsMenus.filter("["+this.nameAttribute+"="+this.selectedName+"]");
			if(elmMenuSelected.length > 0)
				this.open(elmMenuSelected, 0);
		}
		this.attachListeners();
	}
	__.classes.verticalMenuAnimation.prototype.attachListeners = function(argElmsMenus){
		var fncThis = this;
		var elmsMenus = argElmsMenus || this.elmsMenus;
		elmsMenus.find("."+this.classTopitem).bind("click", function(){
			var elmMenu = $(this).parent(this.classToplevelitem);
			if(elmMenu[0] == fncThis.elmCurrent[0]){
				fncThis.close(elmMenu);
				fncThis.elmCurrent = false;
			}else{
				fncThis.close(fncThis.elmCurrent);
				fncThis.open(elmMenu);
			}			
			return false;
		});
	}
	__.classes.verticalMenuAnimation.prototype.open = function(argElmMenu, argDuration){
		var fncDuration = (argDuration === undefined)? this.duration: argDuration;
		if(!argElmMenu) return false;
		var fncThis = this;
		var elmMenu = argElmMenu;
		elmMenu.find("."+this.classSubmenu).slideDown(fncDuration, this.easing, function(){
			elmMenu.removeClass(this.classClosed).addClass(this.classOpen);
			fncThis.elmCurrent = elmMenu;
		});
	}
	__.classes.verticalMenuAnimation.prototype.close = function(argElmMenu){
		if(!argElmMenu) return false;
		var elmMenu = argElmMenu;
		elmMenu.find("."+this.classSubmenu).slideUp(this.duration, this.easing, function(){
			elmMenu.removeClass(this.classOpen).addClass(this.classClosed);
		});
	}
__.lib.getCurrentSubsection = function(argRegex, argIndex){
	var fncIndex = argIndex || 1;
	var arrClasses = __.getClasses(document.body);
	for(i = 0; i < arrClasses.length; i++){
		var regexResult = argRegex.exec(arrClasses[i]);
		if(regexResult){
			return regexResult[fncIndex];
		}
	}
	return false;
}

