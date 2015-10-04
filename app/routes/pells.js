import Ember from 'ember';

var MAX_CACHE_KEYS = 10;

var BasePellRoute = Ember.Route.extend({

  filters: [ "featured", "spoken_word", "melody", "rap" ],

  _stringized: function(p) {
    var str = '';
    Object.keys(p).forEach( k => str += p[k]);
    return str;
  },

  _totals: { },
  _keys_count: 0,

  getTotals: function(params) {

    var p = { };
    Ember.merge( p, params );

    delete p['reqtags']; // fill this in below

    var _key = this._stringized(p);

    if( _key in this._totals ) {
      return Ember.RSVP.resolve(this._totals[_key]);
    }

    var counts = { 
        all: this.store.count(p),
      };

    this.filters.forEach( f => {
      p.reqtags = f;
      counts[f] = this.store.count(p);
    });

    return Ember.RSVP.hash(counts)
            .then( r => {
              if( this._keys_count++ > MAX_CACHE_KEYS ) {
                Ember.debug('Dumping counts cache');
                this._keys_count = 0;
                this._totals = { };
              }
              ++this._keys_count;
              this._totals[ _key ] = r;
              return r;
            });
  },

});

export default BasePellRoute.extend({

  audioPlayer: Ember.inject.service(),
  
  queryParams: { 
    artist:  { refreshModel: true },
    filter:  { refreshModel: true },
    bpm:     { refreshModel: true },
    lic:     { refreshModel: true },
    unmixed: { refreshModel: true },
    limit:   { refreshModel: true },
    offset:  { refreshModel: true },
  },

  defaultQueryParams: {
    artist:  '-',
    filter:  'featured',
    bpm:     '-',
    lic:     'all',
    unmixed: false,
    limit:   8,
    offset:  0,
  },

  model: function( _params, transition ) {

    var params = {};

    Ember.merge( params, this.defaultQueryParams );
    Ember.merge( params, transition.queryParams );

    var args = {
      lic: params.lic,
      limit: params.limit,
      offset: params.offset,
      sort: 'date',
      ord: 'DESC'
    };

    if( params.bpm && params.bpm.match(/^bpm_[0-9]{3}_[0-9]{3}$/) ) {
      args.tags = params.bpm;
    }
    
    if( this.filters.contains(params.filter) ) {
      args.reqtags = params.filter;
    }

    if( params.unmixed  ) {
      args.remixmax = '0';
    }

    var artist = null;
    if( params.artist !== '-' ) {
      args.u = params.artist;
      artist = this.store.findUser(params.artist);
    }

    var hash = {
      artist:   artist,
      playlist: this.store.acappellas(args),
      total:    this.store.count(args),
      totals:   this.getTotals(args),
    };

    return Ember.RSVP.hash(hash);
  }
});
