       //缓动动画
       function animate(obj, target, callback) {
        clearInterval(obj.timer); //预防每点一次按钮移动速度加快
        obj.timer = setInterval(function () {
            var step = (target - obj.offsetLeft) / 10;
            step = step > 0 ? Math.ceil(step) : Math.floor(step);
            if (obj.offsetLeft == target) {
                clearInterval(obj.timer);
                // if (callback) {
                //     callback();
                // }
                callback && callback();
            }
            //把每次加1 这个步长值改为一个慢慢变小的值，步长公式：（目标值-现在的位置）/10
            obj.style.left = obj.offsetLeft + step + 'px';

        }, 15)
    }
   