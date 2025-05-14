"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import apiClient from "@/lib/apiClient"
import { Loader2 } from "lucide-react"
import { SimilarCase } from "@/types/form-types"

export default function SimilarCasesDisplay() {
  const [similarCases, setSimilarCases] = useState<SimilarCase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSimilarCases = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await apiClient.get<SimilarCase[]>('/similar-cases')
        setSimilarCases(data)
      } catch (err: any) {
        console.error('類似事例の取得に失敗しました:', err)
        setError(err.message || '類似事例の取得中にエラーが発生しました')
        // エラー時はデモデータを表示
        setSimilarCases([
          {
            id: "1",
            symptoms: "腰痛、右下肢のしびれ",
            keyPoints: "腰椎椎間板ヘルニアによる神経根症状。保存的治療の必要性と具体的な治療計画が明確に記載されていた。",
          },
          {
            id: "2",
            symptoms: "頚部痛、左上肢の放散痛",
            keyPoints: "頚椎症による神経根症状。症状の詳細な記載と日常生活への影響が具体的に説明されていた。",
          },
          {
            id: "3",
            symptoms: "膝関節痛、歩行困難",
            keyPoints: "変形性膝関節症。疼痛の性質と日常生活動作の制限について具体的に記載されていた。",
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSimilarCases()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>類似承認事例</CardTitle>
        <CardDescription>過去に承認された類似事例を参考にしてください</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded text-red-700 text-sm">
            {error}
          </div>
        ) : similarCases.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            類似事例が見つかりませんでした
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {similarCases.map((caseItem) => (
              <AccordionItem key={caseItem.id} value={caseItem.id}>
                <AccordionTrigger className="text-left">
                  <div className="font-medium">{caseItem.symptoms}</div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">承認ポイント:</h4>
                    <p className="text-sm text-gray-700">{caseItem.keyPoints}</p>
                    {caseItem.approvalCategory && (
                      <div className="text-xs text-gray-500 mt-1">
                        <span className="font-medium">カテゴリ:</span> {caseItem.approvalCategory}
                      </div>
                    )}
                    {caseItem.ageRange && (
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">年齢層:</span> {caseItem.ageRange}歳
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  )
}
