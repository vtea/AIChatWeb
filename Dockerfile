# docker build -t nanjiren01/aichat-web:0.8 .
# docker push nanjiren01/aichat-web:0.8
# docker tag nanjiren01/aichat-web:0.8 nanjiren01/aichat-web:latest
# docker push nanjiren01/aichat-web:latest

# 需要先在本地执行yarn install && yarn build
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/server ./.next/server

ENV BASE_URL=http://aichat-admin:8080

EXPOSE 3000

CMD node /app/server.js
