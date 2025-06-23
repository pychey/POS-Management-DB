-- ====================================================================
-- POS Provider System - Data Control Language (DCL)
-- Role-Based Access Control (RBAC) for Developers
-- ====================================================================

USE pos_management_db;

-- ====================================================================
-- 1. CREATE ROLES (Few roles for many users)
-- ====================================================================

-- DATABASE_ADMIN: Full database administration privileges
CREATE ROLE 'database_admin';

-- SENIOR_DEVELOPER: Full access to all operations
CREATE ROLE 'senior_developer';

-- BACKEND_DEVELOPER: Can read/write application data, limited system access
CREATE ROLE 'backend_developer';

-- FRONTEND_DEVELOPER: Read-only access to most data, limited write access
CREATE ROLE 'frontend_developer';

-- DATA_ANALYST: Read-only access for reporting and analytics
CREATE ROLE 'data_analyst';

-- QA_TESTER: Limited access for testing purposes
CREATE ROLE 'qa_tester';

-- INTERN_DEVELOPER: Limited supervised access for learning
CREATE ROLE 'intern_developer';

-- INTERN_ANALYST: Read-only access for learning analytics
CREATE ROLE 'intern_analyst';

-- ====================================================================
-- 2. GRANT PRIVILEGES TO ROLES
-- ====================================================================

-- DATABASE_ADMIN: Ultimate database administration privileges
GRANT ALL PRIVILEGES ON *.* TO 'database_admin' WITH GRANT OPTION;
GRANT CREATE USER ON *.* TO 'database_admin';
GRANT RELOAD ON *.* TO 'database_admin';
GRANT SHUTDOWN ON *.* TO 'database_admin';
GRANT PROCESS ON *.* TO 'database_admin';
GRANT SUPER ON *.* TO 'database_admin';
GRANT REPLICATION SLAVE ON *.* TO 'database_admin';
GRANT REPLICATION CLIENT ON *.* TO 'database_admin';

-- SENIOR_DEVELOPER: Full administrative privileges on application database
GRANT ALL PRIVILEGES ON pos_provider_system.* TO 'senior_developer';
GRANT CREATE USER ON *.* TO 'senior_developer';
GRANT RELOAD ON *.* TO 'senior_developer';
GRANT PROCESS ON *.* TO 'senior_developer';

-- BACKEND_DEVELOPER: Full CRUD operations on application tables
GRANT SELECT, INSERT, UPDATE, DELETE ON pos_provider_system.pos_system TO 'backend_developer';
GRANT SELECT, INSERT, UPDATE, DELETE ON pos_provider_system.pos_feature TO 'backend_developer';
GRANT SELECT, INSERT, UPDATE, DELETE ON pos_provider_system.pricing TO 'backend_developer';
GRANT SELECT, INSERT, UPDATE, DELETE ON pos_provider_system.store_client TO 'backend_developer';
GRANT SELECT, INSERT, UPDATE, DELETE ON pos_provider_system.pos_sale TO 'backend_developer';
GRANT SELECT, INSERT, UPDATE, DELETE ON pos_provider_system.store_inventory TO 'backend_developer';
GRANT SELECT, INSERT, UPDATE, DELETE ON pos_provider_system.store_transaction TO 'backend_developer';
GRANT SELECT, INSERT, UPDATE, DELETE ON pos_provider_system.transaction_item TO 'backend_developer';
GRANT SELECT, INSERT, UPDATE, DELETE ON pos_provider_system.blog TO 'backend_developer';

-- FRONTEND_DEVELOPER: Read access to most tables, limited write access
GRANT SELECT ON pos_provider_system.pos_system TO 'frontend_developer';
GRANT SELECT ON pos_provider_system.pos_feature TO 'frontend_developer';
GRANT SELECT ON pos_provider_system.pricing TO 'frontend_developer';
GRANT SELECT ON pos_provider_system.store_client TO 'frontend_developer';
GRANT SELECT, INSERT ON pos_provider_system.store_transaction TO 'frontend_developer';
GRANT SELECT, INSERT ON pos_provider_system.transaction_item TO 'frontend_developer';
GRANT SELECT ON pos_provider_system.store_inventory TO 'frontend_developer';
GRANT SELECT ON pos_provider_system.pos_sale TO 'frontend_developer';
GRANT SELECT, INSERT, UPDATE ON pos_provider_system.blog TO 'frontend_developer';

-- DATA_ANALYST: Read-only access for reporting and analytics
GRANT SELECT ON pos_provider_system.pos_system TO 'data_analyst';
GRANT SELECT ON pos_provider_system.pos_feature TO 'data_analyst';
GRANT SELECT ON pos_provider_system.pricing TO 'data_analyst';
GRANT SELECT ON pos_provider_system.store_client TO 'data_analyst';
GRANT SELECT ON pos_provider_system.pos_sale TO 'data_analyst';
GRANT SELECT ON pos_provider_system.store_inventory TO 'data_analyst';
GRANT SELECT ON pos_provider_system.store_transaction TO 'data_analyst';
GRANT SELECT ON pos_provider_system.transaction_item TO 'data_analyst';
GRANT SELECT ON pos_provider_system.blog TO 'data_analyst';

-- QA_TESTER: Limited access for testing
GRANT SELECT ON pos_provider_system.pos_system TO 'qa_tester';
GRANT SELECT ON pos_provider_system.pos_feature TO 'qa_tester';
GRANT SELECT ON pos_provider_system.pricing TO 'qa_tester';
GRANT SELECT, INSERT ON pos_provider_system.store_client TO 'qa_tester';
GRANT SELECT, INSERT ON pos_provider_system.store_transaction TO 'qa_tester';
GRANT SELECT, INSERT ON pos_provider_system.transaction_item TO 'qa_tester';
GRANT SELECT, INSERT, UPDATE ON pos_provider_system.store_inventory TO 'qa_tester';

-- INTERN_DEVELOPER: Very limited supervised access for learning
GRANT SELECT ON pos_provider_system.pos_system TO 'intern_developer';
GRANT SELECT ON pos_provider_system.pos_feature TO 'intern_developer';
GRANT SELECT ON pos_provider_system.pricing TO 'intern_developer';
GRANT SELECT ON pos_provider_system.blog TO 'intern_developer';
GRANT INSERT ON pos_provider_system.blog TO 'intern_developer';

-- INTERN_ANALYST: Read-only access to non-sensitive data for learning
GRANT SELECT ON pos_provider_system.pos_system TO 'intern_analyst';
GRANT SELECT ON pos_provider_system.pos_feature TO 'intern_analyst';
GRANT SELECT ON pos_provider_system.pricing TO 'intern_analyst';
GRANT SELECT ON pos_provider_system.blog TO 'intern_analyst';

-- ====================================================================
-- 3. CREATE USERS AND ASSIGN TO ROLES
-- ====================================================================

-- DATABASE ADMINISTRATORS (Database Management, Performance, Security)
CREATE USER 'thomas_administrator'@'%' IDENTIFIED BY '@CADT_Thomas_Admin_2024!';
CREATE USER 'maria_database'@'%' IDENTIFIED BY '@CADT_Maria_DB_Secure!';

-- SENIOR DEVELOPERS (Team Leads, Architects)
CREATE USER 'john_smith'@'%' IDENTIFIED BY '@CADT_John_Smith_Lead!';
CREATE USER 'sarah_wilson'@'%' IDENTIFIED BY '@CADT_Sarah_Wilson_Arch!';
CREATE USER 'mike_johnson'@'%' IDENTIFIED BY '@CADT_Mike_Johnson_Sr!';

-- BACKEND DEVELOPERS (API, Business Logic, Database)
CREATE USER 'alex_chen'@'%' IDENTIFIED BY '@CADT_Alex_Chen_Backend!';
CREATE USER 'emma_davis'@'%' IDENTIFIED BY '@CADT_Emma_Davis_API!';
CREATE USER 'carlos_rodriguez'@'%' IDENTIFIED BY '@CADT_Carlos_Rodriguez_Dev!';
CREATE USER 'priya_patel'@'%' IDENTIFIED BY '@CADT_Priya_Patel_Logic!';
CREATE USER 'james_brown'@'%' IDENTIFIED BY '@CADT_James_Brown_Server!';
CREATE USER 'lisa_wang'@'%' IDENTIFIED BY '@CADT_Lisa_Wang_Backend!';
CREATE USER 'david_garcia'@'%' IDENTIFIED BY '@CADT_David_Garcia_Code!';
CREATE USER 'anna_kowalski'@'%' IDENTIFIED BY '@CADT_Anna_Kowalski_Dev!';

-- FRONTEND DEVELOPERS (UI, UX, Client-side)
CREATE USER 'tyler_moore'@'%' IDENTIFIED BY '@CADT_Tyler_Moore_UI!';
CREATE USER 'jessica_taylor'@'%' IDENTIFIED BY '@CADT_Jessica_Taylor_UX!';
CREATE USER 'ryan_anderson'@'%' IDENTIFIED BY '@CADT_Ryan_Anderson_Web!';
CREATE USER 'sophia_martin'@'%' IDENTIFIED BY '@CADT_Sophia_Martin_JS!';
CREATE USER 'kevin_lee'@'%' IDENTIFIED BY '@CADT_Kevin_Lee_React!';
CREATE USER 'maya_singh'@'%' IDENTIFIED BY '@CADT_Maya_Singh_Vue!';

-- DATA ANALYSTS (Business Intelligence, Reporting)
CREATE USER 'robert_clark'@'%' IDENTIFIED BY '@CADT_Robert_Clark_BI!';
CREATE USER 'jennifer_white'@'%' IDENTIFIED BY '@CADT_Jennifer_White_Data!';
CREATE USER 'daniel_adams'@'%' IDENTIFIED BY '@CADT_Daniel_Adams_Report!';
CREATE USER 'olivia_thomas'@'%' IDENTIFIED BY '@CADT_Olivia_Thomas_Analytics!';

-- QA TESTERS (Quality Assurance, Testing)
CREATE USER 'mark_harris'@'%' IDENTIFIED BY '@CADT_Mark_Harris_QA!';
CREATE USER 'rachel_lewis'@'%' IDENTIFIED BY '@CADT_Rachel_Lewis_Test!';
CREATE USER 'chris_walker'@'%' IDENTIFIED BY '@CADT_Chris_Walker_Quality!';
CREATE USER 'natalie_hall'@'%' IDENTIFIED BY '@CADT_Natalie_Hall_Verify!';
CREATE USER 'brandon_young'@'%' IDENTIFIED BY '@CADT_Brandon_Young_QA!';

-- INTERN DEVELOPERS (Students, Junior Developers)
CREATE USER 'sam_intern'@'%' IDENTIFIED BY '@CADT_Sam_Intern_Learning!';
CREATE USER 'amy_student'@'%' IDENTIFIED BY '@CADT_Amy_Student_Code!';
CREATE USER 'lucas_trainee'@'%' IDENTIFIED BY '@CADT_Lucas_Trainee_Dev!';
CREATE USER 'zoe_beginner'@'%' IDENTIFIED BY '@CADT_Zoe_Beginner_Web!';
CREATE USER 'ethan_junior'@'%' IDENTIFIED BY '@CADT_Ethan_Junior_Learn!';

-- INTERN ANALYSTS (Students in Data/Analytics)
CREATE USER 'lily_data_intern'@'%' IDENTIFIED BY '@CADT_Lily_Data_Student!';
CREATE USER 'noah_analytics_student'@'%' IDENTIFIED BY '@CADT_Noah_Analytics_Learn!';
CREATE USER 'grace_bi_trainee'@'%' IDENTIFIED BY '@CADT_Grace_BI_Intern!';

-- ====================================================================
-- 4. ASSIGN USERS TO ROLES
-- ====================================================================

-- Assign Database Administrators
GRANT 'database_admin' TO 'thomas_administrator'@'%';
GRANT 'database_admin' TO 'maria_database'@'%';

-- Assign Senior Developers
GRANT 'senior_developer' TO 'john_smith'@'%';
GRANT 'senior_developer' TO 'sarah_wilson'@'%';
GRANT 'senior_developer' TO 'mike_johnson'@'%';

-- Assign Backend Developers
GRANT 'backend_developer' TO 'alex_chen'@'%';
GRANT 'backend_developer' TO 'emma_davis'@'%';
GRANT 'backend_developer' TO 'carlos_rodriguez'@'%';
GRANT 'backend_developer' TO 'priya_patel'@'%';
GRANT 'backend_developer' TO 'james_brown'@'%';
GRANT 'backend_developer' TO 'lisa_wang'@'%';
GRANT 'backend_developer' TO 'david_garcia'@'%';
GRANT 'backend_developer' TO 'anna_kowalski'@'%';

-- Assign Frontend Developers
GRANT 'frontend_developer' TO 'tyler_moore'@'%';
GRANT 'frontend_developer' TO 'jessica_taylor'@'%';
GRANT 'frontend_developer' TO 'ryan_anderson'@'%';
GRANT 'frontend_developer' TO 'sophia_martin'@'%';
GRANT 'frontend_developer' TO 'kevin_lee'@'%';
GRANT 'frontend_developer' TO 'maya_singh'@'%';

-- Assign Data Analysts
GRANT 'data_analyst' TO 'robert_clark'@'%';
GRANT 'data_analyst' TO 'jennifer_white'@'%';
GRANT 'data_analyst' TO 'daniel_adams'@'%';
GRANT 'data_analyst' TO 'olivia_thomas'@'%';

-- Assign QA Testers
GRANT 'qa_tester' TO 'mark_harris'@'%';
GRANT 'qa_tester' TO 'rachel_lewis'@'%';
GRANT 'qa_tester' TO 'chris_walker'@'%';
GRANT 'qa_tester' TO 'natalie_hall'@'%';
GRANT 'qa_tester' TO 'brandon_young'@'%';

-- Assign Intern Developers
GRANT 'intern_developer' TO 'sam_intern'@'%';
GRANT 'intern_developer' TO 'amy_student'@'%';
GRANT 'intern_developer' TO 'lucas_trainee'@'%';
GRANT 'intern_developer' TO 'zoe_beginner'@'%';
GRANT 'intern_developer' TO 'ethan_junior'@'%';

-- Assign Intern Analysts
GRANT 'intern_analyst' TO 'lily_data_intern'@'%';
GRANT 'intern_analyst' TO 'noah_analytics_student'@'%';
GRANT 'intern_analyst' TO 'grace_bi_trainee'@'%';

-- ====================================================================
-- 5. SET DEFAULT ROLES FOR USERS
-- ====================================================================

-- Database Administrators
SET DEFAULT ROLE 'database_admin' TO 'thomas_administrator'@'%';
SET DEFAULT ROLE 'database_admin' TO 'maria_database'@'%';

-- Senior Developers
SET DEFAULT ROLE 'senior_developer' TO 'john_smith'@'%';
SET DEFAULT ROLE 'senior_developer' TO 'sarah_wilson'@'%';
SET DEFAULT ROLE 'senior_developer' TO 'mike_johnson'@'%';

-- Backend Developers
SET DEFAULT ROLE 'backend_developer' TO 'alex_chen'@'%';
SET DEFAULT ROLE 'backend_developer' TO 'emma_davis'@'%';
SET DEFAULT ROLE 'backend_developer' TO 'carlos_rodriguez'@'%';
SET DEFAULT ROLE 'backend_developer' TO 'priya_patel'@'%';
SET DEFAULT ROLE 'backend_developer' TO 'james_brown'@'%';
SET DEFAULT ROLE 'backend_developer' TO 'lisa_wang'@'%';
SET DEFAULT ROLE 'backend_developer' TO 'david_garcia'@'%';
SET DEFAULT ROLE 'backend_developer' TO 'anna_kowalski'@'%';

-- Frontend Developers
SET DEFAULT ROLE 'frontend_developer' TO 'tyler_moore'@'%';
SET DEFAULT ROLE 'frontend_developer' TO 'jessica_taylor'@'%';
SET DEFAULT ROLE 'frontend_developer' TO 'ryan_anderson'@'%';
SET DEFAULT ROLE 'frontend_developer' TO 'sophia_martin'@'%';
SET DEFAULT ROLE 'frontend_developer' TO 'kevin_lee'@'%';
SET DEFAULT ROLE 'frontend_developer' TO 'maya_singh'@'%';

-- Data Analysts
SET DEFAULT ROLE 'data_analyst' TO 'robert_clark'@'%';
SET DEFAULT ROLE 'data_analyst' TO 'jennifer_white'@'%';
SET DEFAULT ROLE 'data_analyst' TO 'daniel_adams'@'%';
SET DEFAULT ROLE 'data_analyst' TO 'olivia_thomas'@'%';

-- QA Testers
SET DEFAULT ROLE 'qa_tester' TO 'mark_harris'@'%';
SET DEFAULT ROLE 'qa_tester' TO 'rachel_lewis'@'%';
SET DEFAULT ROLE 'qa_tester' TO 'chris_walker'@'%';
SET DEFAULT ROLE 'qa_tester' TO 'natalie_hall'@'%';
SET DEFAULT ROLE 'qa_tester' TO 'brandon_young'@'%';

-- Intern Developers
SET DEFAULT ROLE 'intern_developer' TO 'sam_intern'@'%';
SET DEFAULT ROLE 'intern_developer' TO 'amy_student'@'%';
SET DEFAULT ROLE 'intern_developer' TO 'lucas_trainee'@'%';
SET DEFAULT ROLE 'intern_developer' TO 'zoe_beginner'@'%';
SET DEFAULT ROLE 'intern_developer' TO 'ethan_junior'@'%';

-- Intern Analysts
SET DEFAULT ROLE 'intern_analyst' TO 'lily_data_intern'@'%';
SET DEFAULT ROLE 'intern_analyst' TO 'noah_analytics_student'@'%';
SET DEFAULT ROLE 'intern_analyst' TO 'grace_bi_trainee'@'%';

-- ====================================================================
-- 6. FLUSH PRIVILEGES TO APPLY CHANGES
-- ====================================================================

FLUSH PRIVILEGES;

-- ====================================================================
-- 7. VERIFICATION QUERIES (Optional - for checking setup)
-- ====================================================================

-- Check all roles
-- SELECT User, Host FROM mysql.user WHERE User LIKE '%developer%' OR User LIKE '%analyst%' OR User LIKE '%tester%';

-- Check role assignments
-- SELECT * FROM mysql.role_edges;

-- Check privileges for a specific role
-- SHOW GRANTS FOR 'backend_developer';

-- Check privileges for a specific user
-- SHOW GRANTS FOR 'alex_chen'@'%';

-- ====================================================================
-- PRACTICAL SCENARIO EXPLANATION:
-- ====================================================================

/*
RBAC SCENARIO FOR POS PROVIDER SYSTEM:

1. DATABASE_ADMIN (2 users):
   - Ultimate database administrators with full system privileges
   - Can manage server configuration, replication, and all databases
   - Responsible for database performance, security, and maintenance
   - Have SUPER privileges and can manage all users and roles

2. SENIOR_DEVELOPER (3 users):
   - Team leads and system architects
   - Full administrative access to application database
   - Can manage application users, roles, and system configuration
   - Responsible for critical system changes and deployments

3. BACKEND_DEVELOPER (8 users):
   - API developers, business logic implementers
   - Full CRUD access to all application tables
   - Can modify POS systems, pricing, client data, and transactions
   - Core development team for server-side functionality

4. FRONTEND_DEVELOPER (6 users):
   - UI/UX developers, client-side developers
   - Read access to system data for display purposes
   - Limited write access for user-initiated transactions
   - Can manage blog content for marketing pages

5. DATA_ANALYST (4 users):
   - Business intelligence and reporting specialists
   - Read-only access to analyze sales patterns, client behavior
   - Generate reports on POS system performance and usage
   - Support business decision-making with data insights

6. QA_TESTER (5 users):
   - Quality assurance and testing specialists
   - Limited write access to create test data
   - Can perform integration testing on client and transaction flows
   - Verify system functionality without affecting production data

7. INTERN_DEVELOPER (5 users):
   - Students and junior developers learning the system
   - Very limited supervised access to non-sensitive tables
   - Can read basic system information and contribute to blog
   - Safe environment for learning without risking production data

8. INTERN_ANALYST (3 users):
   - Students learning data analysis and business intelligence
   - Read-only access to basic system data for learning
   - Cannot access sensitive client or transaction information
   - Educational access for understanding system structure

TOTAL USERS: 36 users across 8 roles

PASSWORD POLICY:
- All passwords follow format: @CADT_[Name]_[Role/Descriptor]!
- Examples: @CADT_John_Smith_Lead!, @CADT_Thomas_Admin_2024!
- Incorporates CADT prefix as requested
- Includes user identification and role context
- Strong password complexity with special characters

BENEFITS:
- Hierarchical access control from interns to database admins
- Educational pathway for interns to learn with limited risk
- Clear separation between production and learning environments
- Scalable role structure accommodating team growth
- Strong security through principle of least privilege
- Audit-friendly with clear role-based access patterns
*/