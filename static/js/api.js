var baseUrl = "https://explorer.ark.io/api/";

// params
// address 	: string
function getAccount(params) {
	queryApi("getAccount", params.data, function(data){
		params.callback(data);
	});
}


// params
// limit 	: int
// offset 	: int
// address 	: string
function getTransactionByAddress(params) {
	queryApi("getTransactionsByAddress", params.data, function(data){
		console.log(data);
		params.callback(data);
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


function generateKeypair(passphrase) {
	return ark.crypto.getKeys(passphrase);
}

function createTransaction(address, amount, passphrase, secondpassphrase) {
	// var amount      = 1000 * Math.pow(10, 8); // 100000000000
	// var transaction = ark.transaction.createTransaction("hxuG6XABWSN7swQ6Y8ner1CYHfTLeHLH6euB52fAtW6qRcbSfA", amount,null "passphrase", "secondPassphrase");
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