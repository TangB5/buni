import { patternRepository } from '../repositories/pattern.repository';
import { toFormData, toCreatePayload } from '../mappers/pattern.mapper';
import type { Pattern, Step1Data, Step2Data, Step3Data} from '../types';
import { PatternSymbol } from '@buni/patterns';

export class CreatePatternError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly fieldErrors?: Record<string, string>
  ) {
    super(message);
    this.name = 'CreatePatternError';
  }
}

export async function createPattern(
  step1: Step1Data,
  step2: Step2Data,
  step3: Step3Data,
  svgFile: File | null,
  symbols: PatternSymbol[]
): Promise<Pattern> {
  try {
    const payload = toCreatePayload(step1, step2, step3);
    const formData = toFormData(payload, svgFile, symbols);

    return await patternRepository.create(formData);
  } catch (error) {
    console.error('Failed to create pattern:', error);
    throw error;
  }
}
