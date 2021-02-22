// Dom7
var $$ = Dom7;

// Theme
var theme = 'auto';
if (document.location.search.indexOf('theme=') >= 0) {
    theme = document.location.search.split('theme=')[1].split('&')[0];
}

// Init App
var app = new Framework7({
    id: 'com.app.sayvers',
    root: '#app',
    theme: 'md',
    data: function () {
        return {
            user: {
                firstName: 'John',
                lastName: 'Doe',
            },
        };
    },
    methods: {
        helloWorld: function () {
            app.dialog.alert('Hello World!');
        },
    },
    routes: routes,
    popup: {
        closeOnEscape: true,
    },
    sheet: {
        closeOnEscape: true,
    },
    popover: {
        closeOnEscape: true,
    },
    actions: {
        closeOnEscape: true,
    },

    smartSelect: {
        pageTitle: 'Select Option',
        openIn: 'popup',
    }

});

let user_data_var = JSON.parse(localStorage.getItem('user_data'));
if(user_data_var != null){
    app.views.main.router.navigate('/homepage/');
}else{
    $('.loader-screen').show();
}

setTimeout(function () {
    $('.loader-screen').hide();
}, 2000);

// check for updates
// checkUpdates(appVersion).then(res => {
//     if(res.status){
//         app.dialog.alert(res.message, 'Update Required!', () => {
//             // open google playstore
//             window.open('https://skycombabs.com/assets/skycombabs.apk', '_system');
//         })
//     }
// })


$('#logout').click(function(e){
    localStorage.clear();
    app.views.main.router.navigate('/signin/');
})

//$('.introduction').css('min-height', 'calc(100vh - 58px)' )

$$(document).on('page:init', function (e) {
    /* background image to cover */
    $('.background').each(function () {
        var imagewrap = $(this);
        var imagecurrent = $(this).find('img').attr('src');
        if (imagecurrent != undefined || imagecurrent != null) {
            imagewrap.css('background-image', 'url("' + imagecurrent + '")');
            $(this).find('img').remove();
        }

    });


    $('.page-content').on('scroll', function () {
        /* header active on scroll more than 50 px*/
        if ($(this).scrollTop() >= 30) {
            $('.navbar').addClass('active');
        } else {
            $('.navbar').removeClass('active')
        }
    });


});

$$(document).on('page:init', '.page[data-name="thankyou"]', function (e) {
    setTimeout(function() {
        app.views.main.router.navigate('/homepage/');
    }, 2000)

});

$$(document).on('page:init', '.page[data-name="signin"]', function(e){
    $(document).off("click", "#loginButton").on("click", "#loginButton", function(e) {
        e.preventDefault();
        var email = $("#loginEmail").val();
        var password = $("#loginPassword").val();
        let req = {email, password}
        if( email && password ) 
        {
            login(req);
        }else
        {
            app.dialog.alert("Please enter your username and password", "Login Errors");
        }
    });
})

$$(document).on('page:init', '.page[data-name="resetpassword"]', function(e){
    $(document).off("click", "#resetPassword").on("click", "#resetPassword", function(e) {
        var email = $("#emailAddress").val();
        let req = {email}
        if(email)
        {
            app.preloader.show();
            promiseTimeout(30000, resetPassword(req))
                .then(res => {
                    if(res.status){
                        app.preloader.hide();
                        app.dialog.alert(res.message, "Success!", () => {
                            app.views.main.router.navigate('/resetpassword/')
                        });
                    }
                }).catch(err => {
                    app.preloader.hide();
                    app.dialog.alert(err, "Timed Out");
                });
        }else
        {
            app.dialog.alert("Please enter your registered email address", "Oops!");
        }
    });
})

$$(document).on('page:init', '.page[data-name="resetpwd"]', function(e){
    $(document).off("click", "#resetPasswordBtn").on("click", "#resetPasswordBtn", function(e) {
        var password = $("#password2").val();
        var confirmPwd = $("#confirmPassword2").val();
        var resetcode = $("#resetcode").val();
        var email = $("#email2").val();

        let req = {password, confirmPwd, resetcode, email}
        if(password && confirmPwd && resetcode && email)
        {
            app.preloader.show();
            promiseTimeout(30000, changePasswordReset(req))
                .then(res => {
                    if(res.status){
                        app.preloader.hide();
                        app.dialog.alert(res.message, "Success!", () => {
                            app.views.main.router.navigate('/signin/')
                        });
                    }else{
                        app.preloader.hide();
                        app.dialog.alert(res.message, "Oops!");
                    }
                }).catch(err => {
                    app.preloader.hide();
                    app.dialog.alert(err, "Timed Out");
                });
        }else
        {
            app.dialog.alert("All fields are required", "Oops!");
        }
    });
})

$$(document).on('page:init', '.page[data-name="notifications"]', function (e) {
    app.preloader.show('multi');
    let userData = JSON.parse(localStorage.getItem('user_data'));
    fetchNotifications(userData.uuid, userData.sess_token)
        .then(res => {
            let item = '';
            if(res.status){
                let notifications = res.data;
                if(notifications.length >= 1){
                    for(let i = 0; i < notifications.length; i++){
                        item += `<li style="border-bottom: 1px solid #000">
                                        <a class="item-content">
                                            <div class="item-inner">
                                                <div class="row">
                                                    <div class="col pl-0">
                                                        <div class="item-title-row">
                                                            <div class="item-title">${notifications[i].title}</div>
                                                            <div class="item-after">${notifications[i].created_at}</div>
                                                        </div>
                                                        <div class="item-text">${notifications[i].message}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </li>`;
                    }
                }else{
                    item += `<li>
                                <div class="row mx-0 width-100 align-items-center">
                                    <div class="col-auto px-0">
                                        <div class="avatar avatar-50 no-shadow border-0">
                                        </div>
                                    </div>
                                    <div class="col align-self-center pr-0">
                                        <h6 class="font-weight-normal mb-1 mt-0">No notifications found</h6>
                                    </div>
                                    <div class="col text-align-right align-self-center">
                                        <!-- <h6 class="text-color-red mt-0">-$154.0</h6> -->
                                    </div>
                                </div>
                            </li>`
                }

            }else{
                if(res.message === 'Unauthorized access'){
                    localStorage.clear();
                    app.dialog.alert('Session timeout, please login again', 'Session timeout', () => {
                        app.views.main.router.navigate('/signin/');
                    })
                }

                item += `<li>
                            <div class="row mx-0 width-100 align-items-center">
                                <div class="col-auto px-0">
                                    <div class="avatar avatar-50 no-shadow border-0">
                                    </div>
                                </div>
                                <div class="col align-self-center pr-0">
                                    <h6 class="font-weight-normal mb-1 mt-0">No notifications found</h6>
                                </div>
                                <div class="col text-align-right align-self-center">
                                    <!-- <h6 class="text-color-red mt-0">-$154.0</h6> -->
                                </div>
                            </div>
                        </li>`
               
                
            }
            $('#notificationLists').html(item);
            app.preloader.hide();
        })
});

$$(document).on('page:init', '.page[data-name="changepassword"]', function(e){
    $(document).off("click", "#changePassword").on("click", "#changePassword", function(e) {
        let userData = JSON.parse(localStorage.getItem('user_data'));
        
        var password = $("#password22").val();
        var newPassword = $("#newpassword22").val();
        var confirmPwd = $("#confirmpassword22").val();

        let req = {uuid: userData.uuid, sess_token:userData.sess_token, password, newPassword, confirmPwd}
        if(password && newPassword && confirmPwd)
        {
            app.preloader.show();
            promiseTimeout(30000, changePassword(req))
                .then(res => {
                    if(res.status){
                        app.preloader.hide();
                        app.dialog.alert(res.message, "Password Changed", () => {
                            localStorage.clear();
                        app.views.main.router.navigate('/signin/');
                        });
                    }else{
                        if(res.message === 'Unauthorized access'){
                            localStorage.clear();
                            app.dialog.alert('Session timeout, please login again', 'Session timeout', () => {
                                app.views.main.router.navigate('/signin/');
                            })
                        }
                        app.preloader.hide();
                        app.dialog.alert(res.message, "Password Changed")
                    }
                }).catch(err => {
                    app.preloader.hide();
                    app.dialog.alert(err, "Timed Out");
                });
        }else
        {
            app.dialog.alert("Please enter your username and password", "Login Errors");
        }
    });
})

$$(document).on('page:init', '.page[data-name="signup"]', function(e){
    $(document).off("click", "#registerBtn").on("click", "#registerBtn", function(e) {
        let email = $("#reg_email").val();
        let password = $("#reg_password").val();
        let confirmpwd = $("#reg_confirmpwd").val();
        let firstname = $("#reg_firstname").val();
        let lastname = $("#reg_lastname").val();
        let phone = $("#reg_phone").val();
        let terms = $("#terms").val();
        let errMsg = "";
        let req = {email, password, confirmpwd, firstname, lastname, phone};
        if( email && password && confirmpwd && firstname && lastname && phone && terms ) 
        {
            if(confirmpwd === password){
                register(req);
            }else{
                errMsg = 'Passwords do not match';
            }
        }else
        {
            errMsg = 'All fields are required';
        }

        if(errMsg != ""){
            app.dialog.alert(errMsg, "Registration Errors");
        }
    });
});

$$(document).on('page:init', '.page[data-name="transactionpin"]', function (e) {
    $(".item-pin input").keyup(function() {
        if($(this).val().length == 1) {
            var input_flds = $(this).closest('form').find(':input');
            input_flds.eq(input_flds.index(this) + 1).focus();
        }
    });

    $('#changePin').click(function(e){
        let userData = JSON.parse(localStorage.getItem('user_data'));
        let pin1 = $('#pin1').val();
        let pin2 = $('#pin2').val()
        let pin3 = $('#pin3').val() 
        let pin4 = $('#pin4').val();
        let password = $('#password').val()
        let pin = pin1 + pin2 + pin3 + pin4;
        app.preloader.show();
        let req = {uuid: userData.uuid, sess_token: userData.sess_token, pin, password};
        if(pin1 && pin2 && pin3 && pin4 && password){
            changePin(req).then(res => {
                if(res.status){
                    app.preloader.hide();
                    app.dialog.alert(res.message, 'Operation Successful', () => {
                        app.views.main.router.navigate('/homepage/');
                    })
                }else{
                    app.preloader.hide();
                    app.dialog.alert(res.message, 'Operation Failed');
                    if(res.message === 'Unauthorized access'){
                        localStorage.clear();
                        app.dialog.alert('Session timeout, please login again', 'Session timeout', () => {
                            app.views.main.router.navigate('/signin/');
                        })
                    }
                }
            })

        }else{
            app.preloader.hide();

            app.dialog.alert('All fields are required to set your transaction pin')
        }
    })
})

$$(document).on('page:init', '.page[data-name="homepage"]', function (e) {

    /* chart js */
    var ctx = document.getElementById("linechart").getContext('2d');

    var gradient2 = ctx.createLinearGradient(0, 0, 0, 200);
    gradient2.addColorStop(0, 'rgba(151, 94, 251, 0.40)');
    gradient2.addColorStop(1, 'rgba(91, 168, 255, 0.40)');

    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
            datasets: [{
                label: ' Used MB',
                backgroundColor: gradient2,
                data: [65, 70, 60, 90, 75, 100, 130, 120, 150],
                borderColor: "rgba(151, 94, 251, 0.40)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderWidth: 2,
                borderDashOffset: 1,
                borderJoinStyle: 'bevel',
                pointBorderColor: "#ffffff",
                pointBackgroundColor: "#7b65f4",
                pointBorderWidth: 1,
                pointHoverRadius: 2,
                pointHoverBackgroundColor: "#000000",
                pointHoverBorderColor: "#ffffff",
                pointHoverBorderWidth: 0,
                pointRadius: 2,
                pointHitRadius: 6,
                    }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: false,
                text: 'Chart.js  Line Chart',
            },
            legend: {
                display: false,
                labels: {
                    fontColor: "#888888"
                }
            },
            scales: {
                yAxes: [{
                    display: false,
                    ticks: {
                        fontColor: "#888888",
                        beginAtZero: true,
                    },
                    gridLines: {
                        color: "rgba(160,160,160,0.1",
                        zeroLineColor: "rgba(160,160,160,0.15)"
                    }
                        }],
                xAxes: [{
                    display: false,
                    ticks: {
                        fontColor: "#888888"
                    },
                    gridLines: {
                        color: "rgba(160,160,160,0.1)",
                        zeroLineColor: "rgba(160,160,160,0.15)"
                    }
                        }]
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            }
        }
    });




});
