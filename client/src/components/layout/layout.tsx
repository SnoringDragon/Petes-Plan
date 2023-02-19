import { PropsWithChildren } from 'react';
import { Sidebar } from '../sidebar/sidebar';

export function Layout({ children }: PropsWithChildren<{}>) {
    return (<div className="flex h-full">
        <Sidebar />
        <div className="p-4">
            {children}
        </div>
    </div>)
}