$(function(){

	// TweenMax intro
	var mainContent = $("#main-content"),
		mainNav = $("#main-nav"),
		scrollButtons = $(".autoscroll-button");

	var songlistLS = {
		lastBandId: "",
		lastSongId: "",
		lastLangId: "",
	};

	var bands = db.bands;
	var htmlBands = [];
	var countBands = [];
	var band = null;
	var song = null;

	for ( var bandIndex in bands ) {
		band = bands[bandIndex];
		var htmlSongs = [];
		if (htmlBands[band.lang] === undefined) {
			htmlBands[band.lang] = '';
			countBands[band.lang] = 1;
		} else {
			countBands[band.lang]++;
		}
		htmlSongs[band.lang] = '';
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
							.replace(/\{band\.badge\}/, Object.keys(band.songs).length)
							.replace(/\{songs\.html\}/, htmlSongs[band.lang]);
	}

	var bandId = 1;
	for ( var bandLang in htmlBands ) {
		$(htmlTemplates.tab
			.replace(/\{tab\.id\}/, bandId++)
			.replace(/\{tab\.lang\}/, bandLang)
			.replace(/\{tab\.langUpper\}/, bandLang.toUpperCase())
			.replace(/\{tab\.badge\}/, countBands[bandLang]))
			.appendTo(mainNav);
		
		$(htmlTemplates.bandsWrapper.replace(/\{band\.lang\}/, bandLang))
			.html(htmlBands[bandLang])
			.appendTo(mainContent);
	}
	

	var lastScrollPosition = document.body.scrollTop;
	var scrollSpeed = 0;
	// var scrollMax = 10;
	var interval = null;

	$('[data-toggle="tooltip"]').tooltip();

	var tlPageLoad = new TimelineMax();
	var tlOpenSong = new TimelineMax();
	var tlCloseSong = new TimelineMax();
	var tlCloseBand = new TimelineMax();

	var tabs = $(".bands-tab");
	tlPageLoad.staggerFromTo(tabs, 0.5, { xPercent: -100 }, { xPercent: 0, autoAlpha: 1, ease: Power2.easeOut }, 0.5);

	tabs.on('click', function() {
		
		songlistLS.lastLangId = '#' + $('a', this).attr('id');
		localStorage.setItem('songlist', JSON.stringify(songlistLS));

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
			scrollToElement(_, 1);
		}
	});

	$(".js-toggle-songs").on('click', function() {
		var _ = $(this);
		var next = _.next();
		if (next.hasClass('hidden')) {
			openBand(next);
			scrollToElement(_, 0.6);
		} else {
			closeBand(next);
			scrollToElement(_, 0.6);
		}
	});

	
	scrollButtons.on('click', function () {
		TweenMax.fromTo($('> span', this), 0.4, { scale: 2.5 }, { scale: 1 });

		// console.log(scrollSpeed, 'before');
		var dataScroll = $(this).data('scroll');
		var activeSong = $(".song-content-wrapper.active");
		if (isNaN(parseInt(dataScroll))) {
			if ( dataScroll === 'start' ) {
				scrollToElement(activeSong.prev(), 0.5);
			} else if ( dataScroll === 'end' ) {
				scrollToElement(activeSong, 0.5, activeSong.offset().top + activeSong.height() - $(window).height());
			}
			return;
		}
		if (scrollSpeed === 0) {
			scrollSpeed = dataScroll;
		}

		if( interval === null && dataScroll !== 0 || interval !== null && dataScroll !== 0) {
			clearInterval(interval);
			var absScrollSpeed = Math.abs(scrollSpeed);
			// console.log(dataScroll, 'data');
			interval = setInterval(function(){

				document.body.scrollTop += scrollSpeed > 0 ? 1 : -1 ;
				// console.log(lastScrollPosition, document.body.scrollTop);
				activeScrollPositionBottom = activeSong.offset().top + activeSong.height();
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
			console.log('clear2');
			clear();
		}
	});

	function clear() {
		clearInterval(interval);
		interval = null;
		scrollSpeed = 0;
	}

	function openSong(element) {
		if(element && !element.length) {return;}

		songlistLS.lastSongId = '#' + element.prev().attr('id');
		localStorage.setItem('songlist', JSON.stringify(songlistLS));
		
		$('.song-content-wrapper').addClass('hidden').removeClass('active');
		TweenMax.set(element, {className:'+=active'});
		TweenMax.set(element, { className: '-=hidden', opacity: 0 });
		tlOpenSong.from(element, 0.5, { height: 0, clearProps: 'height' })
			.to(element, 0.5, { opacity: 1, onComplete: function () {
				scrollToElement(element.prev(), 0.6);
				if(element.height() > $(window).height()) {
					TweenMax.staggerFromTo(scrollButtons, 0.3, { x: 100 }, { autoAlpha: 1, x: 0, ease: Back.easeOut }, 0.05);
					TweenMax.staggerTo('.autoscroll .glyphicon', 0.3, { rotation: 90, y: 2 }, 0.05);
				}
			}}, '-=0.2');

	}

	function closeSong(element) {
		if(element && !element.length) {return;}
		
		songlistLS.lastSongId = "";
		localStorage.setItem('songlist', JSON.stringify(songlistLS));

		TweenMax.set(element, {className:'-=active'});
		tlCloseSong.staggerTo(scrollButtons, 0.3, { rotation: 0, autoAlpha: 0, x: 100, ease: Back.easeInOut }, 0.05)
			.to(element, 0.5, { opacity: 0, height: 0 })
			.set(element, {className: '+=hidden', clearProps: 'height' });
	}

	function openBand(element) {
		if(element && !element.length) {return;}

		songlistLS.lastBandId = '#' + element.prev().attr('id');
		localStorage.setItem('songlist', JSON.stringify(songlistLS));

		$('.band-content-wrapper').addClass('hidden');
		closeSong($('.song-content-wrapper.active'));
		TweenMax.set(element, {className: '-=hidden', opacity: 0 });
		TweenMax.to(element, 0.5, { opacity: 1, clearProps: 'height' });
		TweenMax.set(element, {className: '+=active'});
	}

	function closeBand(element) {
		if(element && !element.length) {return;}

		songlistLS.lastBandId = "";
		songlistLS.lastSongId = "";
		localStorage.setItem('songlist', JSON.stringify(songlistLS));

		tlCloseBand.to(element, 0.5, { opacity: 0, height: 0 })
			.set(element, {className: '+=hidden', clearProps: 'height' })
			.set(element, {className: '-=active'});
	}

	function scrollToElement(element, duration, offset) {
		var $body = $(document.body);
		offset = offset || element.offset().top;

		TweenMax.to($body, duration, { scrollTop: offset - parseInt($body.css('paddingTop'))});
	}

	var lastLang = null;
	var lastBand = null;
	var lastSong = null;
	if ( localStorage.songlist && ( songlistLS = JSON.parse(localStorage.songlist)) ) {
		
		if ((lastLang = $(songlistLS.lastLangId)) && lastLang.length) {
			lastLang.click();
		}

		if ((lastBand = $(songlistLS.lastBandId)) && lastBand.length) {
			openBand(lastBand.next());
		}
		
		if ((lastSong = $(songlistLS.lastSongId)) && lastSong.length) {
			openSong(lastSong.next());
		}
	}

});