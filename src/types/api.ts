export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success: false;
  message: string;
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;
