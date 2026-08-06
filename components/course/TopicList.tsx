import React from 'react';
import { Check, LockKeyhole } from 'lucide-react';
import { CourseDefinition, TopicDefinition, TopicId } from '../../domain/curriculum';

interface TopicListProps { course: CourseDefinition; completedTopicIds: TopicId[]; onSelect: (topic: TopicDefinition) => void; }

export const TopicList: React.FC<TopicListProps> = ({ course, completedTopicIds, onSelect }) => (
  <ol className="space-y-3">
    {course.topics.map((topic, index) => {
      const complete = completedTopicIds.includes(topic.id);
      const locked = !complete && !topic.prerequisites.every((id) => completedTopicIds.includes(id));
      return <li key={topic.id}><button className="focus-ring notebook-panel flex w-full items-center gap-4 p-4 text-left disabled:cursor-not-allowed disabled:opacity-65" disabled={locked} onClick={() => onSelect(topic)} aria-label={`${topic.title}${locked ? ', prerequisites incomplete' : ''}`}><span className={`flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${complete ? 'border-emerald-300/40 bg-emerald-300/10 text-emerald-200' : locked ? 'border-slate-600 text-slate-500' : 'border-cyan-300/40 text-cyan-200'}`}>{complete ? <Check size={17} /> : locked ? <LockKeyhole size={15} /> : index + 1}</span><span className="min-w-0 flex-1"><span className="block font-semibold text-white">{topic.title}</span><span className="mt-1 block text-sm text-slate-400">{topic.description}</span></span><span className="text-xs text-slate-500">{topic.estimatedStudyMinutes} min</span></button></li>;
    })}
  </ol>
);
