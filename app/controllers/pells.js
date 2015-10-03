import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: [
    "artist",
    "filter",
    "bpm",
    "lic",
    "limit",
    "remixed",
    "recent",
    "offset",
  ],

  artist: '-',
  filter: 'featured',
  bpm: '-',
  lic: 'all',
  limit: 10,
  remixed: false,
  recent: false,
  offset: 0,
});
