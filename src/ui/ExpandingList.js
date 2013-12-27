/*
Class: ExpandingList

Split a list of items into two lists, one displayed, one hidden  A button will be added to reveal the second list.

*/
/* global define */
define(['tmclasses/tmclasses', 'jquery'], function(__tmclasses, jQuery){
	var __ExpandingList = __tmclasses.create({
		init: function(){
			var _this = this;
			_this.__parent(arguments);

			//--create button if it should be created
			if(typeof _this.$button === 'string'){
				_this.$button = jQuery(_this.$button);
				_this.$.append(_this.$button);
			}

			//--attach event listeners
			_this.$button.on('click', jQuery.proxy(_this.handleExpandAction, _this));

			//--get list if it is a select
			if(typeof _this.$list === 'string'){
				_this.$list = _this.$.find('string');
			}

			//--split list
			_this.splitList();

			//--get list to initial state
			if(_this.initiallyOpen){
				_this.open(1);
			}else{
				_this.close(1);
			}
		}
		,properties: {
			$: null
			,$button: '<button class="expandAction">'
			,$list: '>*'
			,$moreList: null

			/*
			Attribute: baseButtonText
			Will use as button text if set.  Will replace '{{value}}' with the appropriate opened/closed text if it exists.
			*/
			/*jshint -W100 */
			,baseButtonText: '{{value}}…'
			,close: function(_duration){
				if(this.$moreList){
					this.$moreList.slideUp((typeof _duration !== 'undefined') ? _duration : this.duration, jQuery.proxy(this.onClose, this));
				}
			}

			/*
			Attribute: closedButtonText
			Text to place on button when the list is closed.
			*/
			,closedButtonText: 'More'

			/*
			Attribute: closedItemCount
			Number of items to keep in the original list, that will be shown when closed.
			*/
			,closedItemCount: 3
			,duration: 500
			,handleExpandAction: function(){
				this.toggle();
			}

			/*
			Attribute: initiallyOpen
			Whether to have $moreList open initially.  Otherwise, it'll close.
			*/
			,initiallyOpen: false
			,isOpen: false

			/*
			Attribute: listItems
			Selector for list items
			*/
			,listItems: '>*'

			/*
			Method: onClose
			Actions to perform once the list is closed.
			*/
			,onClose: function(){
				this.setButtonText(this.closedButtonText);
				this.isOpen = false;
			}

			/*
			Method: onOpen
			Actions to perform once the list is opened.
			*/
			,onOpen: function(){
				this.setButtonText(this.openedButtonText);
				this.isOpen = true;
			}
			,open: function(_duration){
				if(this.$moreList){
					this.$moreList.slideDown((typeof _duration !== 'undefined') ? _duration : this.duration, jQuery.proxy(this.onOpen, this));
				}
			}

			/*
			Attribute: openedButtonText
			Text to place on button when the list is opened.
			*/
			,openedButtonText: 'Less'
			,toggle: function(_duration){
				if(this.isOpen){
					this.close(_duration);
				}else{
					this.open(_duration);
				}
			}
			,setButtonText: function(_text){
				this.$button.text((this.baseButtonText)
					? this.baseButtonText.replace('{{value}}', _text)
					: _text
				);
			}
			,splitList: function(){
				var _this = this;
				var _items = _this.$list.find(_this.listItems);
				if(_items.length > _this.closedItemCount){
					if(!_this.$moreList){
						_this.$moreList = _this.$list.clone();
						_this.$moreList.empty();
						_this.$list.after(_this.$moreList);
					}
					var _moreItems = _items.slice(_this.closedItemCount);
					_moreItems.detach();
					_this.$moreList.append(_moreItems);
				}
			}
		}
	});
	return __ExpandingList;
});
