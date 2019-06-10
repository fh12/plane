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
    // 我军发射子弹默认频率
    var bulletFrequency = 15;
    // 我军发射子弹速度值
    var bulletSpeed = 4;
    // 我军发射子弹速度加成
    var bulletSpeedExtra = 0;

    var bodyWidth = document.documentElement.clientWidth
    var bodyheight = document.documentElement.clientHeight
    var highscore = window.localStorage.getItem('highScore')
    if(highscore){
      highscorelabel.innerHTML = highscore  
    }
    
    /*
     创建飞机类
     */
    function plan(hp, X, Y, sizeX, sizeY, score, dietime, speed, boomimage, imgClass, soundSrc, trailName, hasfire, bulletType) {
        this.planeX = X;
        this.planeY = Y;
        this.imagenode = null;
        this.boomSound = null;
        this.planehp = hp;
        this.hpbartotal = null;
        this.planscore = score;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.planboomimage = boomimage;
        this.planeisdie = false;
        this.issuffercrit = false;
        this.showcrittime = 0;
        this.planedietimes = 0;
        this.planedietime = dietime;
        this.speed = speed;
        this.soundSrc = soundSrc;
        this.trailName = trailName;
        this.hasfire = hasfire;
        this.bulletType = bulletType;
        //行为
        /*
        移动行为
             */
        this.planmove = function () {
            if (scores <= 2500) {
                this.imagenode.style.top = this.imagenode.offsetTop + this.speed + "px";
            } else if (scores > 2500 && scores <= 4000) {
                this.imagenode.style.top = this.imagenode.offsetTop + this.speed + 1 + "px";
            } else if (scores > 4000 && scores <= 6000) {
                this.imagenode.style.top = this.imagenode.offsetTop + this.speed + 2 + "px";
            } else if (scores > 6000 && scores <= 8000) {
                this.imagenode.style.top = this.imagenode.offsetTop + this.speed + 3 + "px";
            } else if (scores > 8000 && scores <= 10000) {
                this.imagenode.style.top = this.imagenode.offsetTop + this.speed + 4 + "px";
            } else {
                this.imagenode.style.top = this.imagenode.offsetTop + this.speed + 5 + "px";
            }
            switch (this.trailName){
                case 'curve':
                    this.imagenode.style.left = this.imagenode.offsetLeft + 1 + 'px';
                    this.imagenode.style.top = 0.02*Math.pow(this.imagenode.offsetLeft,2) + 'px';
                    // this.imagenode.style.left = 20 * Math.sqrt(this.imagenode.offsetTop) + "px";
                    break;
                
            }
        }
        this.init = function () {
            this.imagenode = document.createElement("div");
            this.boomimage = document.createElement("img");
            this.hpbartotal = document.createElement("div");
            this.boomSound = document.createElement("audio");
            this.hpbar = document.createElement('span');
            this.hpbartotal.className = 'hptotal';
            this.hpbartotal.style.width = this.sizeX + 'px';
            this.hpbar.style.width = this.sizeX + 'px';
            this.hpbartotal.setAttribute('hp',this.planehp);
            this.hpbar.className = 'hpbar';
            this.boomimage.src = this.planboomimage;
            this.boomSound.autoplay = '';
            this.boomSound.src = soundSrc;
            this.boomimage.style.width = sizeX + 'px';
            this.boomimage.style.height = sizeY + 'px';
            this.boomimage.style.display = 'none';
            this.imagenode.style.width = sizeX + 'px';
            this.imagenode.style.height = sizeY + 'px';
            this.imagenode.style.left = this.planeX + "px";
            this.imagenode.style.top = this.planeY + "px";
            this.imagenode.className = imgClass;
            this.hpbartotal.appendChild(this.hpbar);
            this.imagenode.appendChild(this.hpbartotal);
            this.imagenode.appendChild(this.boomimage);
            this.imagenode.appendChild(this.boomSound);
            mainDiv.appendChild(this.imagenode);
        }
        this.init();
    }

    /*
    创建子弹类
     */
    function bullet(X, Y, sizeX, sizeY, imgClass, bulletattck, soundSrc, belong, critRate, critDamage, speed, type) {
        this.bulletX = X;
        this.bulletY = Y;
        this.imagenode = null;
        this.bulletSound = null;
        this.bulletattck = bulletattck;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.soundSrc = soundSrc;
        this.belong = belong;
        this.type = type;
        this.critRate = critRate;
        this.critDamage  = critDamage;
        this.speed = speed;
        /*
         移动行为
         */
        this.bulletmove = function (x1,x2,y1,y2) {
            if (belong === 'friend') {
                this.imagenode.style.top = this.imagenode.offsetTop - 20 + "px";
            }
            if (belong === 'enemy') {
                this.imagenode.style.top = this.imagenode.offsetTop + 5 + "px";
                // 自动追踪
                if(type === 'autotrack'){
                    var q = getequation(x1,x2,y1,y2)
                    this.imagenode.style.left = parseInt(this.imagenode.style.left) - q.v + 'px'
                }
                // 导弹追踪(旋转方向)
                if(type === 'missile'){
                    var q = getequation(x1,x2,y1,y2)
                    var a =  q.angle
                    if(a>-60){
                        this.imagenode.style.transform = 'rotate('+ a + 'deg)'
                    }
                    this.imagenode.style.left = parseInt(this.imagenode.style.left) - q.v + 'px'
                }
                
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
    function supplybag(X,Y,imgClass,dietime,type){
        this.supplybagX = X;
        this.supplybagY = Y;
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

    // 创建明细补给包类

    //双发子弹
    function supplytwobullets(X, Y){
        supplybag.call(this, X, Y, 'supply supplytwobullets',1000,'twobullets')
    }
    //子弹速度+1
    function supplybulletspeed(X, Y){
        supplybag.call(this, X, Y, 'supply supplybulletspeed',1000,'bulletspeed')
    }
    //生命+1
    function supplyextralife(X, Y){
        supplybag.call(this, X, Y, 'supply supplyextralife',1000,'extralife')
    }
    //火枪子弹补给包
    function supplyfirebullets(X, Y){
        supplybag.call(this, X, Y, 'supply supplyfirebullets',1000,'firebullets')
    }
    //激光枪补给包
    function supplylaserbullets(X, Y){
        supplybag.call(this, X, Y, 'supply supplylaserbullets',1000,'laserbullets')
    }

    /*
     创建我方子弹类
     */
    function defaultbullet(X, Y) {
        bullet.call(this, X, Y, 15, 37, "bullet bullet1", 1.5, 'music/bullet/shot.mp3', 'friend', 0, 1.5, 5, 'default');
    }
    function doublebullet(X, Y) {
        bullet.call(this, X, Y, 30, 37, "bullet bullet2", 2, 'music/bullet/shot.mp3', 'friend', 0, 2, 5, 'default');
    }
    function firebullet(X, Y) {
        bullet.call(this, X, Y, 35, 72, "bullet firebullet", 3, 'music/bullet/firegun.mp3', 'friend', 0, 1, 1, 'default');
    }
    function laserbullet(X, Y) {
        bullet.call(this, X, Y, 12, 40, "bullet laserbullet", 1, 'music/bullet/lasergun2.mp3', 'friend', 0.2, 2, 7, 'default');
    }

    /*创建敌军子弹*/
    function enemybullet1(X, Y) {
        bullet.call(this, X, Y, 14, 14, "bullet e-bullet1", 1, 'music/bullet/assaultgun.mp3', 'enemy', 0, 1.2, 1, 'default');
    }
    function enemybullet2(X, Y) {
        bullet.call(this, X, Y, 14, 14, "bullet e-bullet1", 1, 'music/bullet/assaultgun.mp3', 'enemy', 0, 1.2, 1, 'autotrack');
    }
    function enemybullet3(X, Y) {
        bullet.call(this, X, Y, 12, 38, "bullet e-missile", 1, 'music/bullet/lasergun2.mp3', 'enemy', 0, 1.2, 1, 'missile');
    }

    /*
    创建敌机类
     */
    function enemy(hp, a, b, sizeX, sizeY, score, dietime, speed, boomimage, imgClass, soundSrc, trailName, hasfire, bulletType) {
        plan.call(this, hp, random(a, b), -100, sizeX, sizeY, score, dietime, speed, boomimage, imgClass, soundSrc, trailName, hasfire, bulletType);
    }
    function enemy1(a, b) {
        plan.call(this, 2, random(a, b), -100, 50, 34, 10, 600, random(2,3), "image/boom.gif", "enemys1 plane", 'music/explode/Explode02.ogg', 'default', false, 'default');
    }
    function enemy2(a, b) {
        plan.call(this, 6, random(a, b), -100, 70, 60, 30, 600, random(1,3), "image/boom.gif", "enemys2 plane", 'music/explode/Explode01.ogg', 'default', true, 'default');
    }
    function enemy3(a, b) {
        plan.call(this, 8, random(a, b), -100, 84, 54, 40, 600, random(1,3), "image/boom.gif", "enemys3 plane", 'music/explode/Explode01.ogg', 'default', true, 'default');
    }
    function enemy4(a, b) {
        plan.call(this, 10, random(a, b), -100, 100, 65, 50, 600, random(1,2), "image/boom.gif", "enemys4 plane", 'music/explode/Explode01.ogg', 'default', true, 'default');
    }
    function enemy5(a, b, trailName, bulletType) {
        plan.call(this, 1, random(a, b), -100, 45, 37, 10, 600, random(2,3), "image/boom.gif", "enemys5 plane", 'music/explode/Explode02.ogg', trailName, true, bulletType);
    }
    function enemy6(a, b, trailName, bulletType) {
        plan.call(this, 1, random(a, b), -100, 90, 78, 10, 600, random(2,3), "image/boom.gif", "enemys6 plane", 'music/explode/Explode02.ogg', trailName, true, bulletType);
    }
    function enemys7(a, b) {
        this.extraimage = null;
        plan.call(this, 15, random(a, b), -100, 100, 100, 300, 600, random(2,3), "image/boom.gif", "enemys7 plane", 'music/explode/Explode03.ogg', 'default',false), 'default';
        this.extraimages = function(){
            this.extraimage = document.createElement('div');
            this.extraimage.className = 'propeller circle';
            this.imagenode.appendChild(this.extraimage)
        };
        this.extraimages()
    }
    

    /*
    创建本方飞机类
     */
    function ourplan(X, Y, imgClass, soundSrc, bulletType) {
        plan.call(this, 3, X, Y, 60, 60, 0, 660, 0, "image/boom.gif", imgClass, soundSrc, 'defualt', false, bulletType);
        this.imagenode.setAttribute('id', 'ourplan');
    }

    /*
     创建本方飞机
     */
    var selfplane = new ourplan(120, 485, 'plane1 plane', 'music/explode/Explode01.ogg', 'default');

    //移动事件
    var ourPlan = document.getElementById('ourplan');
    var yidong = function (ev) {
        // var oevent=window.event||arguments[0];
        // var chufa=oevent.srcElement||oevent.target;
        var oevent = ev.touches[0]
        var selfplaneX = oevent.clientX;
        var selfplaneY = oevent.clientY;
        ourPlan.style.left = Math.max(0, Math.min(bodyWidth - selfplane.sizeX, selfplaneX - selfplane.sizeX / 2)) + "px";
        ourPlan.style.top = Math.max(0, Math.min(bodyheight - selfplane.sizeY, selfplaneY - selfplane.sizeY / 2)) + "px";
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
        selfplane.imagenode.addEventListener("click", pause, true);
        //为body添加判断本方飞机移出边界事件
        bodyobj.addEventListener("touchmove", bianjie, true);
        //为暂停界面的继续按钮添加暂停事件
        suspenddiv.getElementsByTagName("button")[0].addEventListener("click", pause, true);
        suspenddiv.getElementsByTagName("button")[1].addEventListener("click", restart, true);
        //为暂停界面的返回主页按钮添加事件
        suspenddiv.getElementsByTagName("button")[2].addEventListener("click", end, true);
    }
    //初始化隐藏本方飞机
    selfplane.imagenode.style.display = "none";

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

    // 背景图起始位置
    var backgroundPositionY = 0;

    // 摧毁的敌军飞机集合
    var destroyedEnemys = [];

    // 未击中的敌军飞机集合
    var missedEnemys = [];
    /*
    开始函数
     */
    function start() {
        mainDiv.style.backgroundPositionY = backgroundPositionY + "px";
        backgroundPositionY += 1;
        if (backgroundPositionY == bodyheight) {
            backgroundPositionY = 0;
        }
        // 总进程标志位++
        mark++;
        mark1++;

        /*
        创建敌方飞机和补给包
         */

        if (mark1 % 100 == 0) {
            //小飞机
            enemys.push(new enemy1(0, 280));
            // enemys.push(new enemys7( 57, 120));
        }
        if (mark1 % 200 == 0) {
            enemys.push(new enemy5( 0, 10, 'curve', 'autotrack'))
        }
        if (mark1 % 220 == 0) {
            enemys.push(new enemy5( 0, 10, 'curve', 'autotrack'))
        }
        if (mark1 % 240 == 0) {
            enemys.push(new enemy5( 0, 10, 'curve', 'autotrack'))
        }
        if (mark1 % 260 == 0) {
            enemys.push(new enemy5( 0, 10, 'curve', 'autotrack'))
        }
        if (mark1 % 300 == 0) {
            //中飞机
            enemys.push(new enemy2(0, 204));
        }
        if (mark1 % 450 == 0) {
            //中飞机
            enemys.push(new enemy3(0, 204));
        }
        if (mark1 % 550 == 0) {
            //中飞机
            enemys.push(new enemy4( 0, 204));
        }
        if (mark1 % 650 == 0) {
            //小飞机 曲线路
            enemys.push(new enemy5( 0, 10, 'curve', 'autotrack'))
        }
        if (mark1 % 670 == 0) {
            //小飞机 曲线路
            enemys.push(new enemy5( 0, 10, 'curve', 'autotrack'))
        }
        if (mark1 % 690 == 0) {
            //小飞机 曲线路
            enemys.push(new enemy5( 0, 10, 'curve', 'autotrack'))
        }
        if (mark1 % 710 == 0) {
            //小飞机 曲线路
            enemys.push(new enemy5( 0, 10, 'curve', 'autotrack'))
            mark1 = 0;
        }
        if (mark == 1000) {
            //大飞机
            enemys.push(new enemy6( 0, 10, 'curve', 'missile'))
        }
        if (mark == 1500) {
            enemys.push(new enemys7( 57, 120));
        }
        if (mark == 1700) {
            //大飞机
            
            mark = 0;
        }

        /*
        移动敌方飞机
         */
        for (var i = 0; i < enemys.length; i++) {
            if (!enemys[i].planeisdie) {
                enemys[i].planmove();
                if (enemys[i].hasfire && mark % 150 == 0) {
                    // 创建敌军子弹
                    switch (enemys[i].bulletType){
                        case 'default':
                            enemybullets.push(new enemybullet1(parseInt(enemys[i].imagenode.style.left) + enemys[i].sizeX/2 -7, parseInt(enemys[i].imagenode.style.top) + 40));
                            break;
                        case 'autotrack':
                            enemybullets.push(new enemybullet2(parseInt(enemys[i].imagenode.style.left) + enemys[i].sizeX/2 -7, parseInt(enemys[i].imagenode.style.top) + 40));
                            break;
                        case 'missile':
                            enemybullets.push(new enemybullet3(parseInt(enemys[i].imagenode.style.left) + enemys[i].sizeX/2 -6, parseInt(enemys[i].imagenode.style.top) + 40));
                            break;
                    }
                }
            }
            /*
             如果敌机超出边界,删除敌机
             */
            if (enemys[i].imagenode.offsetTop > bodyheight) {
                missedEnemys.push(enemys[i]);
                mainDiv.removeChild(enemys[i].imagenode);
                enemys.splice(i, 1);
            }
            if(enemys[i].issuffercrit == true){
                enemys[i].showcrittime += 20;
                if (enemys[i].showcrittime == enemys[i].planedietime) {
                    removeClass(enemys[i].imagenode, 'critdamage')
                    enemys[i].hpbar.innerHTML = ''
                }
            }
            //当敌机死亡标记为true时，经过一段时间后清除敌机
            if (enemys[i].planeisdie == true) {
                enemys[i].planedietimes += 20;
                if (enemys[i].planedietimes == enemys[i].planedietime) {
                    if(enemys[i].imagenode.className === 'enemys7 plane'){
                        var a =  randomInt(0,4)
                            switch(a){
                            case 0:
                                supplybags.push(new supplybulletspeed(parseInt(enemys[i].imagenode.style.left),enemys[i].imagenode.offsetTop));
                                break;
                            case 1:
                                supplybags.push(new supplyextralife(parseInt(enemys[i].imagenode.style.left),enemys[i].imagenode.offsetTop));
                                break;
                            case 2:
                                supplybags.push(new supplyfirebullets(parseInt(enemys[i].imagenode.style.left),enemys[i].imagenode.offsetTop));
                                break;
                            case 3:
                                supplybags.push(new supplytwobullets(parseInt(enemys[i].imagenode.style.left),enemys[i].imagenode.offsetTop));
                                break;
                            case 4:
                                supplybags.push(new supplylaserbullets(parseInt(enemys[i].imagenode.style.left),enemys[i].imagenode.offsetTop));
                                break;
                        }
                    }
                    destroyedEnemys.push(enemys[i]);
                    mainDiv.removeChild(enemys[i].imagenode);
                    enemys.splice(i, 1);
                }
            }
        }

        /*创建我军子弹*/
        if (mark % (bulletFrequency-bulletSpeed-bulletSpeedExtra) == 0) {
            switch(selfplane.bulletType){
                case 'default':
                    bullets.push(new defaultbullet(parseInt(selfplane.imagenode.style.left) + (selfplane.sizeX/2) - 7, parseInt(selfplane.imagenode.style.top) - 12));
                    break;
                case 'twobullets':
                    bullets.push(new doublebullet(parseInt(selfplane.imagenode.style.left) + (selfplane.sizeX/2) - 15, parseInt(selfplane.imagenode.style.top) - 12));
                    break;
                case 'firebullets':
                    bullets.push(new firebullet(parseInt(selfplane.imagenode.style.left) + (selfplane.sizeX/2) - 17.5, parseInt(selfplane.imagenode.style.top) - 12));
                    break;
                case 'laserbullets':
                    bullets.push(new laserbullet(parseInt(selfplane.imagenode.style.left) + (selfplane.sizeX/2) - 6, parseInt(selfplane.imagenode.style.top) - 12));
                    break;
            }
        }

        /*移动我方子弹*/
        for (var i = 0; i < bullets.length; i++) {
            //当前子弹的速度
            bulletSpeed = bullets[i].speed
            bullets[i].bulletmove();
            /*如果子弹超出边界,删除子弹*/
            if (bullets[i].imagenode.offsetTop < 0) {
                mainDiv.removeChild(bullets[i].imagenode);
                bullets.splice(i, 1);
            }
        }

        /*移动敌军子弹*/
        for (var i = 0; i < enemybullets.length; i++) {
            enemybullets[i].bulletmove(parseInt(enemybullets[i].imagenode.style.left),parseInt(selfplane.imagenode.style.left)+selfplane.sizeX/2,enemybullets[i].imagenode.offsetTop+enemybullets[i].sizeY/2,selfplane.imagenode.offsetTop+selfplane.sizeY/2);
            /*如果子弹超出边界,删除子弹*/
            if (enemybullets[i].imagenode.offsetTop > bodyheight) {
                mainDiv.removeChild(enemybullets[i].imagenode);
                enemybullets.splice(i, 1);
            }
        }
        /*移动补给包*/
        for (var i = 0; i < supplybags.length; i++) {
            supplybags[i].move();
            /*如果补给包超出边界,删除补给包*/
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
                if (enemys[j].planeisdie == false) {
                    if (isCollide(enemys, 'selfplane', i, j)) {
                        if (!this.hasClass(selfplane.imagenode, 'breathe')) selfplane.planehp--;
                        addClass(selfplane.imagenode, 'breathe')
                        setTimeout(function () {
                            removeClass(selfplane.imagenode, 'breathe')
                        }, 3000)
                        if (selfplane.planehp < 0) {
                            selfplane.planehp = 0
                        }
                        enemys[j].boomSound.play();
                        scores = scores + enemys[j].planscore;
                        scorelabel.innerHTML = scores;
                        enemys[j].boomimage.style.display = 'block';
                        enemys[j].planeisdie = true;
                        life.style.width = selfplane.planehp*20 + 'px';
                        if(selfplane.planehp<3){
                            selfplane.hpbar.style.width = selfplane.sizeX / 3 * selfplane.planehp + 'px';
                        }
                    }
                    //判断我方子弹与敌机碰撞
                    if (isCollide(bullets, enemys, i, j)) {
                        //敌军生命 = 敌机血量 - 子弹攻击力 - （子弹暴击率*子弹暴击伤害*子弹攻击力）
                        var isCrit = getRandom(bullets[i].critRate)
                        var attack = bullets[i].bulletattck + isCrit * bullets[i].critDamage * bullets[i].bulletattck
                        // 暴击效果
                        if(isCrit){
                            enemys[j].issuffercrit = true
                            enemys[j].hpbar.innerHTML = attack
                            addClass(enemys[j].imagenode, 'critdamage')
                        }
                        enemys[j].planehp = enemys[j].planehp - attack;
                        enemys[j].hpbar.style.width = parseInt(enemys[j].hpbartotal.style.width)/parseInt(enemys[j].hpbartotal.getAttribute('hp')) * enemys[j].planehp + 'px';
                        //敌机血量为0，敌机图片换为爆炸图片，死亡标记为true，计分
                        if (enemys[j].planehp <= 0) {
                            enemys[j].hpbar.style.width = 0;
                            enemys[j].boomSound.play();
                            scores = scores + enemys[j].planscore;
                            scorelabel.innerHTML = scores;
                            enemys[j].boomimage.style.display = 'block';
                            enemys[j].planeisdie = true;
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
            if (isCollide(enemybullets, 'selfplane', null, i)) {
                if (!this.hasClass(selfplane.imagenode, 'breathe')) selfplane.planehp--;
                addClass(selfplane.imagenode, 'breathe')
                // 3秒无敌状态
                setTimeout(function () {
                    removeClass(selfplane.imagenode, 'breathe')
                }, 3000)
                life.style.width = selfplane.planehp*20 + 'px';
                if(selfplane.planehp<3){
                    selfplane.hpbar.style.width = selfplane.sizeX / 3 * selfplane.planehp + 'px';
                }
                //删除子弹
                mainDiv.removeChild(enemybullets[i].imagenode);
                enemybullets.splice(i, 1);
            }
        }
        // 判断是否拾取补给包
        for (var i = 0; i < supplybags.length; i++) {
            if (isCollide(supplybags, 'selfplane', null, i)) {
                switch(supplybags[i].type){
                        // 增加子弹速度的补给包（全武器加成属性）
                    case 'bulletspeed':
                        if(bulletSpeedExtra<5){
                          bulletSpeedExtra++;  
                        }
                        break;
                        // 双枪补给包
                    case 'twobullets':
                        selfplane.bulletType = 'twobullets';
                        break;
                        // 火枪补给包
                    case 'firebullets':
                        selfplane.bulletType = 'firebullets';
                        break;
                        // 增加额外生命值的补给包
                    case 'extralife':
                        selfplane.planehp++;
                        life.style.width = selfplane.planehp*20 + 'px';
                        selfplane.hpbartotal.setAttribute('hp',parseInt(selfplane.hpbartotal.getAttribute('hp')) + 1);
                        if(selfplane.planehp<=3){
                            selfplane.hpbar.style.width = selfplane.sizeX / 3 * selfplane.planehp + 'px';
                        }
                        break;
                    case 'laserbullets':
                        selfplane.bulletType = 'laserbullets';
                        break;
                }
                supplybags[i].supplybagSound.play();
                supplybags[i].imagenode.style.display = 'none';
                supplybags[i].istaken = true
            }
        }
        
        if (selfplane.planehp <= 0) {
            console.log(missedEnemys)
            console.log(destroyedEnemys)
            //游戏结束，统计分数
            selfplane.boomimage.style.display = 'block';
            selfplane.boomSound.play();
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
    // 碰撞检测条件(array1宽高比array2小)
    function isCollide(array1, array2, i, j) {
        //array1最右边大于array2最左边，array1最左边小于array2最右边
        let leftside = false
        let topside = false
        if (array2 === 'selfplane') {
            leftside = (array1[j].imagenode.offsetLeft + array1[j].sizeX > selfplane.imagenode.offsetLeft) && (array1[j].imagenode.offsetLeft < selfplane.imagenode.offsetLeft + selfplane.sizeX)
            topside = (array1[j].imagenode.offsetTop <= selfplane.imagenode.offsetTop + selfplane.sizeY) && (array1[j].imagenode.offsetTop + array1[j].sizeY >= selfplane.imagenode.offsetTop)
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
        selfplane.imagenode.style.display = "block";
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
            ele.className = ele.className.replace(reg, "");
        }
    }
    //产生min到max之间的随机数
    function random(min, max) {
        return Math.floor(min + Math.random() * (max - min));
    }
    //产生min到max之间的随机整数
    function randomInt(min, max) {
        return parseInt(Math.random()*(max-min+1)+min,10)
    }
    // 暴击率触发可能性
    function getRandom(probability){  
        var probability = probability*100;  
        var odds = Math.floor(Math.random()*100);  
       
        if(probability === 1){return 1};
        if(odds < probability){  
            return 1;  
        }else{  
            return 0;  
        }  
    };  
    // 求子弹追踪我方飞机需要的水平方向速度（自动追踪功能，40表示40*20=800毫秒，子弹从顶部飞到最低需要的时间）
    function getequation(x1,x2,y1,y2) {
        var angle = -(90-Math.atan2(y2-y1,x2-x1)*180/Math.PI).toFixed(0);
        return {
            v: (x1-x2)/40,
            angle
        } 
    }