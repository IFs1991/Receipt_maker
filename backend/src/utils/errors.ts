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

/**
 * バリデーションエラークラス
 * フォームなどの入力バリデーションエラーを表現するクラス
 */
export class ValidationError extends HttpError {
  details: Record<string, string[]>;

  constructor(message: string, details: Record<string, string[]>) {
    super(400, message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

/**
 * 認証エラークラス
 * 認証に関連するエラーを表現するクラス
 */
export class AuthenticationError extends HttpError {
  constructor(message: string = '認証に失敗しました') {
    super(401, message);
    this.name = 'AuthenticationError';
  }
}

/**
 * 認可エラークラス
 * 権限に関連するエラーを表現するクラス
 */
export class AuthorizationError extends HttpError {
  constructor(message: string = 'この操作を行う権限がありません') {
    super(403, message);
    this.name = 'AuthorizationError';
  }
}

/**
 * リソース未発見エラークラス
 * 要求されたリソースが見つからない場合のエラーを表現するクラス
 */
export class NotFoundError extends HttpError {
  constructor(resource: string = 'リソース') {
    super(404, `${resource}が見つかりません`);
    this.name = 'NotFoundError';
  }
}

/**
 * 内部サーバーエラークラス
 * サーバー内部のエラーを表現するクラス
 */
export class InternalServerError extends HttpError {
  constructor(message: string = '内部サーバーエラーが発生しました') {
    super(500, message);
    this.name = 'InternalServerError';
  }
}