import type { ApiResult } from '@/lib/api/types';
import i18n from 'i18next';
import { toApiError } from '@/lib/api/api-error';

type ApiMessageData = Pick<
  ApiResult,
  'message' | 'messageCode' | 'errorCode' | 'errorCategory' | 'retryable' | 'errorArgs'
>;

const SUCCESS_KEYS: Array<[string, string]> = [
  ['BATCH_DELETE.SUCCESS', 'batchDeleteSuccess'],
  ['UNPUBLISH.SUCCESS', 'unpublishSuccess'],
  ['PUBLISH.SUCCESS', 'publishSuccess'],
  ['GENERATE.SUCCESS', 'generateSuccess'],
  ['OPERATION.SUCCESS', 'operationSuccess'],
  ['CREATE.SUCCESS', 'createSuccess'],
  ['UPDATE.SUCCESS', 'updateSuccess'],
  ['DELETE.SUCCESS', 'deleteSuccess'],
  ['SAVE.SUCCESS', 'saveSuccess'],
  ['ENABLE.SUCCESS', 'enableSuccess'],
  ['DISABLE.SUCCESS', 'disableSuccess'],
  ['COPY.SUCCESS', 'copySuccess'],
  ['IMPORT.SUCCESS', 'importSuccess'],
  ['UPLOAD.SUCCESS', 'uploadSuccess'],
  ['SUBMIT.SUCCESS', 'submitSuccess'],
  ['APPROVE.SUCCESS', 'approveSuccess'],
  ['REJECT.SUCCESS', 'rejectSuccess'],
];

const ERROR_KEYS: Array<[string, string]> = [
  ['NOT_FOUND_OR_FORBIDDEN', 'notFoundOrForbidden'],
  ['REQUIRED_FIELD_MISSING', 'requiredFieldMissing'],
  ['INVALID_ASPECT_RATIO', 'invalidAspectRatio'],
  ['CONTENT_SENSITIVE', 'contentSensitive'],
  ['TOOL_SCHEMA_INVALID', 'toolSchemaInvalid'],
  ['MODEL_NOT_CONFIGURED', 'modelNotConfigured'],
  ['MODEL_UNAVAILABLE', 'modelUnavailable'],
  ['APP_ID_REQUIRED', 'appIdRequired'],
  ['FIELD_TOO_LONG', 'fieldTooLong'],
  ['LOGIN_REQUIRED', 'loginRequired'],
  ['USER_INPUT_EMPTY', 'userInputEmpty'],
  ['EMPTY_RESPONSE', 'emptyResponse'],
  ['OPTION.EXPIRED', 'optionExpired'],
  ['OPTION.UNSUPPORTED', 'optionUnsupported'],
  ['ROLE_RESULT_INVALID', 'roleResultInvalid'],
  ['ROLE_INVALID', 'roleInvalid'],
  ['RESOURCE.IN_USE', 'resourceInUse'],
  ['RESOURCE.CONFLICT', 'conflict'],
  ['INVALID_ARGUMENT', 'invalidArgument'],
  ['PARAMETER_INVALID', 'invalidArgument'],
  ['REQUEST_INVALID', 'invalidArgument'],
  ['ARGUMENT_INVALID', 'invalidArgument'],
  ['NOT_FOUND', 'notFound'],
  ['SAVE_FAILED', 'saveFailed'],
  ['EXECUTION_FAILED', 'executionFailed'],
  ['GENERATION.FAILED', 'generationFailed'],
  ['UNEXPECTED_ERROR', 'unexpectedError'],
  ['REQUEST.FAILED', 'requestFailed'],
];

const CATEGORY_KEYS: Record<string, string> = {
  AUTH: 'loginRequired',
  AUTHORIZATION: 'notFoundOrForbidden',
  CONFIGURATION: 'configurationError',
  CONTENT_POLICY: 'contentSensitive',
  CONTENT_SAFETY: 'contentSensitive',
  EXTERNAL_SERVICE: 'externalServiceError',
  LLM: 'modelUnavailable',
  NOT_FOUND: 'notFound',
  PERSISTENCE: 'saveFailed',
  PROVIDER: 'externalServiceError',
  RUNTIME: 'executionFailed',
  SYSTEM: 'unexpectedError',
  TOOL: 'executionFailed',
  VALIDATION: 'invalidArgument',
};

function resolveCodeKey(
  code: string | undefined,
  entries: Array<[string, string]>,
) {
  const normalized = code?.trim().toUpperCase();
  if (!normalized) {
    return undefined;
  }
  return entries.find(([suffix]) => normalized.endsWith(suffix))?.[1];
}

function translateKey(key: string | undefined, args?: Record<string, unknown>) {
  if (!key) {
    return undefined;
  }
  const resourceKey = `apiMessages.${key}`;
  if (!i18n.exists(resourceKey)) {
    return undefined;
  }
  return i18n.t(resourceKey, args || {});
}

export function resolveApiSuccessMessage(
  data: Partial<ApiMessageData> | undefined,
  fallback?: string,
) {
  const key = resolveCodeKey(data?.messageCode, SUCCESS_KEYS);
  return translateKey(key) || data?.message || fallback;
}

export function resolveApiErrorMessage(error: unknown, fallback?: string) {
  const apiError = toApiError(error, fallback);
  const codeKey = resolveCodeKey(apiError.errorCode, ERROR_KEYS);
  const categoryKey = apiError.errorCategory
    ? CATEGORY_KEYS[apiError.errorCategory.trim().toUpperCase()]
    : undefined;
  const translated = translateKey(codeKey || categoryKey, apiError.errorArgs);
  if (translated) {
    return translated;
  }
  if (!apiError.errorCode && !apiError.errorCategory && fallback) {
    return fallback;
  }
  return apiError.message
    || fallback
    || i18n.t('apiMessages.requestFailed');
}

export function localizeApiError(error: unknown, fallback?: string) {
  const apiError = toApiError(error, fallback);
  apiError.message = resolveApiErrorMessage(apiError, fallback);
  return apiError;
}
