/*
Class: GoogleMap

Create and work with a google map using google's map API.

Example:
	var __map = new __.classes.GoogleMap({
		autoMark: false
	});
	//-- create on page load and History statechange, sticking marker at point of interest
	var __initMap = function(){
		var _locationMap = jQuery('.locationMap');
		if(_locationMap.length){
			_locationMap.each(function(){
				var _locationMap = jQuery(this);
				var _latLong = _locationMap.attr('data-latlong');
				_latLong = _latLong.split(',');
				var _lat = _latLong[0] || undefined;
				var _long = _latLong[1] || undefined;
				if(_lat && _long){
					__map.init({
						$: _locationMap
						,latitude: _lat
						,longitude: _long
					});
					var _name = _locationMap.attr('data-name');
					if(_name){
						__map.mark({
							title: _name
						});
					}else{
						__map.mark();
					}
				}
			});
		}
	};
	__initMap();
	History.Adapter.bind(window, 'statechange', function(){
		__map.deinit();
		__initMap();
	});
*/
/* global __, google, window */
__.classes.GoogleMap = __.core.Classes.create({
	init: function(){
		this.__parent(arguments);
		if(!this.options){
			this.options = {
				mapTypeId: window.google.maps.MapTypeId.ROADMAP || undefined
				,zoom: 15
			};
		}
		if(this.latitude && this.longitude){
			this.options.center = new google.maps.LatLng(this.latitude, this.longitude);
		}
		if(!this.markers){
			this.markers = [];
		}

		if(this.$ && this.$.length){
			this.map = new google.maps.Map(this.$[0], this.options);
			if(this.autoMark && this.map){
				this.mark();
			}
		}
	}
	,properties: {
		$: undefined
		,autoMark: true
		,deinit: function(){
			delete this.$;
			delete this.latitude;
			delete this.longitude;
			delete this.map;
			delete this.markers;
			this.__parent();
		}
		,latitude: undefined
		,longitude: undefined
		,map: undefined
		,mark: function(_options){
			if(typeof _options === 'undefined'){
				_options = {};
			}
			if(!_options.position){
				_options.position = new google.maps.LatLng(this.latitude, this.longitude);
			}
			if(!_options.map){
				_options.map = this.map;
			}
			return this.markers.push(new google.maps.Marker(_options));
		}
		,markers: undefined
		,options: undefined
	}
});
