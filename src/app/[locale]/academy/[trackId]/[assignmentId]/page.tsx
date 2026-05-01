import { getAssignment, getTrack, TRACKS } from '@/lib/academy/tracks'
import { notFound } from 'next/navigation'
import AssignmentScorer from '@/components/academy/AssignmentScorer'

export function generateStaticParams() {
  return TRACKS.flatMap(t => t.assignments.map(a => ({ trackId: t.id, assignmentId: a.id })))
}

export default function AssignmentPage({ params }: { params: { trackId: string; assignmentId: string } }) {
  const track = getTrack(params.trackId)
  const assignment = getAssignment(params.trackId, params.assignmentId)
  if (!track || !assignment) notFound()

  return <AssignmentScorer track={track} assignment={assignment} />
}
