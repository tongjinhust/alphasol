import React from 'react';
import "./Index.scss";
import PageFooter from '@component/PageFooter';
import PageHeader from '@component/PageHeader';
import { history } from '@common/history';
import SNBUtils from '@common/SNBUtils';
import { SERVER_URL } from '@common/const';

export default class PageIndex extends React.Component {
    state: {
        pageInfo: any
    }

    intervalTimer: NodeJS.Timeout | null = null;
    constructor(props: any) {
        super(props);
        this.state = {
            pageInfo: null
        }
    }

    async loopFetcher() {
        SNBUtils.fetchJson
        let resp = await SNBUtils.fetchJson(SERVER_URL + "/api/base/summary");
        this.setState({
            pageInfo: resp.data == null ? this.state.pageInfo : resp.data
        })
    }

    componentDidMount() {
        if (this.intervalTimer == null) {
            this.intervalTimer = setInterval(() => {
                this.loopFetcher();
            }, 60000);
            this.loopFetcher();
        }
    }

    componentWillUnmount() {
        if (this.intervalTimer != null) {
            clearInterval(this.intervalTimer);
            this.intervalTimer = null;
        }
    }

    navToProduct() {
        history.push("/project");
    }

    render() {
        return <div className="page-index">
            <PageHeader tabkey="Home" />
            <div className="page-index-banner">
                <div className="m-page-container">
                    <div className="page-index-banner-content">
                        <div className="page-index-banner-content-slogan">Analyze <br />the Solana Ecosystem</div>
                        <div className="page-index-banner-content-desc">SolPro analyzes all of the projects within the Solana ecosystem <br /> to help you make better decisions.</div>
                        <div className="page-index-banner-content-actline">
                            <span className="page-index-banner-content-actline-launcherbtn" onClick={ this.navToProduct }>Launch</span>
                        </div>
                        <div className="page-index-banner-content-preview">
                            <img src={ require("@images/page_index/banner.png") }/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-index-features">
                <div className="m-page-container">
                    <div className="page-index-features-content">
                        <div className="page-index-features-title">Professional Data Analysis on Solana Project</div>
                        <div className="page-index-features-items">
                            <div className="page-index-features-item">
                                <div className="page-index-features-item-title">Discover all of the best projects on Solana</div>
                                <div className="page-index-features-item-desc">Track all projects in the Solana ecosystem. Help users understand the project through data and get familiar with the Solana ecosystem.</div>
                            </div>
                            <div className="page-index-features-item">
                                <div className="page-index-features-item-title">Analyze the health of each project</div>
                                <div className="page-index-features-item-desc">Show the true health of the project by analyzing the data performance of the project and project user activities.</div>
                            </div>
                            <div className="page-index-features-item">
                                <div className="page-index-features-item-title">Decide which projects to use </div>
                                <div className="page-index-features-item-desc">Deconstruct popular and high-quality projects, help users filter out high-value projects, and achieve optimal asset allocation.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-index-ecosystem">
                <div className="m-page-container">
                    <div className="page-index-ecosystem-panel">
                        <img className="page-index-ecosystem-bg" src={ require("@images/page_index/ecosystem.png") } />
                        <div className="page-index-ecosystem-label1">Total projects</div>
                        <div className="page-index-ecosystem-label2">189</div>
                        <div className="page-index-ecosystem-label3">Total addresses</div>
                        <div className="page-index-ecosystem-label4">{
                            this.state.pageInfo == null || this.state.pageInfo.summary == null || this.state.pageInfo.summary.account_count == null ? "-" :
                            SNBUtils.numberFormat(this.state.pageInfo.summary.account_count)
                        }</div>
                    </div>
                </div>
            </div>

            <div className="page-index-actions">
                <div className="m-page-container">
                    <div className="page-index-actions-content">
                        <div className="page-index-actions-title">SolPro in Action</div>
                        <div className="page-index-actions-items">
                            <div className="page-index-actions-item">
                                <div className="page-index-actions-item-dtl">
                                    <div className="page-index-actions-item-title">Full tracking of project performance</div>
                                    <div className="page-index-actions-item-desc">Full tracking of all Solana ecosystem projects, including token release, token price change, TVL trend, etc. It can fully demonstrate the attractiveness and sustainability of the project.</div>
                                </div>
                                <div className="page-index-actions-item-preview">
                                    <img src={ require("@images/page_index/action_1.png") } />
                                </div>
                            </div>
                            <div className="page-index-actions-item">
                                <div className="page-index-actions-item-dtl">
                                    <div className="page-index-actions-item-title">Analyze project user characteristics</div>
                                    <div className="page-index-actions-item-desc">We analyzed the total number of users, new user retention, and active user retention for each project. Is the project being followed by users? Check the chart to see at a glance.</div>
                                </div>
                                <div className="page-index-actions-item-preview">
                                    <img src={ require("@images/page_index/action_2.png") } />
                                </div>
                            </div>
                            <div className="page-index-actions-item">
                                <div className="page-index-actions-item-dtl">
                                    <div className="page-index-actions-item-title">Monitor and analyze top addresses</div>
                                    <div className="page-index-actions-item-desc">SolPro obtains project head user addresses and their positions, and continuously tracks the trading behavior and trading habits of project head addresses.</div>
                                </div>
                                <div className="page-index-actions-item-preview">
                                    <img src={ require("@images/page_index/action_3.png") } />
                                </div>
                            </div>
                            <div className="page-index-actions-item">
                                <div className="page-index-actions-item-dtl">
                                    <div className="page-index-actions-item-title">Latest project news aggregation</div>
                                    <div className="page-index-actions-item-desc">The platform aggregates the latest news of the project, updates information on new trading pairs and new coins of the project, and delivers timely information on airdrops.</div>
                                </div>
                                <div className="page-index-actions-item-preview">
                                    <img src={ require("@images/page_index/action_4.png") } />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <PageFooter showslogan={ true } />
        </div>
    }
}