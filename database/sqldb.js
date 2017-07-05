const humps = require('humps');
const { slug, normalizeLabel } = require('../lib/util');
// const _ = require("lodash");
const { orderedFor } = require("./../lib/util");
const sql = require('mssql');

module.exports = sqlPool => {
  return {
    async getUsersByIds(userIds) {
      //const idsString = userIds.join(",");
      //console.log(`getUsersByIds: ${userIds}`);      
      const response = await sqlPool.request()
        //.input('userIds', ids)
        .query(`
          select * from users
          where id in (${userIds})
        `);

      //this does not work:
      // select * from users
      //   where id in ($1)
      //   `, [userIds]  

      //BUT this also fails!! when the userIds is an array:        
        // sqlPool.request()
        //   .input('userIds', userIds)
        //   .query(`
        //     select * from users
        //     where id in (@userIds)
        //   `);
        // Conversion failed when converting the nvarchar value '2,1' to data type int.


      //console.dir(response.recordset);
      //returned users have to be ordered same as the userIds: (see orderedFor)
      return orderedFor(response.recordset, userIds, 'id', true);
    },
    async getUsersByApiKeys(apiKeys) {

      const response = await sqlPool.request()
        .input('apiKeys', apiKeys)
        .query(`
          select * from users 
          where api_key in (@apiKeys)
        `);

      return orderedFor(response.recordset, apiKeys, 'apiKey', true);
      //console.dir(response);      
    },
    async getContestsForUserIds(userIds) {
      //console.log(`sqldb.getContestsForUserIds: ${userIds}`);
      const response = await sqlPool.request()
        //.input('userIds', userIds)
        .query(`
          select * from contests 
          where created_by in (${userIds})
        `);
      //console.dir(response.recordset);
      const result = orderedFor(response.recordset, userIds, 'createdBy', false);
      //console.log(`sqldb.getContestsForUserIds result: ${JSON.stringify(result)}`);
      return result;
      //return humps.camelizeKeys(response.recordset);      
    },
    async getNamesForContestIds(contestIds) {
      //console.log(`sqldb.getNamesForContestIds: ${contestIds}`);
      try {
        const response = await sqlPool.request()
          //.input('contestIds', contestIds)
          .query(`
            select * from names 
            where contest_id in (${contestIds})
          `);
        //console.dir(response.recordset);
        const result = orderedFor(response.recordset, contestIds, 'contestId', false);
        //console.log(`sqldb.getNamesForContestIds result: ${JSON.stringify(result)}`);
        return result;
      }
      catch (e) {
        console.log(e);
      }
    },
    async addNewContest({ apiKey, title, description }) {
      //console.log(`addNewContest apiKey= ${apiKey}, title= ${title}, description= ${description}`);
      try {
        const response = await sqlPool.request()
          .input('code', slug(title))
          .input('title', title)
          .input('description', description)
          .input('apiKey', apiKey)
          .query(`
          insert into contests( code, title, description, created_by)          
          values(@code, @title, @description, (select id from users where api_key = @apiKey))
          select * from contests where id = @@IDENTITY
        `);
        //output inserted.id, inserted.code, inserted.title, inserted.description, inserted.created_by
        //console.log(`response.recordset= ${JSON.stringify(response.recordset)}`);
        const result = humps.camelizeKeys(response.recordset);
        //console.log(`result=`); console.dir(result);
        return result[0]; //should return a Contest
      } catch (e) {
        console.log(e);
      }
    },
    async addNewName({ apiKey, label, contestId, description }) {
      try {
        const normalizedLabel = normalizeLabel(label);
        const response = await sqlPool.request()
          .input('apiKey', apiKey)
          .input('label', label)
          .input('norm', normalizedLabel)
          .input('contestId', contestId)
          .input('description', description)
          .query(`
        insert into names( contest_id, label, normalized_label, description, created_by )
        values( @contestId, @label, @norm, @description, (select id from users where api_key = @apiKey))
        select * from names where id = @@IDENTITY
      `);
        const result = humps.camelizeKeys(response.recordset);
        //console.log(`result=`); console.dir(result);
        return result[0]; //should return a Name
      } catch (e) {
        console.log(e);
      }
    }
  }
}