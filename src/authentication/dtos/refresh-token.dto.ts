export class RefreshTokenDto {
  id: string;
  userContextsId: string;
  token: string;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(row: any) {
    this.id = row.id;
    this.userContextsId = row.userContextsId;
    this.token = row.token;
    this.expiresAt = row.expiresAt;
    this.isRevoked = row.isRevoked;
    this.createdAt = row.createdAt;
    this.updatedAt = row.updatedAt;
  }
}
