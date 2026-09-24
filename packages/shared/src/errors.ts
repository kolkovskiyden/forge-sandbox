import { z } from 'zod';

export const ErrorCode = z.enum([
  'name_required',
  'name_too_long',
  'duplicate_name',
  'invalid_request',
  'not_found',
  'internal_error',
]);
export type ErrorCode = z.infer<typeof ErrorCode>;

/** The one error shape every API error response uses. */
export const ErrorResponse = z.object({
  error: z.object({
    code: ErrorCode,
    message: z.string(),
  }),
});
export type ErrorResponse = z.infer<typeof ErrorResponse>;

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  name_required: 'Enter a name for the Task.',
  name_too_long: 'Keep the name to 100 characters or fewer.',
  duplicate_name: 'An open Task with this name already exists.',
  invalid_request: 'The request was not understood.',
  not_found: 'This Task no longer exists.',
  internal_error: 'Something went wrong on the server.',
};
