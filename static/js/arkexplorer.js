var cacheWalletData;

init();

function init(){
	initEvent();

	loadAccount();
	getBalance('krw');

	showHome();	
}

function loadAccount() {
	getCookie(null, function(data){
		var address = data.address;
		var balance = data.balance;
		if(balance != null) {
			currnetCurrency = balance;
		} else {
			currnetCurrency = 'btc';
			setCookie({'balance': currnetCurrency});
		}

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

	getCookie(null,function(data){

	});
}

function setWalletData(){
	var data = cacheWalletData;

	var element = '<a class="item info"><div class="right floated content">Ѧ${AMOUNT}</div><div class="left floated content">${WALLET_ADDRESS}</div></a>';
	$('#wallet_list').empty();	
	$('#wallet_list').append(element.replace('${AMOUNT}', amountConverter(data.balance)).replace('${WALLET_ADDRESS}', data.address));

	$('.item.info').click(function(){
		showHome(showInfo);
	})

	$('div[name=walletAddress]').text(data.address);
	$('div[name=balance]').text('Ѧ'+amountConverter(data.balance));

	$('#qrcode').qrcode({width: 90,height: 90,text: JSON.stringify({a:data.address})});

	setCurrency();

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
	var element = '<tr><td><a class="txlink" href="${LINK}">${ID}</a></td><td>${TYPE}</td><td>${AMOUNT}</td><td>${BALANCE}</td></tr>';
	$('#transaction').empty();

	for(var i = 0; i < data.length; i++){
		id = data[i].id.substring(0,10) + "..";
		link = "https://explorer.ark.io/tx/" + data[i].id;	
		time = timeConverter(data[i].timestamp);
		amount = amountConverter(data[i].amount);
		sender = typeConverter(data[i].senderId);
		var labelAmount = label.replace("${COLOR}", sender==true ? "red" : "green").replace("${AMOUNT}",(sender==true ? "-" : "" )+ amount);
		$('#transaction').append(element.replace("${BALANCE}", (amount * marketCurrency[currnetCurrency]).toFixed(4)).replace("${LINK}",link).replace("${ID}",id).replace("${TYPE}", sender==true ? "Send" : "Recived").replace("${AMOUNT}", labelAmount));
	}

	$('.txlink').click(function(){
		console.log($(this).attr('href'));

		openTabs($(this).attr('href'));
	});
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
					setCookie({'address': data.address});
					loadAccount();
					showAddWallet('hide');
				} else {
					$('input[name=address]').parent().addClass('error');
				}
			}
		});
	});

	$('.button.convertVal').click(changeCurrency);

	$('input[name=address]').on('input',function(){
		if($(this).val() == ""){
			$('.btn.addWallet').addClass('disabled');			
		} else {
			$('.btn.addWallet').removeClass('disabled');
		}
	});	
}

function changeCurrency() {
	var idx = currency.indexOf(currnetCurrency);
	if(idx ==  currency.length -1) {
		idx = 0;
	} else {
		idx++;
	}
	currnetCurrency = currency[idx];
	setCookie({'balance' : currency[idx]});
	setCurrency();
}

function setCurrency(){
	currentValue = currencySymbol[currnetCurrency] + amountConverter(cacheWalletData.balance * marketCurrency[currnetCurrency]);

	if(currnetCurrency != 'btc')
		currentValue = amountCommaConverter(currentValue);

	$('.convertVal').text(currentValue);
	$('#wallet_title').text('MY ACCOUNTS ' + 'Ѧ'+ amountConverter(cacheWalletData.balance) + '  /  ' + currentValue);
}


