//to run this test:
//  node test.js {hello} 
//  {hello} is the query.

const nodeEnv = require('./lib/util');
console.log(`Running in ${nodeEnv} mode...`);

//expect a query from cmd line:
const query = process.argv[2];
const schema = require('./schema/index');
const {graphql} = require('graphql');

graphql(schema, query).then( result => {
  console.log(result);
});