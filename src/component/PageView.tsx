import React from 'react';
import { RouteComponentProps } from 'react-router';

export interface PageViewInterface {
    pageReady: boolean
}

export default abstract class PageView extends React.Component<RouteComponentProps> {
    state: PageViewInterface;

    constructor(props: any) {
        super(props);
        this.state = {
            pageReady: true
        }
    }

    protected abstract getPageContent(): React.ReactNode;

    render() {
        return this.getPageContent();
    }
}