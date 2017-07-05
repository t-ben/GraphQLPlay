const humps = require('humps');
const _ = require("lodash");

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  orderedFor: (rows, keys, field, singleObject) => {
    // return the rows ordered for the collection of keys
    console.log(`orderedFor rows:`);
    console.dir(rows);
    console.log(`keys: ${keys} field: ${field}`)
    const data = humps.camelizeKeys(rows);
    const inGroupsOfField = _.groupBy(data, field);
    return keys.map(element => {
      const elementArray = inGroupsOfField[element];
      if (elementArray) {
        return singleObject ? elementArray[0] : elementArray;
      }
      return singleObject ? {} : [];
    });
  },
  slug: str => {
    return str.toLowerCase().replace(' ', '-');// /[\s\W-]+/
  },
  normalizeLabel: str => {
    return str.toLowerCase().replace(' ', '');
  }
};
