import fs from 'fs';
import path from 'path';

export interface SaveRequest {
  content: string;
  fileName: string;
}

export interface SaveResponse {
  success: boolean;
  message: string;
  filePath?: string;
}

export class FileSaveService {
  private saveDirectory: string;

  constructor(saveDirectory: string = './saved-files') {
    this.saveDirectory = path.resolve(saveDirectory);
    this.ensureDirectoryExists();
  }

  /**
   * 确保保存目录存在
   */
  private ensureDirectoryExists(): void {
    if (!fs.existsSync(this.saveDirectory)) {
      fs.mkdirSync(this.saveDirectory, { recursive: true });
    }
  }

  /**
   * 保存文件
   * @param content 文件内容
   * @param fileName 文件名称
   * @returns 保存结果
   */
  saveFile(content: string, fileName: string): SaveResponse {
    try {
      // 防止路径遍历攻击
      const safeFileName = path.basename(fileName);
      const filePath = path.join(this.saveDirectory, safeFileName);

      // 写入文件
      fs.writeFileSync(filePath, content, 'utf-8');

      return {
        success: true,
        message: `文件 "${safeFileName}" 保存成功`,
        filePath: filePath
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return {
        success: false,
        message: `保存失败: ${errorMessage}`
      };
    }
  }

  /**
   * 获取保存目录路径
   */
  getSaveDirectory(): string {
    return this.saveDirectory;
  }
}
