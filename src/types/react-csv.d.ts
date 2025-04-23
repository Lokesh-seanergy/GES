declare module 'react-csv' {
    import { ComponentType, ReactNode } from 'react';
    
    export interface CSVProps {
        data: any[];
        headers?: any[];
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