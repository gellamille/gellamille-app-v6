'use client';

import { useEffect } from 'react';

export function ClearPartnerCart() {
  useEffect(() => {
    window.localStorage.removeItem('gellamille-partner-cart-v1');
  }, []);

  return null;
}
