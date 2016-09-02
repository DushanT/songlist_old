var htmlTemplates = {
    tab:   '<li class="bands-tab">\
                 <a id="tab-{tab.id}" data-toggle="tab" href="#bands-{tab.lang}" >{tab.langUpper} <span class="badge">{tab.badge}</span></a>\
            </li>',

    bandsWrapper: '<div id="bands-{band.lang}" class="row tab-pane fade"></div>',

    band:  '<div class="band-wrapper col-sm-8 col-sm-offset-2">\
                 <div id="band-{band.id}" class="btn-block btn btn-primary js-toggle-songs js-band-name">\
                    {band.name} <span class="badge">{band.badge}</span>\
                 </div>\
                 <div class="band-content-wrapper hidden">\
                    {songs.html}\
                 </div>\
            </div>',

    song:  '<div id="song-{song.id}" class="song-name list-group-item text-center js-toggle-songs-content">\
                {song.title}\
            </div>\
            <div class="song-content-wrapper hidden">\
                {song.content}\
            </div>'
};