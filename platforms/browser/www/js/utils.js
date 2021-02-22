
let base_url = "http://192.168.43.254/sayvers/api/v1/";

function checkConnection(url){

}

function timeOut(num = 30000){
    setTimeout(()=>{
        app.preloader.hide();
        app.dialog.alert('Operation timed out...', 'Time Out');
    }, num)
}

function promiseTimeout(ms, promise) {
     // Create a promise that rejects in <ms> milliseconds
    let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            reject('Operation timed out in '+ (ms/1000) + 's')
        }, ms)
    })

    // Returns a race between our timeout and the passed in promise
    return Promise.race([
        promise,
        timeout
    ])
}

String.prototype.replaceAt = function (index, char) {
    return this.substr(0, index - 1) + char + this.substr(index + char.length);
}

function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
}

function sendAppNotice(){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "post",
            url: base_url + 'general/checknews',
            success: (response) => {
                resolve(response);
            }
        })
    })
}

function login(req){
    app.preloader.show('multi'); 
    localStorage.clear();
    $.ajax({
        type: "post",
        url: base_url + 'login',
        data: req,
        success: (response) => {
            if(response.status){
                localStorage.setItem('user_data', JSON.stringify({ uuid: response.data.uuid, sess_token: response.data.token }))
                app.preloader.hide();   
                app.views.main.router.navigate('/homepage/');
            }else{
                app.preloader.hide();
                app.dialog.alert(response.message, 'Login Failed');
            }
        }
    })
}

function register(req){
    app.preloader.show(); 
    localStorage.clear();
    $.ajax({
        type: "post",
        url: base_url + 'register',
        data: req,
        success: (res) => {
            if(res.status){
                localStorage.setItem('user_data', JSON.stringify({ uuid: res.data.uuid, sess_token: res.data.token }))
                app.preloader.hide();   
                app.views.main.router.navigate('/homepage/');
            }else{
                app.preloader.hide();
                app.dialog.alert(res.message, 'Registration Failed');
            }
        }
    })
}

function fundAccount(req){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "post",
            url: base_url + 'wallet/fund',
            data: req,
            success: (response) => {
                // Update sess_token;
                let userdata = JSON.parse(localStorage.getItem('user_data'));
                if(response.sess_token){
                    userdata.sess_token = response.sess_token;
                }
                localStorage.setItem('user_data', JSON.stringify(userdata));
                resolve(response);
            }
        })
    })
}

function withdrawFunds(req){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "post",
            url: base_url + 'wallet/withdraw',
            data: req,
            success: (response) => {
                // Update sess_token;
                let userdata = JSON.parse(localStorage.getItem('user_data'));
                if(response.sess_token){
                    userdata.sess_token = response.sess_token;
                }
                localStorage.setItem('user_data', JSON.stringify(userdata));
                resolve(response);
            }
        })
    })
}

function fetchBalance(uuid, sess_token){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "post",
            url: base_url + 'wallet/local/getaccount',
            data: {uuid, sess_token},
            success: (response) => {
                
                // Update sess_token;
                let userdata = JSON.parse(localStorage.getItem('user_data'));
                if(response.sess_token){
                    userdata.sess_token = response.sess_token;
                }
                localStorage.setItem('user_data', JSON.stringify(userdata));
                resolve(response);
            }
        })
    })
    
}

function fetchNotifications(uuid, sess_token){
    return new Promise((resolve, reject) => {
        let result;
        $.ajax({
            type: "post",
            url: base_url + 'wallet/notifications',
            data: {uuid, sess_token},
            success: (response) => {
                result = response;

                // Update sess_token;
                let userdata = JSON.parse(localStorage.getItem('user_data'));
                if(response.sess_token){
                    userdata.sess_token = response.sess_token;
                }
                localStorage.setItem('user_data', JSON.stringify(userdata));
                
                resolve(result);
            }
        })
    })
}

function countNotifications(uuid, sess_token){
    return new Promise((resolve, reject) => {
        let result;
        $.ajax({
            type: "post",
            url: base_url + 'wallet/countnotifications',
            data: {uuid, sess_token},
            success: (response) => {
                result = response;
                // Update sess_token;
                let userdata = JSON.parse(localStorage.getItem('user_data'));
                if(response.sess_token){
                    userdata.sess_token = response.sess_token;
                }
                localStorage.setItem('user_data', JSON.stringify(userdata));
                resolve(result);
            }
        })
    })
}


function checkUpdates(version){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "post",
            data: {version},
            url: base_url + 'general/checkupdates',
            success: (response) => {
                resolve(response);
            }
        })
    })
}

function resetPassword(req){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "get",
            data: req,
            url: base_url + 'login/resetpassword',
            success: (response) => {
                resolve(response);
            }
        })
    })
}

function changePasswordReset(req){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "get",
            data: req,
            url: base_url + 'login/changepassword',
            success: (response) => {
                resolve(response);
            }
        })
    })
}

function getBankLists(uuid, sess_token){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "post",
            data: {uuid, sess_token},
            url: base_url + 'transfer/banks/all',
            success: (response) => {
                // Update sess_token;
                let userdata = JSON.parse(localStorage.getItem('user_data'));
                if(response.sess_token){
                    userdata.sess_token = response.sess_token;
                }
                localStorage.setItem('user_data', JSON.stringify(userdata));
                resolve(response);
            }
        })
    })
}

function getGHSBankLists(uuid, sess_token){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "post",
            data: {uuid, sess_token},
            url: base_url + 'transfer/international/banks',
            success: (response) => {
                // Update sess_token;
                let userdata = JSON.parse(localStorage.getItem('user_data'));
                if(response.sess_token){
                    userdata.sess_token = response.sess_token;
                }
                localStorage.setItem('user_data', JSON.stringify(userdata));
                resolve(response);
            }
        })
    })
}

function transferNGNMoney(req){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "post",
            data: req,
            url: base_url + 'transfer/banks/transfer',
            success: (response) => {
                // Update sess_token;
                let userdata = JSON.parse(localStorage.getItem('user_data'));
                if(response.sess_token){
                    userdata.sess_token = response.sess_token;
                }
                localStorage.setItem('user_data', JSON.stringify(userdata));
                resolve(response);
            }
        })
    })   
}

function transferGHSMoney(req){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "post",
            data: req,
            url: base_url + 'transfer/international/transferfunds',
            success: (response) => {
                // Update sess_token;
                let userdata = JSON.parse(localStorage.getItem('user_data'));
                if(response.sess_token){
                    userdata.sess_token = response.sess_token;
                }
                localStorage.setItem('user_data', JSON.stringify(userdata));
                resolve(response);
            }
        })
    })   
}

function transferMobileMoney(req){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "post",
            data: req,
            url: base_url + 'transfer/international/mobilemoney',
            success: (response) => {
                // Update sess_token;
                let userdata = JSON.parse(localStorage.getItem('user_data'));
                if(response.sess_token){
                    userdata.sess_token = response.sess_token;
                }
                localStorage.setItem('user_data', JSON.stringify(userdata));
                resolve(response);
            }
        })
    })   
}

function sendToWallet(req){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "post",
            data: req,
            url: base_url + 'wallet/debit',
            success: (response) => {
                // Update sess_token;
                let userdata = JSON.parse(localStorage.getItem('user_data'));
                if(response.sess_token){
                    userdata.sess_token = response.sess_token;
                }
                localStorage.setItem('user_data', JSON.stringify(userdata));
                resolve(response);
            }
        })
    }) 
}

function verifyBvn(req){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "post",
            data: req,
            url: base_url + 'wallet/verifybvn',
            success: (response) => {
                // Update sess_token;
                let userdata = JSON.parse(localStorage.getItem('user_data'));
                if(response.sess_token){
                    userdata.sess_token = response.sess_token;
                }
                localStorage.setItem('user_data', JSON.stringify(userdata));
                resolve(response);
            }
        })
    })   
}

function changePin(req){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "get",
            data: req,
            url: base_url + 'login/transactionpin',
            success: (response) => {
                // Update sess_token;
                let userdata = JSON.parse(localStorage.getItem('user_data'));
                if(response.sess_token){
                    userdata.sess_token = response.sess_token;
                }
                localStorage.setItem('user_data', JSON.stringify(userdata));
                resolve(response);
            }
        })
    })   
}

function changePassword(req){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "get",
            data: req,
            url: base_url + 'login/changepwd',
            success: (response) => {
                // Update sess_token;
                let userdata = JSON.parse(localStorage.getItem('user_data'));
                if(response.sess_token){
                    userdata.sess_token = response.sess_token;
                }

                localStorage.setItem('user_data', JSON.stringify(userdata));
                resolve(response);
            }
        })
    })   
}

function fetchTransactions(req){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "post",
            data: req,
            url: base_url + 'wallet/local/transactions',
            success: (response) => {
                // Update sess_token;
                let userdata = JSON.parse(localStorage.getItem('user_data'));
                if(response.sess_token){
                    userdata.sess_token = response.sess_token;
                }
                
                localStorage.setItem('user_data', JSON.stringify(userdata));
                resolve(response);
            }
        })
    })
}