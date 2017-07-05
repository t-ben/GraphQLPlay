/*create the sql tables and content*/
IF OBJECT_ID('dbo.votes', 'U') IS NOT NULL 
  DROP TABLE dbo.votes;  
IF OBJECT_ID('dbo.names', 'U') IS NOT NULL 
  DROP TABLE dbo.names; 
IF OBJECT_ID('dbo.contests', 'U') IS NOT NULL 
  DROP TABLE dbo.contests; 
IF OBJECT_ID('dbo.users', 'U') IS NOT NULL 
  DROP TABLE dbo.users;

create table users (
  id int primary key identity(1,1),
  email varchar(128) not null,
  first_name varchar(128),
  last_name varchar(128),
  api_key varchar(128) not null unique,
  created_at datetime not null default getdate() 
);

create table contests (
  id int primary key identity(1,1),
  code varchar(255) not null unique,
  title varchar(255) not null,
  description text,
  status varchar(10) not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  created_at datetime not null default getdate(),
  created_by integer references users not null
);

create table names (
  id int primary key identity(1,1),
  contest_id integer references contests not null,
  label varchar(255) not null,
  normalized_label varchar(255) not null,
  description text,
  created_at datetime not null default getdate(),
  created_by integer references users not null,
  constraint unique_contest_label
    unique(contest_id, normalized_label)
);

create table votes (
  id int primary key identity(1,1),
  name_id integer references names not null,
  up bit not null,
  created_at datetime not null default getdate(),
  created_by integer references users not null,
  constraint user_can_vote_once_on_a_name
    unique(name_id, created_by)
);

INSERT INTO "users" ("email","first_name","last_name","api_key")
VALUES
('samer@agilelabs.com','Samer','Buna','4242'),
('creative@mind.com','Creative','Mind','0000');

INSERT INTO "contests" ("code","title","description","status","created_by")
VALUES
('free-programming-books-site','Free Programming Books Site','A list of free online programming books, categorized by languages/topics','draft',1),
('visualize-most-popular-tweets','Visualize Most Popular Tweets','A site to constantly visualize the most popular tweets in your stream','published',1),
('entrepreneurs-looknig-for-partnership','Interview Entrepreneurs Looking For Partnership',NULL,'archived',1);

INSERT INTO "names" ("contest_id","label","normalized_label","description","created_by")
VALUES
(1,'RootLib','rootlib','The Root Library',2),
(1,'The Free List','thefreelist',NULL,2),
(2,'PopTweet','poptweet',NULL,2),
(2,'TwitterScope','twitterscope',NULL,2);

INSERT INTO "votes" ("name_id","up","created_by")
VALUES
(1,1,1),
(1,1,2),
(2,1,1),
(2,0,2),
(3,0,1),
(3,0,2),
(4,1,1),
(4,1,2);
