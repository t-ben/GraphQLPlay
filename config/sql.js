module.exports = {
  development: {
    database: 'Test',
    user: 'dev',
    password: 'Dev12345',
    server: 'localhost\\SQLEXPRESS', // You can use 'localhost\\instance' to connect to named instance     
  },
  // notes: the dev account is set on sql express on my local machine.
  //  sql server mangmt studio: right click the localhost\SQLEXPRESS: properties->Security
  //        verify Server Authentication: SQL Server and Windows Authentication mode is selected.
  //  created the login user: dev password: Dev12345
  
  // security->logins->dev-properties: 
  //    UserMappings: verify master + Test databases are checked.
  //    Securables: verify Connect SQL has grant permission.

  // ** verify that the service: sql server agent (SQLEXPRESS) is started
  //  at: computer management->services and applications ->services. 
};
