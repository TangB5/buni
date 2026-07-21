import { patternRepository } from '../repositories/pattern.repository';
import { toFormData, toCreatePayload, toUpdatePayload } from '../mappers/pattern.mapper';
import type { Pattern, Step1Data, Step2Data, Step3Data} from '../types';
import { PatternSymbol } from '@buni/patterns';

export class UpdatePatternError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly fieldErrors?: Record<string, string>
  ) {
    super(message);
    this.name = 'UpdatePatternError';
  }
}

export async function updatePattern(
  id: string,
  step1: Step1Data,
  step2: Step2Data,
  step3: Step3Data,
  svgFile: File | null,
  symbols: PatternSymbol[],
  existingSymbols?: PatternSymbol[]
): Promise<Pattern> {
  try {
    const payload = toUpdatePayload(step1, step2, step3, existingSymbols);
    const formData = toFormData(payload, svgFile, symbols);

    return await patternRepository.update(id, formData);
  } catch (error) {
    console.error('Failed to update pattern:', error);
    throw error;
  }
}
