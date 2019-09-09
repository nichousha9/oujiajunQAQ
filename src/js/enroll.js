(function () {
    require(['config'], function () {
        require(['enroll', 'ku', 'jq'], function () {
            $('#enroll_right').load('guding.html');
            //尾部结构插入
            $('#home_footer').load('footer.html');


            //首页跳转
            $('.enroll_left .enroll_sy').click(() => {
                window.open('shouye.html')
            })

            //登录页跳转
            $('.enroll_left .enroll_dl').click(() => {
                location.href = 'login.html';
            })

            //注册页跳转
            $('.enroll_left .enroll_zc').click(() => {
                // window.open('enroll.html')
                location.href = 'enroll.html';
            })

            //用户名
            let ok1 = false
            $('.name_text').blur(function () {
                let name = $('.name_text').val();
                if (name) {
                    let reg = /^[a-zA-Z]\w\d{5,15}$/;
                    let num = reg.test(name);
                    if (num == true) {
                        $(this).next().html('用户名通过').css('color', '#58bc58');
                        ok1 = true;
                    } else {
                        $(this).next().html('必须是英文字母开头').css('color', 'red');
                        ok1 = false;
                    }
                } else {
                    $(this).next().html('用户名不能为空').css('color', 'red');
                    ok1 = false;
                }
            });

            //手机号码
            let ok = false;
            $('.phone_text').blur(function () {
                let arr = $('.phone_text').val();
                if (arr) {
                    let reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
                    let num = reg.test(arr);
                    if (num == true) {
                        $.ajax({
                            type: 'post',
                            url: '../api/login.php',
                            data: {
                                phone: arr,
                                num: '4'
                            },
                            success: str => {
                                if (str == 'yes') {
                                    $(this).next().html('验证通过').css('color', '#58bc58');
                                    ok = true;
                                    $('.dxyzm').show()
                                } else {
                                    $(this).next().html('手机号码已被注册').css('color', 'red');
                                    ok = false;
                                }
                            }
                        })
                    } else {
                        $(this).next().html('请输入正确的号码格式').css('color', 'red');
                        ok = false;
                    }
                } else {
                    $(this).next().html('号码不能为空').css('color', 'red');
                    ok = false;
                }
            });

            //密码验证
            let ok2 = false;
            $('.passw_text').blur(function () {
                let arr = $('.passw_text').val();
                if (arr) {
                    let reg = /^[a-zA-Z]?\w{6,99}$/;
                    let num = reg.test(arr);
                    if (num == true) {
                        $(this).next().next().html('密码通过').css('color', '#58bc58');
                        ok2 = true;
                    } else {
                        $(this).next().next().html('请输入六位以上的密码').css('color', 'red');
                        ok2 = false;
                    }
                } else {
                    $(this).next().next().html('密码不能为空').css('color', 'red');
                    ok2 = false;
                }
            });

            //密码显示
            let isok = true
            $('.passw i').click(() => {
                if (isok) {
                    $('.passw input').attr('type', 'text');
                } else {
                    $('.passw input').attr('type', 'password');
                }
                isok = !isok
            });

            //验证码
            function suiji() {
                let arr = yanzheng(4)
                $('.yzm_sjs').html(arr).css({
                    'color': Color(16),
                    'background': Color(16)
                });
                return arr
            };
            let arr = ''
            arr = suiji().toLowerCase();
            let ok3 = false;
            $('.yzm_sjs').next().click(() => {
                arr = suiji().toLowerCase();
                $('.yzm_text').html('');
                $('.yzm_sjs').next().next().html('');
            });
            $('.yzm_text').blur(function () {
                let num = $('.yzm_text').val().toLowerCase();
                if (num) {
                    if (num == arr) {
                        $(this).next().next().next().html('验证通过').css('color', '#58bc58');
                        ok3 = true;
                    } else {
                        $(this).next().next().next().html('请重新输入验证码').css('color', 'red');
                        ok3 = false;
                    }
                } else {
                    $(this).next().next().next().html('验证码不能为空').css('color', 'red');
                    ok3 = false;
                }
            });

            //协议复选
            let ok4 = true;
            $('.yd input').prop('checked', true);
            let no = true;
            $('.yd input').click(() => {
                if (no) {
                    $('.yd input').next().next().html('请选择').css('color', 'red');
                    ok4 = false;
                } else {
                    $('.yd input').next().next().html('信息通过').css('color', '#58bc58');
                    ok4 = true;
                }
                no = !no
            });

            //手机验证码
            let num = 10
            let timer = null;
            let shuzi = '';
            let ok5 = false;
            function ding() {
                num--;
                $('.dxyzm_btn').val(num + '秒后重新获取验证码');
                if (num <= 0) {
                    clearInterval(timer);
                    $('.dxyzm_btn').val('获取短信验证码');
                    $('.dxyzm_btn').removeAttr("disabled");
                }
            }
            $('.dxyzm_btn').click(() => {
                $.ajax({
                    type: "post",
                    data: {
                        userphone: $('.phone_text').val(),//换成你的号码即可
                    },
                    url: "../api/duanxin.php",
                    async: true,
                    success: function (str) {
                        let arr = JSON.parse(str)
                        shuzi = arr.phonecode;
                    }
                });
                clearInterval(timer);
                num = 10
                $('.dxyzm_btn').val(num + '秒后重新获取验证码');
                timer = setInterval(ding, 1000);
                $('.dxyzm_btn').attr({ "disabled": "disabled" });
            });
            $('.dxyzm_text').blur(function () {
                let num = $('.dxyzm_text').val();
                if (num) {
                    if (num == shuzi) {
                        $('.dxyzm_text').next().next().html('验证通过').css('color', '#58bc58');
                        ok5 = true;
                    } else {
                        $('.dxyzm_text').next().next().html('验证码不通过').css('color', 'red');
                        ok5 = false;
                    }
                } else {
                    $('.dxyzm_text').next().next().html('验证码不能为空').css('color', 'red');
                    ok5 = false;
                }
            });

            //注册
            $('.zc input').click(() => {
                if (ok && ok1 && ok2 && ok3 && ok4 && ok5 == true) {
                    $.ajax({
                        type: 'post',
                        url: '../api/login.php',
                        data: {
                            phone: $('.phone_text').val(),
                            passw: $('.passw_text').val(),
                            name: $('.name_text').val(),
                            num: '2',
                        },
                        success: str => {
                            if (str == 'yes') {
                                $('.zc input').next().html('注册成功');
                                location.href = 'login.html';
                            } else {
                                $('.zc input').next().html('注册失败');
                            }
                        }
                    })
                } else
                    $('.zc input').next().html('信息有误')
            });
        });
    });
})();