(function () {
    //渲染li
    $.ajax({
        type: "GET",
        //文件位置  
        url: "../api/1.json",
        dataType: "json",
        success: function (str) {
            let html = str.map(function (item) {
                return ` <li>${item.number}</li>`
            }).join('')
            $('.nav_list').append(html);
        }
    });

    //渲染dl
    $('.nav_list').on('mouseover', 'li', function () {
        $('.nav_menu').show();
        $(this).addClass('nav_gaoliang').siblings().removeClass('nav_gaoliang');
        let idx = $(this).index() - 1;
        $.ajax({
            type: "GET",
            url: "../api/1.json",
            dataType: "json",
            success: function (str) {
                let num5 = '';
                let html1 = '';
                for (let i = 0; i < str[idx].num2.length; i++) {
                    html1 += `</dl><dl class="nav_menu_dl"><dt><spen>${str[idx].num2[i]}</spen></dt>`
                    for (let j = 0; j < str[idx].num3[i].length; j++) {
                        html1 += `<dd>${str[idx].num3[i][j]}</dd>`
                    }
                    num5 = html1 
                };
                $('.nav_menu_sel').html(num5);
            }

        });

    })
    $('.nav_menu').mouseout(function () {
        $('.nav_menu').hide();
    })
    $('.nav').mouseout(function () {
        $('.nav_menu').hide();
    })
  
    $('.nav').mouseover(function () {
        $('.nav_menu').show();
    });
    $('.nav').on('click', 'dd', function () {
        $(this).addClass('nav_gaoliang2').siblings().removeClass('nav_gaoliang2');
        $(this).parent().siblings().children().removeClass('nav_gaoliang2');
    });
})();