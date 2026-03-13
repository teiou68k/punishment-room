// 修正後のインポート文
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
// ここを esm.sh から npm: に変更します
import webpush from "npm:web-push@3.6.6" 

serve(async (req) => {  const { record } = await req.json()

  // SYSTEMによる「入室しました」の時だけ実行
  if (record.username !== 'SYSTEM' || !record.content.includes('入室しました')) {
    return new Response('Skip', { status: 200 })
  }

  const publicKey = Deno.env.get('VAPID_PUBLIC_KEY')!
  const privateKey = Deno.env.get('VAPID_PRIVATE_KEY')!
  
  // 送信元メールアドレス（形式だけでOK）
  webpush.setVapidDetails('mailto:admin@example.com', publicKey, privateKey)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // 配信先リストを取得
  const { data: subs } = await supabase.from('push_subscriptions').select('subscription')

  const promises = subs?.map((s) => 
    webpush.sendNotification(s.subscription, JSON.stringify({
      title: '調教部屋',
      body: record.content
    })).catch(err => console.error('Send error:', err))
  )

  await Promise.all(promises || [])
  return new Response('Sent', { status: 200 })
})