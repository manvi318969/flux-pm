#!/bin/bash
# ================================================================
#   FLUX - Project Management Tool
#   Ek command mein sab chala do (Ubuntu / Linux)
#   Chalane ke liye:  bash START.sh
# ================================================================

# rang
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

clear
echo -e "${BLUE}================================================================${NC}"
echo -e "${BLUE}        F L U X  -  PROJECT MANAGEMENT TOOL${NC}"
echo -e "${BLUE}================================================================${NC}"
echo ""

# script jis folder mein hai wahi chalo
cd "$(dirname "$0")"
ROOT="$(pwd)"

# ---- Step 1: Node.js check ----
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ X ]  Node.js install nahi hai!${NC}"
    echo ""
    echo "  Install karne ke liye terminal mein ye chalao:"
    echo -e "${YELLOW}     sudo apt update && sudo apt install nodejs npm -y${NC}"
    echo ""
    echo "  Phir ye script dobara chalao:  bash START.sh"
    echo ""
    exit 1
fi
echo -e "${GREEN}[ OK ]  Node.js mil gaya:${NC} $(node -v)"
echo ""

# ---- Step 2: backend .env check ----
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}============================================================${NC}"
    echo -e "${YELLOW}  PEHLI BAAR SETUP - MongoDB connection daalna hai.${NC}"
    echo -e "${YELLOW}============================================================${NC}"
    cp backend/.env.example backend/.env
    echo ""
    echo "  backend/.env file ban gayi."
    echo "  Ab usme MONGO_URI wali line apni MongoDB Atlas string se badlo."
    echo "  (database naam /flux rakhna)"
    echo ""
    echo -e "  Editor khol rahe hai... ${YELLOW}(nano: badlo, phir Ctrl+O Enter Ctrl+X)${NC}"
    sleep 2
    nano backend/.env
    echo ""
    echo -e "${GREEN}  String save kar di? Aage badh rahe hai...${NC}"
    sleep 1
fi

# ---- Step 3: backend dependencies ----
if [ ! -d "backend/node_modules" ]; then
    echo -e "${BLUE}[ ... ]  Backend packages install kar rahe hai (1-2 min)...${NC}"
    (cd backend && npm install)
    echo ""
fi

# ---- Step 4: frontend setup ----
if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
fi
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${BLUE}[ ... ]  Frontend packages install kar rahe hai (1-2 min)...${NC}"
    (cd frontend && npm install)
    echo ""
fi

# ---- Step 5: backend ko background mein chalao ----
echo -e "${BLUE}[ ... ]  Backend server chalu kar rahe hai...${NC}"
(cd backend && npm start > "$ROOT/backend.log" 2>&1) &
BACKEND_PID=$!

# backend connect hone ka wait (max ~20 sec)
echo -e "${BLUE}[ ... ]  Database connect hone ka intezaar...${NC}"
for i in {1..20}; do
    if grep -q "MongoDB connected" "$ROOT/backend.log" 2>/dev/null; then
        echo -e "${GREEN}[ OK ]  Backend connected!${NC}"
        break
    fi
    if grep -q "connection error" "$ROOT/backend.log" 2>/dev/null; then
        echo ""
        echo -e "${RED}[ X ]  Database connect nahi hua. Aam wajah:${NC}"
        echo "       - backend/.env mein MongoDB string galat hai, YA"
        echo "       - Atlas mein IP allow nahi (0.0.0.0/0), YA"
        echo "       - wifi port block kar rahi (mobile hotspot try karo)"
        echo ""
        echo "       Detail ke liye:  cat backend.log"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    sleep 1
done
echo ""

# ---- Step 6: frontend chalao + browser kholo ----
echo -e "${GREEN}================================================================${NC}"
echo -e "${GREEN}   Sab chalu ho gaya!${NC}"
echo -e "${GREEN}   App khul rahi hai:  ${YELLOW}http://localhost:5174${NC}"
echo -e "${GREEN}   Band karne ke liye:  is terminal mein Ctrl+C dabao${NC}"
echo -e "${GREEN}================================================================${NC}"
echo ""

# browser 5 sec baad khol do
( sleep 5 && xdg-open http://localhost:5174 >/dev/null 2>&1 ) &

# backend band karne ke liye trap (Ctrl+C pe)
trap "echo ''; echo 'Band kar rahe hai...'; kill $BACKEND_PID 2>/dev/null; exit 0" INT

# frontend foreground mein chalao
cd frontend && npm run dev
