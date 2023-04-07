import { ContainerError } from './ContainerError';

export default class UnknownIdError extends Error implements ContainerError {
  constructor(id: string) {
    super(`Id "${id}" is not defined.`);
  }
}
