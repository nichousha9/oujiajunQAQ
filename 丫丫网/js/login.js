(function () {
    require(['config'], function () {
        require(['login', 'ku', 'jq'], function () {
            //登录切换
            $('#log_footer').load('footer.html');
            let mima = true
            $('.login-tab').on('click', 'li', function () {
                $(this).addClass('login-on').siblings().removeClass('login-on');
                $('.login-body .login-style').eq($(this).index()).css('display', 'block').siblings().css('display', 'none');
                if ($(this).html() == '普通登录') {
                    mima = true;
                } else {
                    mima = false
                }
                chaxun(mima)
            });
            //查询Cookie
            chaxun(mima)
            function chaxun(mima) { 
                if (mima == true) {
                    let num2 = getCookie('number');
                    let num3 = getCookie('passw');
                    if (num2 && num3) {
                        $('.login-style #txtUser').val(num2);
                        $('.login-style #Userpwd').val(num3);
                    }
                } else {
                    let num4 = getCookie('sjhm');
                    // if (num4) {
                    //     $('#phone').val(num4);
                    //     ok3 = true;
                    // }
                }
            }

            // //手机号码
            let ok4 = false;
            $('#phone').blur(function () {
                let arr = $('#phone').val();
                if (arr) {
                    let reg = /^1[3-9]\d{9}$/;
                    let num = reg.test(arr);
                    if (num == true) {
                        ok4 = true;
                    } else {
                        ok4 = false;
                    }
                } else {
                    ok4 = false;
                }
                console.log(ok4);
                
            });

            //验证码
            function suiji() {
                let arr = yanzheng(4)
                $('.login-style h5').html(arr).css({
                    'color': Color(16),
                    'background': Color(16)
                });
                return arr
            };
            let arr = ''
            arr = suiji().toLowerCase();
            let ok3 = true;
            $('.login-style h5').click(() => {
                arr = suiji().toLowerCase();
                $('.login-style #txtCode2').html('');
            });
            $('.login-style #txtCode2').blur(function () {
                let num = $('.login-style #txtCode2').val().toLowerCase();
                if (num) {
                    if (num == arr) {
                        ok3 = true;
                    } else {
                        ok3 = false;
                    }
                } else {
                    ok3 = false;
                }
                console.log(ok3);
            });

            // //短信验证码
            let num = 10
            let timer = null;
            let shuzi = '';
            let ok5 = false;
            function ding() {
                num--;
                $('.btn_mfyzm').val(num + '秒后重新获取');
                if (num <= 0) {
                    clearInterval(timer);
                    $('.btn_mfyzm').val('获取短信验证码');
                    $('.btn_mfyzm').removeAttr("disabled");
                }
            }
            $('.btn_mfyzm').click(() => {
                $.ajax({
                    type: "post",
                    data: {
                        userphone: $('#phone').val(),//换成你的号码即可
                    },
                    url: "../api/duanxin.php",
                    async: true,
                    success: function (str) {
                        let arr = JSON.parse(str)
                        shuzi = arr.phonecode;
                        console.log(shuzi);
                    }
                });
                clearInterval(timer);
                num = 10
                $('.btn_mfyzm').val(num + '秒后重新获取');
                timer = setInterval(ding, 1000);
                $('.btn_mfyzm').attr({ "disabled": "disabled" });
            });
            $('#dynamicPWD').blur(function () {
                let num = $('#dynamicPWD').val();
                if (num) {
                    if (num == shuzi) {
                        ok5 = true;
                    } else {
                        ok5 = false;
                    }
                } else {
                    ok5 = false;
                }
                console.log(ok5);
                
            });

            //记住账号密码
            let ok6 = true
            $('.login-style #issave').prop('checked', true);
            let off = false
            $('.login-style #issave').click(() => {
                if (off) {
                    ok6 = true;
                } else {
                    ok6 = false
                }
                off = !off
            });

            let ok7 = true
            $('.login-style #issave1').prop('checked', true);
            let off1 = false
            $('.login-style #issave1').click(() => {
                if (off1) {
                    ok7 = true;
                } else {
                    ok7 = false
                }
                off1 = !off1
               
            });

            // //登录判断
            $('.login-style #logbtn').click(() => {
                let ok1 = false;
                let sum = '';
                let arr = $('.login-style #txtUser').val();
                if (arr) {
                        let reg = /^[a-zA-Z][a-zA-Z0-9_]{6,15}$/;
                        let num = reg.test(arr);
                        ok1 = true;
                        if (num == true) {
                            sum = 'number'
                        } else {
                            let reg1 = /^1[3-9]\d{9}$/;
                            let num1 = reg1.test(arr);
                            ok1 = true;
                            if (num1 == true) {
                                sum = 'num'
                            } else {
                                alert('格式错误')
                                sum = '0'
                                ok1 = false;
                            }
                        }
                } else {
                    alert('账号不能为空')
                }
                let ok2 = false;
                let passw = $('.login-style #Userpwd').val();
                if (passw) {
                        let reg = /^[a-zA-Z]?\w{6,99}$/;
                        let num = reg.test(passw);
                        if (num == true) {
                            ok2 = true;
                        } else {
                            ok2 = false;
                        }
                } else {
                    ok2 = false;
                }
                if (ok1 && ok2== true) {
                        $.ajax({
                            type: 'post',
                            url: '../api/login.php',
                            data: {
                                name: arr,
                                passw: passw,
                                num: '3',
                                sum: sum
                            },
                            success: str => {
                                if (str == 'yes') {
                                    if (ok6 == true) {
                                        let sum = 'number'
                                        $.ajax({
                                            type: 'post',
                                            url: '../api/login.php',
                                            data: {
                                                names: arr,
                                                num: '1',
                                                sum: sum
                                            },
                                            dataType: "json",
                                            success: str => {
                                                setCookie('number', str[0].number, 7);
                                                setCookie('passw', str[0].passw, 7);
                                                setCookie('sjhm', str[0].num, 7);
                                             }
                                        })
                                    } else {
                                        setCookie('sjhm', '', 7);
                                        setCookie('number', '', 7);
                                        setCookie('passw', '', 7);
                                    }
                                    location.href = ('shouye.html?1');
                                } else {
                                    alert('登录失败')
                                }
                            }
                        })
                } else {
                    alert('请重新确认信息')
                }
            })
            $('#dynamicLogon').click(function () {
                if (ok3 && ok4 && ok5 == true) {
                    let num4 = $('#phone').val();
                    if (ok7 == true) {
                        let sum = 'num'
                        $.ajax({
                            type: 'post',
                            url: '../api/login.php',
                            data: {
                                names: num4,
                                num: '1',
                                sum: sum
                            },
                            dataType: "json",
                            success: str => {
                                setCookie('number', str[0].number, 7);
                                setCookie('passw', str[0].passw, 7);
                                setCookie('sjhm', str[0].num, 7);
                            }
                        })
                    } else {
                        setCookie('sjhm', '', 7);
                        setCookie('number', '', 7);
                        setCookie('passw', '', 7);
                    }
                    location.href = ('shouye.html?2');
                } else {
                    alert('登录失败')
                    
                }
            })


            //立即注册
            $('.login .zc').click(() => {
                location.href = 'enroll.html';
            })
            $('.login-body .psword a').click(() => {
                window.open("404.html");
            })
        });
    })
})();

