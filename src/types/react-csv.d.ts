declare module 'react-csv' {
    import type { ComponentType, ReactNode } from 'react';
    
    export interface CSVProps {
        data: Record<string, unknown>[];
        headers?: { label: string; key: string }[];
        filename?: string;
        separator?: string;
        target?: string;
        className?: string;
        style?: React.CSSProperties;
        children?: ReactNode;
    }

    export const CSVLink: ComponentType<CSVProps>;
    export const CSVDownload: ComponentType<CSVProps>;
} 