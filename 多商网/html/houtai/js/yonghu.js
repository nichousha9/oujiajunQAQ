(function () {
    $.ajax({
        type: 'post',
        url: 'api/yonghu.php',
        dataType: 'json',
        success: str => {
            // console.log(str);

            let html = str.map(function (item) {
                return `
            <tr data-id=${item.cid}>
                <td>
                    <input type="checkbox" class="num">
                </td>
                <td contenteditable="true">${item.cid}</td>
                <td contenteditable="true">${item.number}</td>
                <td contenteditable="true">${item.passw}</td>
                <td contenteditable="true">${item.num}</td>
                <td contenteditable="true">${item.email}</td>
                <td contenteditable="true">${item.times}</td>
            </tr> `;
            }).join('')
            $('.tbody').html(html);
            checkall();
            newArr();
        }
    });
    //全选
    let checkall = () => {
        $('.sum').click(function () {
            let yes = $('.sum').prop('checked');
            $('.num').prop('checked', yes)
        });
        $('.num').click(function () {
            let lgh = $('.tbody input').length;
            let ckd = $('.tbody input:checked').length;
            if (lgh == ckd) {
                $('.sum').prop('checked', true);
            } else {
                $('.sum').prop('checked', false);
            }
        });
    }

    //点击复选框
    let newArr = () => {
        $('.num').click(function () {
            if ($('.num').is(":checked") == true) {
                let arr = this.closest('tr').dataset.id;
                let arrt = this.closest('tr');
                $('#no').click(function () {
                    $(arrt).remove()
                    $.ajax({
                        type: 'post',
                        url: 'api/delete.php',
                        data: {
                            arr: arr,
                        },
                        success: str => {
                            console.log(str);
                        }
                    })
                })
            }
        });
    };
})();