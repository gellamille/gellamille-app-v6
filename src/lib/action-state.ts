export interface ActionState {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
  data?: Record<string, unknown>;
}

export const initialActionState: ActionState = { ok: false, message: '' };
