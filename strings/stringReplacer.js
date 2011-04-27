/*
allows replacing of pieces in a string with other pieces
-----instantiation
__.testRegexHandler = new __.classes.regexHandler({strIng: "facebook.com/url={{url}}&something={{something}}", arrMatchPieces: {url: "required", something: "default"}});

*/

/*---------
©stringReplacer
----------*/
__.classes.stringReplacer = function(arguments){
		//--optional attributes
		this.boot = arguments.boot || null;
		this.arrMatchPieces = arguments.arrMatchPieces || [];
		this.strKey = arguments.strKey || "key";
		this.strMatchKey = arguments.strMatchKey || "{{key}}";
		this.strRequired = arguments.strRequired || "required";
		this.strIng = arguments.strIng || "";
	}
	__.classes.stringReplacer.prototype.getString = function(argMatchPieces){
		var fncReturn = this.strIng;
		//--set matches to defaults, override with arguments
		var fncMatchPieces = this.arrMatchPieces;
		for(var key in argMatchPieces){
			if(argMatchPieces.hasOwnProperty(key)){
				fncMatchPieces[key] = argMatchPieces[key];
			}
		}
		//--match each key with string
		for(var key in fncMatchPieces){
			//-ensure required keys passes
			if(fncMatchPieces.hasOwnProperty(key) && fncMatchPieces[key] == this.strRequired){
__.message("-exeption[regexHandler]: required key "+key+" not supplied.");
//->return on unpassed required key
				return false;
			}
			var currentMatch = this.strMatchKey.replace(this.strKey, key);
			fncReturn = fncReturn.replace(currentMatch, fncMatchPieces[key]);
		}
		return fncReturn;
	}

