var htmlTemplates = {
	band:  '<div class="row list-group">\
                 <div id="band-{band.id}" class="col-xs-12 btn btn-primary js-toggle-songs js-band-name">\
             		{band.name} <span class="badge"></span>\
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