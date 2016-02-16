/* global __, google, window */
/*
Class: GoogleMap

Create and work with a google map using google's map API.

*/
define(['jquery', 'tmclasses/tmclasses'], function(jQuery, __tmclasses){
	var __this = __tmclasses.create({
		init: function(){
			var _self = this;
			_self.__parent(arguments);
			if(__this.isAPIScriptLoaded){
				_self.activate();
			}else{
				__this.loadAPIScript().done(jQuery.proxy(_self.activate, _self));
			}
		}
		,properties: {
			$: undefined
			,activate: function(){
				var _self = this;
				if(!_self.options){
					_self.options = {};
				}
				if(!_self.markers){
					_self.markers = [];
				}
				if(!_self.options.center && _self.latitude && _self.longitude){
					_self.options.center = new google.maps.LatLng(_self.latitude, _self.longitude);
				}
				if(!_self.options.mapTypeId){
					_self.options.mapTypeId = window.google.maps.MapTypeId.ROADMAP
				}
				if(!_self.options.zoom){
					_self.options.zoom = 15
				}

				if(_self.$ && _self.$.length){
					if(_self.points === 'auto'){
						var _points = _self.$.find(_self.pointsSelector);
						if(_points.length){
							_self.points = [];
							_points.each(function(){
								_self.points.push(jQuery(this).data());
							});
						}else{
							_self.points = undefined;
						}
					}
					if(_self.points){
						//-@ http://stackoverflow.com/a/15720047
						// _self.$.html('');
						_self.map = new google.maps.Map(_self.$[0], _self.options);
						if(_self.autoMark && _self.map){
							if(!_self.bounds){
								_self.bounds = new google.maps.LatLngBounds();
							}
							for(var _i = 0; _i < _self.points.length; ++_i){
								var _point = _self.points[_i];
								var _marker = _self.mark(_point);
								_self.bounds.extend(_marker.position);
							}
						}
						if(_self.bounds){
							_self.map.fitBounds(_self.bounds);
						}
					}else{
						//--set up single point map
						_self.map = new google.maps.Map(_self.$[0], _self.options);
						_self.mark({latitude: _self.latitude, longitude: _self.longitude});
					}
				}
			}
			,autoMark: true
			,bounds: undefined
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
			,mark: function(_opts){
				if(typeof _opts === 'undefined'){
					_opts = {};
				}
				if(!_opts.position){
					_opts.position = new google.maps.LatLng(_opts.latitude, _opts.longitude);
				}
				if(!_opts.map){
					_opts.map = this.map;
				}
				var _marker = new google.maps.Marker(_opts);
				this.markers.push(_marker);
				return _marker;
			}
			,markers: undefined
			,options: undefined
			,points: undefined
			,pointsSelector: '.point'
		}
		,statics: {
			apiKey: undefined
			,isAPIScriptLoaded: (window.google && window.google.maps) || false
			,loadAPIScript: function(){
				if(__this.isAPIScriptLoaded !== 'loading'){
					var _promise = jQuery.getScript('https://maps.googleapis.com/maps/api/js?key=' + __this.apiKey);
				}else{
					var _promise = jQuery.Deferred();
					_promise.resolve();
					_promise = _promise.promise();
				}
				return _promise;
			}
		}
	});
	return __this;
});
