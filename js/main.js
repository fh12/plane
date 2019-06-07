    //获得主界面
    var mainDiv = document.getElementById("maindiv");
    //获得开始界面
    var startdiv = document.getElementById("startdiv");
    //获得游戏中分数显示界面
    var scorediv = document.getElementById("scorediv");
    //获得分数界面
    var scorelabel = document.getElementById("score");
    //获得历史最高分界面
    var highscorelabel = document.getElementById("highscore");
    //获得暂停界面
    var suspenddiv = document.getElementById("suspenddiv");
    //获得游戏结束界面
    var enddiv = document.getElementById("enddiv");
    //获得游戏结束后分数统计界面
    var planscore = document.getElementById("planscore");
    //初始化分数
    var scores = 0;
    // 我军飞机生命值
    var life = document.getElementById("life");
    // 我军发射子弹频率
    var bulletFrequency = 7
    var bodyWidth = document.documentElement.clientWidth
    var bodyheight = document.documentElement.clientHeight
    var highscore = window.localStorage.getItem('highScore')
    if(highscore){
      highscorelabel.innerHTML = highscore  
    }
    
    /*
     创建飞机类
     */
    function plan(hp, X, Y, sizeX, sizeY, score, dietime, sudu, boomimage, imgClass, soundSrc, trailName, hasfire) {
        this.planX = X;
        this.planY = Y;
        this.imagenode = null;
        this.boomSound = null;
        this.planehp = hp;
        this.planscore = score;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.planboomimage = boomimage;
        this.planisdie = false;
        this.plandietimes = 0;
        this.plandietime = dietime;
        this.plansudu = sudu;
        this.soundSrc = soundSrc;
        this.trailName = trailName;
        this.hasfire = hasfire;
        //行为
        /*
        移动行为
             */
        this.planmove = function () {
            if (scores <= 2500) {
                this.imagenode.style.top = this.imagenode.offsetTop + this.plansudu + "px";
            } else if (scores > 2500 && scores <= 4000) {
                this.imagenode.style.top = this.imagenode.offsetTop + this.plansudu + 1 + "px";
            } else if (scores > 4000 && scores <= 6000) {
                this.imagenode.style.top = this.imagenode.offsetTop + this.plansudu + 2 + "px";
            } else if (scores > 6000 && scores <= 8000) {
                this.imagenode.style.top = this.imagenode.offsetTop + this.plansudu + 3 + "px";
            } else if (scores > 8000 && scores <= 10000) {
                this.imagenode.style.top = this.imagenode.offsetTop + this.plansudu + 4 + "px";
            } else {
                this.imagenode.style.top = this.imagenode.offsetTop + this.plansudu + 5 + "px";
            }

            if (this.trailName == 'curve') {
                this.imagenode.style.left = 10 * Math.sqrt(this.imagenode.offsetTop) + "px";
            }
        }
        this.init = function () {
            this.imagenode = document.createElement("div");
            this.boomimage = document.createElement("img");
            this.boomSound = document.createElement("audio");
            this.hpbar = document.createElement('span');
            this.hpbar.className = 'hpbar';
            this.hpbar.style.width = (this.planehp * 8) + 'px';
            this.boomimage.src = this.planboomimage;
            this.boomSound.autoplay = '';
            this.boomSound.src = soundSrc;
            this.boomimage.style.width = sizeX + 'px';
            this.boomimage.style.height = sizeY + 'px';
            this.boomimage.style.display = 'none';
            this.imagenode.style.width = sizeX + 'px';
            this.imagenode.style.height = sizeY + 'px';
            this.imagenode.style.left = this.planX + "px";
            this.imagenode.style.top = this.planY + "px";
            this.imagenode.className = imgClass;
            this.imagenode.appendChild(this.boomimage)
            this.imagenode.appendChild(this.boomSound)
            this.imagenode.appendChild(this.hpbar)
            mainDiv.appendChild(this.imagenode);
        }
        this.init();
    }

    /*
    创建子弹类
     */
    function bullet(X, Y, sizeX, sizeY, imgClass, bulletattck, soundSrc, type) {
        this.bulletX = X;
        this.bulletY = Y;
        this.imagenode = null;
        this.bulletSound = null;
        this.bulletattck = bulletattck;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.soundSrc = soundSrc;
        this.type = type;
        /*
         移动行为
         */
        this.bulletmove = function () {
            if (type === 'friend') {
                this.imagenode.style.top = this.imagenode.offsetTop - 20 + "px";
            }
            if (type === 'enemy') {
                this.imagenode.style.top = this.imagenode.offsetTop + 5 + "px";
            }

        }
        this.init = function () {
            this.imagenode = document.createElement("div");
            this.bulletSound = document.createElement("audio");
            this.imagenode.style.width = sizeX + 'px';
            this.imagenode.style.height = sizeY + 'px';
            this.imagenode.style.left = this.bulletX + "px";
            this.imagenode.style.top = this.bulletY + "px";
            this.imagenode.className = imgClass;
            this.bulletSound.autoplay = '';
            this.bulletSound.src = soundSrc;
            this.imagenode.appendChild(this.bulletSound);
            mainDiv.appendChild(this.imagenode);
            this.bulletSound.play()
        }
        this.init();
    }

    // 创建补给包类
    function supplybag(imgClass,dietime,type){
        this.supplybagX = 0;
        this.supplybagY = 0;
        this.sizeX = 30;
        this.sizeY = 30;
        this.imagenode = null;
        this.supplybagSound = null;
        this.dietimes = 0;
        this.dietime = dietime;
        this.type = type;
        this.istaken = false;
        // 补给包的移动
        this.move = function() {
            this.imagenode.style.top = this.imagenode.offsetTop + 2 + "px";
            
        };
        // 初始化
        this.init = function() {
            this.imagenode = document.createElement("div");
            this.supplybagSound = document.createElement("audio");
            this.imagenode.style.width = this.sizeX + 'px';
            this.imagenode.style.height = this.sizeY + 'px';
            this.imagenode.style.left = this.supplybagX + "px";
            this.imagenode.style.top = this.supplybagY + "px";
            this.imagenode.className = imgClass;
            this.supplybagSound.autoplay = '';
            this.supplybagSound.src = 'music/supply.mp3';
            this.imagenode.appendChild(this.supplybagSound);
            mainDiv.appendChild(this.imagenode);
        }
        this.init();
    }
    /*
     创建单行子弹类
     */
    function defaultbullet(X, Y) {
        bullet.call(this, X, Y, 15, 37, "bullet bullet1", 1, 'music/shot.mp3', 'friend');
    }
    function doublebullet(X, Y) {
        bullet.call(this, X, Y, 30, 37, "bullet bullet2", 1.5, 'music/shot.mp3', 'friend');
    }

    /*创建敌军子弹*/
    function enemybullet1(X, Y) {
        bullet.call(this, X, Y, 14, 14, "bullet e-bullet1", 1, 'music/shot.mp3', 'enemy');
    }

    /*
    创建敌机类
     */
    function enemy(hp, a, b, sizeX, sizeY, score, dietime, sudu, boomimage, imgClass, soundSrc, trailName, hasfire) {
        plan.call(this, hp, random(a, b), -100, sizeX, sizeY, score, dietime, sudu, boomimage, imgClass, soundSrc, trailName, hasfire);
    }
    //产生min到max之间的随机数
    function random(min, max) {
        return Math.floor(min + Math.random() * (max - min));
    }

    /*
    创建本方飞机类
     */
    function ourplan(X, Y, imgClass, soundSrc, trailName, hasfire) {
        plan.call(this, 3, X, Y, 60, 46, 0, 660, 0, "image/boom.gif", imgClass, soundSrc, 'defualt', false);
        this.imagenode.setAttribute('id', 'ourplan');
    }

    /*
     创建本方飞机
     */
    var selfplan = new ourplan(120, 485, 'plane1 plane', 'music/Explode01.ogg', false);

    //移动事件
    var ourPlan = document.getElementById('ourplan');
    var yidong = function (ev) {
        // var oevent=window.event||arguments[0];
        // var chufa=oevent.srcElement||oevent.target;
        var oevent = ev.touches[0]
        var selfplanX = oevent.clientX;
        var selfplanY = oevent.clientY;
        ourPlan.style.left = Math.max(0, Math.min(bodyWidth - selfplan.sizeX, selfplanX - selfplan.sizeX / 2)) + "px";
        ourPlan.style.top = Math.max(0, Math.min(bodyheight - selfplan.sizeY, selfplanY - selfplan.sizeY / 2)) + "px";
    }
    /*
    暂停事件
     */
    var number = 0;
    var pause = function () {
        if (number == 0) {
            suspenddiv.style.display = "block";
            if (document.removeEventListener) {
                mainDiv.removeEventListener("touchmove", yidong, true);
                bodyobj.removeEventListener("touchmove", bianjie, true);
            }
            clearInterval(set);
            number = 1;
        } else {
            suspenddiv.style.display = "none";
            if (document.addEventListener) {
                mainDiv.addEventListener("touchmove", yidong, true);
                bodyobj.addEventListener("touchmove", bianjie, true);
            }
            set = setInterval(start, 20);
            number = 0;
        }
    }
    //判断本方飞机是否移出边界,如果移出边界,则取消mousemove事件,反之加上mousemove事件
    var bianjie = function () {
        var oevent = window.event || arguments[0];
        var bodyobjX = oevent.clientX;
        var bodyobjY = oevent.clientY;
        if (bodyobjX < 0 || bodyobjX > bodyWidth || bodyobjY < 0 || bodyobjY > bodyheight) {
            if (document.removeEventListener) {
                mainDiv.removeEventListener("touchstart", yidong, true);
            }
        } else {
            if (document.addEventListener) {
                mainDiv.addEventListener("touchstart", yidong, true);
            }
        }
    }
    //暂停界面重新开始事件
    function restart() {
        location.reload(true);
        startdiv.style.display = "none";
        maindiv.style.display = "block";
    }
    var bodyobj = document.querySelector("body");
    if (document.addEventListener) {
        //为本方飞机添加移动和暂停
        mainDiv.addEventListener("touchmove", yidong, true);
        //为本方飞机添加暂停事件
        selfplan.imagenode.addEventListener("click", pause, true);
        //为body添加判断本方飞机移出边界事件
        bodyobj.addEventListener("touchmove", bianjie, true);
        //为暂停界面的继续按钮添加暂停事件
        suspenddiv.getElementsByTagName("button")[0].addEventListener("click", pause, true);
        suspenddiv.getElementsByTagName("button")[1].addEventListener("click", restart, true);
        //为暂停界面的返回主页按钮添加事件
        suspenddiv.getElementsByTagName("button")[2].addEventListener("click", end, true);
    }
    //初始化隐藏本方飞机
    selfplan.imagenode.style.display = "none";

    /*敌机对象数组*/
    var enemys = [];

    /*子弹对象数组*/
    var bullets = [];
    var enemybullets = [];

    // 补给包数组
    var supplybags = [];

    //进程标志位
    var mark = 0;

    // 子进程标志位
    var mark1 = 0;

    // 创建子弹种类
    var bulletType = 'default';

    var backgroundPositionY = 0;
    /*
    开始函数
     */
    function start() {
        mainDiv.style.backgroundPositionY = backgroundPositionY + "px";
        backgroundPositionY += 0.4;
        if (backgroundPositionY == 768) {
            backgroundPositionY = 0;
        }
        mark++;
        mark1++;
        /*
        创建敌方飞机
         */

        if (mark1 % 100 == 0) {
            //小飞机
            enemys.push(new enemy(2, 0, 280, 50, 34, 10, 860, random(2, 3), "image/boom.gif", "enemys1 plane", 'music/Explode02.ogg', 'default'));
        }
        if (mark1 % 150 == 0) {
            //中飞机
            enemys.push(new enemy(6, 0, 204, 70, 60, 50, 860, random(1, 2), "image/boom.gif", "enemys2 plane", 'music/Explode01.ogg', 'default', true));
        }
        if (mark1 % 250 == 0) {
            //中飞机
            enemys.push(new enemy(8, 0, 204, 84, 54, 50, 860, random(1, 2), "image/boom.gif", "enemys3 plane", 'music/Explode01.ogg', 'default', true));
        }
        if (mark1 % 350 == 0) {
            //中飞机
            enemys.push(new enemy(10, 0, 204, 100, 65, 50, 1060, random(1, 2), "image/boom.gif", "enemys4 plane", 'music/Explode01.ogg', 'default'));
        }
        if (mark1 % 450 == 0) {
            //小飞机 曲线路
            enemys.push(new enemy(1, 0, 10, 45, 37, 10, 860, 5, "image/boom.gif", "enemys5 plane", 'music/Explode02.ogg', 'curve'))
        }
        if (mark1 % 470 == 0) {
            //小飞机 曲线路
            enemys.push(new enemy(1, 0, 10, 45, 37, 10, 860, 5, "image/boom.gif", "enemys5 plane", 'music/Explode02.ogg', 'curve'))
        }
        if (mark1 % 490 == 0) {
            //小飞机 曲线路
            enemys.push(new enemy(1, 0, 10, 45, 37, 10, 860, 5, "image/boom.gif", "enemys5 plane", 'music/Explode02.ogg', 'curve'))
        }
        if (mark1 % 510 == 0) {
            //小飞机 曲线路
            enemys.push(new enemy(1, 0, 10, 45, 37, 10, 860, 5, "image/boom.gif", "enemys5 plane", 'music/Explode02.ogg', 'curve'))
            mark1 = 0;
        }
        if (mark == 1000) {
            //大飞机
            enemys.push(new enemy(20, 57, 120, 150, 173, 300, 1240, 1, "image/boom.gif", "enemysboss plane", 'music/Explode03.ogg', 'default'));
            supplybags.push(new supplybag('supply twobullets',1000,'twobullets'));
        }
        if (mark == 3000) {
            //子弹速度补给包
            supplybags.push(new supplybag('supply bulletspeed',1000,'bulletspeed'));
        }
        if (mark == 6500) {
            //大飞机
            enemys.push(new enemy(20, 57, 120, 150, 173, 300, 1240, 1, "image/boom.gif", "enemysboss plane", 'music/Explode03.ogg', 'default'));
            mark = 0;
        }

        /*
        移动敌方飞机
         */
        for (var i = 0; i < enemys.length; i++) {
            if (enemys[i].planisdie != true) {
                enemys[i].planmove();
                if (enemys[i].hasfire && mark % 150 == 0) {
                    // 创建敌军子弹
                    enemybullets.push(new enemybullet1(parseInt(enemys[i].imagenode.style.left) + 27, parseInt(enemys[i].imagenode.style.top) + 40));
                }
            }
            /*
             如果敌机超出边界,删除敌机
             */
            if (enemys[i].imagenode.offsetTop > bodyheight) {
                mainDiv.removeChild(enemys[i].imagenode);
                enemys.splice(i, 1);
            }
            //当敌机死亡标记为true时，经过一段时间后清除敌机
            if (enemys[i].planisdie == true) {
                enemys[i].plandietimes += 20;
                if (enemys[i].plandietimes == enemys[i].plandietime) {
                    mainDiv.removeChild(enemys[i].imagenode);
                    enemys.splice(i, 1);
                }
            }
        }

        /*创建我军子弹*/
        if (mark % bulletFrequency == 0) {
            switch(bulletType){
                // 增加子弹速度的补给包
                case 'default':
                    bullets.push(new defaultbullet(parseInt(selfplan.imagenode.style.left) + (selfplan.sizeX/2) - 7, parseInt(selfplan.imagenode.style.top) - 12));
                    break;
                case 'twobullets':
                    bullets.push(new doublebullet(parseInt(selfplan.imagenode.style.left) + (selfplan.sizeX/2) - 7, parseInt(selfplan.imagenode.style.top) - 12));
                    break;
            }
        }

        /*移动我方子弹*/
        for (var i = 0; i < bullets.length; i++) {
            bullets[i].bulletmove();
            /*如果子弹超出边界,删除子弹*/
            if (bullets[i].imagenode.offsetTop < 0) {
                mainDiv.removeChild(bullets[i].imagenode);
                bullets.splice(i, 1);
            }
        }

        /*移动敌军子弹*/
        for (var i = 0; i < enemybullets.length; i++) {
            enemybullets[i].bulletmove();
            /*如果子弹超出边界,删除子弹*/
            if (enemybullets[i].imagenode.offsetTop > bodyheight) {
                mainDiv.removeChild(enemybullets[i].imagenode);
                enemybullets.splice(i, 1);
            }
        }
        /*移动补给包*/
        for (var i = 0; i < supplybags.length; i++) {
            supplybags[i].move();
            /*如果子弹超出边界,删除子弹*/
            if (supplybags[i].imagenode.offsetTop > bodyheight) {
                mainDiv.removeChild(supplybags[i].imagenode);
                supplybags.splice(i, 1);
            }
            //当补给包被拾取，经过一段时间后清除补给包
            if (supplybags[i].istaken === true) {
                supplybags[i].dietimes += 20;
                if (supplybags[i].dietimes == supplybags[i].dietime) {
                    mainDiv.removeChild(supplybags[i].imagenode);
                    supplybags.splice(i, 1);
                }
            }
        }

        /*碰撞判断*/

        for (var i = 0; i < bullets.length; i++) {
            for (var j = 0; j < enemys.length; j++) {
                //判断敌军飞机碰撞我方飞机
                if (enemys[j].planisdie == false) {
                    if (isCollide(enemys, 'selfplan', i, j)) {
                        if (!this.hasClass(selfplan.imagenode, 'breathe')) selfplan.planehp--;
                        addClass(selfplan.imagenode, 'breathe')
                        setTimeout(function () {
                            removeClass(selfplan.imagenode, 'breathe')
                        }, 3000)
                        if (selfplan.planehp < 0) {
                            selfplan.planehp = 0
                        }
                        life.innerHTML = selfplan.planehp;
                        selfplan.hpbar.style.width = (selfplan.planehp * 8) + 'px';
                    }
                    //判断我方子弹与敌机碰撞
                    if (isCollide(bullets, enemys, i, j)) {
                        //敌机血量减子弹攻击力
                        enemys[j].planehp = enemys[j].planehp - bullets[i].bulletattck;
                        enemys[j].hpbar.style.width = (enemys[j].planehp * 8) + 'px';
                        //敌机血量为0，敌机图片换为爆炸图片，死亡标记为true，计分
                        if (enemys[j].planehp <= 0) {
                            enemys[j].boomSound.play();
                            scores = scores + enemys[j].planscore;
                            scorelabel.innerHTML = scores;
                            enemys[j].boomimage.style.display = 'block';
                            enemys[j].planisdie = true;
                        }
                        //删除子弹
                        mainDiv.removeChild(bullets[i].imagenode);
                        bullets.splice(i, 1);
                        break;
                    }
                }
            }
        }
        // 判断敌方子弹与我方飞机碰撞
        for (var i = 0; i < enemybullets.length; i++) {
            if (isCollide(enemybullets, 'selfplan', null, i)) {
                if (!this.hasClass(selfplan.imagenode, 'breathe')) selfplan.planehp--;
                addClass(selfplan.imagenode, 'breathe')
                // 3秒无敌状态
                setTimeout(function () {
                    removeClass(selfplan.imagenode, 'breathe')
                }, 3000)
                life.innerHTML = selfplan.planehp;
                selfplan.hpbar.style.width = (selfplan.planehp * 8) + 'px';
                //删除子弹
                mainDiv.removeChild(enemybullets[i].imagenode);
                enemybullets.splice(i, 1);
            }
        }
        // 判断是否拾取补给包
        for (var i = 0; i < supplybags.length; i++) {
            if (isCollide(supplybags, 'selfplan', null, i)) {
                switch(supplybags[i].type){
                    // 增加子弹速度的补给包
                    case 'bulletspeed':
                        bulletFrequency--;
                        break;
                    case 'twobullets':
                        bulletType = 'twobullets';
                        break;
                }
                supplybags[i].supplybagSound.play();
                supplybags[i].imagenode.style.display = 'none';
                supplybags[i].istaken = true
            }
        }
        
        if (selfplan.planehp <= 0) {
            //游戏结束，统计分数
            selfplan.boomimage.style.display = 'block';
            selfplan.boomSound.play();
            enddiv.style.display = "block";
            planscore.innerHTML = scores;
            if (!window.localStorage) {
                console.log("浏览器不支持localstorage");
                return false;
            } else {
                let oldScore = window.localStorage.getItem("highScore")
                if (!oldScore || oldScore < scores) {
                    window.localStorage.setItem("highScore", scores);
                }
            }
            if (document.removeEventListener) {
                mainDiv.removeEventListener("touchmove", yidong, true);
                bodyobj.removeEventListener("touchmove", bianjie, true);
            }
            clearInterval(set);
        }
    }
    // 碰撞检测条件
    function isCollide(array1, array2, i, j) {
        //array1最右边大于array2最左边，array1最左边小于array2最右边
        let leftside = false
        let topside = false
        if (array2 === 'selfplan') {
            leftside = (array1[j].imagenode.offsetLeft + array1[j].sizeX > selfplan.imagenode.offsetLeft) && (array1[j].imagenode.offsetLeft < selfplan.imagenode.offsetLeft + selfplan.sizeX)
            topside = (array1[j].imagenode.offsetTop <= selfplan.imagenode.offsetTop + selfplan.sizeY) && (array1[j].imagenode.offsetTop + array1[j].sizeY >= selfplan.imagenode.offsetTop)
        } else {
            leftside = (array1[i].imagenode.offsetLeft + array1[i].sizeX > array2[j].imagenode.offsetLeft) && (array1[i].imagenode.offsetLeft < array2[j].imagenode.offsetLeft + array2[j].sizeX)
            //array1最下面边大于array2最上边，array1最上边小于array2最下边
            topside = (array1[i].imagenode.offsetTop <= array2[j].imagenode.offsetTop + array2[j].sizeY) && (array1[i].imagenode.offsetTop + array1[i].sizeY >= array2[j].imagenode.offsetTop)
        }

        if (leftside && topside) {
            return true
        } else {
            return false
        }
    }
    /*
    开始游戏按钮点击事件
     */
    var set;

    function begin() {

        startdiv.style.display = "none";
        mainDiv.style.display = "block";
        selfplan.imagenode.style.display = "block";
        scorediv.style.display = "block";
        /*调用开始函数*/
        set = setInterval(start, 20);
    }
    //游戏结束后点击结束按钮事件
    function end() {
        location.reload(true);
    }


    // 判断是否有存在某个class
    function hasClass(ele, cls) {
        return ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
    }
    //为指定的dom元素添加样式
    function addClass(ele, cls) {
        if (!this.hasClass(ele, cls)) ele.className += " " + cls;
    }
    //删除指定dom元素的样式
    function removeClass(ele, cls) {
        if (hasClass(ele, cls)) {
            var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
            ele.className = ele.className.replace(reg, " ");
        }
    }