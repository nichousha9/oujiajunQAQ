(function () {
   
            let num2 = localStorage.getItem('number');
            if (num2) {
                $.ajax({
                    type: 'get',
                    url: '../api/login.php',
                    data: {
                        num: '8',
                        yonghu: num2,
                    },
                    success: str => {
                        let arr = JSON.parse(str);
                        $('#loginbar .logintop .dl').attr('data-uid', arr[0].cid);
                    }
                })
                $('#loginbar .dl').html(num2 + "欢迎您回来!");
                $('#loginbar .zc').html('退出');
            }
            $('#loginbar .dl').click(() => {
                location.href = ('login.html');
                $('#loginbar .zc').html('退出')
            });

            if ($('#loginbar .dl').html() == '请登录') {
                $('#loginbar .zc').click(() => {
                    location.href = ('enroll.html');
                });
            } else {
                $('#loginbar .zc').click(() => {
                    location.href = ('shouye.html');
                    localStorage.removeItem('number')
                    $('#loginbar .zc').html('注册');
                    $('#loginbar .dl').html('请登录');
                });
    }
            $('#loginbar .gwc').click(() => {
                if ($('#loginbar .dl').html() == '请登录' || $('#loginbar .dl').html() == '注册') {
                    alert('请先登录账号')
                } else {
                    location.href = ('gwc.html');
                }
            })
})();