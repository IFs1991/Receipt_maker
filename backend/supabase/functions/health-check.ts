// Supabase Edge Function health check
// デプロイと動作確認用のシンプルなエンドポイント

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  const { method } = req;

  // GETメソッドのみ許可
  if (method !== "GET") {
    return new Response(
      JSON.stringify({
        error: "Method not allowed",
      }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // 現在のタイムスタンプを返す
  const timestamp = new Date().toISOString();

  // レスポンスオブジェクトを構築
  const data = {
    status: "ok",
    message: "Supabase Edge Function is working!",
    timestamp,
    service: "receipt-assistant-backend",
    version: "1.0.0",
  };

  // JSONレスポンスを返す
  return new Response(
    JSON.stringify(data),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      },
    }
  );
});