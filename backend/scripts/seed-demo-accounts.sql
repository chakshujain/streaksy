-- ============================================================================
-- Streaksy Demo Account Seeder
-- Arjun Mehta (00000000-0000-0000-0000-000000000002) - Power user, 42-day streak
-- Priya Sharma (00000000-0000-0000-0000-000000000003) - Growing user, 15-day streak
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. USER PROBLEM STATUS - Arjun: ~120 solved, ~30 attempted
-- ============================================================================

INSERT INTO user_problem_status (user_id, problem_id, status, solved_at) VALUES
-- Arjun SOLVED - Easy (25 problems)
('00000000-0000-0000-0000-000000000002', '7b709a45-fec6-4743-b2da-2eee312838f9', 'solved', NOW() - INTERVAL '1 day 2 hours'),
('00000000-0000-0000-0000-000000000002', '42ce30e1-1c51-4046-92a2-ea5dff1d78f6', 'solved', NOW() - INTERVAL '1 day 5 hours'),
('00000000-0000-0000-0000-000000000002', '89eff95f-45ea-4923-81d4-08157a699347', 'solved', NOW() - INTERVAL '2 days 3 hours'),
('00000000-0000-0000-0000-000000000002', 'a424144d-9411-48cb-b6ba-b615de4f02ef', 'solved', NOW() - INTERVAL '2 days 6 hours'),
('00000000-0000-0000-0000-000000000002', 'ff689f9f-42cd-450a-babb-bd9cb2489fbc', 'solved', NOW() - INTERVAL '3 days 1 hour'),
('00000000-0000-0000-0000-000000000002', '7a68e7be-d922-40ae-a523-6d9eff7f92ec', 'solved', NOW() - INTERVAL '3 days 4 hours'),
('00000000-0000-0000-0000-000000000002', 'd4e1d4e6-cae9-4085-90da-b341295fe0e8', 'solved', NOW() - INTERVAL '4 days 2 hours'),
('00000000-0000-0000-0000-000000000002', 'da7d26a2-4472-4b15-b944-5f8e23724c07', 'solved', NOW() - INTERVAL '5 days 3 hours'),
('00000000-0000-0000-0000-000000000002', '5ec50f7d-5c4c-4708-bad8-a65c0c69fff4', 'solved', NOW() - INTERVAL '5 days 7 hours'),
('00000000-0000-0000-0000-000000000002', '7e02a395-0e1e-4da1-89b2-19f0522b4a79', 'solved', NOW() - INTERVAL '6 days 1 hour'),
('00000000-0000-0000-0000-000000000002', '8343a953-0c57-4da8-836f-7e79dedce2bc', 'solved', NOW() - INTERVAL '7 days 4 hours'),
('00000000-0000-0000-0000-000000000002', 'f5d38ec7-0ae0-4df7-ae05-30a92b8f5df3', 'solved', NOW() - INTERVAL '8 days 2 hours'),
('00000000-0000-0000-0000-000000000002', '4b135ed6-6cf9-44fc-8896-3923e88a983d', 'solved', NOW() - INTERVAL '9 days 5 hours'),
('00000000-0000-0000-0000-000000000002', 'c7d52304-c4bf-4e1a-b655-662ba9cf24bd', 'solved', NOW() - INTERVAL '10 days 3 hours'),
('00000000-0000-0000-0000-000000000002', '5c60d304-b7a4-450a-8917-4b0eca1b7491', 'solved', NOW() - INTERVAL '11 days 1 hour'),
('00000000-0000-0000-0000-000000000002', 'f668edc3-81d4-44dd-aa92-b6ae3e723a0c', 'solved', NOW() - INTERVAL '12 days 6 hours'),
('00000000-0000-0000-0000-000000000002', '38a05402-7f98-4d6e-b233-5049f2135883', 'solved', NOW() - INTERVAL '13 days 2 hours'),
('00000000-0000-0000-0000-000000000002', 'a72c6ddd-27ca-4498-90e1-ed33d3dbca7d', 'solved', NOW() - INTERVAL '14 days 4 hours'),
('00000000-0000-0000-0000-000000000002', '70aba27b-cd0e-41ea-b536-3c3251419802', 'solved', NOW() - INTERVAL '15 days 3 hours'),
('00000000-0000-0000-0000-000000000002', '79e1f595-81ed-44cf-8c15-b138d1178a08', 'solved', NOW() - INTERVAL '16 days 5 hours'),
('00000000-0000-0000-0000-000000000002', '481468de-a5d6-4131-bb23-215f0d6fcee2', 'solved', NOW() - INTERVAL '17 days 2 hours'),
('00000000-0000-0000-0000-000000000002', '5534a3b0-7d06-460c-a3d7-abeb6a621caf', 'solved', NOW() - INTERVAL '18 days 4 hours'),
('00000000-0000-0000-0000-000000000002', '6079ec3b-f48c-42ee-8942-44bedee53972', 'solved', NOW() - INTERVAL '19 days 1 hour'),
('00000000-0000-0000-0000-000000000002', '778e573c-b144-415b-a59c-6a6e140d1ad4', 'solved', NOW() - INTERVAL '20 days 3 hours'),
('00000000-0000-0000-0000-000000000002', '4be08fca-507c-4713-8999-7f6eb1035fc0', 'solved', NOW() - INTERVAL '21 days 6 hours'),
-- Arjun SOLVED - Medium (70 problems)
('00000000-0000-0000-0000-000000000002', '92548b02-8d34-409a-9359-29cf233a250c', 'solved', NOW() - INTERVAL '1 day 3 hours'),
('00000000-0000-0000-0000-000000000002', '1ab81abc-9b67-4733-9af1-6a90398d7e8b', 'solved', NOW() - INTERVAL '1 day 7 hours'),
('00000000-0000-0000-0000-000000000002', 'f2a32840-41e1-4b0a-8aa7-9a35be4c11e4', 'solved', NOW() - INTERVAL '2 days 1 hour'),
('00000000-0000-0000-0000-000000000002', 'b8e72d1e-03c9-42ae-861f-61e6e2a28892', 'solved', NOW() - INTERVAL '2 days 5 hours'),
('00000000-0000-0000-0000-000000000002', 'a41b281f-a52a-4753-8b1e-bd0f267fd9f2', 'solved', NOW() - INTERVAL '2 days 8 hours'),
('00000000-0000-0000-0000-000000000002', '1ff52440-b7d1-4dcf-862a-b703689044ad', 'solved', NOW() - INTERVAL '3 days 2 hours'),
('00000000-0000-0000-0000-000000000002', '1c730d31-8a84-4605-bbf1-7e4c71b4f5b2', 'solved', NOW() - INTERVAL '3 days 6 hours'),
('00000000-0000-0000-0000-000000000002', 'd958c5cf-b778-4ea2-884f-091edf719430', 'solved', NOW() - INTERVAL '4 days 4 hours'),
('00000000-0000-0000-0000-000000000002', '9e76415a-fb41-4002-98d2-46536af5fd83', 'solved', NOW() - INTERVAL '4 days 7 hours'),
('00000000-0000-0000-0000-000000000002', '51f367df-f747-4664-b142-7887333f616d', 'solved', NOW() - INTERVAL '5 days 1 hour'),
('00000000-0000-0000-0000-000000000002', '41cd5af8-cc42-464b-88e2-07c7c169d66c', 'solved', NOW() - INTERVAL '5 days 5 hours'),
('00000000-0000-0000-0000-000000000002', '3161a61a-793d-47fb-8338-2f5df92e587b', 'solved', NOW() - INTERVAL '6 days 3 hours'),
('00000000-0000-0000-0000-000000000002', '53811ca0-c6b8-4d4e-b7f6-60d6110e7125', 'solved', NOW() - INTERVAL '6 days 7 hours'),
('00000000-0000-0000-0000-000000000002', '695a6482-d7b0-4ef8-aad1-1485a131775f', 'solved', NOW() - INTERVAL '7 days 2 hours'),
('00000000-0000-0000-0000-000000000002', 'd36ac809-e025-44d2-8e4d-da7c6c6af5c4', 'solved', NOW() - INTERVAL '7 days 6 hours'),
('00000000-0000-0000-0000-000000000002', '1ebed14e-2960-439c-bfd2-46195fa1a5b7', 'solved', NOW() - INTERVAL '8 days 4 hours'),
('00000000-0000-0000-0000-000000000002', '6ce0a07e-e1d6-45ae-a668-68a99e5749dd', 'solved', NOW() - INTERVAL '8 days 8 hours'),
('00000000-0000-0000-0000-000000000002', 'bdbe111b-2cee-43e4-8024-7f241b448d6b', 'solved', NOW() - INTERVAL '9 days 1 hour'),
('00000000-0000-0000-0000-000000000002', 'dad746c0-2fb4-4ec3-a423-026c9648cfd2', 'solved', NOW() - INTERVAL '9 days 5 hours'),
('00000000-0000-0000-0000-000000000002', '3cb9ee2b-d567-4302-8583-006350cd65dc', 'solved', NOW() - INTERVAL '10 days 2 hours'),
('00000000-0000-0000-0000-000000000002', '05792937-c2cf-4f66-b760-02e56bbc369e', 'solved', NOW() - INTERVAL '10 days 6 hours'),
('00000000-0000-0000-0000-000000000002', 'bde193c5-4cff-4c5d-be34-8fa0852857af', 'solved', NOW() - INTERVAL '11 days 3 hours'),
('00000000-0000-0000-0000-000000000002', '2b3dd169-28e9-4f7c-92a8-8acbc8a5c83f', 'solved', NOW() - INTERVAL '11 days 7 hours'),
('00000000-0000-0000-0000-000000000002', '715e00be-48d1-4950-8ccb-da05d03f85b3', 'solved', NOW() - INTERVAL '12 days 1 hour'),
('00000000-0000-0000-0000-000000000002', 'ece5cdde-0bb8-4b79-9b65-ce6ef48b279a', 'solved', NOW() - INTERVAL '12 days 5 hours'),
('00000000-0000-0000-0000-000000000002', 'c90886f7-0663-4f9e-bb29-eab9670f8e29', 'solved', NOW() - INTERVAL '13 days 3 hours'),
('00000000-0000-0000-0000-000000000002', '74f0e34d-a60a-4332-b7d8-feb95b21a0ef', 'solved', NOW() - INTERVAL '13 days 7 hours'),
('00000000-0000-0000-0000-000000000002', 'f288e33f-d8b1-4fe3-b0cb-eec978a5f2f5', 'solved', NOW() - INTERVAL '14 days 2 hours'),
('00000000-0000-0000-0000-000000000002', '15cd13ab-4614-4874-8d52-2508ec20fd1f', 'solved', NOW() - INTERVAL '14 days 6 hours'),
('00000000-0000-0000-0000-000000000002', '4870b4c7-58de-4779-98e3-b5646510746f', 'solved', NOW() - INTERVAL '15 days 1 hour'),
('00000000-0000-0000-0000-000000000002', '09be08c9-2cfe-489b-80fe-d2c953bd01a1', 'solved', NOW() - INTERVAL '15 days 5 hours'),
('00000000-0000-0000-0000-000000000002', '02c79de6-be85-4086-86b4-5f211f01816b', 'solved', NOW() - INTERVAL '16 days 3 hours'),
('00000000-0000-0000-0000-000000000002', '4bfe7a89-0f2e-447f-9467-04aeeac71faf', 'solved', NOW() - INTERVAL '16 days 7 hours'),
('00000000-0000-0000-0000-000000000002', 'bbab6f5e-ac73-4352-b2e7-c12344673662', 'solved', NOW() - INTERVAL '17 days 4 hours'),
('00000000-0000-0000-0000-000000000002', 'c35cfb72-5a87-4b5f-b16f-2b216da8b110', 'solved', NOW() - INTERVAL '17 days 8 hours'),
('00000000-0000-0000-0000-000000000002', '80ac2968-bf5d-46a9-9679-db11abc7be73', 'solved', NOW() - INTERVAL '18 days 2 hours'),
('00000000-0000-0000-0000-000000000002', '92f33fd8-39d0-4a40-b640-3fb333d8210e', 'solved', NOW() - INTERVAL '18 days 6 hours'),
('00000000-0000-0000-0000-000000000002', '2242f730-b650-4087-9eab-002e8c4885d1', 'solved', NOW() - INTERVAL '19 days 3 hours'),
('00000000-0000-0000-0000-000000000002', '8d4f5d50-dac8-422b-ba4c-631b853a1d2c', 'solved', NOW() - INTERVAL '19 days 7 hours'),
('00000000-0000-0000-0000-000000000002', 'ede6af5f-52f7-4019-a030-4ca4bd8f060a', 'solved', NOW() - INTERVAL '20 days 1 hour'),
('00000000-0000-0000-0000-000000000002', 'af58e6a6-d31d-43d1-98e4-685734f69f1f', 'solved', NOW() - INTERVAL '20 days 5 hours'),
('00000000-0000-0000-0000-000000000002', '5fef0791-9d86-4cb8-a681-015142780add', 'solved', NOW() - INTERVAL '21 days 3 hours'),
('00000000-0000-0000-0000-000000000002', '3c49995b-6448-4115-bb0a-29b906f56cff', 'solved', NOW() - INTERVAL '21 days 7 hours'),
('00000000-0000-0000-0000-000000000002', '1c1fdd01-bb69-4d4a-ab33-1dec73095567', 'solved', NOW() - INTERVAL '22 days 2 hours'),
('00000000-0000-0000-0000-000000000002', 'f5c341c6-709a-4e73-8b2a-89faf61a0fe2', 'solved', NOW() - INTERVAL '22 days 5 hours'),
('00000000-0000-0000-0000-000000000002', '2c08bb48-f469-4713-a5b0-77be33d85180', 'solved', NOW() - INTERVAL '23 days 1 hour'),
('00000000-0000-0000-0000-000000000002', '50ba8a73-5e8d-405b-b572-9d594b24bef6', 'solved', NOW() - INTERVAL '23 days 5 hours'),
('00000000-0000-0000-0000-000000000002', 'a0887c76-332e-4a46-85d3-95de1e859046', 'solved', NOW() - INTERVAL '24 days 3 hours'),
('00000000-0000-0000-0000-000000000002', '5c2f9013-d2f6-4066-a61c-b8a8586c6321', 'solved', NOW() - INTERVAL '24 days 7 hours'),
('00000000-0000-0000-0000-000000000002', '02038224-a5b1-41ce-ad82-2102b4aad474', 'solved', NOW() - INTERVAL '25 days 2 hours'),
('00000000-0000-0000-0000-000000000002', 'b229d44c-7e66-4aad-8601-946dd8fec705', 'solved', NOW() - INTERVAL '25 days 6 hours'),
('00000000-0000-0000-0000-000000000002', '9bdab7fe-5cd9-44a7-a333-63e8775ff2c8', 'solved', NOW() - INTERVAL '26 days 1 hour'),
('00000000-0000-0000-0000-000000000002', '03fc25ae-48ef-4563-8c81-f91c8268770e', 'solved', NOW() - INTERVAL '26 days 5 hours'),
('00000000-0000-0000-0000-000000000002', '95ec0b95-d75a-49d6-900c-b79c6b9d71ac', 'solved', NOW() - INTERVAL '27 days 3 hours'),
('00000000-0000-0000-0000-000000000002', 'b36c5396-e299-4fe3-9156-7eea40713bef', 'solved', NOW() - INTERVAL '27 days 7 hours'),
('00000000-0000-0000-0000-000000000002', '8cd58e67-35ae-4bec-a42b-a051116baa40', 'solved', NOW() - INTERVAL '28 days 2 hours'),
('00000000-0000-0000-0000-000000000002', '93ab65b7-4176-4e5a-a904-447335091119', 'solved', NOW() - INTERVAL '28 days 5 hours'),
('00000000-0000-0000-0000-000000000002', '7b4c082b-526f-4e4f-b07b-e1420b44577d', 'solved', NOW() - INTERVAL '29 days 1 hour'),
('00000000-0000-0000-0000-000000000002', '153084ee-d024-483d-a821-beaf807dd006', 'solved', NOW() - INTERVAL '29 days 4 hours'),
('00000000-0000-0000-0000-000000000002', 'bea13c92-5150-417a-ac4a-2acbd09354ef', 'solved', NOW() - INTERVAL '30 days 2 hours'),
('00000000-0000-0000-0000-000000000002', 'b3cd812a-acc7-4b4c-a662-7716354c6a4a', 'solved', NOW() - INTERVAL '30 days 6 hours'),
('00000000-0000-0000-0000-000000000002', '0f70e2b8-daf5-4452-bd9c-7d3d5abc71f2', 'solved', NOW() - INTERVAL '4 days 6 hours'),
('00000000-0000-0000-0000-000000000002', '0ac8fa3a-bdbe-4963-8b1b-f68270210d0e', 'solved', NOW() - INTERVAL '6 days 5 hours'),
('00000000-0000-0000-0000-000000000002', '87c8da80-a914-430e-89a9-61cde5ca5cd0', 'solved', NOW() - INTERVAL '7 days 8 hours'),
('00000000-0000-0000-0000-000000000002', 'c7d3764a-cbaf-4efd-8c23-f890b1336569', 'solved', NOW() - INTERVAL '8 days 6 hours'),
('00000000-0000-0000-0000-000000000002', 'dfbee91b-c045-4e8e-b3ca-e3ace40e6322', 'solved', NOW() - INTERVAL '9 days 3 hours'),
('00000000-0000-0000-0000-000000000002', '90a01553-73a0-49c7-8170-742967a9a870', 'solved', NOW() - INTERVAL '10 days 8 hours'),
('00000000-0000-0000-0000-000000000002', 'b3e030e6-ecfd-4345-a3f6-163c5767a2cc', 'solved', NOW() - INTERVAL '11 days 5 hours'),
('00000000-0000-0000-0000-000000000002', '1d1cc590-b9a0-484d-899d-adb5743d5e89', 'solved', NOW() - INTERVAL '12 days 3 hours'),
('00000000-0000-0000-0000-000000000002', '989e34c9-fff4-4685-861c-f495577185f7', 'solved', NOW() - INTERVAL '13 days 5 hours'),
('00000000-0000-0000-0000-000000000002', '97bcfd49-e9e9-4063-9008-ce532fc0f299', 'solved', NOW() - INTERVAL '14 days 8 hours'),
-- Arjun SOLVED - Hard (25 problems)
('00000000-0000-0000-0000-000000000002', 'd7294845-8937-4eb9-a535-7d283bd70279', 'solved', NOW() - INTERVAL '1 day 8 hours'),
('00000000-0000-0000-0000-000000000002', '3396e06f-f405-4287-a230-08e37606c854', 'solved', NOW() - INTERVAL '3 days 7 hours'),
('00000000-0000-0000-0000-000000000002', '3880c37f-743f-4ba0-9537-29f99a707803', 'solved', NOW() - INTERVAL '5 days 8 hours'),
('00000000-0000-0000-0000-000000000002', '70310ce5-0281-4de5-95bd-c496af4e9b33', 'solved', NOW() - INTERVAL '6 days 8 hours'),
('00000000-0000-0000-0000-000000000002', '5b9112de-04bd-48e3-870e-b8d7007d455d', 'solved', NOW() - INTERVAL '8 days 9 hours'),
('00000000-0000-0000-0000-000000000002', '71d5901a-30ce-4ef0-a553-54b5183274f9', 'solved', NOW() - INTERVAL '10 days 9 hours'),
('00000000-0000-0000-0000-000000000002', 'b7696678-c809-4ea8-9395-c164380fad4d', 'solved', NOW() - INTERVAL '12 days 8 hours'),
('00000000-0000-0000-0000-000000000002', '55af29d4-5032-4b5b-a6c2-51eda79cda6b', 'solved', NOW() - INTERVAL '14 days 9 hours'),
('00000000-0000-0000-0000-000000000002', '029c2969-33de-406b-b948-1cd8d169256a', 'solved', NOW() - INTERVAL '16 days 8 hours'),
('00000000-0000-0000-0000-000000000002', '64c184aa-c727-4355-9e46-04127d6ed42f', 'solved', NOW() - INTERVAL '18 days 9 hours'),
('00000000-0000-0000-0000-000000000002', '861820e2-0611-4a3f-a462-a0f8a080636e', 'solved', NOW() - INTERVAL '20 days 8 hours'),
('00000000-0000-0000-0000-000000000002', '92568bfa-5748-4b09-90fe-8e18930e5d8f', 'solved', NOW() - INTERVAL '22 days 7 hours'),
('00000000-0000-0000-0000-000000000002', 'a9d8f90d-b4d4-405b-93a6-09099074d4a3', 'solved', NOW() - INTERVAL '24 days 9 hours'),
('00000000-0000-0000-0000-000000000002', 'cc274a5b-f033-4df0-9699-cbbb69e334b5', 'solved', NOW() - INTERVAL '26 days 8 hours'),
('00000000-0000-0000-0000-000000000002', 'ff7e391e-e5c1-4a91-b42e-1be92c4d0e39', 'solved', NOW() - INTERVAL '28 days 7 hours'),
('00000000-0000-0000-0000-000000000002', 'ea0016e8-5db4-4615-8443-a11a0574029e', 'solved', NOW() - INTERVAL '29 days 6 hours'),
('00000000-0000-0000-0000-000000000002', '80d22a1a-ee7a-4d1c-928b-4e8f4c060954', 'solved', NOW() - INTERVAL '30 days 3 hours'),
('00000000-0000-0000-0000-000000000002', 'd1b69ce8-8cbe-4acb-a1a4-a0fbf3cbb0a2', 'solved', NOW() - INTERVAL '15 days 8 hours'),
('00000000-0000-0000-0000-000000000002', 'fddd6ca6-c8db-4960-8165-20cd4709e871', 'solved', NOW() - INTERVAL '19 days 8 hours'),
('00000000-0000-0000-0000-000000000002', '7bd0916b-c905-4b87-9a2d-12bc01a5a738', 'solved', NOW() - INTERVAL '21 days 9 hours'),
('00000000-0000-0000-0000-000000000002', '8b1666f2-ca4c-4d8d-99ca-83f77839cbf2', 'solved', NOW() - INTERVAL '23 days 8 hours'),
('00000000-0000-0000-0000-000000000002', '1a65b6bd-be47-411a-94e6-1da5627ebab8', 'solved', NOW() - INTERVAL '25 days 9 hours'),
('00000000-0000-0000-0000-000000000002', '9a0fb2cd-30c9-43f5-99b0-4d04958edf97', 'solved', NOW() - INTERVAL '27 days 8 hours'),
('00000000-0000-0000-0000-000000000002', 'fb4452bf-7979-4841-ac2a-31dc1072bae4', 'solved', NOW() - INTERVAL '29 days 9 hours'),
('00000000-0000-0000-0000-000000000002', 'a88b1d6f-d3b7-4d15-8d48-7cff0cae0e3d', 'solved', NOW() - INTERVAL '30 days 8 hours'),
-- Arjun ATTEMPTED (30 problems)
('00000000-0000-0000-0000-000000000002', 'bf5642f3-a28b-4910-92c7-a37c0e47668c', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', '327406bf-c1ea-4dfa-b851-ea7bb74b465e', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', 'a6252762-c930-4311-9fdc-c0e17bea8f5f', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', '5c5ffa51-bb36-4bc8-bc6d-054fe535a513', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', '34a9c707-9903-41bb-a21b-aefeda8e35ff', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', '754488b0-76d4-4908-a306-5011eb54533a', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', 'e5498175-1cbd-483c-93ad-d22c79ba5385', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', 'b2325855-f7b0-4519-9274-19e60b1b4d48', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', '863f1789-6bd9-4fc9-80fa-293367931b44', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', '601d540a-cee1-4ea8-94ee-857c13c88ad9', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', '5934044b-6a66-4a03-8e10-8876af7d2f92', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', 'a2448323-33d9-4a07-84b0-39c303635b50', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', 'cc1cc4b9-0d15-4c00-9355-4aeaeeda43e1', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', '1df3f407-eba8-477c-8a61-114e7496c9aa', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', 'c2fd75b9-defc-4fe3-80be-9e9b5930e8b8', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', '39e9c75f-6180-4b54-98ab-5458a57aea39', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', '95b7d8c3-d1c3-475c-a920-fb7dc9a3a500', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', 'f66c747e-7435-46e8-9b3c-a4251de92796', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', 'e0963abe-ca90-4a66-8ce5-4d5df495adca', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', 'a8539787-a0fe-4574-af0f-b37be56c1f9b', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', '06c45836-74f7-4ad9-add6-8a78aa02637c', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', '5e1005a0-4668-45fb-90c0-a48a623985b7', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', 'fe3188ed-0601-4c4c-b75e-01eac03102b7', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', '1d6e6b7d-9d81-4a1a-88d3-49317c06aadf', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', '2c6368e8-5021-4915-81b1-1ad6c85eb0d6', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', '929f1514-03fa-43b5-a523-b02c8c22f56c', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', '2498763c-3c5e-424c-8202-dc929319b343', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', 'fa452b4e-eab3-49e6-8067-e2e25e0424a6', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', '8d6eb9e8-138d-466e-ae06-c762d6a4caaa', 'attempted', NULL),
('00000000-0000-0000-0000-000000000002', 'e01db357-1f75-4615-94ef-a1378ee4cb6b', 'attempted', NULL),
-- Priya SOLVED - Easy (20 problems)
('00000000-0000-0000-0000-000000000003', '5c60d304-b7a4-450a-8917-4b0eca1b7491', 'solved', NOW() - INTERVAL '1 day 3 hours'),
('00000000-0000-0000-0000-000000000003', '7b709a45-fec6-4743-b2da-2eee312838f9', 'solved', NOW() - INTERVAL '2 days 2 hours'),
('00000000-0000-0000-0000-000000000003', '89eff95f-45ea-4923-81d4-08157a699347', 'solved', NOW() - INTERVAL '3 days 4 hours'),
('00000000-0000-0000-0000-000000000003', 'a424144d-9411-48cb-b6ba-b615de4f02ef', 'solved', NOW() - INTERVAL '4 days 1 hour'),
('00000000-0000-0000-0000-000000000003', 'ff689f9f-42cd-450a-babb-bd9cb2489fbc', 'solved', NOW() - INTERVAL '5 days 3 hours'),
('00000000-0000-0000-0000-000000000003', '7a68e7be-d922-40ae-a523-6d9eff7f92ec', 'solved', NOW() - INTERVAL '6 days 2 hours'),
('00000000-0000-0000-0000-000000000003', 'd4e1d4e6-cae9-4085-90da-b341295fe0e8', 'solved', NOW() - INTERVAL '7 days 5 hours'),
('00000000-0000-0000-0000-000000000003', '7e02a395-0e1e-4da1-89b2-19f0522b4a79', 'solved', NOW() - INTERVAL '8 days 3 hours'),
('00000000-0000-0000-0000-000000000003', '8343a953-0c57-4da8-836f-7e79dedce2bc', 'solved', NOW() - INTERVAL '9 days 1 hour'),
('00000000-0000-0000-0000-000000000003', 'f5d38ec7-0ae0-4df7-ae05-30a92b8f5df3', 'solved', NOW() - INTERVAL '10 days 4 hours'),
('00000000-0000-0000-0000-000000000003', '4b135ed6-6cf9-44fc-8896-3923e88a983d', 'solved', NOW() - INTERVAL '11 days 2 hours'),
('00000000-0000-0000-0000-000000000003', 'c7d52304-c4bf-4e1a-b655-662ba9cf24bd', 'solved', NOW() - INTERVAL '12 days 5 hours'),
('00000000-0000-0000-0000-000000000003', 'f668edc3-81d4-44dd-aa92-b6ae3e723a0c', 'solved', NOW() - INTERVAL '13 days 3 hours'),
('00000000-0000-0000-0000-000000000003', '38a05402-7f98-4d6e-b233-5049f2135883', 'solved', NOW() - INTERVAL '14 days 1 hour'),
('00000000-0000-0000-0000-000000000003', '481468de-a5d6-4131-bb23-215f0d6fcee2', 'solved', NOW() - INTERVAL '15 days 4 hours'),
('00000000-0000-0000-0000-000000000003', '42ce30e1-1c51-4046-92a2-ea5dff1d78f6', 'solved', NOW() - INTERVAL '16 days 2 hours'),
('00000000-0000-0000-0000-000000000003', '5534a3b0-7d06-460c-a3d7-abeb6a621caf', 'solved', NOW() - INTERVAL '18 days 3 hours'),
('00000000-0000-0000-0000-000000000003', '6079ec3b-f48c-42ee-8942-44bedee53972', 'solved', NOW() - INTERVAL '20 days 1 hour'),
('00000000-0000-0000-0000-000000000003', '615b2fc8-ed68-4be3-8129-41eee6a97659', 'solved', NOW() - INTERVAL '22 days 5 hours'),
('00000000-0000-0000-0000-000000000003', '4c331b2d-8192-4fde-8197-223de229e95e', 'solved', NOW() - INTERVAL '25 days 2 hours'),
-- Priya SOLVED - Medium (20 problems)
('00000000-0000-0000-0000-000000000003', '51f367df-f747-4664-b142-7887333f616d', 'solved', NOW() - INTERVAL '1 day 6 hours'),
('00000000-0000-0000-0000-000000000003', 'a41b281f-a52a-4753-8b1e-bd0f267fd9f2', 'solved', NOW() - INTERVAL '2 days 5 hours'),
('00000000-0000-0000-0000-000000000003', '92548b02-8d34-409a-9359-29cf233a250c', 'solved', NOW() - INTERVAL '3 days 7 hours'),
('00000000-0000-0000-0000-000000000003', 'bde193c5-4cff-4c5d-be34-8fa0852857af', 'solved', NOW() - INTERVAL '5 days 5 hours'),
('00000000-0000-0000-0000-000000000003', '03fc25ae-48ef-4563-8c81-f91c8268770e', 'solved', NOW() - INTERVAL '6 days 4 hours'),
('00000000-0000-0000-0000-000000000003', '2c08bb48-f469-4713-a5b0-77be33d85180', 'solved', NOW() - INTERVAL '7 days 7 hours'),
('00000000-0000-0000-0000-000000000003', '74f0e34d-a60a-4332-b7d8-feb95b21a0ef', 'solved', NOW() - INTERVAL '9 days 3 hours'),
('00000000-0000-0000-0000-000000000003', '4870b4c7-58de-4779-98e3-b5646510746f', 'solved', NOW() - INTERVAL '10 days 6 hours'),
('00000000-0000-0000-0000-000000000003', 'ece5cdde-0bb8-4b79-9b65-ce6ef48b279a', 'solved', NOW() - INTERVAL '12 days 2 hours'),
('00000000-0000-0000-0000-000000000003', '3161a61a-793d-47fb-8338-2f5df92e587b', 'solved', NOW() - INTERVAL '14 days 5 hours'),
('00000000-0000-0000-0000-000000000003', 'c35cfb72-5a87-4b5f-b16f-2b216da8b110', 'solved', NOW() - INTERVAL '16 days 4 hours'),
('00000000-0000-0000-0000-000000000003', '2242f730-b650-4087-9eab-002e8c4885d1', 'solved', NOW() - INTERVAL '18 days 6 hours'),
('00000000-0000-0000-0000-000000000003', '1c1fdd01-bb69-4d4a-ab33-1dec73095567', 'solved', NOW() - INTERVAL '20 days 3 hours'),
('00000000-0000-0000-0000-000000000003', '8d4f5d50-dac8-422b-ba4c-631b853a1d2c', 'solved', NOW() - INTERVAL '22 days 2 hours'),
('00000000-0000-0000-0000-000000000003', '15cd13ab-4614-4874-8d52-2508ec20fd1f', 'solved', NOW() - INTERVAL '24 days 4 hours'),
('00000000-0000-0000-0000-000000000003', '0ac8fa3a-bdbe-4963-8b1b-f68270210d0e', 'solved', NOW() - INTERVAL '26 days 3 hours'),
('00000000-0000-0000-0000-000000000003', 'ede6af5f-52f7-4019-a030-4ca4bd8f060a', 'solved', NOW() - INTERVAL '27 days 5 hours'),
('00000000-0000-0000-0000-000000000003', 'd36ac809-e025-44d2-8e4d-da7c6c6af5c4', 'solved', NOW() - INTERVAL '28 days 2 hours'),
('00000000-0000-0000-0000-000000000003', '6ce0a07e-e1d6-45ae-a668-68a99e5749dd', 'solved', NOW() - INTERVAL '29 days 4 hours'),
('00000000-0000-0000-0000-000000000003', '9e76415a-fb41-4002-98d2-46536af5fd83', 'solved', NOW() - INTERVAL '30 days 1 hour'),
-- Priya SOLVED - Hard (5 problems)
('00000000-0000-0000-0000-000000000003', '861820e2-0611-4a3f-a462-a0f8a080636e', 'solved', NOW() - INTERVAL '4 days 8 hours'),
('00000000-0000-0000-0000-000000000003', '3396e06f-f405-4287-a230-08e37606c854', 'solved', NOW() - INTERVAL '11 days 7 hours'),
('00000000-0000-0000-0000-000000000003', '55af29d4-5032-4b5b-a6c2-51eda79cda6b', 'solved', NOW() - INTERVAL '17 days 6 hours'),
('00000000-0000-0000-0000-000000000003', 'b7696678-c809-4ea8-9395-c164380fad4d', 'solved', NOW() - INTERVAL '23 days 5 hours'),
('00000000-0000-0000-0000-000000000003', 'ea0016e8-5db4-4615-8443-a11a0574029e', 'solved', NOW() - INTERVAL '29 days 7 hours'),
-- Priya ATTEMPTED (15 problems)
('00000000-0000-0000-0000-000000000003', 'd7294845-8937-4eb9-a535-7d283bd70279', 'attempted', NULL),
('00000000-0000-0000-0000-000000000003', '1ab81abc-9b67-4733-9af1-6a90398d7e8b', 'attempted', NULL),
('00000000-0000-0000-0000-000000000003', 'b8e72d1e-03c9-42ae-861f-61e6e2a28892', 'attempted', NULL),
('00000000-0000-0000-0000-000000000003', '1ff52440-b7d1-4dcf-862a-b703689044ad', 'attempted', NULL),
('00000000-0000-0000-0000-000000000003', '41cd5af8-cc42-464b-88e2-07c7c169d66c', 'attempted', NULL),
('00000000-0000-0000-0000-000000000003', '50ba8a73-5e8d-405b-b572-9d594b24bef6', 'attempted', NULL),
('00000000-0000-0000-0000-000000000003', '695a6482-d7b0-4ef8-aad1-1485a131775f', 'attempted', NULL),
('00000000-0000-0000-0000-000000000003', '1ebed14e-2960-439c-bfd2-46195fa1a5b7', 'attempted', NULL),
('00000000-0000-0000-0000-000000000003', 'bdbe111b-2cee-43e4-8024-7f241b448d6b', 'attempted', NULL),
('00000000-0000-0000-0000-000000000003', 'a0887c76-332e-4a46-85d3-95de1e859046', 'attempted', NULL),
('00000000-0000-0000-0000-000000000003', '5c2f9013-d2f6-4066-a61c-b8a8586c6321', 'attempted', NULL),
('00000000-0000-0000-0000-000000000003', '97bcfd49-e9e9-4063-9008-ce532fc0f299', 'attempted', NULL),
('00000000-0000-0000-0000-000000000003', '5c5ffa51-bb36-4bc8-bc6d-054fe535a513', 'attempted', NULL),
('00000000-0000-0000-0000-000000000003', 'bf5642f3-a28b-4910-92c7-a37c0e47668c', 'attempted', NULL),
('00000000-0000-0000-0000-000000000003', '34a9c707-9903-41bb-a21b-aefeda8e35ff', 'attempted', NULL)
ON CONFLICT (user_id, problem_id) DO NOTHING;

-- ============================================================================
-- 2. STREAKS - Verify/update
-- ============================================================================

INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_solve_date)
VALUES
('00000000-0000-0000-0000-000000000002', 42, 42, CURRENT_DATE),
('00000000-0000-0000-0000-000000000003', 15, 28, CURRENT_DATE)
ON CONFLICT (user_id) DO UPDATE SET
  current_streak = EXCLUDED.current_streak,
  longest_streak = EXCLUDED.longest_streak,
  last_solve_date = EXCLUDED.last_solve_date;

-- ============================================================================
-- 3. SUBMISSIONS - 30 for Arjun, 15 for Priya
-- ============================================================================

INSERT INTO submissions (id, user_id, problem_id, status, language, code, runtime_ms, runtime_percentile, memory_kb, memory_percentile, time_spent_seconds, submitted_at) VALUES
-- Arjun submissions (Python3 mostly)
('a0000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '5c60d304-b7a4-450a-8917-4b0eca1b7491', 'accepted', 'python3', E'# Two Sum\nclass Solution:\n    def twoSum(self, nums, target):\n        seen = {}\n        for i, n in enumerate(nums):\n            if target - n in seen:\n                return [seen[target - n], i]\n            seen[n] = i', 42, 89.50, 16800, 72.30, 180, NOW() - INTERVAL '11 days 1 hour'),
('a0000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '92548b02-8d34-409a-9359-29cf233a250c', 'accepted', 'python3', E'# Rotate Image\nclass Solution:\n    def rotate(self, matrix):\n        matrix[:] = [list(row) for row in zip(*matrix[::-1])]', 35, 94.20, 16400, 85.10, 240, NOW() - INTERVAL '1 day 3 hours'),
('a0000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '51f367df-f747-4664-b142-7887333f616d', 'accepted', 'python3', E'# Group Anagrams\nclass Solution:\n    def groupAnagrams(self, strs):\n        d = defaultdict(list)\n        for s in strs:\n            d[tuple(sorted(s))].append(s)\n        return list(d.values())', 78, 82.40, 19200, 65.80, 360, NOW() - INTERVAL '5 days 1 hour'),
('a0000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', '3396e06f-f405-4287-a230-08e37606c854', 'accepted', 'python3', E'# Merge K Sorted Lists\nimport heapq\nclass Solution:\n    def mergeKLists(self, lists):\n        heap = []\n        for i, l in enumerate(lists):\n            if l: heapq.heappush(heap, (l.val, i, l))\n        dummy = cur = ListNode(0)\n        while heap:\n            val, i, node = heapq.heappop(heap)\n            cur.next = node\n            cur = cur.next\n            if node.next:\n                heapq.heappush(heap, (node.next.val, i, node.next))\n        return dummy.next', 68, 96.30, 20100, 58.40, 900, NOW() - INTERVAL '3 days 7 hours'),
('a0000001-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'a41b281f-a52a-4753-8b1e-bd0f267fd9f2', 'accepted', 'python3', E'# Merge Intervals\nclass Solution:\n    def merge(self, intervals):\n        intervals.sort()\n        merged = [intervals[0]]\n        for s, e in intervals[1:]:\n            if s <= merged[-1][1]:\n                merged[-1][1] = max(merged[-1][1], e)\n            else:\n                merged.append([s, e])\n        return merged', 72, 87.60, 18900, 70.20, 420, NOW() - INTERVAL '2 days 8 hours'),
('a0000001-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', '861820e2-0611-4a3f-a462-a0f8a080636e', 'accepted', 'python3', E'# Trapping Rain Water\nclass Solution:\n    def trap(self, height):\n        l, r = 0, len(height) - 1\n        lmax = rmax = ans = 0\n        while l < r:\n            if height[l] < height[r]:\n                lmax = max(lmax, height[l])\n                ans += lmax - height[l]\n                l += 1\n            else:\n                rmax = max(rmax, height[r])\n                ans += rmax - height[r]\n                r -= 1\n        return ans', 52, 97.80, 17600, 82.50, 600, NOW() - INTERVAL '20 days 8 hours'),
('a0000001-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', 'bde193c5-4cff-4c5d-be34-8fa0852857af', 'accepted', 'python3', E'# Longest Substring Without Repeating Characters\nclass Solution:\n    def lengthOfLongestSubstring(self, s):\n        seen = {}\n        l = res = 0\n        for r, c in enumerate(s):\n            if c in seen and seen[c] >= l:\n                l = seen[c] + 1\n            seen[c] = r\n            res = max(res, r - l + 1)\n        return res', 48, 91.20, 16900, 78.40, 300, NOW() - INTERVAL '11 days 3 hours'),
('a0000001-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000002', '2c08bb48-f469-4713-a5b0-77be33d85180', 'accepted', 'python3', E'# Coin Change\nclass Solution:\n    def coinChange(self, coins, amount):\n        dp = [float("inf")] * (amount + 1)\n        dp[0] = 0\n        for c in coins:\n            for a in range(c, amount + 1):\n                dp[a] = min(dp[a], dp[a - c] + 1)\n        return dp[amount] if dp[amount] != float("inf") else -1', 108, 75.30, 17200, 80.10, 480, NOW() - INTERVAL '23 days 1 hour'),
('a0000001-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000002', '50ba8a73-5e8d-405b-b572-9d594b24bef6', 'accepted', 'python3', E'# LRU Cache\nfrom collections import OrderedDict\nclass LRUCache(OrderedDict):\n    def __init__(self, capacity):\n        self.cap = capacity\n    def get(self, key):\n        if key not in self: return -1\n        self.move_to_end(key)\n        return self[key]\n    def put(self, key, value):\n        if key in self: self.move_to_end(key)\n        self[key] = value\n        if len(self) > self.cap: self.popitem(last=False)', 145, 68.90, 24300, 52.60, 720, NOW() - INTERVAL '23 days 5 hours'),
('a0000001-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000002', 'd36ac809-e025-44d2-8e4d-da7c6c6af5c4', 'accepted', 'python3', E'# Word Break\nclass Solution:\n    def wordBreak(self, s, wordDict):\n        dp = [False] * (len(s) + 1)\n        dp[0] = True\n        words = set(wordDict)\n        for i in range(1, len(s) + 1):\n            for j in range(i):\n                if dp[j] and s[j:i] in words:\n                    dp[i] = True\n                    break\n        return dp[-1]', 38, 93.50, 16500, 84.30, 540, NOW() - INTERVAL '7 days 6 hours'),
('a0000001-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000002', '4870b4c7-58de-4779-98e3-b5646510746f', 'accepted', 'python3', E'# Daily Temperatures\nclass Solution:\n    def dailyTemperatures(self, temperatures):\n        res = [0] * len(temperatures)\n        stack = []\n        for i, t in enumerate(temperatures):\n            while stack and temperatures[stack[-1]] < t:\n                j = stack.pop()\n                res[j] = i - j\n            stack.append(i)\n        return res', 85, 79.80, 28400, 45.20, 360, NOW() - INTERVAL '15 days 1 hour'),
('a0000001-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000002', '3161a61a-793d-47fb-8338-2f5df92e587b', 'accepted', 'python3', E'# Implement Trie\nclass Trie:\n    def __init__(self):\n        self.children = {}\n        self.end = False\n    def insert(self, word):\n        node = self\n        for c in word:\n            if c not in node.children:\n                node.children[c] = Trie()\n            node = node.children[c]\n        node.end = True', 132, 72.10, 32100, 40.80, 600, NOW() - INTERVAL '6 days 3 hours'),
('a0000001-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000002', '8d4f5d50-dac8-422b-ba4c-631b853a1d2c', 'accepted', 'python3', E'# Course Schedule\nclass Solution:\n    def canFinish(self, numCourses, prerequisites):\n        graph = defaultdict(list)\n        for a, b in prerequisites:\n            graph[a].append(b)\n        visited = set()\n        path = set()\n        def dfs(node):\n            if node in path: return False\n            if node in visited: return True\n            path.add(node)\n            for nei in graph[node]:\n                if not dfs(nei): return False\n            path.remove(node)\n            visited.add(node)\n            return True\n        return all(dfs(i) for i in range(numCourses))', 55, 90.40, 18700, 71.60, 780, NOW() - INTERVAL '19 days 7 hours'),
('a0000001-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000002', '55af29d4-5032-4b5b-a6c2-51eda79cda6b', 'accepted', 'python3', E'# Minimum Window Substring\nfrom collections import Counter\nclass Solution:\n    def minWindow(self, s, t):\n        need = Counter(t)\n        missing = len(t)\n        l = start = end = 0\n        for r, c in enumerate(s, 1):\n            missing -= need[c] > 0\n            need[c] -= 1\n            if not missing:\n                while l < r and need[s[l]] < 0:\n                    need[s[l]] += 1\n                    l += 1\n                if not end or r - l <= end - start:\n                    start, end = l, r\n                need[s[l]] += 1\n                missing += 1\n                l += 1\n        return s[start:end]', 62, 95.60, 17300, 80.20, 1200, NOW() - INTERVAL '14 days 9 hours'),
('a0000001-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000002', 'b229d44c-7e66-4aad-8601-946dd8fec705', 'accepted', 'python3', E'# 3Sum\nclass Solution:\n    def threeSum(self, nums):\n        nums.sort()\n        res = []\n        for i in range(len(nums) - 2):\n            if i > 0 and nums[i] == nums[i-1]: continue\n            l, r = i + 1, len(nums) - 1\n            while l < r:\n                s = nums[i] + nums[l] + nums[r]\n                if s < 0: l += 1\n                elif s > 0: r -= 1\n                else:\n                    res.append([nums[i], nums[l], nums[r]])\n                    while l < r and nums[l] == nums[l+1]: l += 1\n                    l += 1; r -= 1\n        return res', 95, 84.20, 19800, 62.10, 660, NOW() - INTERVAL '25 days 6 hours'),
('a0000001-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000002', 'a0887c76-332e-4a46-85d3-95de1e859046', 'accepted', 'python3', E'# Longest Consecutive Sequence\nclass Solution:\n    def longestConsecutive(self, nums):\n        s = set(nums)\n        best = 0\n        for n in s:\n            if n - 1 not in s:\n                length = 1\n                while n + length in s:\n                    length += 1\n                best = max(best, length)\n        return best', 120, 76.80, 31200, 42.50, 300, NOW() - INTERVAL '24 days 3 hours'),
('a0000001-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000002', 'd4e1d4e6-cae9-4085-90da-b341295fe0e8', 'accepted', 'python3', E'# Reverse Linked List\nclass Solution:\n    def reverseList(self, head):\n        prev = None\n        while head:\n            head.next, prev, head = prev, head, head.next\n        return prev', 32, 96.70, 16200, 88.40, 120, NOW() - INTERVAL '4 days 2 hours'),
('a0000001-0000-0000-0000-000000000018', '00000000-0000-0000-0000-000000000002', 'b7696678-c809-4ea8-9395-c164380fad4d', 'accepted', 'python3', E'# Largest Rectangle in Histogram\nclass Solution:\n    def largestRectangleArea(self, heights):\n        stack = [-1]\n        ans = 0\n        for i, h in enumerate(heights):\n            while stack[-1] != -1 and heights[stack[-1]] >= h:\n                height = heights[stack.pop()]\n                width = i - stack[-1] - 1\n                ans = max(ans, height * width)\n            stack.append(i)\n        while stack[-1] != -1:\n            height = heights[stack.pop()]\n            width = len(heights) - stack[-1] - 1\n            ans = max(ans, height * width)\n        return ans', 75, 88.90, 27600, 48.30, 1080, NOW() - INTERVAL '12 days 8 hours'),
('a0000001-0000-0000-0000-000000000019', '00000000-0000-0000-0000-000000000002', '715e00be-48d1-4950-8ccb-da05d03f85b3', 'accepted', 'python3', E'# Kth Largest Element\nimport heapq\nclass Solution:\n    def findKthLargest(self, nums, k):\n        return heapq.nlargest(k, nums)[-1]', 58, 85.30, 18100, 73.90, 180, NOW() - INTERVAL '12 days 1 hour'),
('a0000001-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000002', 'ece5cdde-0bb8-4b79-9b65-ce6ef48b279a', 'accepted', 'python3', E'# Jump Game\nclass Solution:\n    def canJump(self, nums):\n        reach = 0\n        for i, n in enumerate(nums):\n            if i > reach: return False\n            reach = max(reach, i + n)\n        return True', 45, 92.10, 17400, 79.60, 240, NOW() - INTERVAL '12 days 5 hours'),
('a0000001-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000002', '7b709a45-fec6-4743-b2da-2eee312838f9', 'accepted', 'python3', E'# Missing Number\nclass Solution:\n    def missingNumber(self, nums):\n        return len(nums) * (len(nums) + 1) // 2 - sum(nums)', 28, 98.20, 16100, 90.50, 120, NOW() - INTERVAL '1 day 2 hours'),
('a0000001-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000002', '03fc25ae-48ef-4563-8c81-f91c8268770e', 'accepted', 'python3', E'# Maximum Subarray (Kadane)\nclass Solution:\n    def maxSubArray(self, nums):\n        cur = best = nums[0]\n        for n in nums[1:]:\n            cur = max(n, cur + n)\n            best = max(best, cur)\n        return best', 65, 86.40, 28900, 44.70, 180, NOW() - INTERVAL '26 days 5 hours'),
('a0000001-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000002', '1ebed14e-2960-439c-bfd2-46195fa1a5b7', 'accepted', 'python3', E'# Palindromic Substrings\nclass Solution:\n    def countSubstrings(self, s):\n        count = 0\n        for i in range(len(s)):\n            for l, r in [(i, i), (i, i+1)]:\n                while l >= 0 and r < len(s) and s[l] == s[r]:\n                    count += 1\n                    l -= 1; r += 1\n        return count', 88, 80.60, 16600, 83.20, 420, NOW() - INTERVAL '8 days 4 hours'),
('a0000001-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000002', '153084ee-d024-483d-a821-beaf807dd006', 'accepted', 'python3', E'# Network Delay Time (Dijkstra)\nimport heapq\nclass Solution:\n    def networkDelayTime(self, times, n, k):\n        graph = defaultdict(list)\n        for u, v, w in times:\n            graph[u].append((v, w))\n        dist = {}\n        heap = [(0, k)]\n        while heap:\n            d, u = heapq.heappop(heap)\n            if u in dist: continue\n            dist[u] = d\n            for v, w in graph[u]:\n                if v not in dist:\n                    heapq.heappush(heap, (d + w, v))\n        return max(dist.values()) if len(dist) == n else -1', 112, 74.50, 19500, 64.30, 840, NOW() - INTERVAL '29 days 4 hours'),
('a0000001-0000-0000-0000-000000000025', '00000000-0000-0000-0000-000000000002', '9e76415a-fb41-4002-98d2-46536af5fd83', 'accepted', 'python3', E'# Permutation in String\nfrom collections import Counter\nclass Solution:\n    def checkInclusion(self, s1, s2):\n        c1 = Counter(s1)\n        window = Counter(s2[:len(s1)])\n        if c1 == window: return True\n        for i in range(len(s1), len(s2)):\n            window[s2[i]] += 1\n            old = s2[i - len(s1)]\n            window[old] -= 1\n            if window[old] == 0: del window[old]\n            if c1 == window: return True\n        return False', 55, 90.80, 16800, 79.10, 480, NOW() - INTERVAL '4 days 7 hours'),
('a0000001-0000-0000-0000-000000000026', '00000000-0000-0000-0000-000000000002', 'ede6af5f-52f7-4019-a030-4ca4bd8f060a', 'accepted', 'python3', E'# Generate Parentheses\nclass Solution:\n    def generateParenthesis(self, n):\n        res = []\n        def bt(s, o, c):\n            if len(s) == 2 * n:\n                res.append(s)\n                return\n            if o < n: bt(s + "(", o + 1, c)\n            if c < o: bt(s + ")", o, c + 1)\n        bt("", 0, 0)\n        return res', 32, 97.10, 16300, 87.20, 300, NOW() - INTERVAL '20 days 1 hour'),
('a0000001-0000-0000-0000-000000000027', '00000000-0000-0000-0000-000000000002', '92568bfa-5748-4b09-90fe-8e18930e5d8f', 'accepted', 'python3', E'# Serialize and Deserialize Binary Tree\nclass Codec:\n    def serialize(self, root):\n        vals = []\n        def dfs(node):\n            if not node:\n                vals.append("#")\n                return\n            vals.append(str(node.val))\n            dfs(node.left)\n            dfs(node.right)\n        dfs(root)\n        return ",".join(vals)', 98, 78.90, 21400, 55.80, 960, NOW() - INTERVAL '22 days 7 hours'),
('a0000001-0000-0000-0000-000000000028', '00000000-0000-0000-0000-000000000002', '8b1666f2-ca4c-4d8d-99ca-83f77839cbf2', 'accepted', 'python3', E'# Binary Tree Maximum Path Sum\nclass Solution:\n    def maxPathSum(self, root):\n        self.ans = float("-inf")\n        def dfs(node):\n            if not node: return 0\n            l = max(0, dfs(node.left))\n            r = max(0, dfs(node.right))\n            self.ans = max(self.ans, l + r + node.val)\n            return max(l, r) + node.val\n        dfs(root)\n        return self.ans', 42, 95.40, 22800, 53.20, 720, NOW() - INTERVAL '23 days 8 hours'),
('a0000001-0000-0000-0000-000000000029', '00000000-0000-0000-0000-000000000002', '41cd5af8-cc42-464b-88e2-07c7c169d66c', 'accepted', 'python3', E'# Maximum Product Subarray\nclass Solution:\n    def maxProduct(self, nums):\n        res = mx = mn = nums[0]\n        for n in nums[1:]:\n            if n < 0: mx, mn = mn, mx\n            mx = max(n, mx * n)\n            mn = min(n, mn * n)\n            res = max(res, mx)\n        return res', 38, 93.80, 16700, 81.60, 360, NOW() - INTERVAL '5 days 5 hours'),
('a0000001-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000002', 'c90886f7-0663-4f9e-bb29-eab9670f8e29', 'accepted', 'python3', E'# Best Time to Buy and Sell Stock with Cooldown\nclass Solution:\n    def maxProfit(self, prices):\n        sold = 0\n        held = float("-inf")\n        rest = 0\n        for p in prices:\n            prev_sold = sold\n            sold = held + p\n            held = max(held, rest - p)\n            rest = max(rest, prev_sold)\n        return max(sold, rest)', 35, 96.20, 16400, 86.50, 540, NOW() - INTERVAL '13 days 3 hours'),
-- Priya submissions (Java/C++ mix)
('b0000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', '5c60d304-b7a4-450a-8917-4b0eca1b7491', 'accepted', 'java', E'// Two Sum\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            if (map.containsKey(target - nums[i]))\n                return new int[]{map.get(target - nums[i]), i};\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}', 4, 97.80, 44200, 52.30, 300, NOW() - INTERVAL '1 day 3 hours'),
('b0000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', '51f367df-f747-4664-b142-7887333f616d', 'accepted', 'java', E'// Group Anagrams\nclass Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        Map<String, List<String>> map = new HashMap<>();\n        for (String s : strs) {\n            char[] arr = s.toCharArray();\n            Arrays.sort(arr);\n            String key = new String(arr);\n            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);\n        }\n        return new ArrayList<>(map.values());\n    }\n}', 8, 88.40, 46800, 45.60, 480, NOW() - INTERVAL '1 day 6 hours'),
('b0000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', '89eff95f-45ea-4923-81d4-08157a699347', 'accepted', 'cpp', E'// Merge Two Sorted Lists\nclass Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n        if (!l1) return l2;\n        if (!l2) return l1;\n        if (l1->val < l2->val) {\n            l1->next = mergeTwoLists(l1->next, l2);\n            return l1;\n        }\n        l2->next = mergeTwoLists(l1, l2->next);\n        return l2;\n    }\n};', 4, 95.20, 14800, 82.40, 240, NOW() - INTERVAL '3 days 4 hours'),
('b0000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', '861820e2-0611-4a3f-a462-a0f8a080636e', 'accepted', 'cpp', E'// Trapping Rain Water\nclass Solution {\npublic:\n    int trap(vector<int>& height) {\n        int l = 0, r = height.size()-1, lmax = 0, rmax = 0, ans = 0;\n        while (l < r) {\n            if (height[l] < height[r]) {\n                lmax = max(lmax, height[l]);\n                ans += lmax - height[l++];\n            } else {\n                rmax = max(rmax, height[r]);\n                ans += rmax - height[r--];\n            }\n        }\n        return ans;\n    }\n};', 8, 92.60, 20100, 68.30, 900, NOW() - INTERVAL '4 days 8 hours'),
('b0000001-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', '92548b02-8d34-409a-9359-29cf233a250c', 'accepted', 'java', E'// Rotate Image\nclass Solution {\n    public void rotate(int[][] matrix) {\n        int n = matrix.length;\n        for (int i = 0; i < n; i++)\n            for (int j = i; j < n; j++) {\n                int tmp = matrix[i][j];\n                matrix[i][j] = matrix[j][i];\n                matrix[j][i] = tmp;\n            }\n        for (int[] row : matrix)\n            for (int i = 0; i < n/2; i++) {\n                int tmp = row[i];\n                row[i] = row[n-1-i];\n                row[n-1-i] = tmp;\n            }\n    }\n}', 0, 100.00, 41600, 62.80, 600, NOW() - INTERVAL '3 days 7 hours'),
('b0000001-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 'bde193c5-4cff-4c5d-be34-8fa0852857af', 'accepted', 'java', E'// Longest Substring Without Repeating Characters\nclass Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Set<Character> set = new HashSet<>();\n        int l = 0, res = 0;\n        for (int r = 0; r < s.length(); r++) {\n            while (set.contains(s.charAt(r)))\n                set.remove(s.charAt(l++));\n            set.add(s.charAt(r));\n            res = Math.max(res, r - l + 1);\n        }\n        return res;\n    }\n}', 6, 90.50, 43400, 55.20, 420, NOW() - INTERVAL '5 days 5 hours'),
('b0000001-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000003', '2c08bb48-f469-4713-a5b0-77be33d85180', 'accepted', 'cpp', E'// Coin Change\nclass Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        vector<int> dp(amount+1, amount+1);\n        dp[0] = 0;\n        for (int c : coins)\n            for (int a = c; a <= amount; a++)\n                dp[a] = min(dp[a], dp[a-c]+1);\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n};', 12, 85.70, 16200, 78.90, 600, NOW() - INTERVAL '7 days 7 hours'),
('b0000001-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000003', '3396e06f-f405-4287-a230-08e37606c854', 'accepted', 'java', E'// Merge K Sorted Lists\nclass Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> a.val - b.val);\n        for (ListNode l : lists) if (l != null) pq.offer(l);\n        ListNode dummy = new ListNode(0), cur = dummy;\n        while (!pq.isEmpty()) {\n            ListNode node = pq.poll();\n            cur.next = node;\n            cur = cur.next;\n            if (node.next != null) pq.offer(node.next);\n        }\n        return dummy.next;\n    }\n}', 6, 94.30, 44000, 50.40, 1200, NOW() - INTERVAL '11 days 7 hours'),
('b0000001-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000003', '74f0e34d-a60a-4332-b7d8-feb95b21a0ef', 'accepted', 'java', E'// Binary Tree Level Order Traversal\nclass Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        List<List<Integer>> res = new ArrayList<>();\n        if (root == null) return res;\n        Queue<TreeNode> q = new LinkedList<>();\n        q.offer(root);\n        while (!q.isEmpty()) {\n            int size = q.size();\n            List<Integer> level = new ArrayList<>();\n            for (int i = 0; i < size; i++) {\n                TreeNode node = q.poll();\n                level.add(node.val);\n                if (node.left != null) q.offer(node.left);\n                if (node.right != null) q.offer(node.right);\n            }\n            res.add(level);\n        }\n        return res;\n    }\n}', 2, 98.60, 43800, 54.10, 360, NOW() - INTERVAL '9 days 3 hours'),
('b0000001-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000003', 'd4e1d4e6-cae9-4085-90da-b341295fe0e8', 'accepted', 'cpp', E'// Reverse Linked List\nclass Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        ListNode* prev = nullptr;\n        while (head) {\n            ListNode* next = head->next;\n            head->next = prev;\n            prev = head;\n            head = next;\n        }\n        return prev;\n    }\n};', 4, 93.40, 14600, 85.70, 180, NOW() - INTERVAL '7 days 5 hours'),
('b0000001-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000003', '03fc25ae-48ef-4563-8c81-f91c8268770e', 'accepted', 'java', E'// Maximum Subarray\nclass Solution {\n    public int maxSubArray(int[] nums) {\n        int cur = nums[0], best = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            cur = Math.max(nums[i], cur + nums[i]);\n            best = Math.max(best, cur);\n        }\n        return best;\n    }\n}', 2, 99.10, 51200, 40.20, 240, NOW() - INTERVAL '6 days 4 hours'),
('b0000001-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000003', 'a41b281f-a52a-4753-8b1e-bd0f267fd9f2', 'accepted', 'cpp', E'// Merge Intervals\nclass Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        sort(intervals.begin(), intervals.end());\n        vector<vector<int>> res = {intervals[0]};\n        for (auto& iv : intervals) {\n            if (iv[0] <= res.back()[1])\n                res.back()[1] = max(res.back()[1], iv[1]);\n            else\n                res.push_back(iv);\n        }\n        return res;\n    }\n};', 18, 82.30, 19400, 70.60, 540, NOW() - INTERVAL '2 days 5 hours'),
('b0000001-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000003', '4870b4c7-58de-4779-98e3-b5646510746f', 'accepted', 'java', E'// Daily Temperatures\nclass Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        int[] res = new int[temperatures.length];\n        Deque<Integer> stack = new ArrayDeque<>();\n        for (int i = 0; i < temperatures.length; i++) {\n            while (!stack.isEmpty() && temperatures[stack.peek()] < temperatures[i]) {\n                int j = stack.pop();\n                res[j] = i - j;\n            }\n            stack.push(i);\n        }\n        return res;\n    }\n}', 15, 80.90, 50200, 42.80, 600, NOW() - INTERVAL '10 days 6 hours'),
('b0000001-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000003', 'ece5cdde-0bb8-4b79-9b65-ce6ef48b279a', 'accepted', 'cpp', E'// Jump Game\nclass Solution {\npublic:\n    bool canJump(vector<int>& nums) {\n        int reach = 0;\n        for (int i = 0; i < nums.size(); i++) {\n            if (i > reach) return false;\n            reach = max(reach, i + nums[i]);\n        }\n        return true;\n    }\n};', 8, 88.50, 48600, 46.30, 300, NOW() - INTERVAL '12 days 2 hours'),
('b0000001-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000003', '55af29d4-5032-4b5b-a6c2-51eda79cda6b', 'accepted', 'java', E'// Minimum Window Substring\nclass Solution {\n    public String minWindow(String s, String t) {\n        int[] need = new int[128];\n        for (char c : t.toCharArray()) need[c]++;\n        int missing = t.length(), l = 0, start = 0, minLen = Integer.MAX_VALUE;\n        for (int r = 0; r < s.length(); r++) {\n            if (need[s.charAt(r)]-- > 0) missing--;\n            while (missing == 0) {\n                if (r - l + 1 < minLen) { minLen = r - l + 1; start = l; }\n                if (++need[s.charAt(l++)] > 0) missing++;\n            }\n        }\n        return minLen == Integer.MAX_VALUE ? "" : s.substring(start, start + minLen);\n    }\n}', 6, 96.80, 44800, 51.20, 1800, NOW() - INTERVAL '17 days 6 hours')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 4. REVISION NOTES - 20 for Arjun, 8 for Priya
-- ============================================================================

INSERT INTO revision_notes (user_id, problem_id, key_takeaway, approach, time_complexity, space_complexity, tags, difficulty_rating, last_revised_at, revision_count) VALUES
-- Arjun revision notes (20)
('00000000-0000-0000-0000-000000000002', '5c60d304-b7a4-450a-8917-4b0eca1b7491', 'Use hash map to achieve O(n) instead of brute force O(n^2). Key insight: store complement.', 'Hash Map lookup for complement', 'O(n)', 'O(n)', ARRAY['hash-map', 'array'], 'easy', NOW() - INTERVAL '2 days', 3),
('00000000-0000-0000-0000-000000000002', 'b229d44c-7e66-4aad-8601-946dd8fec705', 'Two pointer technique: sort array first, then use left/right pointers. Skip duplicates!', 'Sort + Two Pointers', 'O(n^2)', 'O(1)', ARRAY['two-pointers', 'sorting'], 'medium', NOW() - INTERVAL '3 days', 2),
('00000000-0000-0000-0000-000000000002', '861820e2-0611-4a3f-a462-a0f8a080636e', 'Two pointer from both ends. Track left max and right max. Water trapped = max - height at each position.', 'Two Pointer (optimal) or Monotonic Stack', 'O(n)', 'O(1)', ARRAY['two-pointers', 'stack', 'monotonic-stack'], 'hard', NOW() - INTERVAL '1 day', 5),
('00000000-0000-0000-0000-000000000002', 'a41b281f-a52a-4753-8b1e-bd0f267fd9f2', 'Sort intervals by start time. Merge overlapping by comparing end times. Classic greedy.', 'Sort + Linear Scan', 'O(n log n)', 'O(n)', ARRAY['intervals', 'sorting', 'greedy'], 'easy', NOW() - INTERVAL '4 days', 2),
('00000000-0000-0000-0000-000000000002', '3396e06f-f405-4287-a230-08e37606c854', 'Min heap with k elements. Always pop smallest, push its next. Divide and conquer also works.', 'Min Heap / Priority Queue', 'O(n log k)', 'O(k)', ARRAY['heap', 'linked-list', 'divide-and-conquer'], 'medium', NOW() - INTERVAL '5 days', 4),
('00000000-0000-0000-0000-000000000002', 'bde193c5-4cff-4c5d-be34-8fa0852857af', 'Sliding window with hash set/map. Shrink window when duplicate found. Classic template problem.', 'Sliding Window + Hash Set', 'O(n)', 'O(min(n,m))', ARRAY['sliding-window', 'hash-set', 'string'], 'easy', NOW() - INTERVAL '2 days', 3),
('00000000-0000-0000-0000-000000000002', '2c08bb48-f469-4713-a5b0-77be33d85180', 'Bottom-up DP. dp[amount] = min coins needed. For each coin, update all amounts >= coin value.', 'Bottom-up DP', 'O(amount * coins)', 'O(amount)', ARRAY['dynamic-programming', 'bfs'], 'medium', NOW() - INTERVAL '6 days', 3),
('00000000-0000-0000-0000-000000000002', '50ba8a73-5e8d-405b-b572-9d594b24bef6', 'OrderedDict in Python makes this trivial. For manual impl: doubly linked list + hash map.', 'Doubly Linked List + Hash Map', 'O(1) for get/put', 'O(capacity)', ARRAY['design', 'hash-map', 'linked-list'], 'medium', NOW() - INTERVAL '7 days', 4),
('00000000-0000-0000-0000-000000000002', '8d4f5d50-dac8-422b-ba4c-631b853a1d2c', 'DFS with cycle detection using 3 states: unvisited, in-path, visited. Topological sort variant.', 'DFS with 3-state coloring', 'O(V + E)', 'O(V + E)', ARRAY['graph', 'dfs', 'topological-sort'], 'medium', NOW() - INTERVAL '3 days', 2),
('00000000-0000-0000-0000-000000000002', '55af29d4-5032-4b5b-a6c2-51eda79cda6b', 'Sliding window with frequency count. Expand right, shrink left when all chars matched. Track minimum.', 'Sliding Window + Frequency Map', 'O(m + n)', 'O(1)', ARRAY['sliding-window', 'hash-map', 'string'], 'hard', NOW() - INTERVAL '1 day', 6),
('00000000-0000-0000-0000-000000000002', 'd36ac809-e025-44d2-8e4d-da7c6c6af5c4', 'DP where dp[i] = can we form s[:i] from dictionary. Inner loop checks all possible last words.', 'Bottom-up DP', 'O(n^2 * m)', 'O(n)', ARRAY['dynamic-programming', 'string', 'hash-set'], 'medium', NOW() - INTERVAL '8 days', 2),
('00000000-0000-0000-0000-000000000002', 'b7696678-c809-4ea8-9395-c164380fad4d', 'Monotonic stack pattern. For each bar, find how far it extends left and right. Stack stores indices.', 'Monotonic Stack', 'O(n)', 'O(n)', ARRAY['stack', 'monotonic-stack', 'array'], 'hard', NOW() - INTERVAL '4 days', 3),
('00000000-0000-0000-0000-000000000002', 'a0887c76-332e-4a46-85d3-95de1e859046', 'Use set for O(1) lookup. Only start counting from numbers where n-1 is NOT in set (start of sequence).', 'Hash Set with smart iteration', 'O(n)', 'O(n)', ARRAY['hash-set', 'array', 'union-find'], 'medium', NOW() - INTERVAL '5 days', 2),
('00000000-0000-0000-0000-000000000002', '4870b4c7-58de-4779-98e3-b5646510746f', 'Monotonic decreasing stack of indices. When we find warmer temp, pop and calculate distance.', 'Monotonic Stack', 'O(n)', 'O(n)', ARRAY['stack', 'monotonic-stack', 'array'], 'easy', NOW() - INTERVAL '6 days', 3),
('00000000-0000-0000-0000-000000000002', '153084ee-d024-483d-a821-beaf807dd006', 'Dijkstra with min heap. Track visited nodes. Return max distance if all nodes reached, else -1.', 'Dijkstra (min heap)', 'O(E log V)', 'O(V + E)', ARRAY['graph', 'dijkstra', 'heap'], 'medium', NOW() - INTERVAL '7 days', 2),
('00000000-0000-0000-0000-000000000002', '41cd5af8-cc42-464b-88e2-07c7c169d66c', 'Track both max and min product. Negative * negative = positive. Swap max/min when current is negative.', 'DP with max/min tracking', 'O(n)', 'O(1)', ARRAY['dynamic-programming', 'array'], 'medium', NOW() - INTERVAL '2 days', 4),
('00000000-0000-0000-0000-000000000002', '92568bfa-5748-4b09-90fe-8e18930e5d8f', 'Preorder DFS with null markers. Use comma separator. Deserialize with queue/iterator.', 'DFS Preorder with null markers', 'O(n)', 'O(n)', ARRAY['tree', 'dfs', 'design', 'serialization'], 'hard', NOW() - INTERVAL '3 days', 3),
('00000000-0000-0000-0000-000000000002', '8b1666f2-ca4c-4d8d-99ca-83f77839cbf2', 'DFS returns max single-path sum. At each node, update global max with left + right + node.val.', 'DFS with global max tracking', 'O(n)', 'O(h)', ARRAY['tree', 'dfs', 'dynamic-programming'], 'hard', NOW() - INTERVAL '5 days', 4),
('00000000-0000-0000-0000-000000000002', 'c90886f7-0663-4f9e-bb29-eab9670f8e29', 'State machine DP: held, sold, rest states. Transition: sold=held+price, held=max(held,rest-price), rest=max(rest,sold).', 'State Machine DP', 'O(n)', 'O(1)', ARRAY['dynamic-programming', 'state-machine'], 'medium', NOW() - INTERVAL '4 days', 3),
('00000000-0000-0000-0000-000000000002', '3161a61a-793d-47fb-8338-2f5df92e587b', 'Each node has children dict and end flag. Insert/search/startsWith all follow edges character by character.', 'Trie node with hash map children', 'O(m) per operation', 'O(total chars)', ARRAY['trie', 'design', 'string'], 'easy', NOW() - INTERVAL '1 day', 2),
-- Priya revision notes (8)
('00000000-0000-0000-0000-000000000003', '5c60d304-b7a4-450a-8917-4b0eca1b7491', 'HashMap approach: for each number, check if complement exists. Much faster than nested loops.', 'Hash Map one pass', 'O(n)', 'O(n)', ARRAY['hash-map', 'array', 'beginner'], 'easy', NOW() - INTERVAL '3 days', 2),
('00000000-0000-0000-0000-000000000003', '89eff95f-45ea-4923-81d4-08157a699347', 'Recursive merge is elegant. Compare heads, attach smaller one, recurse. Base case: if either is null.', 'Recursion', 'O(n + m)', 'O(n + m)', ARRAY['linked-list', 'recursion'], 'easy', NOW() - INTERVAL '5 days', 1),
('00000000-0000-0000-0000-000000000003', 'bde193c5-4cff-4c5d-be34-8fa0852857af', 'Sliding window: expand right pointer, shrink left when duplicate found. HashSet tracks window contents.', 'Sliding Window + HashSet', 'O(n)', 'O(min(n,m))', ARRAY['sliding-window', 'hash-set'], 'medium', NOW() - INTERVAL '2 days', 3),
('00000000-0000-0000-0000-000000000003', '2c08bb48-f469-4713-a5b0-77be33d85180', 'Bottom-up DP approach. Fill dp array from 0 to amount. Each cell = minimum coins to make that amount.', 'DP tabulation', 'O(amount * n)', 'O(amount)', ARRAY['dynamic-programming', 'bfs'], 'hard', NOW() - INTERVAL '4 days', 2),
('00000000-0000-0000-0000-000000000003', '861820e2-0611-4a3f-a462-a0f8a080636e', 'Two pointer approach is mind-blowing! Move the smaller pointer inward. Water level determined by min of maxes.', 'Two Pointers from both ends', 'O(n)', 'O(1)', ARRAY['two-pointers', 'hard-problem'], 'hard', NOW() - INTERVAL '1 day', 4),
('00000000-0000-0000-0000-000000000003', '03fc25ae-48ef-4563-8c81-f91c8268770e', 'Kadane''s algorithm: maintain current sum and global max. Reset current sum when it goes negative.', 'Kadane''s Algorithm', 'O(n)', 'O(1)', ARRAY['dynamic-programming', 'array', 'kadanes'], 'easy', NOW() - INTERVAL '6 days', 2),
('00000000-0000-0000-0000-000000000003', '74f0e34d-a60a-4332-b7d8-feb95b21a0ef', 'BFS with queue. Process level by level using queue size. Standard tree BFS template.', 'BFS with Queue', 'O(n)', 'O(n)', ARRAY['tree', 'bfs', 'queue'], 'easy', NOW() - INTERVAL '3 days', 1),
('00000000-0000-0000-0000-000000000003', 'd4e1d4e6-cae9-4085-90da-b341295fe0e8', 'Iterative: prev=null, keep moving next pointer. Also works recursively but iterative is cleaner.', 'Iterative pointer reversal', 'O(n)', 'O(1)', ARRAY['linked-list', 'two-pointers'], 'easy', NOW() - INTERVAL '2 days', 2)
ON CONFLICT (user_id, problem_id) DO NOTHING;

-- ============================================================================
-- 5. FEED EVENTS - 15+ events for each user
-- ============================================================================

INSERT INTO feed_events (id, user_id, event_type, title, description, metadata, created_at) VALUES
-- Arjun feed events (15 new + 6 existing = 21 total)
('a1000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'solve', 'Solved "Rotate Image"', 'In-place rotation using transpose + reverse. Elegant!', '{"difficulty": "medium", "problemSlug": "rotate-image", "problemTitle": "Rotate Image"}', NOW() - INTERVAL '1 day 3 hours'),
('a1000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'solve', 'Solved "Merge K Sorted Lists"', 'Min heap approach. O(n log k) is beautiful.', '{"difficulty": "hard", "problemSlug": "merge-k-sorted-lists", "problemTitle": "Merge K Sorted Lists"}', NOW() - INTERVAL '3 days 7 hours'),
('a1000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'solve', 'Solved "Group Anagrams"', NULL, '{"difficulty": "medium", "problemSlug": "group-anagrams", "problemTitle": "Group Anagrams"}', NOW() - INTERVAL '5 days 1 hour'),
('a1000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'solve', 'Solved "Minimum Window Substring"', 'Sliding window mastery. This problem is a must-do.', '{"difficulty": "hard", "problemSlug": "minimum-window-substring", "problemTitle": "Minimum Window Substring"}', NOW() - INTERVAL '14 days 9 hours'),
('a1000001-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'solve', 'Solved "LRU Cache"', 'OrderedDict makes it trivial in Python', '{"difficulty": "medium", "problemSlug": "lru-cache", "problemTitle": "LRU Cache"}', NOW() - INTERVAL '23 days 5 hours'),
('a1000001-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', 'solve', 'Solved "Coin Change"', 'Classic DP. Bottom-up approach clicked today.', '{"difficulty": "medium", "problemSlug": "coin-change", "problemTitle": "Coin Change"}', NOW() - INTERVAL '23 days 1 hour'),
('a1000001-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', 'solve', 'Solved "Largest Rectangle in Histogram"', 'Monotonic stack is so powerful for these problems', '{"difficulty": "hard", "problemSlug": "largest-rectangle-in-histogram", "problemTitle": "Largest Rectangle in Histogram"}', NOW() - INTERVAL '12 days 8 hours'),
('a1000001-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000002', 'solve', 'Solved "Binary Tree Maximum Path Sum"', NULL, '{"difficulty": "hard", "problemSlug": "binary-tree-maximum-path-sum", "problemTitle": "Binary Tree Maximum Path Sum"}', NOW() - INTERVAL '23 days 8 hours'),
('a1000001-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000002', 'streak_milestone', 'Arjun reached a 7-day streak!', 'One week down, consistency is key', '{"streakDays": 7}', NOW() - INTERVAL '35 days'),
('a1000001-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000002', 'streak_milestone', 'Arjun reached a 14-day streak!', 'Two weeks of daily grinding!', '{"streakDays": 14}', NOW() - INTERVAL '28 days'),
('a1000001-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000002', 'streak_milestone', 'Arjun reached a 21-day streak!', 'Three weeks! Habits are forming.', '{"streakDays": 21}', NOW() - INTERVAL '21 days'),
('a1000001-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000002', 'streak_milestone', 'Arjun reached a 30-day streak!', 'One month of daily DSA!', '{"streakDays": 30}', NOW() - INTERVAL '12 days'),
('a1000001-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000002', 'streak_milestone', 'Arjun reached a 42-day streak!', '42 days! The answer to everything.', '{"streakDays": 42}', NOW() - INTERVAL '1 hour'),
('a1000001-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000002', 'solve', 'Solved "3Sum"', 'Two pointer after sorting. Skip duplicates carefully.', '{"difficulty": "medium", "problemSlug": "3sum", "problemTitle": "3Sum"}', NOW() - INTERVAL '25 days 6 hours'),
('a1000001-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000002', 'solve', 'Solved "Course Schedule"', 'Graph DFS with cycle detection. 3-state coloring pattern.', '{"difficulty": "medium", "problemSlug": "course-schedule", "problemTitle": "Course Schedule"}', NOW() - INTERVAL '19 days 7 hours'),
-- Priya feed events (15 new + 6 existing = 21 total)
('b1000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'solve', 'Solved "Group Anagrams"', 'Sorting each string as key worked! HashMap is love.', '{"difficulty": "medium", "problemSlug": "group-anagrams", "problemTitle": "Group Anagrams"}', NOW() - INTERVAL '1 day 6 hours'),
('b1000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'solve', 'Solved "Merge Two Sorted Lists"', 'Recursive approach was so clean!', '{"difficulty": "easy", "problemSlug": "merge-two-sorted-lists", "problemTitle": "Merge Two Sorted Lists"}', NOW() - INTERVAL '3 days 4 hours'),
('b1000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'solve', 'Solved "Trapping Rain Water"', 'Finally cracked this hard problem! Two pointer approach is genius.', '{"difficulty": "hard", "problemSlug": "trapping-rain-water", "problemTitle": "Trapping Rain Water"}', NOW() - INTERVAL '4 days 8 hours'),
('b1000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'solve', 'Solved "Coin Change"', 'DP is starting to make sense!', '{"difficulty": "medium", "problemSlug": "coin-change", "problemTitle": "Coin Change"}', NOW() - INTERVAL '7 days 7 hours'),
('b1000001-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', 'solve', 'Solved "Reverse Linked List"', 'prev, curr, next pointer dance', '{"difficulty": "easy", "problemSlug": "reverse-linked-list", "problemTitle": "Reverse Linked List"}', NOW() - INTERVAL '7 days 5 hours'),
('b1000001-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 'solve', 'Solved "Binary Tree Level Order Traversal"', 'BFS template is so useful!', '{"difficulty": "medium", "problemSlug": "binary-tree-level-order-traversal", "problemTitle": "Binary Tree Level Order Traversal"}', NOW() - INTERVAL '9 days 3 hours'),
('b1000001-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000003', 'solve', 'Solved "Merge K Sorted Lists"', 'PriorityQueue approach. My first hard problem this week!', '{"difficulty": "hard", "problemSlug": "merge-k-sorted-lists", "problemTitle": "Merge K Sorted Lists"}', NOW() - INTERVAL '11 days 7 hours'),
('b1000001-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000003', 'solve', 'Solved "Daily Temperatures"', 'Monotonic stack pattern - need to practice more of these', '{"difficulty": "medium", "problemSlug": "daily-temperatures", "problemTitle": "Daily Temperatures"}', NOW() - INTERVAL '10 days 6 hours'),
('b1000001-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000003', 'streak_milestone', 'Priya reached a 7-day streak!', 'First full week! Super motivated!', '{"streakDays": 7}', NOW() - INTERVAL '8 days'),
('b1000001-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000003', 'streak_milestone', 'Priya reached a 14-day streak!', 'Two weeks of consistency! Feeling proud.', '{"streakDays": 14}', NOW() - INTERVAL '1 day'),
('b1000001-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000003', 'solve', 'Solved "Maximum Subarray"', 'Kadane''s algorithm is so elegant. Just track current and global max.', '{"difficulty": "medium", "problemSlug": "maximum-subarray", "problemTitle": "Maximum Subarray"}', NOW() - INTERVAL '6 days 4 hours'),
('b1000001-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000003', 'solve', 'Solved "Merge Intervals"', NULL, '{"difficulty": "medium", "problemSlug": "merge-intervals", "problemTitle": "Merge Intervals"}', NOW() - INTERVAL '2 days 5 hours'),
('b1000001-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000003', 'solve', 'Solved "Jump Game"', 'Greedy approach: just track max reachable index', '{"difficulty": "medium", "problemSlug": "jump-game", "problemTitle": "Jump Game"}', NOW() - INTERVAL '12 days 2 hours'),
('b1000001-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000003', 'solve', 'Solved "Minimum Window Substring"', 'Took me 30 mins but I got it! Sliding window FTW', '{"difficulty": "hard", "problemSlug": "minimum-window-substring", "problemTitle": "Minimum Window Substring"}', NOW() - INTERVAL '17 days 6 hours'),
('b1000001-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000003', 'solve', 'Solved "Longest Palindromic Substring"', 'Expand around center approach. Check both odd and even length.', '{"difficulty": "medium", "problemSlug": "longest-palindromic-substring", "problemTitle": "Longest Palindromic Substring"}', NOW() - INTERVAL '20 days 3 hours')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 6. LIKES AND COMMENTS on feed events
-- ============================================================================

INSERT INTO feed_likes (feed_event_id, user_id, created_at) VALUES
-- Likes on Arjun's events from other users
('a1000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '1 day 2 hours'),
('a1000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '1 day 1 hour'),
('a1000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', NOW() - INTERVAL '23 hours'),
('a1000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '3 days 5 hours'),
('a1000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000006', NOW() - INTERVAL '3 days 4 hours'),
('a1000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '14 days 7 hours'),
('a1000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000007', NOW() - INTERVAL '14 days 5 hours'),
('a1000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '14 days 3 hours'),
('a1000001-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '12 days 6 hours'),
('a1000001-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000005', NOW() - INTERVAL '12 days 5 hours'),
('a1000001-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '12 days'),
('a1000001-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '11 days 23 hours'),
('a1000001-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000005', NOW() - INTERVAL '11 days 22 hours'),
('a1000001-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000006', NOW() - INTERVAL '11 days 21 hours'),
('a1000001-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '30 minutes'),
('a1000001-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '20 minutes'),
('a1000001-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000005', NOW() - INTERVAL '15 minutes'),
('a1000001-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000006', NOW() - INTERVAL '10 minutes'),
('a1000001-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000007', NOW() - INTERVAL '5 minutes'),
('a1000001-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000008', NOW() - INTERVAL '2 minutes'),
-- Likes on Priya's events
('b1000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '1 day 4 hours'),
('b1000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '1 day 3 hours'),
('b1000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '4 days 6 hours'),
('b1000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', NOW() - INTERVAL '4 days 5 hours'),
('b1000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000006', NOW() - INTERVAL '4 days 4 hours'),
('b1000001-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '11 days 5 hours'),
('b1000001-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '11 days 4 hours'),
('b1000001-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '7 days 23 hours'),
('b1000001-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '7 days 22 hours'),
('b1000001-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000005', NOW() - INTERVAL '7 days 21 hours'),
('b1000001-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '23 hours'),
('b1000001-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '22 hours'),
('b1000001-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000006', NOW() - INTERVAL '21 hours'),
('b1000001-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000007', NOW() - INTERVAL '20 hours'),
('b1000001-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '17 days 4 hours'),
('b1000001-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000008', NOW() - INTERVAL '17 days 3 hours'),
-- Likes on existing events
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '18 hours'),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '17 hours'),
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '10 hours'),
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', NOW() - INTERVAL '9 hours')
ON CONFLICT (feed_event_id, user_id) DO NOTHING;

INSERT INTO feed_comments (id, feed_event_id, user_id, content, created_at) VALUES
-- Comments on Arjun's events
('c1000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Clean approach! I need to try this one next.', NOW() - INTERVAL '1 day 1 hour'),
('c1000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'Merge K sorted lists is such a classic. Heap approach is the way!', NOW() - INTERVAL '3 days 4 hours'),
('c1000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'This problem took me so long. Any tips for the sliding window pattern?', NOW() - INTERVAL '14 days 6 hours'),
('c1000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'Track two pointers and a frequency map. Expand right, shrink left when condition met!', NOW() - INTERVAL '14 days 5 hours'),
('c1000001-0000-0000-0000-000000000005', 'a1000001-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000003', '30 days! You are a machine! Keep it up!', NOW() - INTERVAL '11 days 23 hours'),
('c1000001-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000005', 'Insane consistency! Motivation for all of us.', NOW() - INTERVAL '11 days 22 hours'),
('c1000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000003', '42 days?! The answer to life, the universe, and DSA!', NOW() - INTERVAL '25 minutes'),
('c1000001-0000-0000-0000-000000000008', 'a1000001-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000004', 'Legend! You are going to crush your interviews.', NOW() - INTERVAL '15 minutes'),
('c1000001-0000-0000-0000-000000000009', 'a1000001-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000006', 'Goals! I am on day 5, hoping to get there.', NOW() - INTERVAL '8 minutes'),
('c1000001-0000-0000-0000-000000000010', 'a1000001-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000005', 'Monotonic stack problems are so satisfying once they click!', NOW() - INTERVAL '12 days 4 hours'),
-- Comments on Priya's events
('c1000001-0000-0000-0000-000000000011', 'b1000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'Great job on solving a hard problem! The two pointer approach is the cleanest way.', NOW() - INTERVAL '4 days 5 hours'),
('c1000001-0000-0000-0000-000000000012', 'b1000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', 'This was my first hard solve too. Feels amazing right?', NOW() - INTERVAL '4 days 3 hours'),
('c1000001-0000-0000-0000-000000000013', 'b1000001-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000002', 'Congrats on the 7-day streak! The first week is the hardest.', NOW() - INTERVAL '7 days 22 hours'),
('c1000001-0000-0000-0000-000000000014', 'b1000001-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000002', '14 days! You are building a real habit now. Proud of you!', NOW() - INTERVAL '22 hours'),
('c1000001-0000-0000-0000-000000000015', 'b1000001-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000004', 'Two weeks strong! Keep going!', NOW() - INTERVAL '21 hours'),
('c1000001-0000-0000-0000-000000000016', 'b1000001-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', 'PQ approach is great! Try the divide and conquer method too.', NOW() - INTERVAL '11 days 4 hours'),
('c1000001-0000-0000-0000-000000000017', 'b1000001-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000006', 'Sliding window is such a powerful pattern. Well done!', NOW() - INTERVAL '17 days 2 hours'),
('c1000001-0000-0000-0000-000000000018', 'b1000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'DP does click at some point! Coin Change is a great gateway problem.', NOW() - INTERVAL '7 days 5 hours'),
-- Comments on existing events
('c1000001-0000-0000-0000-000000000019', '20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', 'Trapping Rain Water is such a classic!', NOW() - INTERVAL '16 hours'),
('c1000001-0000-0000-0000-000000000020', '20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'Great first problem choice! Two Sum is the gateway.', NOW() - INTERVAL '8 hours')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 7. BADGES
-- ============================================================================

INSERT INTO user_badges (user_id, badge_id, earned_at) VALUES
-- Arjun badges (10)
('00000000-0000-0000-0000-000000000002', '172dd678-accf-4f8d-8d76-44c071fe347a', NOW() - INTERVAL '42 days'),
('00000000-0000-0000-0000-000000000002', '395720e5-ac47-4209-ab05-ab44a5216ce5', NOW() - INTERVAL '38 days'),
('00000000-0000-0000-0000-000000000002', 'a2cda37f-73c3-40c6-a714-06e0a6fa0ada', NOW() - INTERVAL '20 days'),
('00000000-0000-0000-0000-000000000002', 'fec79cab-c779-40e2-9d3d-33a58d0e1095', NOW() - INTERVAL '5 days'),
('00000000-0000-0000-0000-000000000002', '237385bd-1311-43ec-b06f-96eaa14c5cda', NOW() - INTERVAL '35 days'),
('00000000-0000-0000-0000-000000000002', 'cbbb437c-4079-443c-8c40-4002d8c1f2f1', NOW() - INTERVAL '28 days'),
('00000000-0000-0000-0000-000000000002', '8fadd2c0-fdbe-42f9-bb6a-6bd72ec295e7', NOW() - INTERVAL '12 days'),
('00000000-0000-0000-0000-000000000002', '9f674acf-fd07-4361-816b-97c14445491f', NOW() - INTERVAL '30 days'),
('00000000-0000-0000-0000-000000000002', 'ca3bbcdd-abda-42a8-a1b1-efffa5bbd625', NOW() - INTERVAL '18 days'),
('00000000-0000-0000-0000-000000000002', '9b356f3b-4391-4ac2-8741-292b6e3ee537', NOW() - INTERVAL '40 days'),
('00000000-0000-0000-0000-000000000002', '530762cd-f64f-46bc-a185-5bd3acdacf46', NOW() - INTERVAL '25 days'),
-- Priya badges (6)
('00000000-0000-0000-0000-000000000003', '172dd678-accf-4f8d-8d76-44c071fe347a', NOW() - INTERVAL '30 days'),
('00000000-0000-0000-0000-000000000003', '395720e5-ac47-4209-ab05-ab44a5216ce5', NOW() - INTERVAL '18 days'),
('00000000-0000-0000-0000-000000000003', '237385bd-1311-43ec-b06f-96eaa14c5cda', NOW() - INTERVAL '8 days'),
('00000000-0000-0000-0000-000000000003', 'cbbb437c-4079-443c-8c40-4002d8c1f2f1', NOW() - INTERVAL '1 day'),
('00000000-0000-0000-0000-000000000003', '9f674acf-fd07-4361-816b-97c14445491f', NOW() - INTERVAL '15 days'),
('00000000-0000-0000-0000-000000000003', '9b356f3b-4391-4ac2-8741-292b6e3ee537', NOW() - INTERVAL '28 days')
ON CONFLICT (user_id, badge_id) DO NOTHING;

-- ============================================================================
-- 8. NOTIFICATIONS
-- ============================================================================

INSERT INTO notifications (id, user_id, type, title, body, data, read_at, created_at) VALUES
-- Arjun notifications (10)
('e1000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'badge_earned', 'Badge Earned: Century Club!', 'You solved 100 problems. Incredible achievement!', '{"badgeName": "Century Club"}', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('e1000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'badge_earned', 'Badge Earned: Monthly Master!', 'You maintained a 30-day streak!', '{"badgeName": "Monthly Master"}', NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'),
('e1000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'streak_milestone', '42-day streak!', 'You are on fire! 42 consecutive days of solving.', '{"streakDays": 42}', NULL, NOW() - INTERVAL '1 hour'),
('e1000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'streak_milestone', '30-day streak!', 'One month of daily DSA practice!', '{"streakDays": 30}', NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'),
('e1000001-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'poke', 'Priya poked you!', 'Priya Sharma wants you to keep solving!', '{"fromUserId": "00000000-0000-0000-0000-000000000003", "fromName": "Priya Sharma"}', NULL, NOW() - INTERVAL '6 hours'),
('e1000001-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', 'badge_earned', 'Badge Earned: Medium Rare!', 'You solved 25 medium problems.', '{"badgeName": "Medium Rare"}', NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'),
('e1000001-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', 'badge_earned', 'Badge Earned: Half Century!', 'You solved 50 problems. Halfway to the century!', '{"badgeName": "Half Century"}', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
('e1000001-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000002', 'group_join', 'New member in Neetcode Gang', 'Priya Sharma joined Neetcode Gang', '{"groupName": "Neetcode Gang"}', NOW() - INTERVAL '15 days', NOW() - INTERVAL '25 days'),
('e1000001-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000002', 'badge_earned', 'Badge Earned: Note Taker!', 'You created 10 revision notes. Great study habits!', '{"badgeName": "Note Taker"}', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
('e1000001-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000002', 'poke', 'Rahul poked you!', 'Rahul Verma challenged you to solve a hard problem today!', '{"fromUserId": "00000000-0000-0000-0000-000000000004", "fromName": "Rahul Verma"}', NULL, NOW() - INTERVAL '2 hours'),
-- Priya notifications (10)
('e2000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'badge_earned', 'Badge Earned: First Solve!', 'You solved your first problem! Welcome to the grind!', '{"badgeName": "First Solve"}', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
('e2000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'badge_earned', 'Badge Earned: Ten Down!', 'You solved 10 problems! Keep the momentum going.', '{"badgeName": "Ten Down"}', NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'),
('e2000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'streak_milestone', '7-day streak!', 'Your first full week! Consistency wins.', '{"streakDays": 7}', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
('e2000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'streak_milestone', '14-day streak!', 'Two weeks of daily practice!', '{"streakDays": 14}', NULL, NOW() - INTERVAL '1 day'),
('e2000001-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', 'poke', 'Arjun poked you!', 'Arjun Mehta wants to see you solve today!', '{"fromUserId": "00000000-0000-0000-0000-000000000002", "fromName": "Arjun Mehta"}', NULL, NOW() - INTERVAL '3 hours'),
('e2000001-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 'badge_earned', 'Badge Earned: Week Warrior!', 'You maintained a 7-day streak!', '{"badgeName": "Week Warrior"}', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
('e2000001-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000003', 'badge_earned', 'Badge Earned: Easy Peasy!', 'You solved 10 easy problems.', '{"badgeName": "Easy Peasy"}', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
('e2000001-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000003', 'group_join', 'Welcome to FAANG Prep 2026!', 'You joined FAANG Prep 2026. Good luck!', '{"groupName": "FAANG Prep 2026"}', NOW() - INTERVAL '20 days', NOW() - INTERVAL '28 days'),
('e2000001-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000003', 'badge_earned', 'Badge Earned: Fortnight Fighter!', 'You maintained a 14-day streak!', '{"badgeName": "Fortnight Fighter"}', NULL, NOW() - INTERVAL '1 day'),
('e2000001-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000003', 'poke', 'Neha poked you!', 'Neha Gupta is cheering you on!', '{"fromUserId": "00000000-0000-0000-0000-000000000005", "fromName": "Neha Gupta"}', NULL, NOW() - INTERVAL '5 hours')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 9. GROUP ACTIVITY
-- ============================================================================

INSERT INTO group_activity (id, group_id, user_id, action, metadata, created_at) VALUES
-- Streaksy Global activity
('f1000001-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'solved_problem', '{"problemSlug": "rotate-image", "difficulty": "medium"}', NOW() - INTERVAL '1 day 3 hours'),
('f1000001-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'solved_problem', '{"problemSlug": "merge-k-sorted-lists", "difficulty": "hard"}', NOW() - INTERVAL '3 days 7 hours'),
('f1000001-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'streak_milestone', '{"streakDays": 42}', NOW() - INTERVAL '1 hour'),
('f1000001-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'solved_problem', '{"problemSlug": "trapping-rain-water", "difficulty": "hard"}', NOW() - INTERVAL '20 days 8 hours'),
('f1000001-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'solved_problem', '{"problemSlug": "minimum-window-substring", "difficulty": "hard"}', NOW() - INTERVAL '14 days 9 hours'),
('f1000001-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'solved_problem', '{"problemSlug": "group-anagrams", "difficulty": "medium"}', NOW() - INTERVAL '1 day 6 hours'),
('f1000001-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'solved_problem', '{"problemSlug": "trapping-rain-water", "difficulty": "hard"}', NOW() - INTERVAL '4 days 8 hours'),
('f1000001-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'streak_milestone', '{"streakDays": 14}', NOW() - INTERVAL '1 day'),
('f1000001-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'solved_problem', '{"problemSlug": "coin-change", "difficulty": "medium"}', NOW() - INTERVAL '7 days 7 hours'),
('f1000001-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'streak_milestone', '{"streakDays": 30}', NOW() - INTERVAL '12 days'),
-- Neetcode Gang activity
('f1000001-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'solved_problem', '{"problemSlug": "lru-cache", "difficulty": "medium"}', NOW() - INTERVAL '23 days 5 hours'),
('f1000001-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'solved_problem', '{"problemSlug": "coin-change", "difficulty": "medium"}', NOW() - INTERVAL '23 days 1 hour'),
('f1000001-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'solved_problem', '{"problemSlug": "3sum", "difficulty": "medium"}', NOW() - INTERVAL '25 days 6 hours'),
('f1000001-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'solved_problem', '{"problemSlug": "binary-tree-maximum-path-sum", "difficulty": "hard"}', NOW() - INTERVAL '23 days 8 hours'),
('f1000001-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'streak_milestone', '{"streakDays": 21}', NOW() - INTERVAL '21 days'),
-- FAANG Prep 2026 activity
('f1000001-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'solved_problem', '{"problemSlug": "course-schedule", "difficulty": "medium"}', NOW() - INTERVAL '19 days 7 hours'),
('f1000001-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'solved_problem', '{"problemSlug": "largest-rectangle-in-histogram", "difficulty": "hard"}', NOW() - INTERVAL '12 days 8 hours'),
('f1000001-0000-0000-0000-000000000018', '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'solved_problem', '{"problemSlug": "merge-intervals", "difficulty": "medium"}', NOW() - INTERVAL '2 days 5 hours'),
('f1000001-0000-0000-0000-000000000019', '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'solved_problem', '{"problemSlug": "minimum-window-substring", "difficulty": "hard"}', NOW() - INTERVAL '17 days 6 hours'),
('f1000001-0000-0000-0000-000000000020', '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'streak_milestone', '{"streakDays": 7}', NOW() - INTERVAL '8 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 10. NOTES (personal notes on problems)
-- ============================================================================

INSERT INTO notes (id, user_id, problem_id, content, visibility, created_at) VALUES
-- Arjun notes (8)
('d1000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '861820e2-0611-4a3f-a462-a0f8a080636e', 'Two pointer from both ends is the optimal approach. Key insight: the water level at each position is determined by the minimum of the max heights on both sides. Track left_max and right_max, move the pointer with the smaller max.', 'personal', NOW() - INTERVAL '20 days'),
('d1000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '55af29d4-5032-4b5b-a6c2-51eda79cda6b', 'Sliding window with two frequency maps. Expand right boundary until all chars of t are covered, then shrink left to find minimum window. Track "missing" count to avoid comparing maps every step.', 'personal', NOW() - INTERVAL '14 days'),
('d1000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '50ba8a73-5e8d-405b-b572-9d594b24bef6', 'In interviews, explain both approaches: 1) Python OrderedDict (quick to code), 2) Manual doubly-linked list + hashmap (shows understanding). The DLL allows O(1) removal from any position.', 'personal', NOW() - INTERVAL '23 days'),
('d1000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', '3396e06f-f405-4287-a230-08e37606c854', 'Three approaches: 1) Brute force merge one by one O(kN), 2) Min heap O(N log k), 3) Divide and conquer O(N log k). Min heap is easiest to implement correctly. Remember to handle null lists!', 'personal', NOW() - INTERVAL '3 days'),
('d1000001-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', '8d4f5d50-dac8-422b-ba4c-631b853a1d2c', 'Classic topological sort problem. DFS with 3 states: WHITE (unvisited), GRAY (in current path), BLACK (done). If we visit a GRAY node, there is a cycle. BFS with in-degree also works (Kahn''s algorithm).', 'personal', NOW() - INTERVAL '19 days'),
('d1000001-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', 'b7696678-c809-4ea8-9395-c164380fad4d', 'Monotonic stack: maintain a stack of indices in decreasing height order. When current bar is shorter than stack top, pop and calculate area. The width extends from current position to new stack top.', 'personal', NOW() - INTERVAL '12 days'),
('d1000001-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', 'a0887c76-332e-4a46-85d3-95de1e859046', 'The trick: only start counting from the beginning of a sequence (where n-1 is NOT in set). This avoids counting subsequences and gives O(n) amortized.', 'personal', NOW() - INTERVAL '24 days'),
('d1000001-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000002', '8b1666f2-ca4c-4d8d-99ca-83f77839cbf2', 'DFS that returns max path sum using at most one child. At each node, update global answer with left + right + node.val (path through node). Return max(left, right) + node.val (path extending upward).', 'personal', NOW() - INTERVAL '23 days'),
-- Priya notes (5)
('d2000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', '5c60d304-b7a4-450a-8917-4b0eca1b7491', 'My first problem! The HashMap approach is so much better than brute force. Store each number with its index, then look up the complement.', 'personal', NOW() - INTERVAL '30 days'),
('d2000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', '861820e2-0611-4a3f-a462-a0f8a080636e', 'This was SO hard at first. The key insight from Arjun: think about it from both sides. If left max is smaller, the water at left pointer is determined by left max. Mind = blown.', 'personal', NOW() - INTERVAL '4 days'),
('d2000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', '2c08bb48-f469-4713-a5b0-77be33d85180', 'DP finally clicked! The idea: dp[i] = min coins for amount i. For each coin, if amount >= coin, then dp[amount] = min(dp[amount], dp[amount - coin] + 1). Build up from 0.', 'personal', NOW() - INTERVAL '7 days'),
('d2000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', '74f0e34d-a60a-4332-b7d8-feb95b21a0ef', 'BFS template for trees: use a queue, process level by level. The key is to capture queue size at the start of each level before adding children.', 'personal', NOW() - INTERVAL '9 days'),
('d2000001-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', 'bde193c5-4cff-4c5d-be34-8fa0852857af', 'Sliding window is becoming my favorite pattern! Use a HashSet to track characters in the window. Expand right, shrink left when duplicate found.', 'personal', NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO NOTHING;

COMMIT;
