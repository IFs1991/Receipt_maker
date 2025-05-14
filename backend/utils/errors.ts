/**
 * HTTPエラーを表すカスタムエラークラス
 * ステータスコードとメッセージを含みます
 */
export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'HttpError';
  }
}

/**
 * エラーレスポンスのための標準形式
 * エラーメッセージとオプションのエラー詳細を含みます
 */
export interface ErrorResponse {
  message: string;
  details?: any;
  statusCode: number;
}

/**
 * エラーレスポンスを生成するためのユーティリティ関数
 */
export function createErrorResponse(statusCode: number, message: string, details?: any): ErrorResponse {
  return {
    message,
    details,
    statusCode
  };
}