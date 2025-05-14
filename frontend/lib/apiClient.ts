import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// APIクライアントの基本設定
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

// APIクライアントクラス
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // リクエストインターセプター：認証トークンの自動付与
    this.client.interceptors.request.use(
      (config) => {
        // LocalStorageからトークンを取得
        const token = typeof window !== 'undefined' ? localStorage.getItem('firebaseIdToken') : null;

        // トークンが存在する場合、ヘッダーに追加
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // レスポンスインターセプター：共通エラーハンドリング
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // 認証エラー (401) の場合、ログインページにリダイレクト
        if (error.response?.status === 401) {
          // ログインページへリダイレクト
          if (typeof window !== 'undefined') {
            localStorage.removeItem('firebaseIdToken');
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // GET リクエスト
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // POST リクエスト
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // PUT リクエスト
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // DELETE リクエスト
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // エラーハンドリング
  private handleError(error: any): never {
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data;
      // エラーメッセージをコンソールに記録
      console.error('APIエラー:', serverError);
    } else {
      console.error('予期せぬエラー:', error);
    }
    throw error;
  }
}

// シングルトンインスタンスをエクスポート
const apiClient = new ApiClient();
export default apiClient;