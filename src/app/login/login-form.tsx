'use client';

import { useActionState } from 'react';
import { initialActionState } from '@/lib/action-state';
import { SubmitButton } from '@/components/submit-button';
import { loginAction } from './actions';

export function LoginForm() {
  const [state, action] = useActionState(loginAction, initialActionState);

  return (
    <form action={action}>
      <div>
        <label className="required" htmlFor="email">E-mail-cím</label>
        <input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field-spacing">
        <label className="required" htmlFor="password">Jelszó</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {state.message ? <div className="alert alert-error">{state.message}</div> : null}
      <div className="actions">
        <SubmitButton className="button button-primary" >Belépés</SubmitButton>
      </div>
    </form>
  );
}
