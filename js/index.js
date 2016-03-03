/*
	Swipeable Tab
*/


$(function() {
	FastClick.attach(document.body);

	var itemCount = 8, //切换模块数(即总nav数)
		maxShowItem = 4, //每屏显示的nav数
		scrollPage = itemCount - maxShowItem, //nav可以切换移动的最大次数
		currentScrollPage = 0,
		currentStepIndex = 0, //当前显示的step
		currentNavIndex = 0, //当前显示的nav
		stepWidth, //单项内容宽度
		$navListItem = $('.nav-list-item'),
		$stepScroller = $('.step-list-scroller'),
		$content = $('.content'),
		inProgress = false, //是否正在切换
		$cover = $('#cover'),
		pageScrollTime = 250; //单项内容切换动画时间

	//css3动画支持检测
	//借鉴 http://osvaldas.info/image-lightbox-responsive-touch-friendly
	var cssTransitionSupport = function() {
			var s = document.body || document.documentElement,
				s = s.style;
			if (s.WebkitTransition == '') return '-webkit-';
			if (s.MozTransition == '') return '-moz-';
			if (s.OTransition == '') return '-o-';
			if (s.transition == '') return '';
			return false;
		},
		isCssTransitionSupport = cssTransitionSupport() === false ? false : true,
		cssTransitionTranslateX = function(element, positionX, speed) {
			var options = {},
				prefix = cssTransitionSupport();
			options[prefix + 'transform'] = 'translateX(' + positionX + ')';
			options[prefix + 'transition'] = prefix + 'transform ' + speed + 's linear';
			element.css(options);
		};

	//初始化UI，根据窗口大小动态调整导航和内容项尺寸
	function initUI() {
		var containerWidth = $('.nav-list-container').width(),
			itemWidth = mathDiv(containerWidth, maxShowItem);

		$('.nav-height').height(mathMul(itemWidth, 1.06));
		$('.nav-list-scroller').width(mathMul(itemWidth, itemCount));
		$navListItem.width(itemWidth);
		$navListItem.find('p').css('lineHeight', mathMul(itemWidth, 0.02) + 'em');
		$navListItem.find('i').css('fontSize', mathMul(itemWidth, 0.03) + 'em');
		$navListItem.find('span').css('fontSize', mathMul(itemWidth, 0.015) + 'em');

		$('.content').css('top', mathMul(itemWidth, 1.06) + 'px');

		stepWidth = $('.content').width();
		var stepHeight = $('.content').height();

		$('.step-width').width(stepWidth);
		$stepScroller.width(mathMul(stepWidth, itemCount));
		$stepScroller.height(stepHeight);
		$('.step-container').height(stepHeight);

		if (isCssTransitionSupport) {
			cssTransitionTranslateX($stepScroller, '0px', '0');
		}
	}

	initUI();

	$(window).resize(function() {
		initUI();
	});


	//https://github.com/cubiq/iscroll
	var navScroll = new IScroll('.nav-list-container', {
		eventPassthrough: true,
		scrollX: true,
		scrollY: false,
		preventDefault: false,
		tap: true,
		mouseWheel: true,
		snap: 'li'
	});

	function switchNav(index) {
		var toShowNavIndex = index;
		if (toShowNavIndex === currentNavIndex || toShowNavIndex === -1 || toShowNavIndex === itemCount) return false;

		$navListItem.eq(currentNavIndex).removeClass('current');
		$navListItem.eq(toShowNavIndex).addClass('current');
		currentNavIndex = toShowNavIndex;

		currentScrollPage = navScroll.currentPage.pageX;

		if (currentNavIndex - currentScrollPage > 3) { //写死了，待改进
			for (var i = 0; i < currentNavIndex - currentScrollPage - 3; i++) {
				navScroll.next();
			}
		} else if (currentNavIndex < currentScrollPage) {
			for (var i = 0; i < currentScrollPage - currentNavIndex; i++) {
				navScroll.prev();
			}
		}
	}

	//direction = -1 表示右移，1 表示左移
	function scrollStep(direction, num) {
		if (inProgress || (currentStepIndex === 0 && direction === -1) || (currentStepIndex === itemCount - 1 && direction === 1)) return false;

		inProgress = true;
		$cover.css('display', 'block'); //切换动画正进行时，透明遮挡防止误操作

		currentStepIndex += direction * num;

		if (isCssTransitionSupport) {
			var newX = $stepScroller.attr('poX') - mathMul(stepWidth, num) * direction;
			cssTransitionTranslateX($stepScroller, newX + 'px', pageScrollTime * num / 1000);
			$stepScroller.attr('poX', newX);
			setTimeout(function() {
				inProgress = false;
				$cover.css('display', 'none');
			}, pageScrollTime * num);
		} else {
			var newLeft = $stepScroller.position().left - mathMul(stepWidth, num) * direction;
			$stepScroller.animate({
				left: newLeft + 'px'
			}, pageScrollTime * num, 'swing', function() {
				inProgress = false;
				$cover.css('display', 'none');
			});
		}
	}

	//https://github.com/Clouda-team/touch.code.baidu.com
	touch.on($content, 'swipeleft', function(ev) {
		ev.preventDefault();
		scrollStep(1, 1);
		switchNav(currentNavIndex + 1);
	});

	touch.on($content, 'swiperight', function(ev) {
		ev.preventDefault();
		scrollStep(-1, 1);
		switchNav(currentNavIndex - 1);
	});

	function checkScrollBtn() {
		var $prev = $('.prev'),
			$next = $('.next');
		if (navScroll.currentPage.pageX === 0) {
			$prev.addClass('disabled');
			$next.removeClass('disabled');
		} else if (navScroll.currentPage.pageX === scrollPage) {
			$next.addClass('disabled');
			$prev.removeClass('disabled');
		} else {
			$prev.removeClass('disabled');
			$next.removeClass('disabled');
		}
	}

	checkScrollBtn();

	navScroll.on('scrollEnd', checkScrollBtn);

	$navListItem.on('tap', function() {
		var $this = $(this),
			toShowNavIndex = $this.index();
		if (toShowNavIndex > currentNavIndex) {
			scrollStep(1, (toShowNavIndex - currentNavIndex));
			switchNav(toShowNavIndex);
		} else if (toShowNavIndex < currentNavIndex) {
			scrollStep(-1, (currentNavIndex - toShowNavIndex));
			switchNav(toShowNavIndex);
		} else {
			return false;
		}
	});

	$('.prev').on('click', function() {
		navScroll.prev();
		checkScrollBtn();
	});

	$('.next').on('click', function() {
		navScroll.next();
		checkScrollBtn();
	});

	$('.load-container').hide();


	//后退2步
	$('a[href="#google"]').click(function(event) {
		event.preventDefault();
		scrollStep(-1, 2);
		switchNav(currentNavIndex - 2);
	});
	//前进1步
	$('a[href="#css3"]').click(function(event) {
		event.preventDefault();
		scrollStep(1, 1);
		switchNav(currentNavIndex + 1);
	});
	//后退4步
	$('a[href="#apple"]').click(function(event) {
		event.preventDefault();
		scrollStep(-1, 4);
		switchNav(currentNavIndex - 4);
	});



	//加减乘除
	function mathAdd(a, b) {
		if (!a) { a = 0; }
		if (!b) { b = 0; }
		var c, d, e;
		try { c = a.toString().split(".")[1].length; } catch (f) { c = 0; }
		try { d = b.toString().split(".")[1].length; } catch (f) { d = 0; }
		return e = Math.pow(10, Math.max(c, d)), (mathMul(a, e) + mathMul(b, e)) / e;
	}

	function mathSub(a, b) {
		if (!a) { a = 0; }
		if (!b) { b = 0; }
		var c, d, e;
		try { c = a.toString().split(".")[1].length; } catch (f) { c = 0; }
		try { d = b.toString().split(".")[1].length; } catch (f) { d = 0; }
		return e = Math.pow(10, Math.max(c, d)), (mathMul(a, e) - mathMul(b, e)) / e;
	}

	function mathMul(a, b) {
		if (!a) { a = 0; }
		if (!b) { b = 0; }
		var c = 0, d = a.toString(), e = b.toString();
		try { c += d.split(".")[1].length; } catch (f) {}
		try { c += e.split(".")[1].length; } catch (f) {}
		return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
	}

	function mathDiv(a, b) {
		if (!a) { a = 0; }
		if (!b) { b = 0; }
		var c, d, e = 0, f = 0;
		try { e = a.toString().split(".")[1].length; } catch (g) {}
		try { f = b.toString().split(".")[1].length; } catch (g) {}
		return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mathMul(c / d, Math.pow(10, f - e));
	}

});