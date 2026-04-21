# Save Server

一个基于 Express + TypeScript 构建的轻量级文件保存服务，提供 HTTP API 接口用于接收字符串内容并将其保存为文件。

## 目录

- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
  - [环境要求](#环境要求)
  - [安装依赖](#安装依赖)
  - [构建项目](#构建项目)
  - [启动服务](#启动服务)
- [API 文档](#api-文档)
  - [保存文件](#保存文件)
  - [健康检查](#健康检查)
- [配置说明](#配置说明)
- [安全机制](#安全机制)
- [开发指南](#开发指南)
- [常见问题](#常见问题)

## 功能特性

- 接收字符串内容并保存为文件
- 支持自定义文件名称
- 自动创建保存目录
- 路径遍历攻击防护
- 参数验证与错误处理
- 健康检查接口
- TypeScript 类型安全

## 技术栈

| 类别 | 技术 |
|------|------|
| 运行时 | Node.js |
| 语言 | TypeScript |
| Web 框架 | Express.js 5.x |
| 类型定义 | @types/node, @types/express |

## 项目结构

```
save-server/
├── src/
│   ├── file-save.service.ts    # 文件保存核心服务
│   └── index.ts                # Express 服务器入口
├── saved-files/                # 保存的文件存放目录（运行时自动创建）
├── dist/                       # TypeScript 编译输出
├── package.json                # 项目配置与依赖
├── tsconfig.json               # TypeScript 编译配置
├── .gitignore                  # Git 忽略规则
└── README.md                   # 项目文档
```

## 快速开始

### 环境要求

- Node.js >= 18.x
- npm >= 9.x

### 安装依赖

```bash
npm install
```

### 构建项目

```bash
npm run build
```

构建完成后，编译后的 JavaScript 文件将输出到 `dist/` 目录。

### 启动服务

**生产模式：**

```bash
npm start
```

**开发模式（文件变更自动重启）：**

```bash
npm run dev
```

服务默认启动在 `http://localhost:3000`。

## API 文档

### 保存文件

**请求**

```
POST /save
Content-Type: application/json
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 是 | 要保存的文件内容 |
| fileName | string | 是 | 文件名称（包含扩展名） |

**请求示例**

```bash
curl -X POST http://localhost:3000/save \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello, World!",
    "fileName": "hello.txt"
  }'
```

**成功响应 (200)**

```json
{
  "success": true,
  "message": "文件 \"hello.txt\" 保存成功",
  "filePath": "C:\\Users\\Administrator\\Desktop\\save-server\\saved-files\\hello.txt"
}
```

**失败响应 (400)**

```json
{
  "success": false,
  "message": "缺少必要参数: content 和 fileName"
}
```

**失败响应 (500)**

```json
{
  "success": false,
  "message": "保存失败: <错误信息>"
}
```

### 健康检查

**请求**

```
GET /health
```

**响应 (200)**

```json
{
  "status": "ok",
  "message": "服务运行正常"
}
```

## 配置说明

### 修改端口

编辑 `src/index.ts` 中的 `port` 变量：

```typescript
const port = 3000; // 修改为你想要的端口
```

### 修改保存目录

编辑 `src/index.ts` 中创建 `FileSaveService` 实例时的参数：

```typescript
const fileService = new FileSaveService('./your-custom-dir');
```

或者在 `file-save.service.ts` 中修改默认值：

```typescript
constructor(saveDirectory: string = './your-custom-dir') {
```

## 安全机制

### 路径遍历攻击防护

服务使用 `path.basename()` 提取文件名，防止恶意用户通过 `../` 等方式访问非预期目录。例如：

```
输入: "../../etc/passwd"
实际保存为: "passwd"
```

### 参数验证

所有接口均会对请求参数进行验证，缺少必要参数时返回 400 错误。

## 开发指南

### 添加新接口

在 `src/index.ts` 中添加路由：

```typescript
app.get('/your-route', (req: Request, res: Response) => {
  res.json({ message: 'Hello' });
});
```

### 扩展文件保存服务

在 `src/file-save.service.ts` 中添加新方法：

```typescript
// 示例：追加内容到文件
appendToFile(content: string, fileName: string): SaveResponse {
  // 实现逻辑
}
```

## 常见问题

**Q: 保存的文件在哪里？**

A: 默认保存在项目根目录下的 `saved-files/` 文件夹中。

**Q: 支持保存二进制文件吗？**

A: 当前版本仅支持文本内容（UTF-8 编码），如需支持二进制文件需要修改 `file-save.service.ts` 中的写入逻辑。

**Q: 如何批量保存多个文件？**

A: 可以循环调用 `/save` 接口，或者自行扩展批量保存接口。

## License

ISC
