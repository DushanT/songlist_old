var htmlTemplates = {
    tab:   '<li class="bands-tab">\
                 <a id="tab-{tab.id}" data-toggle="tab" href="#bands-{tab.lang}" >{tab.langUpper} <span class="badge">{tab.badge}</span></a>\
            </li>',

    bandsWrapper: '<div id="bands-{band.lang}" class="tab-pane fade"></div>',

	band:  '<div class="row list-group">\
                 <div id="band-{band.id}" class="col-xs-12 btn btn-primary js-toggle-songs js-band-name">\
             		{band.name} <span class="badge">{band.badge}</span>\
             	 </div>\
                 <div class="band-content-wrapper col-xs-12 list-group hidden">\
					{songs.html}\
                 </div>\
            </div>',

    song:  '<div id="song-{song.id}" class="song-name list-group-item text-center js-toggle-songs-content">\
				{song.title}\
            </div>\
            <div class="song-content-wrapper container hidden">\
                 <div class="row text-left">\
                     <div class="song-content center-block">\
                          {song.content}\
                     </div>\
                 </div>\
            </div>'
};