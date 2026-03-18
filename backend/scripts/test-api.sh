#!/bin/bash
#
# Solvo API Integration Tests
# Run: bash scripts/test-api.sh
#
# Tests every endpoint end-to-end against a running server.
# Prerequisites: server running on localhost:3000, DB seeded.

set -euo pipefail

API="http://localhost:3000/api"
PASS=0
FAIL=0
TOTAL=0

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Generate unique test email to avoid conflicts
TEST_ID=$(date +%s)
TEST_EMAIL="test${TEST_ID}@solvo.dev"
TEST_EMAIL2="test${TEST_ID}b@solvo.dev"
TEST_PASSWORD="password123"
TEST_NAME="Test User ${TEST_ID}"

# ── Helpers ──
assert() {
  local test_name="$1"
  local expected="$2"
  local actual="$3"
  TOTAL=$((TOTAL + 1))

  if echo "$actual" | grep -q "$expected"; then
    PASS=$((PASS + 1))
    echo -e "  ${GREEN}✓${NC} $test_name"
  else
    FAIL=$((FAIL + 1))
    echo -e "  ${RED}✗${NC} $test_name"
    echo -e "    ${RED}Expected:${NC} $expected"
    echo -e "    ${RED}Got:${NC} $(echo "$actual" | head -1)"
  fi
}

assert_status() {
  local test_name="$1"
  local expected_status="$2"
  local actual_status="$3"
  local body="$4"
  TOTAL=$((TOTAL + 1))

  if [ "$actual_status" -eq "$expected_status" ]; then
    PASS=$((PASS + 1))
    echo -e "  ${GREEN}✓${NC} $test_name (HTTP $actual_status)"
  else
    FAIL=$((FAIL + 1))
    echo -e "  ${RED}✗${NC} $test_name — expected HTTP $expected_status, got $actual_status"
    echo -e "    ${RED}Response:${NC} $(echo "$body" | head -1)"
  fi
}

# ── Extract JSON field (portable, no jq dependency) ──
json_field() {
  python3 -c "import sys,json; d=json.load(sys.stdin); print(d$1)" 2>/dev/null
}

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║       Solvo API Integration Tests        ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════╝${NC}"
echo ""

# ============================================
# 1. HEALTH CHECK
# ============================================
echo -e "${YELLOW}── Health Check ──${NC}"
HEALTH=$(curl -s http://localhost:3000/health)
assert "Health endpoint returns ok" '"status":"ok"' "$HEALTH"

# ============================================
# 2. AUTH — SIGNUP
# ============================================
echo ""
echo -e "${YELLOW}── Auth: Signup ──${NC}"

SIGNUP_RES=$(curl -s -w "\n%{http_code}" -X POST "$API/auth/signup" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"displayName\":\"$TEST_NAME\"}")
SIGNUP_BODY=$(echo "$SIGNUP_RES" | head -1)
SIGNUP_STATUS=$(echo "$SIGNUP_RES" | tail -1)

assert_status "Signup returns 201" 201 "$SIGNUP_STATUS" "$SIGNUP_BODY"
assert "Signup returns token" '"token"' "$SIGNUP_BODY"
assert "Signup returns user" '"email"' "$SIGNUP_BODY"

TOKEN=$(echo "$SIGNUP_BODY" | json_field '["token"]')
USER_ID=$(echo "$SIGNUP_BODY" | json_field '["user"]["id"]')
echo -e "  ${CYAN}→ Token: ${TOKEN:0:20}...${NC}"
echo -e "  ${CYAN}→ User ID: $USER_ID${NC}"

# ── Duplicate signup ──
DUP_RES=$(curl -s -w "\n%{http_code}" -X POST "$API/auth/signup" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"displayName\":\"Dup\"}")
DUP_STATUS=$(echo "$DUP_RES" | tail -1)
assert_status "Duplicate signup returns 409" 409 "$DUP_STATUS" "$(echo "$DUP_RES" | head -1)"

# ============================================
# 3. AUTH — LOGIN
# ============================================
echo ""
echo -e "${YELLOW}── Auth: Login ──${NC}"

LOGIN_RES=$(curl -s -w "\n%{http_code}" -X POST "$API/auth/login" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")
LOGIN_STATUS=$(echo "$LOGIN_RES" | tail -1)
assert_status "Login returns 200" 200 "$LOGIN_STATUS" "$(echo "$LOGIN_RES" | head -1)"
assert "Login returns token" '"token"' "$(echo "$LOGIN_RES" | head -1)"

# ── Wrong password ──
BAD_RES=$(curl -s -w "\n%{http_code}" -X POST "$API/auth/login" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"wrongpassword\"}")
BAD_STATUS=$(echo "$BAD_RES" | tail -1)
assert_status "Wrong password returns 401" 401 "$BAD_STATUS" "$(echo "$BAD_RES" | head -1)"

# ── Auth required (no token) ──
NO_AUTH=$(curl -s -w "\n%{http_code}" "$API/problems")
NO_AUTH_STATUS=$(echo "$NO_AUTH" | tail -1)
assert_status "No token returns 401" 401 "$NO_AUTH_STATUS" "$(echo "$NO_AUTH" | head -1)"

# ============================================
# 4. AUTH — CONNECT LEETCODE
# ============================================
echo ""
echo -e "${YELLOW}── Auth: Connect LeetCode ──${NC}"

LC_RES=$(curl -s -w "\n%{http_code}" -X POST "$API/auth/connect-leetcode" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"leetcodeUsername":"testuser_lc"}')
LC_STATUS=$(echo "$LC_RES" | tail -1)
assert_status "Connect LeetCode returns 200" 200 "$LC_STATUS" "$(echo "$LC_RES" | head -1)"

# ============================================
# 5. PROBLEMS
# ============================================
echo ""
echo -e "${YELLOW}── Problems ──${NC}"

PROBLEMS_RES=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/problems")
assert "List problems returns array" '"problems"' "$PROBLEMS_RES"
PROBLEM_COUNT=$(echo "$PROBLEMS_RES" | python3 -c "import sys,json; print(len(json.load(sys.stdin)['problems']))")
assert "Has seeded problems" "true" "$([ "$PROBLEM_COUNT" -gt 0 ] && echo true || echo false)"
echo -e "  ${CYAN}→ Problem count: $PROBLEM_COUNT${NC}"

# ── Filter by difficulty ──
EASY_RES=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/problems?difficulty=easy")
assert "Filter by easy works" '"problems"' "$EASY_RES"

# ── Get by slug ──
SLUG_RES=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/problems/two-sum")
assert "Get problem by slug" '"two-sum"' "$SLUG_RES"

# ── Sheets ──
SHEETS_RES=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/problems/sheets")
assert "List sheets" '"sheets"' "$SHEETS_RES"

SHEET_PROBLEMS=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/problems/sheets/leetcode-top-150")
assert "Get sheet problems" '"problems"' "$SHEET_PROBLEMS"

# ============================================
# 6. GROUPS
# ============================================
echo ""
echo -e "${YELLOW}── Groups ──${NC}"

# ── Create group ──
GROUP_RES=$(curl -s -w "\n%{http_code}" -X POST "$API/groups" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Test Group","description":"A test group"}')
GROUP_BODY=$(echo "$GROUP_RES" | head -1)
GROUP_STATUS=$(echo "$GROUP_RES" | tail -1)
assert_status "Create group returns 201" 201 "$GROUP_STATUS" "$GROUP_BODY"
assert "Group has invite_code" '"invite_code"' "$GROUP_BODY"

GROUP_ID=$(echo "$GROUP_BODY" | json_field '["group"]["id"]')
INVITE_CODE=$(echo "$GROUP_BODY" | json_field '["group"]["invite_code"]')
echo -e "  ${CYAN}→ Group ID: $GROUP_ID${NC}"
echo -e "  ${CYAN}→ Invite code: $INVITE_CODE${NC}"

# ── Create group validation (missing name) ──
BAD_GROUP=$(curl -s -w "\n%{http_code}" -X POST "$API/groups" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{}')
BAD_GROUP_STATUS=$(echo "$BAD_GROUP" | tail -1)
assert_status "Create group without name returns 400" 400 "$BAD_GROUP_STATUS" "$(echo "$BAD_GROUP" | head -1)"

# ── List user groups ──
MY_GROUPS=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/groups")
assert "List my groups" '"groups"' "$MY_GROUPS"

# ── Get group details ──
GROUP_DETAIL=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/groups/$GROUP_ID")
assert "Get group detail" '"members"' "$GROUP_DETAIL"

# ── Join group (second user) ──
SIGNUP2=$(curl -s -X POST "$API/auth/signup" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$TEST_EMAIL2\",\"password\":\"$TEST_PASSWORD\",\"displayName\":\"User Two\"}")
TOKEN2=$(echo "$SIGNUP2" | json_field '["token"]')
USER_ID2=$(echo "$SIGNUP2" | json_field '["user"]["id"]')

JOIN_RES=$(curl -s -w "\n%{http_code}" -X POST "$API/groups/join" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN2" \
  -d "{\"inviteCode\":\"$INVITE_CODE\"}")
JOIN_STATUS=$(echo "$JOIN_RES" | tail -1)
assert_status "Join group via invite code returns 200" 200 "$JOIN_STATUS" "$(echo "$JOIN_RES" | head -1)"

# ── Duplicate join ──
DUP_JOIN=$(curl -s -w "\n%{http_code}" -X POST "$API/groups/join" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN2" \
  -d "{\"inviteCode\":\"$INVITE_CODE\"}")
DUP_JOIN_STATUS=$(echo "$DUP_JOIN" | tail -1)
assert_status "Duplicate join returns 409" 409 "$DUP_JOIN_STATUS" "$(echo "$DUP_JOIN" | head -1)"

# ── Invalid invite code ──
BAD_JOIN=$(curl -s -w "\n%{http_code}" -X POST "$API/groups/join" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN2" \
  -d '{"inviteCode":"invalidcode123"}')
BAD_JOIN_STATUS=$(echo "$BAD_JOIN" | tail -1)
assert_status "Invalid invite code returns 404" 404 "$BAD_JOIN_STATUS" "$(echo "$BAD_JOIN" | head -1)"

# ============================================
# 7. SYNC (CRITICAL PATH)
# ============================================
echo ""
echo -e "${YELLOW}── Sync: LeetCode (Critical Path) ──${NC}"

SYNC_RES=$(curl -s -w "\n%{http_code}" -X POST "$API/sync/leetcode" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"userId\":\"$USER_ID\",\"problemSlug\":\"two-sum\",\"status\":\"solved\"}")
SYNC_BODY=$(echo "$SYNC_RES" | head -1)
SYNC_STATUS=$(echo "$SYNC_RES" | tail -1)
assert_status "Sync solved returns 200" 200 "$SYNC_STATUS" "$SYNC_BODY"
assert "Sync returns progress" '"progress"' "$SYNC_BODY"
assert "Sync returns streak" '"streak"' "$SYNC_BODY"
assert "Status is solved" '"solved"' "$SYNC_BODY"

# ── Sync another problem ──
SYNC2=$(curl -s -X POST "$API/sync/leetcode" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"userId\":\"$USER_ID\",\"problemSlug\":\"valid-parentheses\",\"status\":\"solved\"}")
assert "Sync second problem" '"solved"' "$SYNC2"

# ── Sync with invalid slug ──
BAD_SYNC=$(curl -s -w "\n%{http_code}" -X POST "$API/sync/leetcode" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"userId\":\"$USER_ID\",\"problemSlug\":\"nonexistent-problem\",\"status\":\"solved\"}")
BAD_SYNC_STATUS=$(echo "$BAD_SYNC" | tail -1)
assert_status "Sync unknown slug returns 404" 404 "$BAD_SYNC_STATUS" "$(echo "$BAD_SYNC" | head -1)"

# ── Sync validation (missing fields) ──
VAL_SYNC=$(curl -s -w "\n%{http_code}" -X POST "$API/sync/leetcode" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"problemSlug":"two-sum"}')
VAL_SYNC_STATUS=$(echo "$VAL_SYNC" | tail -1)
assert_status "Sync missing userId returns 400" 400 "$VAL_SYNC_STATUS" "$(echo "$VAL_SYNC" | head -1)"

# ============================================
# 8. PROGRESS
# ============================================
echo ""
echo -e "${YELLOW}── Progress ──${NC}"

PROGRESS_RES=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/progress")
assert "Get progress" '"progress"' "$PROGRESS_RES"

SOLVED_COUNT=$(echo "$PROGRESS_RES" | python3 -c "import sys,json; p=json.load(sys.stdin)['progress']; print(len([x for x in p if x['status']=='solved']))")
assert "Has 2 solved problems" "2" "$SOLVED_COUNT"

# ============================================
# 9. STREAKS
# ============================================
echo ""
echo -e "${YELLOW}── Streaks ──${NC}"

STREAK_RES=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/streaks")
assert "Get streak" '"streak"' "$STREAK_RES"
assert "Streak has currentStreak" '"currentStreak"' "$STREAK_RES"

CURRENT=$(echo "$STREAK_RES" | json_field '["streak"]["currentStreak"]')
echo -e "  ${CYAN}→ Current streak: $CURRENT${NC}"

# ============================================
# 10. LEADERBOARD
# ============================================
echo ""
echo -e "${YELLOW}── Leaderboard ──${NC}"

LB_RES=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/leaderboard/group/$GROUP_ID")
assert "Get group leaderboard" '"leaderboard"' "$LB_RES"

# ── Non-member access ──
SIGNUP3=$(curl -s -X POST "$API/auth/signup" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"outsider${TEST_ID}@solvo.dev\",\"password\":\"$TEST_PASSWORD\",\"displayName\":\"Outsider\"}")
TOKEN3=$(echo "$SIGNUP3" | json_field '["token"]')

NON_MEMBER_LB=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $TOKEN3" "$API/leaderboard/group/$GROUP_ID")
NON_MEMBER_STATUS=$(echo "$NON_MEMBER_LB" | tail -1)
assert_status "Non-member leaderboard returns 403" 403 "$NON_MEMBER_STATUS" "$(echo "$NON_MEMBER_LB" | head -1)"

# ============================================
# 11. NOTES
# ============================================
echo ""
echo -e "${YELLOW}── Notes ──${NC}"

PROBLEM_ID=$(echo "$PROBLEMS_RES" | python3 -c "import sys,json; print(json.load(sys.stdin)['problems'][0]['id'])")

# ── Create personal note ──
NOTE_RES=$(curl -s -w "\n%{http_code}" -X POST "$API/notes" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"problemId\":\"$PROBLEM_ID\",\"content\":\"Use hash map for O(n)\",\"visibility\":\"personal\"}")
NOTE_BODY=$(echo "$NOTE_RES" | head -1)
NOTE_STATUS=$(echo "$NOTE_RES" | tail -1)
assert_status "Create personal note returns 201" 201 "$NOTE_STATUS" "$NOTE_BODY"

NOTE_ID=$(echo "$NOTE_BODY" | json_field '["note"]["id"]')

# ── Get personal notes ──
GET_NOTES=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/notes/personal/$PROBLEM_ID")
assert "Get personal notes" '"notes"' "$GET_NOTES"
assert "Note has content" 'hash map' "$GET_NOTES"

# ── Update note ──
UPDATE_NOTE=$(curl -s -w "\n%{http_code}" -X PUT "$API/notes/$NOTE_ID" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"content":"Updated: use hash map with two-pass approach"}')
UPDATE_STATUS=$(echo "$UPDATE_NOTE" | tail -1)
assert_status "Update note returns 200" 200 "$UPDATE_STATUS" "$(echo "$UPDATE_NOTE" | head -1)"

# ── Create group note ──
GROUP_NOTE=$(curl -s -w "\n%{http_code}" -X POST "$API/notes" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"problemId\":\"$PROBLEM_ID\",\"content\":\"Group insight: sliding window\",\"visibility\":\"group\",\"groupId\":\"$GROUP_ID\"}")
GROUP_NOTE_STATUS=$(echo "$GROUP_NOTE" | tail -1)
assert_status "Create group note returns 201" 201 "$GROUP_NOTE_STATUS" "$(echo "$GROUP_NOTE" | head -1)"

# ── Delete note ──
DEL_NOTE=$(curl -s -w "\n%{http_code}" -X DELETE "$API/notes/$NOTE_ID" \
  -H "Authorization: Bearer $TOKEN")
DEL_STATUS=$(echo "$DEL_NOTE" | tail -1)
assert_status "Delete note returns 200" 200 "$DEL_STATUS" "$(echo "$DEL_NOTE" | head -1)"

# ============================================
# 12. INSIGHTS
# ============================================
echo ""
echo -e "${YELLOW}── Insights ──${NC}"

OVERVIEW_RES=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/insights/overview")
assert "Insights overview" '"totalSolved"' "$OVERVIEW_RES"

WEEKLY_RES=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/insights/weekly")
assert "Insights weekly" "200" "$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$API/insights/weekly")"

TAGS_RES=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/insights/tags")
assert "Insights tags" "200" "$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$API/insights/tags")"

TREND_RES=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/insights/difficulty-trend")
assert "Insights difficulty trend" "200" "$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$API/insights/difficulty-trend")"

# ============================================
# 13. PREFERENCES
# ============================================
echo ""
echo -e "${YELLOW}── Preferences ──${NC}"

PREFS_RES=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/preferences")
assert "Get preferences" "200" "$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$API/preferences")"

# ── Update preferences ──
UPDATE_PREFS=$(curl -s -w "\n%{http_code}" -X PUT "$API/preferences" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"accent_color":"#22d3ee","weekly_goal":10,"show_streak_animation":false}')
UPDATE_PREFS_STATUS=$(echo "$UPDATE_PREFS" | tail -1)
assert_status "Update preferences returns 200" 200 "$UPDATE_PREFS_STATUS" "$(echo "$UPDATE_PREFS" | head -1)"

# ── Verify preferences persisted ──
PREFS_CHECK=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/preferences")
assert "Preferences persisted accent_color" '#22d3ee' "$PREFS_CHECK"
assert "Preferences persisted weekly_goal" '10' "$PREFS_CHECK"

# ============================================
# 14. SHEETS UPLOAD (CSV)
# ============================================
echo ""
echo -e "${YELLOW}── Sheets Upload ──${NC}"

# Create a temp CSV file
TMPCSV=$(mktemp /tmp/solvo-test-XXXXX.csv)
cat > "$TMPCSV" << 'CSVEOF'
title,slug,difficulty,url,tags
Coin Change,coin-change,medium,https://leetcode.com/problems/coin-change/,"dynamic-programming,array"
House Robber,house-robber,medium,https://leetcode.com/problems/house-robber/,"dynamic-programming,array"
Jump Game,jump-game,medium,https://leetcode.com/problems/jump-game/,"greedy,array"
CSVEOF

UPLOAD_RES=$(curl -s -w "\n%{http_code}" -X POST "$API/sheets/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "name=DP Sheet" \
  -F "file=@$TMPCSV")
UPLOAD_BODY=$(echo "$UPLOAD_RES" | head -1)
UPLOAD_STATUS=$(echo "$UPLOAD_RES" | tail -1)
assert_status "Sheet upload returns 201" 201 "$UPLOAD_STATUS" "$UPLOAD_BODY"

rm -f "$TMPCSV"

# ── Verify uploaded sheet ──
SHEETS_AFTER=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/problems/sheets")
assert "Uploaded sheet appears in list" 'DP Sheet' "$SHEETS_AFTER"

# ============================================
# SUMMARY
# ============================================
echo ""
echo -e "${CYAN}══════════════════════════════════════════${NC}"
echo -e "${CYAN}  Results: $PASS passed, $FAIL failed, $TOTAL total${NC}"
echo -e "${CYAN}══════════════════════════════════════════${NC}"

if [ "$FAIL" -gt 0 ]; then
  echo -e "${RED}  SOME TESTS FAILED${NC}"
  exit 1
else
  echo -e "${GREEN}  ALL TESTS PASSED ✓${NC}"
  exit 0
fi
