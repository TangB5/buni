'use client';

import { useMutation }
  from '@tanstack/react-query';

import { featurePattern }
  from '../usecases/feature-pattern.usecase';

export function useFeaturePattern() {

  return useMutation({

    mutationFn: featurePattern,
  });
}