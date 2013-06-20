<script>
	var json = JSON.parse('{"id" : "1","jsonrpc" : "2.0","method" : "myMethod","params" : {"params1" : [],"params2" : false,"params3" : [{"innerParams1" : 0,'+
		'"innerParams2" : 0,"innerParams3" : "Simple Text","innerParams4" : 0,"innerParams5" : 0,"innerParams6" : 1.0000,"innerParams7" : 1.0000,'+
		'"innerParams8" : 1.0000,"innerParams9" : 1.0000}],"params4" : [],"params5" : {"documentation" : "email"},"params6" : 0,'+
		'"params7" : "2013-06-12T14:31:08.237000Z","params8" : [{"name1" : "Some name","name2" : [{"prop1" : "Some prop","prop2" : [],'+
		'"prop3" : 250,"prop4" : {"innerProp1" : "Some inner property","innerProp2" : "False","innerProp3" : "False"},"prop5" : 0}]}],'+
		'"params9" : "2013-06-12T14:31:08.237000Z","params10" : null,"params11" : "Generic Text","params12" : true,"params13" : 0}}');
    var endpointBrowser = String('{!endpointBrowser}');  						   
    var endpointSFDC = String('{!endpointSFDC}');
	var timeout = parseInt(String('{!timeout}'), 10);

    var ratingEngineError = function(message){
    	console.log("error: ", message);
    }

    var ratingEngineSuccess = function(response){
		console.log("success: ", response);
    }

    var ratingEngineSuccessIE = function(){
    	ratingEngineSuccess(JSON.parse(xdr.responseText));
    }

	// To solve the Cross-Domain problem using Salesforce.
    var crossDomainAjaxCallHandlerUsingSalesforceProxy = function(){
    	Visualforce.remoting.Manager.invokeAction(
            '{!$RemoteAction.SalesforceController.SalesforceMethod}',
            JSON.stringify(json),endpointSFDC,
            function(response, event){           
                if (event.status) {
                    ratingEngineSuccess(JSON.parse($('<div></div>').html(response).text()));
                } else if (event.type == 'exception') {
                    ratingEngineError(event.message);
                }
            },
            {escape: true}
        );
    }
    
    // IE8 and IE9 use XDomainRequest object instead of XMLHttpRequest, the one JQuery uses.
    // XDomainRequest doesn’t parse the returned text. In other words, when 
    // we use jQuery, we have a ready JSON object returned, but when we use XDomainRequest, 
    // we have a plain text received.
    // NOTE: Only works on IE8 and IE9
    function crossDomainAjaxCallHandlerIE() {    
        if (window.XDomainRequest) { // Check whether the browser supports XDR.
            xdr = new XDomainRequest(); // Create a new XDR object.			
            if (xdr) {				        
		        params = JSON.stringify(json);
                // There is an error and the request cannot be completed.
				xdr.onerror = crossDomainAjaxCallHandlerUsingSalesforceProxy;
                // This event is raised when the request reaches its timeout. 
                xdr.ontimeout = crossDomainAjaxCallHandlerUsingSalesforceProxy;
                // When the object starts returning data, the onprogress event 
                // is raised and the data can be retrieved by using responseText.
                //xdr.onprogress = ratingEngineSuccess;
                // When the object is complete, the onload event is raised and 
                // the responseText ensures the data is available.
                xdr.onload = ratingEngineSuccessIE;
                xdr.timeout = timeout;
                xdr.open("post", endpointBrowser);
                // The request is then sent to the server.  
                xdr.send(params);
            } else {
                //Failed to create new XDR object			                
	            crossDomainAjaxCallHandlerUsingSalesforceProxy();
            }
        } else {
            //XDR does not exist
            crossDomainAjaxCallHandlerUsingSalesforceProxy();
        }
    }
    
    // This generic function offers a Cross-Domain solution. First try to call
    // the server without using a  considering any browser but IE9 or below.
    // If the call isn't success, it tries again considering IE9 and IE8 which support
    // cross-domain whithout a  but not using the same object as jQuery. If this
    // one doesn't success, it calls the server using SFDC as a.
    function crossDomainAjaxCallHandler() {
    	$.ajax({
            type: "POST",
            url: endpointBrowser,
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(json),
            timeout: timeout,
            success: function(response, status, xhr){
            	ratingEngineSuccess(response);
            },
            error: function(xhr, status, error){
                // Checks whether the browser is IE8 or IE9. Otherwise the call will use Saleforce	                    
            	if ($.browser.msie && window.XDomainRequest) {      
                    crossDomainAjaxCallHandlerIE();
                } else {
                    crossDomainAjaxCallHandlerUsingSalesforceProxy();
                }
            }         
        });
    }
</script>