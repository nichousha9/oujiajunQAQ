(function () {
    require(['config'], function () {
        require(['login', 'ku', 'jq'], function () {
            //登录切换
            $('#home_footer').load('footer.html', () => {
                $('#home_footer #footer').css('background', ' url(../img/tuifooter2_01.jpg)')
                $('#home_footer .content').css({
                    'background': ' url(../img/tuifooter2_02.jpg)',
                    'padding-top': '0px',
                    'border-top': '1px solid rgb(219, 198, 198)',
                });
            });
            $('.login_main .login_top .mm').css('border-bottom', '2px solid red');
            let mima = true
            $('.login_main .login_top .mm').click(() => {
                $('.login_main .login_top .mm').css('border-bottom', '2px solid red');
                $('.login_main .login_top .sj').attr("style", "");
                $('.login_main .login_inp').show();
                $('.login_main .login_sj').hide();
                mima = true
                chaxun(mima)
            });
            $('.login_main .login_top .sj').click(() => {
                $('.login_main .login_top .sj').css('border-bottom', '2px solid red');
                $('.login_main .login_top .mm').attr("style", "");
                $('.login_main .login_inp').hide();
                $('.login_main .login_sj').show()
                mima = false
                chaxun(mima)
            });

            //查询Cookie
            chaxun(mima)
            function chaxun(mima) {
                if (mima == true) {
                    let num2 = getCookie('number');
                    let num3 = getCookie('passw');
                    if (num2 && num3) {
                        $('.login_right .login_inp_num').val(num2);
                        $('.login_right .login_inp_pic').val(num3);
                    }
                } else {
                    let num4 = getCookie('sjhm');
                    if (num4) {
                        $('.login_right .sjhm').val(num4);
                    }
                }
            }

            //手机号码
            let ok4 = false;
            $('.login_sj .sjhm').blur(function () {
                let arr = $('.login_sj .sjhm').val();
                if (arr) {
                    let reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
                    let num = reg.test(arr);
                    if (num == true) {
                        ok4 = true;
                    } else {
                        ok4 = false;
                    }
                } else {
                    ok4 = false;
                }
            });

            //验证码
            function suiji() {
                let arr = yanzheng(4)
                $('.login_right h5').html(arr).css({
                    'color': Color(16),
                    'background': Color(16)
                });
                return arr
            };
            let arr = ''
            arr = suiji().toLowerCase();
            let ok3 = false;
            $('.login_right h5').click(() => {
                arr = suiji().toLowerCase();
                $('.login_right .yzm').html('');
            });
            $('.login_right .yzm').blur(function () {
                let num = ''
                if (mima) {
                    num = $('.login_right .yzm').eq(0).val().toLowerCase();
                } else {
                    num = $('.login_right .yzm').eq(1).val().toLowerCase();
                }
                if (num) {
                    if (num == arr) {
                        ok3 = true;
                        console.log('验证成功');

                    } else {
                        ok3 = false;
                        console.log('验证码错误');
                    }
                } else {
                    ok3 = false;
                    console.log('验证码不能为空');

                }
            });

            //短信验证码
            let num = 10
            let timer = null;
            let shuzi = '';
            let ok5 = false;
            function ding() {
                num--;
                $('.login_sj .dxyzm_btn').val(num + '秒后重新获取验证码');
                if (num <= 0) {
                    clearInterval(timer);
                    $('.login_sj .dxyzm_btn').val('获取短信验证码');
                    $('.login_sj .dxyzm_btn').removeAttr("disabled");
                }
            }
            $('.login_sj .dxyzm_btn').click(() => {
                $.ajax({
                    type: "post",
                    data: {
                        userphone: $('.login_right .sjhm').val(),//换成你的号码即可
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
                $('.login_sj .dxyzm_btn').val(num + '秒后重新获取验证码');
                timer = setInterval(ding, 1000);
                $('.login_sj .dxyzm_btn').attr({ "disabled": "disabled" });
            });
            $('.login_sj .dxyzm').blur(function () {
                let num = $('.login_sj .dxyzm').val();
                if (num) {
                    if (num == shuzi) {
                        ok5 = true;
                    } else {
                        ok5 = false;
                    }
                } else {
                    ok5 = false;
                }
            });

            //记住账号密码
            let ok6 = true
            $('.login_footer .gouwo').prop('checked', true);
            let off = false
            $('.login_footer .gouwo').click(() => {
                if (off) {
                    ok6 = true;
                } else {
                    ok6 = false
                }
                off = !off
            });

            //登录判断
            $('.login_right .btn_dl').click(() => {
                if (mima == true) {
                    let ok1 = false;
                    let sum = '';
                    let arr = $('.login_right .login_inp_num').val();
                    if (arr) {
                        let reg = /^[a-zA-Z][a-zA-Z0-9_]{6,15}$/;
                        let num = reg.test(arr);
                        ok1 = true;
                        if (num == true) {
                            sum = 'number'
                        } else {
                            let reg1 = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
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
                    let passw = $('.login_right .login_inp_pic').val();
                    if (arr) {
                        let reg = /^[a-zA-Z]?\w{6,99}$/;
                        let num = reg.test(arr);
                        if (num == true) {
                            ok2 = true;
                        } else {
                            ok2 = false;
                        }
                    } else {
                        ok2 = false;
                    }
                    if (ok1 && ok2 && ok3 == true) {
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
                                        setCookie('number', arr, 7);
                                        setCookie('passw', passw, 7);
                                    } else {
                                        removeCookie('number');
                                        removeCookie('passw');
                                    }
                                    localStorage.setItem('number', arr);
                                    alert('成功');
                                    location.href = ('shouye.html');
                                } else {
                                    alert('失败')
                                }
                            }
                        })
                    } else {
                        alert('请重新确认信息')
                    }
                } else {
                    console.log(2);

                    if (ok3 && ok4 && ok5 == true) {
                        let num4 = $('.login_right .sjhm').val();
                        if (ok6 == true) {
                            setCookie('sjhm', num4, 7);
                        } else {
                            removeCookie('sjhm');
                        }
                        alert('成功');
                        location.href = ('shouye.html');
                    } else {
                        alert('失败');
                    }
                }
            });

            //第三方登录
            $('.login_right .weoxin i').click(() => {
                window.open("404.html");
            });

            //立即注册
            $('.login_right .login_footer span').eq(0).click(() => {
                location.href = 'enroll.html';
            })
            $('.login_right .login_footer span').eq(1).click(() => {
                window.open("404.html");
            })
        });
    })
})();