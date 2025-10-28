import React, { createContext, useContext } from 'react';
import { useMotoControl } from '../control/motoControl';

const MotoContext = createContext<ReturnType<typeof useMotoControl> | null>(null);

export const MotoProvider = ({ children }: { children: React.ReactNode }) => {
    const moto = useMotoControl();
    return <MotoContext.Provider value={moto}>{children}</MotoContext.Provider>;
};

export function useMoto() {
    const context = useContext(MotoContext);
    if (!context) throw new Error('useMoto must be used within a MotoProvider');
    return context;
}
