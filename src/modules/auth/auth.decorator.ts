import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard as BaseAuthGuard } from '@nestjs/passport/dist/auth.guard';

/**
 * The default auth guard. Will validate the JWT token and load the relevant user from the database.
 * It should be used in the overwhelming majority of the cases.
 */
export function AuthUserRequired() {
  return applyDecorators(
    UseGuards(BaseAuthGuard('jwt')),
    ApiBearerAuth('default'),
  );
}

/**
 * This will load the external user details from Auth0 and not our database.
 * This is useful when a local user might not have been created yet
 */
export function AuthTokenRequired() {
  return applyDecorators(
    UseGuards(BaseAuthGuard('jwt-external-user')),
    ApiBearerAuth('default'),
  );
}

export const PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(PUBLIC_KEY, true);
