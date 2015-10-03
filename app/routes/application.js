import Ember from 'ember';

function jqerr(e) {
  Ember.debug(e);
}

export default Ember.Route.extend({

  audioPlayer: Ember.inject.service(),

  defaultModel: {
    user_id: '-',
    filter: 'featured',
    bpm: '-',
    lic: 'all',
    limit: 10,
    remixed: '-'
  },

  watchPlayer: function() {
    var nowPlaying = this.get('audioPlayer.nowPlaying');
    if( nowPlaying ) {
      var args = {
          url: 'http://ccmixter.org/waveimage/' + nowPlaying.id + '/0',
          method: 'GET',
          dataType: 'text',
          error: jqerr,
        };      

      Ember.RSVP.resolve(Ember.$.ajax(args)).then( svg => {
        Ember.$('.waveimage.bar').html(svg);
      });
    }
  }.observes('audioPlayer.nowPlaying'),

  actions: {
    
    popup: function(popupType) {
      return popupType;
    },

    clearOptions: function() {
      this.transitionTo('/pells', { queryParams: { } } );
    },

    togglePlay: function(pell) {
      this.get('audioPlayer').togglePlay(pell);
    },

    playlistActions: function( actionType, model ) {
      if( actionType === 'title' ) {
        this.transitionTo( 'pells.pell', model.id );
      } else if( actionType === 'artist' ) {
        this.transitionTo( 'pells', { queryParams: { artist: model.artist.id } } );
      }
    }
  }
});
