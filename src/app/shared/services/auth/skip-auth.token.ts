import { HttpContextToken } from '@angular/common/http';

/**
 * Per-request opt-out of the auth interceptor.
 * `new HttpContext().set(SKIP_AUTH, true)` on a request means:
 *  - no Authorization header is attached
 *  - a 401 will NOT trigger the refresh-retry flow
 */
export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);
