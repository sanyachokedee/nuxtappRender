# เลือก image ที่เราต้องการใช้ ในที่นี้เราใช้ node:20
FROM node:18-alpine

# กำหนด directory ที่เราจะใช้เก็บโค้ดของเรา
WORKDIR /NuxtApp/app

# คัดลอกไฟล์ package.json และ package-lock.json ไปยัง container
#COPY package*.json ./

# คัดลอกโค้ดของเราไปยัง container
COPY . .

# ติดตั้ง dependencies ที่เราใช้
RUN npm install

# Build โค้ดของเรา
RUN npm run build

# กำหนด port ที่เราจะใช้
EXPOSE 3000

# คำสั่งรัน Application Nuxt
# CMD [ "npm", "run", "preview" ]
CMD ["node", ".output/server/index.mjs"]