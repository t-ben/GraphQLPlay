const { orderedFor } = require("./../lib/util");

module.exports = mPool => {
  return {
    getUsersByIds(userIds) {
      return mPool.collection('users')
        .find({userId: { $in: userIds }})
        .toArray()
        .then( rows => { return orderedFor(rows, userIds, 'userId', true) });
    }
    // getCounts(user, countsField){
    //   return mPool.collection('users')
    //     .findOne({userId: user.id})
    //     .then( userCounts => userCounts[countsField]);
    // }
  };
};