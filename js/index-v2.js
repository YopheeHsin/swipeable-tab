$(function() {
	FastClick.attach(document.body);

	var maxShowItem = 4,
		currentScrollIndex = 0,
		stepWidth,
		$navListItem = $('.nav-list-item'),
		itemCount = $navListItem.length,
		scrollPage = itemCount - maxShowItem,
		$stepScroller = $('.step-list-scroller'),
		$content = $('.content'),
		$cover = $('#cover'),
		inProgress = false,
		pageScrollTime = 300,
		bannerRatio = 2;


	function initUI() {
		var containerWidth = $('.nav-list-container').width(),
			itemWidth = mathDiv(containerWidth, maxShowItem);

		$('.nav-height').height(mathMul(itemWidth, 1.06));
		$('.nav-list-scroller').width(mathMul(itemWidth, itemCount));
		$navListItem.width(itemWidth);
		$navListItem.find('p').css('lineHeight', mathMul(itemWidth, 0.02) + 'em');
		$navListItem.find('i').css('fontSize', mathMul(itemWidth, 0.03) + 'em');
		$navListItem.find('span').css('fontSize', mathMul(itemWidth, 0.015) + 'em');

		var stepWidth = $content.width();
		$('.step-width').width(stepWidth);
		$content.css('top', mathMul(itemWidth, 1.06) + 'px');

		var stepHeight = $content.height();
		$('.step-width').height(stepHeight);
	}

	initUI();

	// $(window).resize(function() {
	// 	initUI();
	// });


	var navScroll = new IScroll('.nav-list-container', {
		eventPassthrough: true,
		scrollX: true,
		scrollY: false,
		preventDefault: false,
		tap: true,
		mouseWheel: true,
		snap: 'li'
	});

	function switchNav(toShowNavIndex) {
		if (toShowNavIndex === -1 || toShowNavIndex === itemCount) return;
		$navListItem.removeClass('current').eq(toShowNavIndex).addClass('current');
		
		var currentScrollPage = navScroll.currentPage.pageX;
		if (toShowNavIndex - currentScrollPage > 3) { 
			navScroll.goToPage(currentScrollPage + 1, 0);
		} else if (toShowNavIndex < currentScrollPage) {
			navScroll.goToPage(currentScrollPage - 1, 0);
		}
	}

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
		if (scrollPage <= 0) {
			$prev.addClass('disabled');
			$next.addClass('disabled');
		}
	}

	checkScrollBtn();
	navScroll.on('scrollEnd', checkScrollBtn);


	var stepSwiper = new Swiper('.swiper-container', {
		// observer: true,
		// observeParents: true,
		onSlideChangeStart: function() {
			$cover.css('display', 'block');
		},
		onTransitionEnd: function(swiper) {
			currentScrollIndex = swiper.activeIndex;
			switchNav(currentScrollIndex);
			// setTimeout(function(){
				$cover.css('display', 'none');
			// }, 300);
		}
	});

	function scrollStep(direction, num) {
		if ((currentScrollIndex === 0 && direction === -1) || (currentScrollIndex === itemCount - 1 && direction === 1)) return false;
		stepSwiper.slideTo(currentScrollIndex + direction * num);
	}

	$navListItem.on('tap', function() {
		var toShowNavIndex = $(this).index();
		if (toShowNavIndex === currentScrollIndex) return;
		if (toShowNavIndex > currentScrollIndex) scrollStep(1, (toShowNavIndex - currentScrollIndex));
		if (toShowNavIndex < currentScrollIndex) scrollStep(-1, (currentScrollIndex - toShowNavIndex));
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
	});
	//前进1步
	$('a[href="#css3"]').click(function(event) {
		event.preventDefault();
		scrollStep(1, 1);
	});
	//后退4步
	$('a[href="#apple"]').click(function(event) {
		event.preventDefault();
		scrollStep(-1, 4);
	});


});

function mathAdd(a,b){if(!a){a=0}if(!b){b=0}var c,d,e;try{c=a.toString().split(".")[1].length}catch(f){c=0}try{d=b.toString().split(".")[1].length}catch(f){d=0}return e=Math.pow(10,Math.max(c,d)),(mathMul(a,e)+mathMul(b,e))/e}
function mathSub(a,b){if(!a){a=0}if(!b){b=0}var c,d,e;try{c=a.toString().split(".")[1].length}catch(f){c=0}try{d=b.toString().split(".")[1].length}catch(f){d=0}return e=Math.pow(10,Math.max(c,d)),(mathMul(a,e)-mathMul(b,e))/e}
function mathMul(a,b){if(!a){a=0}if(!b){b=0}var c=0,d=a.toString(),e=b.toString();try{c+=d.split(".")[1].length}catch(f){}try{c+=e.split(".")[1].length}catch(f){}return Number(d.replace(".",""))*Number(e.replace(".",""))/Math.pow(10,c)}
function mathDiv(a,b){if(!a){a=0}if(!b){b=0}var c,d,e=0,f=0;try{e=a.toString().split(".")[1].length}catch(g){}try{f=b.toString().split(".")[1].length}catch(g){}return c=Number(a.toString().replace(".","")),d=Number(b.toString().replace(".","")),mathMul(c/d,Math.pow(10,f-e))}


