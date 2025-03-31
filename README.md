# CS5610_FP

# Run API server (from /api directory)

cd ./api
npm install
npx prisma migrate dev --name init
npm run dev

# Run Client (from /client directory)

cd ./client
npm install
npm start

# Test /ping endpoint (optional)

curl http://localhost:3000/ping
