(function () {
    $('#login .dl').click(function () {
        let num = $('#login .zh').val();
        let passw = $('#login .mm').val();
        $.ajax({
            type: 'post',
            url: 'api/login.php',
            data: {
                name: num,
                passw: passw
            },
            success: str => {
                console.log(str);
                
                if (str == 'yes') {
                    location.href = 'houtai.html';  
                } else {
                    alert('登录失败')
                }   
            }
        })
    })
})();