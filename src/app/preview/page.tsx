import { getSheetData } from '@/lib/sheets'
import { PreviewClient } from '@/components/PreviewClient'

export default async function PreviewPage() {
  const cards = await getSheetData()
  return <PreviewClient cards={cards} />
}
