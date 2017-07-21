var cacheWalletData;

var currency = 'btc';
var btc_currency = 0.0001;
init();

function init(){
	initEvent();
	loadAccount();
	showHome();	
}

function loadAccount() {
	getCookie(function(data){
		address = data.address;
		if(address != null){
			if(cacheWalletData == null) {
				getAccount({
					data : {
						address : address
					}, 
					callback : function(data){
						if(data.success == true) {
							cacheWalletData = data;
							setWalletData();
						}
					}
				});
			} else {
				setWalletData();
			}
		}
	});
}

function setWalletData(){
	var data = cacheWalletData;
	$('#wallet_title').text('MY ACCOUNTS ' + 'Ѧ'+ amountConverter(data.balance));

	var element = '<a class="item info"><div class="right floated content">Ѧ${AMOUNT}</div><div class="left floated content">${WALLET_ADDRESS}</div></a>';
	$('#wallet_list').empty();	
	$('#wallet_list').append(element.replace('${AMOUNT}', amountConverter(data.balance)).replace('${WALLET_ADDRESS}', data.address));

	$('.item.info').click(function(){
		showHome(showInfo);
	})

	$('div[name=walletAddress]').text(data.address);
	$('div[name=balance]').text('Ѧ'+amountConverter(data.balance));

	$('#qrcode').qrcode({width: 90,height: 90,text: JSON.stringify({a:data.address})});

	getTransactionByAddress({
		data : {
			limit : 30,
			offset : 0,
			address : data.address
		},
		callback : function(data) {
			setTransactionData(data.transactions);
		}
	})
}

function setTransactionData(data){
	var label = '<div class="ui ${COLOR} label">${AMOUNT}</div>';
	var element = '<tr><td>${TYPE}</td><td>${AMOUNT}</td><td>${BALANCE}</td></tr>';
	$('#transaction').empty();

	for(var i = 0; i < data.length; i++){
		time = timeConverter(data[i].timestamp);
		amount = amountConverter(data[i].amount);
		sender = typeConverter(data[i].senderId);
		var labelAmount = label.replace("${COLOR}", sender==true ? "red" : "green").replace("${AMOUNT}",(sender==true ? "-" : "" )+ amount);
		$('#transaction').append(element.replace("${BALANCE}", (amount * btc_currency).toFixed(4)).replace("${TYPE}", sender==true ? "Send" : "Recived").replace("${AMOUNT}", labelAmount));
	}
}


function initEvent(){
	$('.btn.home').click(function(){
		if(menu == 'info'){
			showInfo(showHome);
		}
	});

	$('.pp.addWallet').click(function(){
		showAddWallet($(this).attr('condition'));
	});

	$('.btn.addWallet').click(function(){
		getAccount({
			data : {
				address : $('input[name=address]').val()
			}, 
			callback : function(data){
				if(data.success == true) {
					cacheWalletData = data;
					setCookie(data.address);
					loadAccount();
					showAddWallet('hide');
				} else {
					$('input[name=address]').parent().addClass('error');
				}
			}
		});
	});	

	$('input[name=address]').on('input',function(){
		if($(this).val() == ""){
			$('.btn.addWallet').addClass('disabled');			
		} else {
			$('.btn.addWallet').removeClass('disabled');
		}
	});	
}

function typeConverter(senderid){
	return senderid == cacheWalletData.address;
}

function amountConverter(amount){
	var amount = amount /100000000;
	return amount.toFixed(2);
}

function timeConverter(unixtime){
	var a = new Date(unixtime * 1000);
	var year = a.getYear();
	var month = a.getMonth();
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var time = date + '/' + month + ' ' + hour + ':' + min;
	return time;
}

function getCookie(cb){
	chrome.storage.local.get(['address'], function(items){
		cb(items)
	});
}

function setCookie(value){
	console.log(value);
	chrome.storage.local.set({ 'address' : value }, function(){
	});
}




// function getTransaction(){
// 	var url = getTransactionURL + "?address=" + wallet_address + "&limit=20&offset=0";
// 	console.log(url);
// 	$.ajax({
//             type: "GET", //or GET
//             url: url,
//             crossDomain:true,
//             cache:false,
//             async:false,
//             success: function(data){
//             	if(data.success == true){
//             		console.log(data);
//             		setTransactionData(data.transactions);
//             	} else {
//             		console.log(data);
//             	}
//             },
//             error: function(data){
//             	console.log(data);
//             }
//         });
// }


// function getBalance(){
// 	url = "https://api.coinmarketcap.com/v1/ticker/ark/";
// 	$.ajax({
//             type: "GET", //or GET
//             url: url,
//             crossDomain:true,
//             cache:false,
//             async:false,
//             success: function(data){
//             	usd_currency = data[0].price_usd;            	
//             	btc_currency = data[0].price_btc;

// 				$('.usdPrice').text("$ " + usd_currency);
// 				$('.btcPrice').text("Ƀ " + btc_currency);
// 				getKRWBalance();		
//             },
//             error: function(data){
//             	console.log(data);
//             }
//         });
// }

// function getKRWBalance(){
// 	url = "https://api.coinone.co.kr/ticker/?format=json&currency=btc";
// 	$('.krwPrice').text('');
// 	$.ajax({
//             type: "GET", //or GET
//             url: url,
//             crossDomain:true,
//             cache:false,
//             async:false,
//             success: function(data){
//             	krw_currency = parseInt(data.last * btc_currency);
//             	$('.krwPrice').text("₩ " + krw_currency);
//             },
//             error: function(data){
//             	console.log(data);
//             },
//         });
// }
