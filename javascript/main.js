$(function(){

	// TweenMax intro
	
	$('[data-toggle="tooltip"]').tooltip();

	var bandsSK = $("#bands-sk"),
		bandsEN = $("#bands-en"),
		tabs = $(".bands-tab"),
		scrollButtons = $(".autoscroll-button");

	TweenMax.set([tabs, scrollButtons], {autoAlpha: 0});
	TweenMax.set('.autoscroll', {
		position: 'fixed',
		right: 0,
		top: '50%',
		yPercent: -50,
	});

	var bands = db.bands;
	var htmlBands = {
		sk: '',
		en: ''
	};
	var band = null;
	var song = null;

	for ( var bandIndex in bands ) {
		band = bands[bandIndex];
		var htmlSongs = {
			sk: '',
			en: ''
		};
		for ( var songIndex in band.songs ) {
			song = band.songs[songIndex];
			var contentWithChords = song.content.replace(/;/g,'<br>').replace(/\[(.+?)\]/g, '<span class="chord">$1</span>');
			htmlSongs[band.lang] += htmlTemplates.song
							.replace(/\{song\.id\}/, bandIndex + '-' + songIndex)
							.replace(/\{song\.title\}/g, song.title)
							.replace(/\{song\.content\}/g, contentWithChords);
		}

		htmlBands[band.lang] += htmlTemplates.band
							.replace(/\{band\.id\}/, bandIndex)
							.replace(/\{band\.name\}/, band.name)
							.replace(/\{songs\.html\}/, htmlSongs[band.lang]);
	}
	
	bandsSK.html(htmlBands.sk);
	bandsEN.html(htmlBands.en);
	
	$(".bands-tab a").html(function(){
		var badgeNum = $($(this).attr('href')).children('.btn').length;
		if (badgeNum !== 0) {
			$(this).next('.badge').html(badgeNum > 1 ? badgeNum + ' bands' : badgeNum + ' band');
		}
	});

	// TweenMax.set('.tab-pane .row', {  });

	var tlPageLoad = new TimelineMax();
	var tlOpenSong = new TimelineMax();
	var tlCloseSong = new TimelineMax();
	var tlCloseBane = new TimelineMax();

	tlPageLoad.staggerFromTo(tabs, 0.3, { y: 100 }, { x: 0, y: 0, autoAlpha: 1, ease: Power2.easeOut }, 0.5)
		.staggerFromTo('.tab-pane .row', 0.1, { opacity: 0, yPercent: -100 }, { yPercent: 0, opacity: 1 }, 0.01);

	$(".js-band-name").each(function(){
		var badgeNum = $(this).next('.list-group').children('.list-group-item').length;
		if (badgeNum !== 0) {
			$(".badge", this).html(badgeNum > 1 ? badgeNum + ' songs' : badgeNum + ' song');
		}
	});

	tabs.on('click', function() {
		closeSong($(".song-content-wrapper.active"));
		closeBand($(".band-content-wrapper.active"));
	});

	var activeScrollPositionBottom;
	$(".js-toggle-songs-content").on('click', function() {
		var _ = $(this);
		var next = _.next();
		if (next.hasClass('hidden')) {
			openSong(next);
		} else {
			closeSong(next);
			TweenMax.to(document.body, 1, { scrollTop: _.offset().top });
		}
	});

	$(".js-toggle-songs").on('click', function() {
		var _ = $(this);
		var next = _.next();
		if (next.hasClass('hidden')) {
			openBand(next);
			TweenMax.to(document.body, 0.6, { scrollTop: _.offset().top});
		} else {
			closeBand(next);
			TweenMax.to(document.body, 0.6, { scrollTop: _.offset().top});
		}
	});

	var lastScrollPosition = document.body.scrollTop;
	var scrollSpeed = 0;
	// var scrollMax = 10;
	var interval = null;
	$(".autoscroll > div").on('click', function () {
		// console.log(scrollSpeed, 'before');
		var dataScroll = $(this).data('scroll');
		if (scrollSpeed === 0) {
			scrollSpeed = dataScroll;
		}
		if( interval === null || interval !== null && /*scrollSpeed < scrollMax && scrollSpeed > -scrollMax && */dataScroll !== 0) {
			clearInterval(interval);
			var absScrollSpeed = Math.abs(scrollSpeed);
			// console.log(dataScroll, 'data');
			interval = setInterval(function(){
				document.body.scrollTop += scrollSpeed > 0 ? 1 : -1 ;
				// console.log(lastScrollPosition, document.body.scrollTop);
				if (lastScrollPosition === document.body.scrollTop || (activeScrollPositionBottom > 0 && activeScrollPositionBottom <= (document.body.scrollTop + $(window).height()))) {
					clear();
				}
				lastScrollPosition = document.body.scrollTop;
			}, 300 / absScrollSpeed );
			scrollSpeed += dataScroll * (absScrollSpeed > 5 ? ( absScrollSpeed > 10 ? 3 : 2 ) : 1);
			if(scrollSpeed === 0) {
				scrollSpeed += dataScroll;
			}
			// console.log(scrollSpeed, 'after');
		} else {
			// console.log('clear');
			clear();
		}
	});

	function clear() {
		clearInterval(interval);
		interval = null;
		scrollSpeed = 0;
	}

	function openSong(element) {
		$('.song-content-wrapper').addClass('hidden').removeClass('active');
		TweenMax.set(element, {className:'+=active'});
		TweenMax.set(element, { className: '-=hidden', opacity: 0 });
		tlOpenSong.from(element, 0.5, { height: 0, clearProps: 'height' })
			.to(element, 0.5, { opacity: 1 }, '-=0.2')
			.to(document.body, 0.6, { scrollTop: element.prev().offset().top, onComplete: function(){
				activeScrollPositionBottom = element.offset().top + element.height();
				if(element.height() > $(window).height()) {
					TweenMax.staggerFromTo(scrollButtons, 0.3, { x: 100 }, { autoAlpha: 1, x: 0, ease: Back.easeOut }, 0.05);
				}
			}}, '-=0.1');
	}

	function closeSong(element) {
		if(element && !element.length) {return;}

		TweenMax.set(element, {className:'-=active'});
		tlCloseSong.staggerTo(scrollButtons, 0.15, { autoAlpha: 0, x: 100, ease: Back.easeInOut }, 0.1)
			.to(element, 0.5, { opacity: 0, height: 0 })
			.set(element, {className: '+=hidden', clearProps: 'height' });
	}

	function openBand(element) {
		$('.band-content-wrapper').addClass('hidden');
		closeSong($('.song-content-wrapper.active'));
		TweenMax.set(element, {className: '-=hidden', opacity: 0 });
		TweenMax.to(element, 0.5, { opacity: 1, clearProps: 'height' });
		TweenMax.set(element, {className: '+=active'});
	}

	function closeBand(element) {
		if(element && !element.length) {return;}

		tlCloseBand.to(element, 0.5, { opacity: 0, height: 0 })
			.set(element, {className: '+=hidden', clearProps: 'height' })
			.set(element, {className: '-=active'});
	}

});