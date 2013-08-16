/*
description
-----dependencies
tmlib, jquery
-----parameters

-----html
	<ul class="subNavigationList hoverTipList">
<? foreach($testItems as $testItem){ ?>
		<li class="subNavigationItem hoverTipItem clearAfter"><a href="/shop/items/<?=cleanURL($testItem)?>">
			<div class="label"><?=$testItem?></div>
			<div class="hoverTip">
				<img src="/images/content/bookWhatsTheSecretThumb.gif" alt="" />
			</div>
		</a></li>
<? } ?>
	</ul>

-----css
/ *==hovertip * /
.hoverTipList{
	position: relative;
}
html.hasjavascript .hoverTipItem .hoverTip{
	display: none;
	position: absolute;
}
html.hasjavascript .hoverTipItem.current .hoverTip
,html.hasjavascript .hoverTipItem:hover .hoverTip
,html.hasjavascript .hoverTipItem a:focus .hoverTip
{
	display: block;
	position: absolute;
}
-----instantiation
*/
		//--hovertips
		__.elmsHoverTipsWraps = jQuery('.hoverTipList');
		if(__.elmsHoverTipsWraps.length > 0){
			__.hoverTipWidgets = [];
			__.elmsHoverTipsWraps.each(function(){
				__.hoverTipWidgets.push(new __.classes.StickyHoverTips({
					elmWrapper: jQuery(this)
				}));
			});
		}
/*
*/

	/*-----
	==StickyHoverTips
	-----*/
	__.classes.StickyHoverTips = function(args){
			if(typeof args == "undefined") var args = {};
			//--required attributes
	//->return

			//--optional attributes
			var fncThis = this;
			//--required attributes
			this.elmWrapper = args.elmWrapper || null;
			if(!(this.elmWrapper && this.elmWrapper.length > 0))
				return null;
	//->return

			//--optional attributes
			this.classCurrent = args.classCurrent || 'current';
			this.classItem = args.classItem || 'hoverTipItem';
			this.elmsItems = args.elmsItems || this.elmWrapper.find('.'+this.classItem);
			this.boot = args.boot || {};
			this.oninit = args.oninit || null;

			//--init
			//---show first item on load
			this.elmsItems.removeClass(this.classCurrent).first().addClass(this.classCurrent);

			//---show on hover
			this.elmWrapper.on('focus mouseover', '.' + this.classItem, function(){
				var elmThis = jQuery(this);
				if(!elmThis.hasClass(fncThis.classItem)){
					elmThis = elmThis.closest('.'+fncThis.classItem);
				}
				fncThis.elmsItems.removeClass(fncThis.classCurrent);
				elmThis.addClass(fncThis.classCurrent);
			});

			if(this.oninit)
				this.oninit.call(this);
		}

