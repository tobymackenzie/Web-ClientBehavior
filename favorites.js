/*
handles adding favorites list to cookies via dragondrop location

-----instantiation
if(typeof $ != 'undefined'){
	$(function(){
		// dragondrop
		var elmDroppableContainer = $("#footer .favoriteslist");
		if(elmDroppableContainer.length > 0){
			var callbackShrinkItems = 
			__.favorites = new __.classes.favorites({
				elmDroppableContainer: elmDroppableContainer,
				elmsDraggable: $("#maincontent .portfolioimage"),
//				member: (typeof page.member != "undefined" && cogneatoMember.isLoggedIn)?cogneatoMember: false),
				callbackItemAdd: function(argElmsItem){
					argElmsItem.find("img").css("height", "65px");
				},
				callbackDraggableStart: function(event, ui){
__.message("start");
					//-resize image and element to match favorites bar sizes
					var elmImage = ui.helper.find("img");
					elmImage.css({height: "65px"});
					ui.helper.css({width: elmImage.outerWidth()+"px"});
				}
			});
		}
	});
}

*/

/*----------
©favorites
----------*/
__.classes.favorites = function(arguments){
		this.elmDroppableContainer = arguments.elmDroppableContainer || null;
		this.elmsDraggable = arguments.elmsDraggable || null;
		this.selectorAccepts = arguments.selectorAccepts || "li";
		this.classAdded = arguments.classAdded || "ui-added";
		this.nameCookie = (arguments.nameCookie)? arguments.nameCookie: "favorites";
		this.htmlDeleteButton = (arguments.htmlDeleteButton)? arguments.htmlDeleteButton: '<a class="delete button" href="javascript://__remove_item_from_favorites"><span>delete</span></a>';
		this.callbackItemAdd = arguments.callbackItemAdd || null;
		this.callbackDraggableStart = arguments.callbackDraggableStart || null;
		this.attrID = arguments.attrID || "data-unid";
		this.member = arguments.member || false;
		
		var fncThis = this;
		
		if(!this.elmDroppableContainer || this.elmDroppableContainer.length < 1 || !this.elmsDraggable || this.elmsDraggable.length < 1)
			return false;
//-> return
/*
		this.elmDroppableContainer.droppable({accept: this.selectorAccepts, drop: this.addDroppableItem});
*/
		this.initDraggableItems(this.elmsDraggable);
/* 		jQuery(".imagelist").sortable({helper: "clone", connectWith: "#footer .favoriteslist"}); */
		this.elmDroppableContainer.sortable({
//			containment: "parent",
			forcePlaceholderSize: true,
			receive: function(event, ui){
// cannot be used currently due to bug
				//-ensure item is not already in items
				//-change height of incoming item appropriately
				//-add delete button
				//-ajax add item to users db
			}
			,update: function(event, ui){
				//-ajax update sort order
				fncThis.update();
			}
			,stop: function(event, ui){
				var elmNew = ui.item;
// hack to work around "receive" bug
				if(!elmNew.hasClass(fncThis.classAdded)){
					var idNew = elmNew.attr(fncThis.attrID);
					var isIDAlreadyAdded = false;
					fncThis.elmDroppableContainer.find(fncThis.selectorAccepts).not(elmNew).each(function(index, element){
						if(jQuery(this).attr(fncThis.attrID) == idNew)
							isIDAlreadyAdded = true;
					});
					if(isIDAlreadyAdded){
						jQuery(ui.sender).sortable('cancel');
						jQuery(this).sortable('cancel');
						elmNew.remove();
					}else{
						elmNew.css({position: "relative"});
						fncThis.handleAddItem(elmNew);
					}
				}
			}
			,over: function(event, ui){
				ui.sender.addClass("receiving");
			}
			,out: function(event, ui){
				ui.sender.removeClass("receiving");
			}
		});
		this.handleAddItem(this.elmDroppableContainer.find(this.selectorAccepts));
	}
	__.classes.favorites.prototype.initDraggableItems = function(argElements){
		var parmDraggable = {
			appendTo: jQuery("body"),
			helper: 'clone',
			cursorAt: {left: 5, top: 5},
			connectToSortable: this.elmDroppableContainer
		}
		if(this.callbackDraggableStart)
			parmDraggable.start = this.callbackDraggableStart;
		argElements.draggable(parmDraggable);
	}
	__.classes.favorites.prototype.handleAddItem = function(argElmItem){
		var fncThis = this;
		var elmsItems = argElmItem.not("."+fncThis.classAdded);
		elmsItems.addClass(fncThis.classAdded);
		elmsItems.append(function(){
			return jQuery(fncThis.htmlDeleteButton).bind("click", function(event){
				if(event.preventDefault)
					event.preventDefault();
				//-ajax remove item from user db
				//-remove element from list
				jQuery(this).closest(fncThis.selectorAccepts).remove();
				fncThis.update();

				return false;
			});		
		});
		if(fncThis.callbackItemAdd)
			fncThis.callbackItemAdd.call(this, elmsItems);
	}
	__.classes.favorites.prototype.update = function(){
		var fncThis = this;
		var elmsItems = fncThis.elmDroppableContainer.find(fncThis.selectorAccepts);
		var arrUnids = new Array();
		elmsItems.each(function(){
			arrUnids.push(jQuery(this).attr(fncThis.attrID));
		});
		if(fncThis.nameCookie){
			__.lib.cookies.set({name: fncThis.nameCookie, value: arrUnids.join(","), expires: 180});
			if(fncThis.member)
				__.message("saving to member database");
		}
	}
	__.classes.favorites.prototype.whatever = function(){
	}

