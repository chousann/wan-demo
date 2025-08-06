# WebAuthn 认证演示应用

这是一个使用 Angular 和 Node.js 实现的 WebAuthn 认证演示应用。

## 项目结构

```
webauthn-demo/
├── backend/          # Node.js 后端服务
└── frontend/         # Angular 前端应用
```

## 后端 (Node.js)

### 安装依赖

```bash
cd backend
npm install
```

### 启动后端服务

```bash
npm start
# 或者开发模式
npm run dev
```

服务将在 http://localhost:3000 上运行

## 前端 (Angular)

### 安装依赖

```bash
cd frontend
npm install
```

### 启动前端应用

```bash
npm start
# 或者
ng serve
```

应用将在 http://localhost:4200 上运行

## 使用说明

1. 启动后端服务
2. 启动前端应用
3. 在浏览器中访问 http://localhost:4200
4. 输入用户名进行注册或登录

### 注册流程

1. 输入用户名
2. 点击"注册"按钮
3. 根据浏览器提示完成身份验证器注册（如指纹、面部识别或安全密钥）

### 登录流程

1. 输入已注册的用户名
2. 点击"登录"按钮
3. 根据浏览器提示完成身份验证

## 常见问题解决

### TypeScript编译错误

如果遇到以下错误:
- `Module build failed: Error: [path] is missing from the TypeScript compilation`
- `Property 'verified' does not exist on type 'Observable<any>'`
- 类型冲突错误

请确保:
1. 所有TypeScript文件都正确配置在tsconfig中
2. 正确处理Observable类型的返回值
3. 添加了必要的类型依赖

### Node.js类型冲突

如果遇到Node.js类型冲突错误，请检查tsconfig.json配置，确保添加了:
```json
"skipLibCheck": true
```

### JSON语法错误

如果遇到类似 `tsconfig.json:1:1 - error TS1005: '{' expected.` 的错误，这表示JSON文件格式有误。请检查：
1. 确保JSON文件以有效的注释或对象开始
2. 确保所有括号正确匹配
3. 确保没有多余的字符

### Base64编码错误

如果遇到 `InvalidCharacterError: Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.` 错误，这是因为WebAuthn使用的是base64url编码而不是标准的base64编码。

我们已经通过以下方式解决：
1. 实现了base64url到base64的转换函数
2. 添加了正确的填充处理
3. 在编码和解码过程中正确处理特殊字符

## 注意事项

- 此演示应用使用内存存储用户数据，重启服务后数据将丢失
- 需要使用支持 WebAuthn 的现代浏览器（Chrome、Firefox、Edge等）
- 在生产环境中，需要使用 HTTPS 协议
- 当前实现是演示用途，实际生产环境需要更强的安全措施
- WebAuthn要求使用localhost或HTTPS域名