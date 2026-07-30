import { ApiError, toApiError } from '../api-error';

describe('api error', () => {
  it('preserves structured backend error fields', () => {
    const error = ApiError.fromResult({
      code: 500,
      message: 'Content generation failed',
      errorCode: 'TS.STORY.GENERATION.FAILED',
      errorCategory: 'PROVIDER',
      retryable: true,
      errorArgs: {
        scene: 'opening',
      },
    });

    expect(error).toMatchObject({
      message: 'Content generation failed',
      code: 500,
      errorCode: 'TS.STORY.GENERATION.FAILED',
      errorCategory: 'PROVIDER',
      retryable: true,
      errorArgs: {
        scene: 'opening',
      },
    });
  });

  it('extracts structured fields from an axios-style error', () => {
    const error = toApiError({
      response: {
        data: {
          code: 500,
          message: 'Invalid tool arguments',
          errorCode: 'AGENT.TOOL.COMMON.ARGUMENT_INVALID',
          errorCategory: 'VALIDATION',
          retryable: false,
          errorArgs: {
            field: 'transferData',
          },
        },
      },
    });

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      errorCode: 'AGENT.TOOL.COMMON.ARGUMENT_INVALID',
      errorCategory: 'VALIDATION',
      retryable: false,
      errorArgs: {
        field: 'transferData',
      },
    });
  });
});
