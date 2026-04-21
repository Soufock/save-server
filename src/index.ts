import express, { Request, Response } from 'express';
import { FileSaveService } from './file-save.service';

const app = express();
const port = 3000;

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 初始化文件保存服务
const fileService = new FileSaveService('./saved-files');

/**
 * POST /save
 * 保存文件
 * Body: { content: string, fileName: string }
 */
app.post('/save', (req: Request, res: Response) => {
  const { content, fileName }: { content: string; fileName: string } = req.body;

  // 参数验证
  if (!content || !fileName) {
    res.status(400).json({
      success: false,
      message: '缺少必要参数: content 和 fileName'
    });
    return;
  }

  const result = fileService.saveFile(content, fileName);
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

/**
 * GET /health
 * 健康检查
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: '服务运行正常' });
});

/**
 * GET /check/:fileName
 * 检查文件是否存在
 */
app.get('/check/:fileName', (req: Request, res: Response) => {
  const fileName = req.params.fileName as string;

  const result = fileService.checkFileExists(fileName);
  res.status(200).json(result);
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器已启动: http://localhost:${port}`);
  console.log(`文件保存目录: ${fileService.getSaveDirectory()}`);
});

export default app;
