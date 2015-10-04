import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: [
    "artist",
    "filter",
    "bpm",
    "lic",
    "limit",
    "unmixed",
    "offset",
  ],

  artist: '-',
  filter: 'featured',
  bpm: '-',
  lic: 'all',
  limit: 8,
  unmixed: false,
  offset: 0,
});
