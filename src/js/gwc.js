(function () {
    require(['config'], function () {
        require(['gwc', 'ku', 'jq'], function () {
            let names = getCookie('number');
            $('#gwc_top .top1_left span').html('HI,' + names);
            $('#gwc_top .top1_right').on('mouseover', 'li', function () {
                $(this).children('ul').css('height', 'auto');
            });
            $('#gwc_top .top1_right').on('mouseout', 'li', function () {
                $(this).children('ul').css('height', '0');
            });
            $.ajax({
                type: "GET",
                url: "../api/login.php",
                data: {
                    biao: "gouwuche",
                    num: '7',
                },
                success: str => {
                    let arr = JSON.parse(str);
                    let html = arr.map(function (item) {
                        return `
                             <li>
                                <h6>X</h6>
                                <dl>
                                    <dt>
                                        <img src="${item.imgs}" alt="">
                                    </dt>
                                    <dd>
                                        <p>${item.name}</p>
                                        <p>已选 ： ${item.color}</p>
                                        <h4>
                                            <i>数量 ：${item.quantity}件</i>
                                            <i>${item.total}</i>
                                        </h4>
                                    </dd>
                                </dl>
                            </li>
                        `
                    }).join('');
                    $('#gwc_top .top1_right li .gouwuche').append(html);
                    $('#gwc_top .top1 .top1_right li span').eq(1).html('购物车(' + arr.length + ')')
                }
            });
            $.ajax({
                type: "GET",
                url: "../api/login.php",
                data: {
                    biao: "gouwuche",
                    num: '7',
                },
                success: str => {
                    let arr = JSON.parse(str);
                    $('#gwc_top .top1_left span').attr('data-uid', arr[0].yid);
                    let html = arr.map(function (item) {
                        return `
                            <li data-id="${item.oid}" data-cid="${item.cid}">
                                <h2>
                                    <span>供应商 : </span><i>${item.dian}</i>
                                </h2>
                                <div class="fk_gn">
                                    <div class="gn_1">
                                        <input type="checkbox" name="" id="" class="fx">
                                        <img src="${item.imgs}" alt="">
                                        <p>${item.name}</p>
                                        <span>${item.kucun}</span>
                                    </div>
                                    <div class="gn_2">
                                        <span>${item.color}</span>
                                        <div class="gn_ge">
                                            <i>规格2</i>
                                            <input type="button" value="-" class="jian">
                                            <input type="text" class="shu" value="${item.quantity}">
                                            <input type="button" value="+" class="jia">
                                        </div>
                                    </div>
                                    <div class="gn_3">
                                        <p>${item.unit}</p>
                                        <i>原价：¥240.00</i>
                                    </div>
                                    <div class="gn_4">
                                        <span class="geshu">${item.quantity}</span>
                                    </div>
                                    <div class="gn_5">
                                  
                                        <h5 class="toty">${item.total}</h5>
                                    </div>
                                    <div class="gn_6">
                                        <img src="../img/dsImg_56.jpg" alt="" class="dle">
                                    </div>
                                </div>
                            </li> `}).join('');
                    $('#gwc_main .gwc_fk').html(html);
                }

            });
            let fid = getCookie('gid');
            let nums = fid.split('&');
            for (let i = 0; i < nums.length; i++) {
                $.ajax({
                    type: 'get',
                    url: '../api/login.php',
                    data: {
                        id: nums[i],
                        num: '5',
                    },
                    success: str => {
                        let arr = JSON.parse(str);
                        let html = arr.map(function (item) {
                            return `
                            <li>
                                <dl>
                                    <dt>
                                        <img src="${item.imgs}" alt="">
                                    </dt>
                                    <dd>
                                        <p>${item.names}</p>
                                        <i>￥${item.price}</i>
                                    </dd>
                                </dl>
                            </li>
                            `
                        }).join('');
                        $('#gwc_main .zhuji').append(html)
                    }
                });
            };
            function total(now, num) {//数量和小计的变化 now-点击的元素
                //数量的变化
                let kuncun = $(now).parent().parent().prev().children('span').html() * 1
                if (num < 1) {
                    num = 1;
                } else if (num > kuncun) {
                    num = kuncun;
                    //这里可以给个提示：您输入的值超过了库存量
                }
                $(now).parent().find('.shu').val(num);
                $(now).parent().parent().next().next().find('.geshu').html(num)
                

                //小计=数量*单价
                let price = $(now).parent().parent().next().children('p').html() * 1;//单价
                let all = (num * price).toFixed(2);//小计
                $(now).parent().parent().next().next().next().children('.toty').html(all);
                allNum();
            }
            //点击加
            $('.gwc_fk').on('click', '.jia', function () {
                let num = $(this).prev().val();
                num++;
                total($(this), num);
            });

            //点击减
            $('.gwc_fk').on('click', '.jian', function () {
                let num = $(this).next().val();
                num--;
                total($(this), num);
            });

            //手动输入
            $('.gwc_fk').on('input', '.shu', function () {
                let num = $(this).val();
                total($(this), num);
                
            });

            //删除当行 集合里面找集合
            $('.gwc_fk').on('click', '.dle', function () {
                // console.log($(this));
                let ok = confirm('您确定要删我吗？');
                if (ok) {
                    let uid = $(this).parent().parent().parent().data('cid');
                    $.ajax({
                        type: "GET",
                        url: "../api/login.php",
                        data: {
                            uid: uid,
                            num: '9',
                        },
                        success: str => {
                            console.log(str);
                        }
                    })
                    $(this).parent().parent().parent().remove()
                }
                allNum();
            });

            //复选框控制总量和总价
            function checkedArr() {
                let arr = [];//存放勾选复选框的下标
                $('.gwc_fk .fx').each(function (index, item) {
                    if ($(item).prop('checked')) {
                        //被勾选了
                        arr.push(index);
                    }
                });
                return arr;
            }
            function allNum() {
                let checkall = checkedArr();
                let num = 0;
                let total = 0;
                checkall.forEach(function (item, index) {
                    num += $('.gwc_fk .shu').eq(checkall[index]).val() * 1;
                    total += $('.gwc_fk .toty').eq(checkall[index]).text() * 1;
                });
                //总价总数量
                $('#gwc_main .gwc_jie .jie_right i').html(num);
                $('#gwc_main .jie_right em').html(total.toFixed(2));
                //控制全选按钮
                let len = $('.gwc_fk .fx').length;//复选框的个数
                let achecknum = $('.gwc_fk .fx:checked').length;
                if (len == achecknum) {
                    //已经全选
                    $('.gwc_jie .quanxuan').prop('checked', true);
                } else {
                    $('.gwc_jie .quanxuan').prop('checked', false);
                }

            }

            //复选
            $('.gwc_fk').on('click', '.fx', function () {
                allNum();
            });

            //全选功能
            $('.gwc_jie .quanxuan').click(function () {
                let isok = $('.gwc_jie .quanxuan').prop('checked');
                $('.gwc_fk .fx').prop('checked', isok);
                allNum();
            });

            //全删：删除被选中行
            $('.gwc_jie .shan').click(function () {
                let checkall = checkedArr().reverse();//返回被勾选的下标数组
                let ok = confirm('您确定要删除我们？');
                if (ok) {
                    checkall.forEach(function (item, index) {
                        let uid = $('#gwc_top .top1_left span').data('uid');
                        $.ajax({
                            type: "GET",
                            url: "../api/login.php",
                            data: {
                                uid: uid,
                                num: '10',
                            },
                            success: str => {
                            }
                        })
                        $('.gwc_fk li').eq(checkall[index]).remove();
                    });
                }
                allNum();
                if ($('#gwc_main .gwc_fk li').size() == 0) {
                    $('#gwc_main .gwc_jie').css('display', 'none');
                    $('#gwc_main .gwc_can').css('display', 'none');
                }
            });
        });
    })
})();