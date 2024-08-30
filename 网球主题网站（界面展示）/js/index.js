window.addEventListener('load', function () {
    var prev = document.querySelector('.prev');
    var next = document.querySelector('.next');
    var focus = document.querySelector('.focus');
    var focusWidth = focus.offsetWidth;
    focus.addEventListener('mouseenter', function () {
        prev.style.display = 'block';
        next.style.display = 'block';
        //停止播放轮播图
        clearInterval(timer);
        timer = null;
    })
    focus.addEventListener('mouseleave', function () {
        prev.style.display = 'none';
        next.style.display = 'none';
        //开始自动播放轮播图
        timer = setInterval(function () {
            //手动调用函数
            next.click();
        },2000);

    })
    //动态生成小圆圈，有几个小圆圈就生成几张图片
    var changepicture = focus.querySelector('.changepicture');
    var promonav = focus.querySelector('.promo-nav');
    //console.log(changepicture.children.length);
    for (var i = 0; i < changepicture.children.length;i++) {
        var li = document.createElement('li');
        // 记录当前小圆圈的索引号 通过自定义属性来做
        li.setAttribute('index',i);
        promonav.appendChild(li);
        //利用排他思想
        li.addEventListener('click', function () {
            for (var i = 0; i < promonav.children.length; i++) {
                promonav.children[i].className = '';
            }
            this.className = 'selected';
            // 点击小圆圈，移动图片
           // animate(obj,target,callback);
            // 得到我们自定义的索引
            var index = this.getAttribute('index');
            num = index;
            circle = index;
            // console.log(focusWidth);
            animate(changepicture, -index * focusWidth);
        })
      } 
    promonav.children[0].className = 'selected';
    //克隆第一张图片
    var firstpicture = changepicture.children[0].cloneNode(true);
    changepicture.appendChild(firstpicture);
      //右侧按钮无缝滚动
    var num = 0;
    //circle使得小圆圈与图片滚动同步
    var circle = 0;
    //节流阀，防止手动点击按钮图片滚动过快
    var flag = true;
    next.addEventListener('click', function () {
        if (flag) {
            flag = false;//关闭节流阀
            if (num == changepicture.children.length-1) {
                num = 0;
                changepicture.style.left = 0; 
            }
            num++;
            animate(changepicture, -num * focusWidth, function () {
                flag = true;//等待执行完animate函授后再开启节流阀
            });
            circle++;
            if (circle==promonav.children.length) {
                circle = 0;
            }
            for (var i = 0; i < promonav.children.length;i++) {
                promonav.children[i].className = '';
            }
           
            promonav.children[circle].className = 'selected';
        }
       
    });

    //左侧按钮无缝滚动
    prev.addEventListener('click', function () {
        if (flag) {
            flag = false;//关闭节流阀
            if (num==0) {
                num=changepicture.children.length-1;
                changepicture.style.left=-num * focusWidth+'px';
            }
            num--;
            animate(changepicture, -num * focusWidth, function () {
                flag = true;
            });
            circle--;
            if (circle<0) {
                circle = promonav.children.length-1;
            }
            // for (var i = 0; i < promonav.children.length;i++) {
            //     promonav.children[i].className = '';
            // }
           
            // promonav.children[circle].className = 'selected';
          circleChange();
        }
       
    });
    // 封装小圆圈滚动函数
    function circleChange() {
        for (var i = 0; i < promonav.children.length;i++) {
            promonav.children[i].className = '';
        }
       
        promonav.children[circle].className = 'selected';
    }
    //自动播放轮播图
    var timer = setInterval(function () {
        //手动调用函数
        next.click();
    },2000);
})