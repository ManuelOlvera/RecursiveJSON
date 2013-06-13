<script>
	var json = JSON.parse('{"id" : "1","jsonrpc" : "2.0","method" : "myMethod","params" : {"params1" : [],"params2" : false,"params3" : [{"innerParams1" : 0,'+
		'"innerParams2" : 0,"innerParams3" : "Simple Text","innerParams4" : 0,"innerParams5" : 0,"innerParams6" : 1.0000,"innerParams7" : 1.0000,'+
		'"innerParams8" : 1.0000,"innerParams9" : 1.0000}],"params4" : [],"params5" : {"documentation" : "email"},"params6" : 0,'+
		'"params7" : "2013-06-12T14:31:08.237000Z","params8" : [{"name1" : "Some name","name2" : [{"prop1" : "Some prop","prop2" : [],'+
		'"prop3" : 250,"prop4" : {"innerProp1" : "Some inner property","innerProp2" : "False","innerProp3" : "False"},"prop5" : 0}]}],'+
		'"params9" : "2013-06-12T14:31:08.237000Z","params10" : null,"params11" : "Generic Text","params12" : true,"params13" : 0}}');

	function isArray (value) {
	    return value &&
	        typeof value === 'object' &&
	        typeof value.length === 'number' &&
	        typeof value.splice === 'function' &&
	        !(value.propertyIsEnumerable('length'));
	};


	function recursiveGetProperty(obj, lookup, callback) {
	    for (property in obj) {
	        if (property == lookup) {
	            callback(obj[property]);
	        } else if (obj[property] instanceof Object) {
	            if(isArray(obj[property])){
	                if(obj[property].length !== 0){
	                    var jsonArray = obj[property];
	                    for (arrayProperty in jsonArray) {
	                        if (jsonArray.hasOwnProperty(arrayProperty)) {
	                            recursiveGetProperty(jsonArray[arrayProperty], lookup, callback);
	                        }
	                    }
	                }
	            } else {
	                recursiveGetProperty(obj[property], lookup, callback);
	            }
	        }
	    }
	}

	recursiveGetProperty(json, 'params11', function(obj) {
	    console.debug(obj);
	});
</script>