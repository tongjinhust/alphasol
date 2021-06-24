import React from 'react';
import { history } from '@common/history';

export interface PageHeaderProps {
    tabkey: string,
    title?: string
}

export default class PageHeader extends React.Component<PageHeaderProps> {
    public navTo(event: any) {
        let target = event.target;
        if (target == null || target.getAttribute == null) {
            return;
        }
        let dataKey = target.getAttribute("data-key");
        if (history.location.pathname != dataKey) {
            history.push(dataKey);
        }
    }

    render() {
        let { tabkey } = this.props;
        return (
            <div className="m-page-header">
                <div className="m-page-container">
                    <div className="m-page-header-content">
                        <div className="m-page-header-left">
                            <a className="m-page-header-logo" href="/">
                                <img src={ require("@images/common/icon-logo-header.png") } />
                            </a>
                        </div>
                        <div className="m-page-header-navs">
                            <span data-key="/" className={ "m-page-header-navs-item " + (tabkey == "Home" ? "active" : "") } onClick={ this.navTo } >Home</span>
                            <span data-key="/project" className={ "m-page-header-navs-item " + (tabkey == "Project" ? "active" : "") } onClick={ this.navTo }>Projects</span>
                            <span data-key="/activity" className={ "m-page-header-navs-item " + (tabkey == "Activity" ? "active" : "") } onClick={ this.navTo }>Activity</span>
                            {/* <span data-key="/assets" className={ "m-page-header-navs-item " + (tabkey == "Assets" ? "active" : "") }>Assets</span> */}
                        </div>
                        {/* <div className="m-page-header-language">
                            <img src={ require("@images/common/icon-language-en.png") } />
                            <span className="m-page-header-language-item font-english active">English</span>
                            <span className="m-page-header-language-split">/</span>
                            <span className="m-page-header-language-item font-chinese">中文</span>
                        </div> */}
                    </div>
                </div>
            </div>
        );
    }
}