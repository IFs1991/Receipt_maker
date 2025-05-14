"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReasonDisplay() {
  const [copied, setCopied] = useState(false)

  // Sample AI-generated reason text
  const reasonText = `
患者は45歳男性、2週間前から徐々に悪化する腰痛と右下肢のしびれを主訴に来院されました。

【傷病の状態】
・腰部に持続的な鈍痛があり、長時間の座位で増悪
・右下肢外側に放散痛としびれ感が出現
・前屈時に疼痛が増強し、日常生活動作に支障をきたしている
・夜間痛により睡眠の質が低下

【検査所見】
・SLRテスト：右側30度で陽性
・腰椎可動域制限：前屈30度、後屈10度で疼痛あり
・右L5神経支配領域の知覚鈍麻

【診断】
腰椎椎間板ヘルニア（L4/5）による神経根症状

【治療の必要性】
上記の症状および所見から、継続的な理学療法による疼痛管理と機能回復が必要です。保存的治療を行いながら経過観察し、症状の改善が見られない場合は、画像診断による精査を検討します。

【治療計画】
・疼痛緩和のための物理療法
・腰部安定化エクササイズ指導
・日常生活動作の指導と環境調整
・週2回の通院による経過観察

以上の理由から、本患者に対する継続的な治療が必要と判断します。
  `.trim()

  const handleCopy = () => {
    navigator.clipboard.writeText(reasonText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>AI生成理由書ドラフト</CardTitle>
          <CardDescription>AIが生成した理由書のドラフトです</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy} className={copied ? "bg-green-100" : ""}>
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              コピー完了
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              コピー
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-md whitespace-pre-line text-sm">{reasonText}</div>
      </CardContent>
    </Card>
  )
}
