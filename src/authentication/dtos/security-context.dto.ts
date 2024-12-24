export class SecurityContextDto {
  contextId: string;
  roles: Array<string>;
  originalContextId: string;

  constructor(
    contextId: string,
    roles: Array<string>,
    originalContextId: string,
  ) {
    this.contextId = contextId;
    this.roles = roles;
    this.originalContextId = originalContextId;
  }
}
