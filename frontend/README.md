# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Git workflow (Chuẩn dự án thực tế)

### Khởi tạo Git và kết nối với GitHub

```bash
git init
git remote add origin https://github.com/<your-username>/<your-repo>.git
```

### Quy trình làm việc với branch

```bash
# Luôn cập nhật branch chính mới nhất
git checkout main
git pull origin main

# Tạo branch mới cho từng tính năng/bugfix
git checkout -b feature/ten-tinh-nang
# hoặc
git checkout -b fix/ten-bug

# Sau khi sửa code, commit thay đổi
git add .
git commit -m "feat: mô tả ngắn gọn tính năng" # hoặc "fix: mô tả bugfix"

# Đẩy branch lên GitHub
git push -u origin feature/ten-tinh-nang
# hoặc
git push -u origin fix/ten-bug
```

### Tạo Pull Request (PR)

- Vào GitHub, tạo Pull Request từ branch vừa push lên vào branch chính (`main` hoặc `develop`).
- Reviewer sẽ review, sau đó merge nếu đạt yêu cầu.

### Sau khi merge PR

```bash
git checkout main
git pull origin main
git branch -d feature/ten-tinh-nang # Xoá branch local nếu không cần nữa
```

---

**Lưu ý:**  
- Luôn làm việc trên branch riêng, không commit trực tiếp lên `main`.
- Đặt tên branch theo chuẩn: `feature/ten-tinh-nang`, `fix/ten-bug`, `hotfix/...`
- Commit message nên rõ ràng, dùng prefix: `feat:`, `fix:`, `chore:`, `docs:`, v.v.

---
