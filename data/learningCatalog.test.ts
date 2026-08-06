import { describe, expect, it } from 'vitest';
import { LEARNING_DESTINATIONS, searchLearningDestinations } from './learningCatalog';

describe('learning catalog navigation', () => {
  it('indexes only the two approved course paths', () => {
    expect(LEARNING_DESTINATIONS).toHaveLength(17);
    expect(JSON.stringify(LEARNING_DESTINATIONS)).not.toMatch(/population|radioactive|biotech|differential equations/i);
  });

  it('returns lesson destinations', () => {
    expect(searchLearningDestinations('eigen')[0].destination).toEqual({
      section: 'lesson',
      courseId: 'linear-algebra-geometry',
      topicId: 'eigenvalues-eigenvectors',
    });
  });
});
