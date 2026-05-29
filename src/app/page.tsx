import { getSheetData } from '@/lib/sheets'
import { AppClient } from '@/components/AppClient'

export default async function Home() {
  const posts = await getSheetData()
  return <AppClient posts={posts} />
}
