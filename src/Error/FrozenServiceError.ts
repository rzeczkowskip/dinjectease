import { ContainerError } from './ContainerError';

export default class FrozenServiceError extends Error implements ContainerError {
  constructor(id: string) {
    super(`Cannot override frozen service "${id}".`);
  }
}
