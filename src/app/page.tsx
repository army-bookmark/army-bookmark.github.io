import { getSheetData } from '@/lib/sheets'
import { AppClient } from '@/components/AppClient'

export const revalidate = 300 // ISR: revalidate every 5 min

export default async function Home() {
  const posts = await getSheetData()
  return <AppClient posts={posts} />
}
