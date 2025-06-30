import { catchError } from 'rxjs/operators';
import { of, OperatorFunction, throwError } from 'rxjs';
import { ErrorService } from '../services/error.service';

export function handleError<T>(
  errorService: ErrorService,
  context: string = '',
  fallback: T | null = null
): OperatorFunction<T, T> {
  return catchError((err: unknown) => {
    errorService.handle(err, context);
    return fallback !== null ? of(fallback) : throwError(() => err);
  });
}
