'use client';

import { startTransition, useActionState } from 'react';

// Like useActionState, but submits through onSubmit so React does not reset the
// form's fields after the action runs (keeps user input when validation fails).
export function useFormAction(serverAction) {
  const [state, dispatch, pending] = useActionState(serverAction, null);
  const onSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => dispatch(formData));
  };
  return [state, onSubmit, pending];
}
