USE pos_management_db;

CREATE ROLE 'database_admin';
CREATE ROLE 'senior_developer';
CREATE ROLE 'backend_developer';
CREATE ROLE 'frontend_developer';
CREATE ROLE 'data_analyst';
CREATE ROLE 'qa_tester';
CREATE ROLE 'intern_developer';
CREATE ROLE 'intern_analyst';

GRANT ALL PRIVILEGES ON *.* TO 'database_admin' WITH GRANT OPTION;
GRANT CREATE USER ON *.* TO 'database_admin';
GRANT RELOAD ON *.* TO 'database_admin';
GRANT SHUTDOWN ON *.* TO 'database_admin';
GRANT PROCESS ON *.* TO 'database_admin';
GRANT SUPER ON *.* TO 'database_admin';
GRANT REPLICATION SLAVE ON *.* TO 'database_admin';
GRANT REPLICATION CLIENT ON *.* TO 'database_admin';

GRANT ALL PRIVILEGES ON pos_management_db.* TO 'senior_developer';
GRANT CREATE USER ON *.* TO 'senior_developer';
GRANT RELOAD ON *.* TO 'senior_developer';
GRANT PROCESS ON *.* TO 'senior_developer';

GRANT SELECT, INSERT, UPDATE, DELETE ON pos_management_db.pos_system TO 'backend_developer';
GRANT SELECT, INSERT, UPDATE, DELETE ON pos_management_db.pos_feature TO 'backend_developer';
GRANT SELECT, INSERT, UPDATE, DELETE ON pos_management_db.pricing TO 'backend_developer';
GRANT SELECT, INSERT, UPDATE, DELETE ON pos_management_db.store_client TO 'backend_developer';
GRANT SELECT, INSERT, UPDATE, DELETE ON pos_management_db.pos_sale TO 'backend_developer';
GRANT SELECT, INSERT, UPDATE, DELETE ON pos_management_db.store_inventory TO 'backend_developer';
GRANT SELECT, INSERT, UPDATE, DELETE ON pos_management_db.store_transaction TO 'backend_developer';
GRANT SELECT, INSERT, UPDATE, DELETE ON pos_management_db.transaction_item TO 'backend_developer';

GRANT SELECT ON pos_management_db.pos_system TO 'frontend_developer';
GRANT SELECT ON pos_management_db.pos_feature TO 'frontend_developer';
GRANT SELECT ON pos_management_db.pricing TO 'frontend_developer';
GRANT SELECT ON pos_management_db.store_client TO 'frontend_developer';
GRANT SELECT, INSERT ON pos_management_db.store_transaction TO 'frontend_developer';
GRANT SELECT, INSERT ON pos_management_db.transaction_item TO 'frontend_developer';
GRANT SELECT ON pos_management_db.store_inventory TO 'frontend_developer';
GRANT SELECT ON pos_management_db.pos_sale TO 'frontend_developer';

GRANT SELECT ON pos_management_db.pos_system TO 'data_analyst';
GRANT SELECT ON pos_management_db.pos_feature TO 'data_analyst';
GRANT SELECT ON pos_management_db.pricing TO 'data_analyst';
GRANT SELECT ON pos_management_db.store_client TO 'data_analyst';
GRANT SELECT ON pos_management_db.pos_sale TO 'data_analyst';
GRANT SELECT ON pos_management_db.store_inventory TO 'data_analyst';
GRANT SELECT ON pos_management_db.store_transaction TO 'data_analyst';
GRANT SELECT ON pos_management_db.transaction_item TO 'data_analyst';

GRANT SELECT ON pos_management_db.pos_system TO 'qa_tester';
GRANT SELECT ON pos_management_db.pos_feature TO 'qa_tester';
GRANT SELECT ON pos_management_db.pricing TO 'qa_tester';
GRANT SELECT, INSERT ON pos_management_db.store_client TO 'qa_tester';
GRANT SELECT, INSERT ON pos_management_db.store_transaction TO 'qa_tester';
GRANT SELECT, INSERT ON pos_management_db.transaction_item TO 'qa_tester';
GRANT SELECT, INSERT, UPDATE ON pos_management_db.store_inventory TO 'qa_tester';

GRANT SELECT ON pos_management_db.pos_system TO 'intern_developer';
GRANT SELECT ON pos_management_db.pos_feature TO 'intern_developer';
GRANT SELECT ON pos_management_db.pricing TO 'intern_developer';

GRANT SELECT ON pos_management_db.pos_system TO 'intern_analyst';
GRANT SELECT ON pos_management_db.pos_feature TO 'intern_analyst';
GRANT SELECT ON pos_management_db.pricing TO 'intern_analyst';

CREATE USER 'thomas_administrator'@'%' IDENTIFIED BY '@123Thomas';
CREATE USER 'maria_database'@'%' IDENTIFIED BY '@123Maria';

CREATE USER 'john_smith'@'%' IDENTIFIED BY '@123John';
CREATE USER 'sarah_wilson'@'%' IDENTIFIED BY '@123Sarah';
CREATE USER 'mike_johnson'@'%' IDENTIFIED BY '@123Mike';

CREATE USER 'alex_chen'@'%' IDENTIFIED BY '@123Alex';
CREATE USER 'emma_davis'@'%' IDENTIFIED BY '@123Emma';
CREATE USER 'carlos_rodriguez'@'%' IDENTIFIED BY '@123Carlos';
CREATE USER 'priya_patel'@'%' IDENTIFIED BY '@123Priya';
CREATE USER 'james_brown'@'%' IDENTIFIED BY '@123James';
CREATE USER 'lisa_wang'@'%' IDENTIFIED BY '@123Lisa';
CREATE USER 'david_garcia'@'%' IDENTIFIED BY '@123David';
CREATE USER 'anna_kowalski'@'%' IDENTIFIED BY '@123Anna';

CREATE USER 'tyler_moore'@'%' IDENTIFIED BY '@123Tyler';
CREATE USER 'jessica_taylor'@'%' IDENTIFIED BY '@123Jessica';
CREATE USER 'ryan_anderson'@'%' IDENTIFIED BY '@123Ryan';
CREATE USER 'sophia_martin'@'%' IDENTIFIED BY '@123Sophia';
CREATE USER 'kevin_lee'@'%' IDENTIFIED BY '@123Kevin';
CREATE USER 'maya_singh'@'%' IDENTIFIED BY '@123Maya';

CREATE USER 'robert_clark'@'%' IDENTIFIED BY '@123Robert';
CREATE USER 'jennifer_white'@'%' IDENTIFIED BY '@123Jennifer';
CREATE USER 'daniel_adams'@'%' IDENTIFIED BY '@123Daniel';
CREATE USER 'olivia_thomas'@'%' IDENTIFIED BY '@123Olivia';

CREATE USER 'mark_harris'@'%' IDENTIFIED BY '@123Mark';
CREATE USER 'rachel_lewis'@'%' IDENTIFIED BY '@123Rachel';
CREATE USER 'chris_walker'@'%' IDENTIFIED BY '@123Chris';
CREATE USER 'natalie_hall'@'%' IDENTIFIED BY '@123Natalie';
CREATE USER 'brandon_young'@'%' IDENTIFIED BY '@123Brandon';

CREATE USER 'sam_intern'@'%' IDENTIFIED BY '@123Samm';
CREATE USER 'amy_student'@'%' IDENTIFIED BY '@123Amyy';
CREATE USER 'lucas_trainee'@'%' IDENTIFIED BY '@123Lucas';
CREATE USER 'zoe_beginner'@'%' IDENTIFIED BY '@123Zoee';
CREATE USER 'ethan_junior'@'%' IDENTIFIED BY '@123Ethan';

CREATE USER 'lily_data_intern'@'%' IDENTIFIED BY '@123Lily';
CREATE USER 'noah_analytics_student'@'%' IDENTIFIED BY '@123Noah';
CREATE USER 'grace_bi_trainee'@'%' IDENTIFIED BY '@123Grace';

GRANT 'database_admin' TO 'thomas_administrator'@'%';
GRANT 'database_admin' TO 'maria_database'@'%';

GRANT 'senior_developer' TO 'john_smith'@'%';
GRANT 'senior_developer' TO 'sarah_wilson'@'%';
GRANT 'senior_developer' TO 'mike_johnson'@'%';

GRANT 'backend_developer' TO 'alex_chen'@'%';
GRANT 'backend_developer' TO 'emma_davis'@'%';
GRANT 'backend_developer' TO 'carlos_rodriguez'@'%';
GRANT 'backend_developer' TO 'priya_patel'@'%';
GRANT 'backend_developer' TO 'james_brown'@'%';
GRANT 'backend_developer' TO 'lisa_wang'@'%';
GRANT 'backend_developer' TO 'david_garcia'@'%';
GRANT 'backend_developer' TO 'anna_kowalski'@'%';

GRANT 'frontend_developer' TO 'tyler_moore'@'%';
GRANT 'frontend_developer' TO 'jessica_taylor'@'%';
GRANT 'frontend_developer' TO 'ryan_anderson'@'%';
GRANT 'frontend_developer' TO 'sophia_martin'@'%';
GRANT 'frontend_developer' TO 'kevin_lee'@'%';
GRANT 'frontend_developer' TO 'maya_singh'@'%';

GRANT 'data_analyst' TO 'robert_clark'@'%';
GRANT 'data_analyst' TO 'jennifer_white'@'%';
GRANT 'data_analyst' TO 'daniel_adams'@'%';
GRANT 'data_analyst' TO 'olivia_thomas'@'%';

GRANT 'qa_tester' TO 'mark_harris'@'%';
GRANT 'qa_tester' TO 'rachel_lewis'@'%';
GRANT 'qa_tester' TO 'chris_walker'@'%';
GRANT 'qa_tester' TO 'natalie_hall'@'%';
GRANT 'qa_tester' TO 'brandon_young'@'%';

GRANT 'intern_developer' TO 'sam_intern'@'%';
GRANT 'intern_developer' TO 'amy_student'@'%';
GRANT 'intern_developer' TO 'lucas_trainee'@'%';
GRANT 'intern_developer' TO 'zoe_beginner'@'%';
GRANT 'intern_developer' TO 'ethan_junior'@'%';

GRANT 'intern_analyst' TO 'lily_data_intern'@'%';
GRANT 'intern_analyst' TO 'noah_analytics_student'@'%';
GRANT 'intern_analyst' TO 'grace_bi_trainee'@'%';

SET DEFAULT ROLE 'database_admin' TO 'thomas_administrator'@'%';
SET DEFAULT ROLE 'database_admin' TO 'maria_database'@'%';

SET DEFAULT ROLE 'senior_developer' TO 'john_smith'@'%';
SET DEFAULT ROLE 'senior_developer' TO 'sarah_wilson'@'%';
SET DEFAULT ROLE 'senior_developer' TO 'mike_johnson'@'%';

SET DEFAULT ROLE 'backend_developer' TO 'alex_chen'@'%';
SET DEFAULT ROLE 'backend_developer' TO 'emma_davis'@'%';
SET DEFAULT ROLE 'backend_developer' TO 'carlos_rodriguez'@'%';
SET DEFAULT ROLE 'backend_developer' TO 'priya_patel'@'%';
SET DEFAULT ROLE 'backend_developer' TO 'james_brown'@'%';
SET DEFAULT ROLE 'backend_developer' TO 'lisa_wang'@'%';
SET DEFAULT ROLE 'backend_developer' TO 'david_garcia'@'%';
SET DEFAULT ROLE 'backend_developer' TO 'anna_kowalski'@'%';

SET DEFAULT ROLE 'frontend_developer' TO 'tyler_moore'@'%';
SET DEFAULT ROLE 'frontend_developer' TO 'jessica_taylor'@'%';
SET DEFAULT ROLE 'frontend_developer' TO 'ryan_anderson'@'%';
SET DEFAULT ROLE 'frontend_developer' TO 'sophia_martin'@'%';
SET DEFAULT ROLE 'frontend_developer' TO 'kevin_lee'@'%';
SET DEFAULT ROLE 'frontend_developer' TO 'maya_singh'@'%';

SET DEFAULT ROLE 'data_analyst' TO 'robert_clark'@'%';
SET DEFAULT ROLE 'data_analyst' TO 'jennifer_white'@'%';
SET DEFAULT ROLE 'data_analyst' TO 'daniel_adams'@'%';
SET DEFAULT ROLE 'data_analyst' TO 'olivia_thomas'@'%';

SET DEFAULT ROLE 'qa_tester' TO 'mark_harris'@'%';
SET DEFAULT ROLE 'qa_tester' TO 'rachel_lewis'@'%';
SET DEFAULT ROLE 'qa_tester' TO 'chris_walker'@'%';
SET DEFAULT ROLE 'qa_tester' TO 'natalie_hall'@'%';
SET DEFAULT ROLE 'qa_tester' TO 'brandon_young'@'%';

SET DEFAULT ROLE 'intern_developer' TO 'sam_intern'@'%';
SET DEFAULT ROLE 'intern_developer' TO 'amy_student'@'%';
SET DEFAULT ROLE 'intern_developer' TO 'lucas_trainee'@'%';
SET DEFAULT ROLE 'intern_developer' TO 'zoe_beginner'@'%';
SET DEFAULT ROLE 'intern_developer' TO 'ethan_junior'@'%';

SET DEFAULT ROLE 'intern_analyst' TO 'lily_data_intern'@'%';
SET DEFAULT ROLE 'intern_analyst' TO 'noah_analytics_student'@'%';
SET DEFAULT ROLE 'intern_analyst' TO 'grace_bi_trainee'@'%';

FLUSH PRIVILEGES;