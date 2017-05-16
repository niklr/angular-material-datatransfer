import 'core-js/client/shim';
import 'reflect-metadata';
require('zone.js/dist/zone');

import 'ts-helpers';

if (process.env.ENV === 'build') {
  // Production

} else {
  // Development

  Error['stackTraceLimit'] = Infinity;

  require('zone.js/dist/long-stack-trace-zone');
}

// https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      let subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      let lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}
