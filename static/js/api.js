var baseUrl = "https://explorer.ark.io/api/";

function getAccount(address , cb) {
	data = {
		address : address
	}

	queryApi("getAccount", data, function(data){
		console.log(data);	
	});
}

function queryApi(api, data, cb) {
	url = baseUrl + getApi(api, data);

	$.ajax({
            type: "GET", //or GET
            url: url,
            crossDomain:true,
            cache:false,
            async:false,
            success: function(data){      
				if(typeof(cb) == 'function') {
					cb(data);
				}
            },
            error: function(data){
				if(typeof(cb) == 'function') {
					cb(data);
				}
            }
        });
}

function getApi(api, data) {
	return api + "?" + toQueryString(data);
}

function toQueryString (array) {
	var out = new Array();

	for(key in array){
		out.push(key + '=' + encodeURIComponent(array[key]));
	}

	return out.join('&');
}