import { CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  alert('You are not authorized to view this page');
  return false;
};
 