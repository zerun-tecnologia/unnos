import { CreateMatchForm } from '@/components/create-match/create-match-form'
import { CreateMatchHeader } from '@/components/create-match/create-match-header'
import { CreateMatchInfoCard } from '@/components/create-match/create-match-info-card'
import { PageTransition } from '@/components/transitions'

export default function CreateMatch() {
  return (
    <PageTransition>
      <div className="py-8 max-w-3xl mx-auto">
        <CreateMatchHeader />
        <CreateMatchForm />
        <CreateMatchInfoCard />
      </div>
    </PageTransition>
  )
}
