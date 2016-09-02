var htmlTemplates = {
    tab:   '<li class="bands-tab">\
                 <a id="tab-{tab.id}" data-toggle="tab" href="#bands-{tab.lang}" >{tab.langUpper} <span class="badge">{tab.badge}</span></a>\
            </li>',

    bandsWrapper: '<div id="bands-{band.lang}" class="tab-pane fade"></div>',

    band:  '<div class="container-fluid">\
	       <div class="row list-group">\
                 <div id="band-{band.id}" class="col-xs-12 col-sm-8 col-sm-offset-2 btn btn-primary js-toggle-songs js-band-name">\
             		{band.name} <span class="badge">{band.badge}</span>\
             	 </div>\
                 <div class="band-content-wrapper col-xs-12 col-sm-8 col-sm-offset-2 hidden">\
                    <div class="row">\
                        {songs.html}\
                    </div>\
                 </div>\
             </div>\
            </div>',

    song:  '<div id="song-{song.id}" class="song-name col-xs-12 list-group-item text-center js-toggle-songs-content">\
                {song.title}\
            </div>\
            <div class="song-content-wrapper col-xs-12 hidden">\
                <div class="transposition">\
                    <div>Transpose:</div>\
                    <span class="btn btn-default btn-sm transpose" data-transpose="-1"><span class="glyphicon glyphicon-minus"></span></span>\
                    <span class="btn btn-default btn-sm transpose" data-transpose="1"><span class="glyphicon glyphicon-plus"></span></span>\
                </div>\
                {song.content}\
            </div>'
};