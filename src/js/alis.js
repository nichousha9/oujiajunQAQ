(function () {
    require(['config'], function () {
        require(['alis', 'ku', 'lun', 'jq', 'fen'], function () {
            setCookie('gid', 0, 7);
            $('#alis_top').load('loginbar.html');
            $('#alis_logo').load('head.html', () => {
                $('#alis_logo').css('height', '90px');
                $('#head .inp_search .inp_btn').click(() => {
                    let num = $('#head .inp_search .inp_chaxun').val();
                    location.href = 'alis.html?' + num;
                });
                let data = decodeURI(location.search.slice(1));//把转义的url转回中文
                ajax({
                    type: 'get',
                    data: {
                        order: `SELECT *FROM shangpin WHERE names LIKE '%${data}%'`
                    },
                    url: '../api/names.php',
                    success: str => {
                        let arr = JSON.parse(str);
                        xuan(arr)
                    }
                })
            });
            $('#alis_nav').load('nav.html');
            $('#alis_guding').load('guding.html');
            $('#alis_footer').load('footer.html');
            carousel({
                ele: 'alis_lunbotu',
                iw: 927,
                ih: 360,
                imgdata: ['../lib/lunbo/img/lun1.jpg',
                    '../lib/lunbo/img/lun2.jpg',
                    '../lib/lunbo/img/lunbo1(3).jpg',
                    '../lib/lunbo/img/lunbo1(4).jpg'],
                time: 5,
            });
            $('#alis_lunbo .light').css({
                'text-align': 'right',
            });
            $('#alis_lunbo .light span').css({
                'width': '15px',
                'height': '15px'
            });
            function xuan(arr) {
                let html = arr.map(function (item) {
                    return `
                    <li data-id = "${item.cid}">
                        <img src="${item.imgs}" alt="">
                        <p>${item.names}</p>
                        <div class="jump_sp_dp">
                            <span>${item.dianjia}</span>
                            <i>已售${item.sales}件</i>
                        </div>
                        <div class="jump_sp_jg">
                            <span>￥${item.price}0</span>
                            <i>立即上架</i>
                        </div>
                    </li>`
                }).join('');
                $('#alis_jump #lou .jump_sp').html(html);
            }
            let ipage = 1;
            let sum = 10;
            function fen(ipage) {
                function xuan(arr) {
                    let html = arr.map(function (item) {
                        return `
                    <li data-id = "${item.cid}">
                        <img src="${item.imgs}" alt="">
                        <p>${item.names}</p>
                        <div class="jump_sp_dp">
                            <span>${item.dianjia}</span>
                            <i>已售${item.sales}件</i>
                        </div>
                        <div class="jump_sp_jg">
                            <span>￥${item.price}0</span>
                            <i>立即上架</i>
                        </div>
                    </li>`
                    }).join('');
                    $('#alis_jump #lou .jump_sp').html(html);
                }
                $.ajax({
                    type: 'get',
                    url: '../api/fen.php',
                    data: {
                        page: ipage,
                        sum: sum,
                    },
                    success: str => {
                        let arr = JSON.parse(str);
                        xuan(arr.data);
                    }
                })
            }
            fen();
            $("#page").paging({
                nowPage: ipage, // 当前页码
                pageNum: sum, // 总页码
                buttonNum: 6, //要展示的页码数量
                callback: function (num) { //回调函数
                }
            });
            $("#page").on('click', 'ul .xl-prevPage', function () {
                ipage -= 1;
                fen(ipage)
            });
            $("#page").on('click', 'ul .xl-nextPage', function () {
                ipage++;
                fen(ipage)
            })
            $("#page").on('click', 'ul li', function () {
                let num = $(this).html();
                let num2 = $(this).html();
                if (num2 == '上一页' || num2 == '下一页' || num2 == '...') {
                } else {
                    ipage = num;
                    fen(ipage)
                }
            });

            console.log(getCookie('gid'));
            $('#alis_jump .jump_sp').on('click', 'li', function () {
                let num = $(this).data().id.toString();
                let fid = getCookie('gid');
                // console.log(num);
                // console.log(fid);

                if (fid) {
                    console.log(1);
                    
                    let arr = fid.split('&');
                    let index = arr.indexOf(num)
                    if (index != -1) {
                        arr.splice(index, 1);
                    }
                    arr.push(num);
                    let html = arr.join('&');
                    setCookie('gid', html, 7)
                } else {
                    console.log('meiyou');
                    
                    setCookie('gid', num, 7)
                }
                window.open('xiangqing.html?data-id=' + num);
            });
            $('#alis_jump .jump_sp').on('mouseover', 'li', function () {
                $(this).addClass('gaoliang').siblings().removeClass('gaoliang')
            });
            $('#alis_jump .jump_sp').on('mouseout', 'li', function () {
                $(this).removeClass('gaoliang')
            })
        });
    });
})();