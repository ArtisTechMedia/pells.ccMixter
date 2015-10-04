import Ember from 'ember';

function jqerr(e,text) {
  Ember.debug(text);
}

export default Ember.Route.extend({

  audioPlayer: Ember.inject.service(),

  watchPlayer: function() {
    Ember.$('.waveimage.bar').fadeOut();
    var imageURL = this.get('audioPlayer.nowPlaying.wavImageURL');
    if( imageURL ) {
      // todo: export full xml+svg and put in <img> tag
      var args = {
          url: imageURL,
          method: 'GET',
          dataType: 'text',
          error: jqerr,
        };      
      Ember.RSVP.resolve(Ember.$.ajax(args)).then( svg => {
        Ember.$('.waveimage.bar').html(svg).fadeIn();
      });
    }
  }.observes('audioPlayer.nowPlaying'),

  _selected: 0,

  actions: {
    
    popup: function(popupType) {
      return popupType;
    },

    clearOptions: function() {
      this.transitionTo('/pells', { queryParams: { } } );
    },

    playlistActions: function( actionType, model ) {
      if( actionType === 'title' ) {
        this.transitionTo( 'pells.pell', model.id );
      } else if( actionType === 'artist' ) {
        this.transitionTo( 'pells', { queryParams: { artist: model.artist.id } } );
      }
    },

    selectLine: function(pell) {
      if( this._selected ) {
        Ember.$('#line_' + this._selected).removeClass('selected');
      }
      Ember.$('#line_' + pell.id).addClass('selected');
      this.transitionTo( 'pells.pell', pell.id );
      try {
        this.get('audioPlayer').togglePlay(pell);
      } catch (e) {
        Ember.debug(e);
      }
    },
  }
});
