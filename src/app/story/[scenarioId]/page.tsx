import { notFound } from 'next/navigation';

import { getScenario } from '@/data/scenarios';
import { StoryPlayer } from '@/features/story/components/StoryPlayer';

type Props = { params: Promise<{ scenarioId: string }> };

/**
 * Full-viewport player route — deliberately outside AppShell so the video
 * surface owns the screen and the bottom nav does not compete with choices.
 */
export default async function StoryPlayPage({ params }: Props) {
  const { scenarioId } = await params;
  const scenario = getScenario(scenarioId);
  if (!scenario) notFound();
  return <StoryPlayer scenario={scenario} />;
}
