use pos_management_db;

create role 'database_admin';
create role 'senior_developer';
create role 'backend_developer';
create role 'frontend_developer';
create role 'data_analyst';
create role 'qa_tester';
create role 'intern_developer';
create role 'intern_analyst';

grant all privileges on *.* to 'database_admin' with grant option;
grant create user on *.* to 'database_admin';
grant reload on *.* to 'database_admin';
grant shutdown on *.* to 'database_admin';
grant process on *.* to 'database_admin';
grant super on *.* to 'database_admin';
grant replication slave on *.* to 'database_admin';
grant replication client on *.* to 'database_admin';

grant all privileges on pos_management_db.* to 'senior_developer';
grant create user on *.* to 'senior_developer';
grant reload on *.* to 'senior_developer';
grant process on *.* to 'senior_developer';

grant select, insert, update, delete on pos_management_db.pos_system to 'backend_developer';
grant select, insert, update, delete on pos_management_db.pos_feature to 'backend_developer';
grant select, insert, update, delete on pos_management_db.pricing to 'backend_developer';
grant select, insert, update, delete on pos_management_db.store_client to 'backend_developer';
grant select, insert, update, delete on pos_management_db.pos_sale to 'backend_developer';
grant select, insert, update, delete on pos_management_db.store_inventory to 'backend_developer';
grant select, insert, update, delete on pos_management_db.store_transaction to 'backend_developer';
grant select, insert, update, delete on pos_management_db.transaction_item to 'backend_developer';

grant select on pos_management_db.pos_system to 'frontend_developer';
grant select on pos_management_db.pos_feature to 'frontend_developer';
grant select on pos_management_db.pricing to 'frontend_developer';
grant select on pos_management_db.store_client to 'frontend_developer';
grant select, insert on pos_management_db.store_transaction to 'frontend_developer';
grant select, insert on pos_management_db.transaction_item to 'frontend_developer';
grant select on pos_management_db.store_inventory to 'frontend_developer';
grant select on pos_management_db.pos_sale to 'frontend_developer';

grant select on pos_management_db.pos_system to 'data_analyst';
grant select on pos_management_db.pos_feature to 'data_analyst';
grant select on pos_management_db.pricing to 'data_analyst';
grant select on pos_management_db.store_client to 'data_analyst';
grant select on pos_management_db.pos_sale to 'data_analyst';
grant select on pos_management_db.store_inventory to 'data_analyst';
grant select on pos_management_db.store_transaction to 'data_analyst';
grant select on pos_management_db.transaction_item to 'data_analyst';

grant select on pos_management_db.pos_system to 'qa_tester';
grant select on pos_management_db.pos_feature to 'qa_tester';
grant select on pos_management_db.pricing to 'qa_tester';
grant select, insert on pos_management_db.store_client to 'qa_tester';
grant select, insert on pos_management_db.store_transaction to 'qa_tester';
grant select, insert on pos_management_db.transaction_item to 'qa_tester';
grant select, insert, update on pos_management_db.store_inventory to 'qa_tester';

grant select on pos_management_db.pos_system to 'intern_developer';
grant select on pos_management_db.pos_feature to 'intern_developer';
grant select on pos_management_db.pricing to 'intern_developer';

grant select on pos_management_db.pos_system to 'intern_analyst';
grant select on pos_management_db.pos_feature to 'intern_analyst';
grant select on pos_management_db.pricing to 'intern_analyst';

create user 'thomas_administrator'@'%' identified by '@123Thomas';
create user 'maria_database'@'%' identified by '@123Maria';

create user 'john_smith'@'%' identified by '@123John';
create user 'sarah_wilson'@'%' identified by '@123Sarah';
create user 'mike_johnson'@'%' identified by '@123Mike';

create user 'alex_chen'@'%' identified by '@123Alex';
create user 'emma_davis'@'%' identified by '@123Emma';
create user 'carlos_rodriguez'@'%' identified by '@123Carlos';
create user 'priya_patel'@'%' identified by '@123Priya';
create user 'james_brown'@'%' identified by '@123James';
create user 'lisa_wang'@'%' identified by '@123Lisa';
create user 'david_garcia'@'%' identified by '@123David';
create user 'anna_kowalski'@'%' identified by '@123Anna';

create user 'tyler_moore'@'%' identified by '@123Tyler';
create user 'jessica_taylor'@'%' identified by '@123Jessica';
create user 'ryan_anderson'@'%' identified by '@123Ryan';
create user 'sophia_martin'@'%' identified by '@123Sophia';
create user 'kevin_lee'@'%' identified by '@123Kevin';
create user 'maya_singh'@'%' identified by '@123Maya';

create user 'robert_clark'@'%' identified by '@123Robert';
create user 'jennifer_white'@'%' identified by '@123Jennifer';
create user 'daniel_adams'@'%' identified by '@123Daniel';
create user 'olivia_thomas'@'%' identified by '@123Olivia';

create user 'mark_harris'@'%' identified by '@123Mark';
create user 'rachel_lewis'@'%' identified by '@123Rachel';
create user 'chris_walker'@'%' identified by '@123Chris';
create user 'natalie_hall'@'%' identified by '@123Natalie';
create user 'brandon_young'@'%' identified by '@123Brandon';

create user 'sam_intern'@'%' identified by '@123Samm';
create user 'amy_student'@'%' identified by '@123Amyy';
create user 'lucas_trainee'@'%' identified by '@123Lucas';
create user 'zoe_beginner'@'%' identified by '@123Zoee';
create user 'ethan_junior'@'%' identified by '@123Ethan';

create user 'lily_data_intern'@'%' identified by '@123Lily';
create user 'noah_analytics_student'@'%' identified by '@123Noah';
create user 'grace_bi_trainee'@'%' identified by '@123Grace';

grant 'database_admin' to 'thomas_administrator'@'%';
grant 'database_admin' to 'maria_database'@'%';

grant 'senior_developer' to 'john_smith'@'%';
grant 'senior_developer' to 'sarah_wilson'@'%';
grant 'senior_developer' to 'mike_johnson'@'%';

grant 'backend_developer' to 'alex_chen'@'%';
grant 'backend_developer' to 'emma_davis'@'%';
grant 'backend_developer' to 'carlos_rodriguez'@'%';
grant 'backend_developer' to 'priya_patel'@'%';
grant 'backend_developer' to 'james_brown'@'%';
grant 'backend_developer' to 'lisa_wang'@'%';
grant 'backend_developer' to 'david_garcia'@'%';
grant 'backend_developer' to 'anna_kowalski'@'%';

grant 'frontend_developer' to 'tyler_moore'@'%';
grant 'frontend_developer' to 'jessica_taylor'@'%';
grant 'frontend_developer' to 'ryan_anderson'@'%';
grant 'frontend_developer' to 'sophia_martin'@'%';
grant 'frontend_developer' to 'kevin_lee'@'%';
grant 'frontend_developer' to 'maya_singh'@'%';

grant 'data_analyst' to 'robert_clark'@'%';
grant 'data_analyst' to 'jennifer_white'@'%';
grant 'data_analyst' to 'daniel_adams'@'%';
grant 'data_analyst' to 'olivia_thomas'@'%';

grant 'qa_tester' to 'mark_harris'@'%';
grant 'qa_tester' to 'rachel_lewis'@'%';
grant 'qa_tester' to 'chris_walker'@'%';
grant 'qa_tester' to 'natalie_hall'@'%';
grant 'qa_tester' to 'brandon_young'@'%';

grant 'intern_developer' to 'sam_intern'@'%';
grant 'intern_developer' to 'amy_student'@'%';
grant 'intern_developer' to 'lucas_trainee'@'%';
grant 'intern_developer' to 'zoe_beginner'@'%';
grant 'intern_developer' to 'ethan_junior'@'%';

grant 'intern_analyst' to 'lily_data_intern'@'%';
grant 'intern_analyst' to 'noah_analytics_student'@'%';
grant 'intern_analyst' to 'grace_bi_trainee'@'%';

set default role 'database_admin' to 'thomas_administrator'@'%';
set default role 'database_admin' to 'maria_database'@'%';

set default role 'senior_developer' to 'john_smith'@'%';
set default role 'senior_developer' to 'sarah_wilson'@'%';
set default role 'senior_developer' to 'mike_johnson'@'%';

set default role 'backend_developer' to 'alex_chen'@'%';
set default role 'backend_developer' to 'emma_davis'@'%';
set default role 'backend_developer' to 'carlos_rodriguez'@'%';
set default role 'backend_developer' to 'priya_patel'@'%';
set default role 'backend_developer' to 'james_brown'@'%';
set default role 'backend_developer' to 'lisa_wang'@'%';
set default role 'backend_developer' to 'david_garcia'@'%';
set default role 'backend_developer' to 'anna_kowalski'@'%';

set default role 'frontend_developer' to 'tyler_moore'@'%';
set default role 'frontend_developer' to 'jessica_taylor'@'%';
set default role 'frontend_developer' to 'ryan_anderson'@'%';
set default role 'frontend_developer' to 'sophia_martin'@'%';
set default role 'frontend_developer' to 'kevin_lee'@'%';
set default role 'frontend_developer' to 'maya_singh'@'%';

set default role 'data_analyst' to 'robert_clark'@'%';
set default role 'data_analyst' to 'jennifer_white'@'%';
set default role 'data_analyst' to 'daniel_adams'@'%';
set default role 'data_analyst' to 'olivia_thomas'@'%';

set default role 'qa_tester' to 'mark_harris'@'%';
set default role 'qa_tester' to 'rachel_lewis'@'%';
set default role 'qa_tester' to 'chris_walker'@'%';
set default role 'qa_tester' to 'natalie_hall'@'%';
set default role 'qa_tester' to 'brandon_young'@'%';

set default role 'intern_developer' to 'sam_intern'@'%';
set default role 'intern_developer' to 'amy_student'@'%';
set default role 'intern_developer' to 'lucas_trainee'@'%';
set default role 'intern_developer' to 'zoe_beginner'@'%';
set default role 'intern_developer' to 'ethan_junior'@'%';

set default role 'intern_analyst' to 'lily_data_intern'@'%';
set default role 'intern_analyst' to 'noah_analytics_student'@'%';
set default role 'intern_analyst' to 'grace_bi_trainee'@'%';

flush privileges;