-- ============================================================
-- Seed 100 realistic users with activity for Streaksy
-- Password for all seeded users: Streaksy2026!
-- ============================================================

-- Shared bcrypt hash for 'Streaksy2026!'
-- $2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.

BEGIN;

-- ── 100 Users ──
-- Diverse names, bios, locations, and leetcode usernames
INSERT INTO users (email, password_hash, display_name, leetcode_username, email_verified, avatar_url, bio, location, github_url, linkedin_url) VALUES
('arjun.sharma@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Arjun Sharma', 'arjun_codes', true, NULL, 'SDE-2 at Amazon. 400+ LC problems solved. Love DP!', 'Bangalore, India', 'https://github.com/arjunsharma', NULL),
('priya.patel@outlook.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Priya Patel', 'priya_dsa', true, NULL, 'CS undergrad at IIT Bombay. Targeting FAANG internships.', 'Mumbai, India', NULL, NULL),
('rahul.verma@yahoo.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Rahul Verma', 'rv_coder', true, NULL, 'Full-stack dev switching to SDE roles', 'Delhi, India', NULL, NULL),
('sneha.reddy@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Sneha Reddy', 'sneha_r', true, NULL, 'Backend engineer. Graph problems are my jam.', 'Hyderabad, India', NULL, NULL),
('alex.chen@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Alex Chen', 'alexc_lc', true, NULL, 'SWE at Google. Mentoring DSA prep.', 'San Francisco, USA', 'https://github.com/alexchen', NULL),
('maya.williams@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Maya Williams', 'mayaw', true, NULL, 'New grad prepping for interviews', 'Austin, TX', NULL, NULL),
('vikram.singh@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Vikram Singh', 'vikram_s', true, NULL, 'Competitive programmer. Codeforces 1800+', 'Pune, India', NULL, NULL),
('ananya.gupta@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Ananya Gupta', 'ananya_g', true, NULL, 'Data scientist learning DSA for SDE switch', 'Noida, India', NULL, NULL),
('james.park@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'James Park', 'jpark_dev', true, NULL, 'iOS developer at Meta. Tree problems specialist.', 'Seattle, USA', NULL, NULL),
('sakshi.jain@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Sakshi Jain', 'sakshi_j', true, NULL, 'Final year CSE student. 200+ problems done!', 'Jaipur, India', NULL, NULL),
('david.kim@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'David Kim', 'dkim_lc', true, NULL, 'Software engineer at Stripe', 'New York, USA', NULL, NULL),
('neha.kapoor@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Neha Kapoor', 'neha_k', true, NULL, 'Prepping for Microsoft interviews', 'Bangalore, India', NULL, NULL),
('rohan.mishra@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Rohan Mishra', 'rohan_m', true, NULL, 'Backend dev. Sliding window master.', 'Chennai, India', NULL, NULL),
('emma.johnson@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Emma Johnson', 'emmaj_code', true, NULL, 'CS PhD student. Algorithms researcher.', 'Boston, USA', NULL, NULL),
('aditya.kumar@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Aditya Kumar', 'aditya_k', true, NULL, 'DevOps engineer learning DSA', 'Gurgaon, India', NULL, NULL),
('sarah.lee@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Sarah Lee', 'sarahlee', true, NULL, 'Frontend dev transitioning to full-stack', 'Toronto, Canada', NULL, NULL),
('karthik.rajan@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Karthik Rajan', 'karthik_r', true, NULL, 'SDE-1 at Flipkart. Binary search enthusiast.', 'Bangalore, India', NULL, NULL),
('lisa.wang@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Lisa Wang', 'lisawang', true, NULL, 'ML engineer dabbling in competitive programming', 'San Jose, USA', NULL, NULL),
('amit.tiwari@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Amit Tiwari', 'amit_t', true, NULL, 'System design + DSA prep', 'Lucknow, India', NULL, NULL),
('jennifer.martinez@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Jennifer Martinez', 'jen_codes', true, NULL, 'Bootcamp grad grinding LeetCode', 'Miami, USA', NULL, NULL),
('deepak.nair@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Deepak Nair', 'deepak_n', true, NULL, 'Stack and queue problems are underrated', 'Kochi, India', NULL, NULL),
('michael.brown@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Michael Brown', 'mikeb_lc', true, NULL, 'Senior SWE at Netflix. 600+ LC solved.', 'Los Angeles, USA', NULL, NULL),
('pooja.agarwal@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Pooja Agarwal', 'pooja_a', true, NULL, '3rd year at NIT. Starting my DSA journey.', 'Bhopal, India', NULL, NULL),
('ryan.taylor@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Ryan Taylor', 'ryant', true, NULL, 'Rust developer. Two pointers all day.', 'Denver, USA', NULL, NULL),
('shreya.das@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Shreya Das', 'shreya_d', true, NULL, 'Placed at Google! Still solving daily.', 'Kolkata, India', NULL, NULL),
('kevin.zhang@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Kevin Zhang', 'kzhang', true, NULL, 'Quant developer. Math + DP focus.', 'Chicago, USA', NULL, NULL),
('nisha.mehta@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Nisha Mehta', 'nisha_m', true, NULL, 'PM turned SWE. Loving the DSA grind!', 'Ahmedabad, India', NULL, NULL),
('daniel.wilson@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Daniel Wilson', 'danw_dev', true, NULL, 'Backend at Shopify. Union-Find is beautiful.', 'Ottawa, Canada', NULL, NULL),
('ritu.saxena@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Ritu Saxena', 'ritu_s', true, NULL, 'GATE aspirant. Consistent daily solver.', 'Indore, India', NULL, NULL),
('tom.anderson@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Tom Anderson', 'tom_a', true, NULL, 'Security engineer doing DSA for fun', 'London, UK', NULL, NULL),
('kavitha.rao@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Kavitha Rao', 'kavitha_r', true, NULL, 'Tech lead at Infosys. Helping juniors prep.', 'Mysuru, India', NULL, NULL),
('chris.martinez@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Chris Martinez', 'chrism', true, NULL, 'Android developer at Uber', 'San Francisco, USA', NULL, NULL),
('divya.iyer@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Divya Iyer', 'divya_i', true, NULL, 'ICPC regional finalist. Graph theory nerd.', 'Coimbatore, India', NULL, NULL),
('nathan.harris@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Nathan Harris', 'nharris', true, NULL, 'Pre-med turned CS. Catching up on DSA.', 'Philadelphia, USA', NULL, NULL),
('meera.pillai@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Meera Pillai', 'meera_p', true, NULL, 'Embedded systems engineer. Arrays are life.', 'Trivandrum, India', NULL, NULL),
('lucas.garcia@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Lucas Garcia', 'lucasg', true, NULL, 'First-gen CS student. Building good habits.', 'São Paulo, Brazil', NULL, NULL),
('harsha.vardhan@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Harsha Vardhan', 'harsha_v', true, NULL, 'SDE at Razorpay. Monotonic stack specialist.', 'Bangalore, India', NULL, NULL),
('olivia.moore@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Olivia Moore', 'oliviam', true, NULL, 'Teaching assistant for algorithms class', 'Cambridge, UK', NULL, NULL),
('siddharth.yadav@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Siddharth Yadav', 'sid_y', true, NULL, 'Fresher targeting product companies', 'Nagpur, India', NULL, NULL),
('ashley.thompson@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Ashley Thompson', 'ashleyt', true, NULL, 'Data engineer at Snowflake', 'Portland, USA', NULL, NULL),
('manish.dubey@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Manish Dubey', 'manish_d', true, NULL, 'Passionate about bit manipulation tricks', 'Varanasi, India', NULL, NULL),
('sophia.chen@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Sophia Chen', 'sophiac', true, NULL, 'Product manager studying tech depth', 'Seattle, USA', NULL, NULL),
('nitin.sharma@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Nitin Sharma', 'nitin_s', true, NULL, 'Startup founder who still grinds LC', 'Delhi, India', NULL, NULL),
('rachel.green@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Rachel Green', 'rachelg', true, NULL, 'Career changer from finance to tech', 'New York, USA', NULL, NULL),
('gaurav.pandey@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Gaurav Pandey', 'gaurav_p', true, NULL, 'Consistent 5 problems/day. No excuses.', 'Patna, India', NULL, NULL),
('emily.davis@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Emily Davis', 'emilyd', true, NULL, 'SWE at Apple. Interview coaching on the side.', 'Cupertino, USA', NULL, NULL),
('suresh.babu@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Suresh Babu', 'suresh_b', true, NULL, 'Quality over quantity. Deep understanding matters.', 'Vizag, India', NULL, NULL),
('jason.wright@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Jason Wright', 'jasonw', true, NULL, 'Game developer. DP = game states.', 'Austin, TX', NULL, NULL),
('pallavi.menon@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Pallavi Menon', 'pallavi_m', true, NULL, '50-day streak and counting!', 'Bangalore, India', NULL, NULL),
('andrew.jackson@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Andrew Jackson', 'andrewj', true, NULL, 'Just started. Day 3 of my LC journey.', 'Dallas, USA', NULL, NULL),
('tanvi.bhatt@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Tanvi Bhatt', 'tanvi_b', true, NULL, 'SDE intern at Oracle. Learning heaps.', 'Surat, India', NULL, NULL),
('marcus.lee@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Marcus Lee', 'marcusl', true, NULL, 'Systems programmer. Low-level + algorithms.', 'Berlin, Germany', NULL, NULL),
('isha.bhardwaj@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Isha Bhardwaj', 'isha_b', true, NULL, 'Focused on medium-level problems this month', 'Chandigarh, India', NULL, NULL),
('william.taylor@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'William Taylor', 'willt', true, NULL, 'DevRel engineer. Making DSA accessible.', 'Dublin, Ireland', NULL, NULL),
('megha.kulkarni@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Megha Kulkarni', 'megha_k', true, NULL, 'Backend dev. BFS is my comfort zone.', 'Pune, India', NULL, NULL),
('jack.robinson@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Jack Robinson', 'jackr', true, NULL, 'Self-taught dev. Proving myself through LC.', 'Manchester, UK', NULL, NULL),
('aarti.deshmukh@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Aarti Deshmukh', 'aarti_d', true, NULL, 'Placement season prep! Wish me luck.', 'Nashik, India', NULL, NULL),
('tyler.smith@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Tyler Smith', 'tylers', true, NULL, 'Mechanical engineer pivoting to CS', 'Houston, USA', NULL, NULL),
('swati.chaudhary@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Swati Chaudhary', 'swati_c', true, NULL, 'Debugging DP transitions at 2am', 'Ranchi, India', NULL, NULL),
('benjamin.lee@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Benjamin Lee', 'benl', true, NULL, 'CTO at a startup. Still a student at heart.', 'Singapore', NULL, NULL),
('anisha.goyal@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Anisha Goyal', 'anisha_g', true, NULL, 'MTech student. Research + coding = life', 'Kanpur, India', NULL, NULL),
('samuel.jackson@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Samuel Jackson', 'samj', true, NULL, 'Preparing for FAANG onsite rounds', 'Atlanta, USA', NULL, NULL),
('rashmi.nair@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Rashmi Nair', 'rashmi_n', true, NULL, 'Working on Striver sheet. 40% done!', 'Thrissur, India', NULL, NULL),
('ethan.wright@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Ethan Wright', 'ethanw', true, NULL, 'Freshman CS major. Starting from scratch.', 'Columbus, USA', NULL, NULL),
('lavanya.krishnan@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Lavanya Krishnan', 'lavanya_k', true, NULL, 'Technical writer who codes on weekends', 'Chennai, India', NULL, NULL),
('noah.miller@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Noah Miller', 'noahm', true, NULL, 'Grinding towards that FAANG offer', 'Phoenix, USA', NULL, NULL),
('bhavya.soni@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Bhavya Soni', 'bhavya_s', true, NULL, 'Trie problems are like puzzles!', 'Rajkot, India', NULL, NULL),
('oliver.white@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Oliver White', 'oliverw', true, NULL, 'Cloud architect who loves optimization', 'Sydney, Australia', NULL, NULL),
('pankaj.arora@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Pankaj Arora', 'pankaj_a', true, NULL, 'Daily grinder. 100-day streak goal.', 'Amritsar, India', NULL, NULL),
('hannah.jones@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Hannah Jones', 'hannahj', true, NULL, 'Math major getting into CS', 'Edinburgh, UK', NULL, NULL),
('yash.tomar@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Yash Tomar', 'yash_t', true, NULL, 'Just cracked my first hard problem!', 'Dehradun, India', NULL, NULL),
('grace.kim@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Grace Kim', 'gracek', true, NULL, 'SWE at Notion. Backtracking is fun.', 'San Francisco, USA', NULL, NULL),
('rajat.bose@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Rajat Bose', 'rajat_b', true, NULL, 'Targeting 300 problems by April', 'Kolkata, India', NULL, NULL),
('chloe.anderson@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Chloe Anderson', 'chloea', true, NULL, 'Intern at Databricks. Learning graph algos.', 'San Francisco, USA', NULL, NULL),
('vivek.chauhan@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Vivek Chauhan', 'vivek_c', true, NULL, 'Topological sort solved my dependency issues at work', 'Ghaziabad, India', NULL, NULL),
('mia.thomas@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Mia Thomas', 'miat', true, NULL, 'Technical interviewer at a unicorn', 'Austin, TX', NULL, NULL),
('ajay.menon@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Ajay Menon', 'ajay_m', true, NULL, 'Building muscle memory one problem at a time', 'Ernakulam, India', NULL, NULL),
('zoe.wilson@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Zoe Wilson', 'zoew', true, NULL, 'Recursion finally clicked!', 'Melbourne, Australia', NULL, NULL),
('harsh.agrawal@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Harsh Agrawal', 'harsh_a', true, NULL, '450 problems and still going strong', 'Raipur, India', NULL, NULL),
('liam.clark@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Liam Clark', 'liamc', true, NULL, 'Competitive programming coach', 'Vancouver, Canada', NULL, NULL),
('preeti.bansal@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Preeti Bansal', 'preeti_b', true, NULL, 'Love solving problems with friends', 'Ludhiana, India', NULL, NULL),
('jordan.davis@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Jordan Davis', 'jordand', true, NULL, 'AWS engineer. Segment trees are next.', 'Seattle, USA', NULL, NULL),
('komal.singh@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Komal Singh', 'komal_s', true, NULL, 'Just solved my 100th problem!', 'Patna, India', NULL, NULL),
('max.mueller@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Max Mueller', 'maxm', true, NULL, 'CS student at TU Munich', 'Munich, Germany', NULL, NULL),
('simran.kaur@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Simran Kaur', 'simran_k', true, NULL, 'SWE at Zoho. Greedy algorithms fascinate me.', 'Chennai, India', NULL, NULL),
('owen.thomas@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Owen Thomas', 'owent', true, NULL, 'Blockchain dev. Algorithms are transferable.', 'Miami, USA', NULL, NULL),
('ritika.choudhary@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Ritika Choudhary', 'ritika_c', true, NULL, 'Revising all medium problems before interviews', 'Jodhpur, India', NULL, NULL),
('dylan.scott@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Dylan Scott', 'dylans', true, NULL, 'Morning LC is the best LC', 'Chicago, USA', NULL, NULL),
('aditi.rawat@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Aditi Rawat', 'aditi_r', true, NULL, 'CS professor. Teaching by solving.', 'Delhi, India', NULL, NULL),
('logan.brown@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Logan Brown', 'loganb', true, NULL, 'Full-stack JS developer', 'Portland, USA', NULL, NULL),
('varun.saxena@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Varun Saxena', 'varun_s', true, NULL, 'DSA + System Design combo prep', 'Jaipur, India', NULL, NULL),
('natalie.harris@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Natalie Harris', 'natalieh', true, NULL, 'Data engineer learning problem solving', 'Toronto, Canada', NULL, NULL),
('saurabh.kumar@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Saurabh Kumar', 'saurabh_k', true, NULL, 'Aiming for Google London office', 'Mumbai, India', NULL, NULL),
('isabella.clark@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Isabella Clark', 'isabellac', true, NULL, 'Gap year well spent on LeetCode', 'San Diego, USA', NULL, NULL),
('akash.joshi@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Akash Joshi', 'akash_j', true, NULL, 'Night owl coder. Solving problems at midnight.', 'Pune, India', NULL, NULL),
('ella.martin@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Ella Martin', 'ellam', true, NULL, 'Transitioning from QA to development', 'Brighton, UK', NULL, NULL),
('tushar.agarwal@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Tushar Agarwal', 'tushar_a', true, NULL, 'Competitive programmer turned SDE. 500+ LC.', 'Bangalore, India', NULL, NULL),
('scarlett.jones@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Scarlett Jones', 'scarlettj', true, NULL, 'ML + DSA. Best of both worlds.', 'Boston, USA', NULL, NULL),
('nikhil.das@gmail.com', '$2b$12$5jOz8Yq9fMnfKNTtRgRXvuigOMwlh7obyKnQw2kys5PluR1uTzMR.', 'Nikhil Das', 'nikhil_d', true, NULL, 'Array problems are my warmup', 'Guwahati, India', NULL, NULL)
ON CONFLICT (email) DO NOTHING;

-- ── User Preferences ──
INSERT INTO user_preferences (user_id, theme, weekly_goal)
SELECT id, CASE WHEN random() > 0.5 THEN 'dark' ELSE 'default' END, (floor(random() * 7 + 3))::int
FROM users WHERE email LIKE '%@gmail.com' OR email LIKE '%@outlook.com' OR email LIKE '%@yahoo.com'
ON CONFLICT (user_id) DO NOTHING;

-- ── User Streaks (varied: some with big streaks, some just starting) ──
INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_solve_date)
SELECT id,
  CASE
    WHEN random() < 0.15 THEN (floor(random() * 60 + 30))::int   -- 15% power users: 30-90 day streaks
    WHEN random() < 0.4 THEN (floor(random() * 20 + 5))::int     -- 25% regular: 5-25 day streaks
    WHEN random() < 0.7 THEN (floor(random() * 5 + 1))::int      -- 30% casual: 1-5 day streaks
    ELSE 0                                                         -- 30% inactive
  END,
  (floor(random() * 90 + 1))::int,
  CURRENT_DATE - (floor(random() * 3))::int * INTERVAL '1 day'  -- last solved within 0-2 days ago
FROM users WHERE email LIKE '%@gmail.com' OR email LIKE '%@outlook.com' OR email LIKE '%@yahoo.com'
ON CONFLICT (user_id) DO NOTHING;

-- ── Solve problems for users ──
-- Each user solves a random subset of problems
INSERT INTO user_problem_status (user_id, problem_id, status, solved_at)
SELECT u.id, p.id, 'solved',
  NOW() - (floor(random() * 90) * INTERVAL '1 day') - (floor(random() * 24) * INTERVAL '1 hour')
FROM users u
CROSS JOIN problems p
WHERE (u.email LIKE '%@gmail.com' OR u.email LIKE '%@outlook.com' OR u.email LIKE '%@yahoo.com')
  AND random() < 0.5  -- each user solves ~50% of problems
ON CONFLICT (user_id, problem_id) DO NOTHING;

-- Some users also have attempted (not solved) problems
INSERT INTO user_problem_status (user_id, problem_id, status)
SELECT u.id, p.id, 'attempted'
FROM users u
CROSS JOIN problems p
WHERE (u.email LIKE '%@gmail.com' OR u.email LIKE '%@outlook.com' OR u.email LIKE '%@yahoo.com')
  AND random() < 0.15
ON CONFLICT (user_id, problem_id) DO NOTHING;

-- ── Create Groups ──
INSERT INTO groups (name, description, invite_code, created_by) VALUES
  ('FAANG Prep 2026', 'Grinding together for FAANG interviews. Daily targets and accountability.', 'faang2026prep', (SELECT id FROM users WHERE email = 'arjun.sharma@gmail.com')),
  ('Striver Sheet Grinders', 'Following Striver SDE Sheet. One topic per week.', 'strivergrind', (SELECT id FROM users WHERE email = 'priya.patel@outlook.com')),
  ('Blind 75 Speedrun', 'Completing Blind 75 in 30 days. No slacking!', 'blind75fast', (SELECT id FROM users WHERE email = 'alex.chen@gmail.com')),
  ('DSA Beginners', 'Supportive group for those just starting their DSA journey', 'dsabeginners', (SELECT id FROM users WHERE email = 'maya.williams@gmail.com')),
  ('Hard Problems Only', 'We only solve hard problems here. Not for the faint-hearted.', 'hardonly2026', (SELECT id FROM users WHERE email = 'vikram.singh@gmail.com')),
  ('Women in Tech DSA', 'Supportive community for women preparing for tech interviews', 'witdsa2026', (SELECT id FROM users WHERE email = 'sneha.reddy@gmail.com')),
  ('Weekend Warriors', 'Solve 10+ problems every weekend. Casual weekday vibes.', 'weekendwar26', (SELECT id FROM users WHERE email = 'james.park@gmail.com')),
  ('Graph Gang', 'Dedicated to mastering graph algorithms', 'graphgang26', (SELECT id FROM users WHERE email = 'divya.iyer@gmail.com'))
ON CONFLICT (invite_code) DO NOTHING;

-- ── Add members to groups (creator is admin, others are members) ──
-- Admins (creators)
INSERT INTO group_members (group_id, user_id, role)
SELECT g.id, g.created_by, 'admin'
FROM groups g WHERE g.invite_code IN ('faang2026prep','strivergrind','blind75fast','dsabeginners','hardonly2026','witdsa2026','weekendwar26','graphgang26')
ON CONFLICT DO NOTHING;

-- Random members for FAANG Prep (20-30 users)
INSERT INTO group_members (group_id, user_id, role, joined_at)
SELECT g.id, u.id, 'member', NOW() - (floor(random() * 30) * INTERVAL '1 day')
FROM groups g, users u
WHERE g.invite_code = 'faang2026prep'
  AND u.id != g.created_by
  AND random() < 0.3
ON CONFLICT DO NOTHING;

-- Random members for Striver Sheet
INSERT INTO group_members (group_id, user_id, role, joined_at)
SELECT g.id, u.id, 'member', NOW() - (floor(random() * 30) * INTERVAL '1 day')
FROM groups g, users u
WHERE g.invite_code = 'strivergrind'
  AND u.id != g.created_by
  AND random() < 0.25
ON CONFLICT DO NOTHING;

-- Random members for Blind 75
INSERT INTO group_members (group_id, user_id, role, joined_at)
SELECT g.id, u.id, 'member', NOW() - (floor(random() * 20) * INTERVAL '1 day')
FROM groups g, users u
WHERE g.invite_code = 'blind75fast'
  AND u.id != g.created_by
  AND random() < 0.2
ON CONFLICT DO NOTHING;

-- Random members for Beginners
INSERT INTO group_members (group_id, user_id, role, joined_at)
SELECT g.id, u.id, 'member', NOW() - (floor(random() * 40) * INTERVAL '1 day')
FROM groups g, users u
WHERE g.invite_code = 'dsabeginners'
  AND u.id != g.created_by
  AND random() < 0.35
ON CONFLICT DO NOTHING;

-- Random members for remaining groups
INSERT INTO group_members (group_id, user_id, role, joined_at)
SELECT g.id, u.id, 'member', NOW() - (floor(random() * 25) * INTERVAL '1 day')
FROM groups g, users u
WHERE g.invite_code IN ('hardonly2026','witdsa2026','weekendwar26','graphgang26')
  AND u.id != g.created_by
  AND random() < 0.15
ON CONFLICT DO NOTHING;

-- ── Group Activity Feed ──
-- Users solving problems generates group activity
INSERT INTO group_activity (group_id, user_id, action, metadata, created_at)
SELECT gm.group_id, gm.user_id,
  LEFT('solved ' || p.title, 50),
  json_build_object('problem_id', p.id, 'difficulty', p.difficulty, 'problem_slug', p.slug)::jsonb,
  ups.solved_at
FROM group_members gm
JOIN user_problem_status ups ON ups.user_id = gm.user_id AND ups.status = 'solved'
JOIN problems p ON p.id = ups.problem_id
WHERE random() < 0.6  -- 60% of solves generate group activity
ORDER BY random()
LIMIT 500;

-- Joining activity
INSERT INTO group_activity (group_id, user_id, action, metadata, created_at)
SELECT gm.group_id, gm.user_id,
  'joined the group',
  '{}'::jsonb,
  gm.joined_at
FROM group_members gm
ON CONFLICT DO NOTHING;

-- ── Discussion Comments ──
INSERT INTO comments (problem_id, user_id, content, created_at) VALUES
  ((SELECT id FROM problems WHERE slug='two-sum'), (SELECT id FROM users WHERE email='arjun.sharma@gmail.com'), 'Hash map approach is the classic O(n) solution. Remember to check if complement exists BEFORE adding current number to avoid using same element twice!', NOW() - INTERVAL '15 days'),
  ((SELECT id FROM problems WHERE slug='two-sum'), (SELECT id FROM users WHERE email='priya.patel@outlook.com'), 'For the follow-up: if array is sorted, use two pointers instead of hash map for O(1) space.', NOW() - INTERVAL '14 days'),
  ((SELECT id FROM problems WHERE slug='valid-parentheses'), (SELECT id FROM users WHERE email='deepak.nair@gmail.com'), 'Stack is perfect here. Push opening brackets, pop on closing. If stack empty at end = valid!', NOW() - INTERVAL '12 days'),
  ((SELECT id FROM problems WHERE slug='climbing-stairs'), (SELECT id FROM users WHERE email='sneha.reddy@gmail.com'), 'This is literally Fibonacci in disguise. dp[i] = dp[i-1] + dp[i-2]. Can optimize to O(1) space with just two variables.', NOW() - INTERVAL '10 days'),
  ((SELECT id FROM problems WHERE slug='maximum-subarray'), (SELECT id FROM users WHERE email='alex.chen@gmail.com'), 'Kadane''s algorithm is beautiful. The key insight: if current sum goes negative, reset to 0 because any future subarray is better off starting fresh.', NOW() - INTERVAL '9 days'),
  ((SELECT id FROM problems WHERE slug='best-time-to-buy-and-sell-stock'), (SELECT id FROM users WHERE email='sakshi.jain@gmail.com'), 'Track min price so far, calculate profit at each step. One pass, O(1) space. So elegant!', NOW() - INTERVAL '8 days'),
  ((SELECT id FROM problems WHERE slug='merge-two-sorted-lists'), (SELECT id FROM users WHERE email='david.kim@gmail.com'), 'Recursive solution is clean but iterative is better for interviews — no stack overflow risk.', NOW() - INTERVAL '7 days'),
  ((SELECT id FROM problems WHERE slug='3sum'), (SELECT id FROM users WHERE email='rahul.verma@yahoo.com'), 'Sort first, then fix one element and use two pointers on the rest. Don''t forget to skip duplicates!', NOW() - INTERVAL '6 days'),
  ((SELECT id FROM problems WHERE slug='container-with-most-water'), (SELECT id FROM users WHERE email='vikram.singh@gmail.com'), 'Two pointers from both ends. Move the shorter wall inward because moving the taller one can never increase the area.', NOW() - INTERVAL '5 days'),
  ((SELECT id FROM problems WHERE slug='longest-substring-without-repeating-characters'), (SELECT id FROM users WHERE email='rohan.mishra@gmail.com'), 'Sliding window with a hash set. Expand right, and when you hit a duplicate, shrink from left until unique again.', NOW() - INTERVAL '4 days'),
  ((SELECT id FROM problems WHERE slug='add-two-numbers'), (SELECT id FROM users WHERE email='neha.kapoor@gmail.com'), 'Don''t forget the carry! Create a dummy head node to simplify edge cases.', NOW() - INTERVAL '3 days'),
  ((SELECT id FROM problems WHERE slug='median-of-two-sorted-arrays'), (SELECT id FROM users WHERE email='emma.johnson@gmail.com'), 'Binary search on the shorter array. Partition both arrays such that left half ≤ right half. Tricky but O(log(min(m,n)))!', NOW() - INTERVAL '2 days'),
  ((SELECT id FROM problems WHERE slug='two-sum'), (SELECT id FROM users WHERE email='michael.brown@gmail.com'), 'Pro tip: in an interview, start with brute force O(n²) first, then optimize to hash map. Shows your thought process.', NOW() - INTERVAL '1 day'),
  ((SELECT id FROM problems WHERE slug='symmetric-tree'), (SELECT id FROM users WHERE email='kavitha.rao@gmail.com'), 'Compare left.left with right.right AND left.right with right.left. Both recursive and iterative (queue) work well.', NOW() - INTERVAL '12 hours'),
  ((SELECT id FROM problems WHERE slug='binary-tree-inorder-traversal'), (SELECT id FROM users WHERE email='james.park@gmail.com'), 'Morris traversal gives O(1) space! Thread the tree temporarily. Mind-blowing when you first see it.', NOW() - INTERVAL '6 hours')
ON CONFLICT DO NOTHING;

-- ── Revision Notes for active users ──
INSERT INTO revision_notes (user_id, problem_id, key_takeaway, approach, time_complexity, space_complexity, intuition, points_to_remember, ai_generated, revision_count, last_revised_at, created_at)
SELECT
  u.id, p.id,
  CASE p.slug
    WHEN 'two-sum' THEN 'Use hash map for O(1) complement lookup'
    WHEN 'valid-parentheses' THEN 'Stack perfectly matches the LIFO nature of bracket matching'
    WHEN 'climbing-stairs' THEN 'It''s Fibonacci! dp[n] = dp[n-1] + dp[n-2]'
    WHEN 'best-time-to-buy-and-sell-stock' THEN 'Track minimum price and maximum profit in single pass'
    WHEN 'maximum-subarray' THEN 'Kadane''s: reset running sum when it goes negative'
    ELSE 'Key pattern: ' || p.difficulty || ' level ' || p.title
  END,
  CASE p.difficulty WHEN 'easy' THEN 'Hash Table' WHEN 'medium' THEN 'Two Pointers' ELSE 'Binary Search' END,
  CASE p.difficulty WHEN 'easy' THEN 'O(n)' WHEN 'medium' THEN 'O(n log n)' ELSE 'O(log n)' END,
  CASE p.difficulty WHEN 'easy' THEN 'O(n)' WHEN 'medium' THEN 'O(n)' ELSE 'O(1)' END,
  'Understanding the core pattern makes similar problems trivial.',
  ARRAY['Handle edge cases', 'Consider empty input', 'Watch for overflow'],
  random() < 0.4,
  (floor(random() * 5))::int,
  NOW() - (floor(random() * 10) * INTERVAL '1 day'),
  NOW() - (floor(random() * 30) * INTERVAL '1 day')
FROM users u
CROSS JOIN problems p
JOIN user_problem_status ups ON ups.user_id = u.id AND ups.problem_id = p.id AND ups.status = 'solved'
WHERE random() < 0.3
ON CONFLICT (user_id, problem_id) DO NOTHING;

-- ── Badges for users ──
-- First Solve badge for everyone who solved at least 1
INSERT INTO user_badges (user_id, badge_id, earned_at)
SELECT DISTINCT ups.user_id, b.id,
  MIN(ups.solved_at)
FROM user_problem_status ups, badges b
WHERE ups.status = 'solved' AND b.name = 'First Solve'
GROUP BY ups.user_id, b.id
ON CONFLICT DO NOTHING;

-- Ten Down for users with 10+ solves
INSERT INTO user_badges (user_id, badge_id, earned_at)
SELECT ups.user_id, b.id, NOW() - INTERVAL '10 days'
FROM (SELECT user_id, COUNT(*) AS cnt FROM user_problem_status WHERE status = 'solved' GROUP BY user_id HAVING COUNT(*) >= 10) ups, badges b
WHERE b.name = 'Ten Down'
ON CONFLICT DO NOTHING;

-- Week Warrior for users with streak >= 7
INSERT INTO user_badges (user_id, badge_id, earned_at)
SELECT us.user_id, b.id, NOW() - INTERVAL '7 days'
FROM user_streaks us, badges b
WHERE us.current_streak >= 7 AND b.name = 'Week Warrior'
ON CONFLICT DO NOTHING;

-- Easy Peasy for users who solved easy problems
INSERT INTO user_badges (user_id, badge_id, earned_at)
SELECT DISTINCT ups.user_id, b.id, NOW() - (floor(random() * 20) * INTERVAL '1 day')
FROM user_problem_status ups
JOIN problems p ON p.id = ups.problem_id AND p.difficulty = 'easy'
CROSS JOIN badges b
WHERE ups.status = 'solved' AND b.name = 'Easy Peasy'
ON CONFLICT DO NOTHING;

-- Team Player for users in groups
INSERT INTO user_badges (user_id, badge_id, earned_at)
SELECT DISTINCT gm.user_id, b.id, gm.joined_at
FROM group_members gm, badges b
WHERE b.name = 'Team Player'
ON CONFLICT DO NOTHING;

-- Note Taker for users with revision notes
INSERT INTO user_badges (user_id, badge_id, earned_at)
SELECT DISTINCT rn.user_id, b.id, rn.created_at
FROM revision_notes rn, badges b
WHERE b.name = 'Note Taker'
ON CONFLICT DO NOTHING;

-- ── Notifications (make platform feel alive) ──
INSERT INTO notifications (user_id, type, title, body, created_at)
SELECT u.id, 'streak',
  u.display_name || ' is on a ' || us.current_streak || '-day streak!',
  'Keep it up! Consistency is key.',
  NOW() - (floor(random() * 5) * INTERVAL '1 day')
FROM users u
JOIN user_streaks us ON us.user_id = u.id
WHERE us.current_streak >= 5
ON CONFLICT DO NOTHING;

COMMIT;
