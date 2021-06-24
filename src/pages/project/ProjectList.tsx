import React from 'react';
import { Spin, Result } from 'antd';

import PageFooter from '@component/PageFooter';
import PageHeader from '@component/PageHeader';
import SNBUtils from '@common/SNBUtils';
import { history } from '@common/history';

import "./ProjectList.scss";

export default class PageProjectList extends React.Component {
    state: {
        loaded: boolean,
        pagedata: any | null
    }

    constructor(props: any) {
        super(props);
        this.state = {
            loaded: true,
            pagedata: null
        }
        this.fetchPageInfo();
    }

    async fetchPageInfo() {
        let resp = await SNBUtils.fetchJson("/api/project/list");
        this.setState({
            loaded: false,
            pagedata: resp.data
        })
    }

    onClickProjectItem(event: any) {
        event.preventDefault();
        history.push(event.target.getAttribute("href"));
    }

    render() {
        let { loaded, pagedata } = this.state;
        let tokenChange = pagedata == null ? {} : pagedata.tokenChange;
        return <div className="page">
                   <PageHeader tabkey="Project" />
                   <div className="m-page-content">
                        <div className="m-page-split"></div>
                        <div className="page-project-list">
                            <div className="m-page-container">
                                    <div className="page-project-list-table">
                                        <div className="page-project-list-table-row">
                                            <div className="page-project-list-table-row-col col-name">Project</div>
                                            <div className="page-project-list-table-row-col col-token">Token</div>
                                            <div className="page-project-list-table-row-col col-tag">Tag</div>
                                            <div className="page-project-list-table-row-col col-tvl">TVL</div>
                                            <div className="page-project-list-table-row-col col-price">Price</div>
                                            <div className="page-project-list-table-row-col col-change">24H Change</div>
                                            <div className="page-project-list-table-row-col col-volume">24H Volume</div>
                                            <div className="page-project-list-table-row-col col-user">24H Users</div>
                                        </div>
                                        { loaded == true && <div className="m-page-holder"><Spin size="large" /></div> }
                                        { loaded == false && pagedata == null && <div className="m-page-holder"><Result title="Project Not Found，Server Busy！"/></div> }
                                        { pagedata != null && pagedata.projectList.map((item:any) => {
                                            let { baseSummary, tradeSummary, accountSummary } = item;
                                            let { currentToken, previewToken } = tokenChange[baseSummary.token_info._id];
                                            let { price, symbol, logoURI, name, decimals, project_config } = currentToken;
                                            return <div className="page-project-list-table-row" key={ item.mint }>
                                                <a href={ "/project/" + item.mint } onClick={ this.onClickProjectItem } className="font-english page-project-list-table-row-col col-name"><img src={ logoURI } />{ name }</a>
                                                <div className="page-project-list-table-row-col col-token">{ symbol }</div>
                                                <div className="page-project-list-table-row-col col-tag">{ project_config.tags.join(" , ") }</div>
                                                <div className="font-number page-project-list-table-row-col col-tvl">${ SNBUtils.numberFormat(baseSummary.tvl_amount * price / Math.pow(10, decimals)) }</div>
                                                <div className="font-number page-project-list-table-row-col col-price">${ SNBUtils.numberFormat(price, 6) }</div>
                                                <div className="font-number page-project-list-table-row-col col-change">
                                                    {
                                                        previewToken == null || previewToken.price == 0 ? "-" :
                                                        <div className={ "change-color-" + (previewToken.price <= price ? "good" : "bad") }>
                                                            { previewToken.price <= price ? "+" : "" }{ SNBUtils.numberFormat((price - previewToken.price) * 100 / previewToken.price, 2) }%
                                                        </div>
                                                    }
                                                </div>
                                                <div className="font-number page-project-list-table-row-col col-volume">${ SNBUtils.numberFormat(tradeSummary.change_amountusd_amount) }</div>
                                                <div className="font-number page-project-list-table-row-col col-user">{ SNBUtils.numberFormat(accountSummary.count_active) }</div>
                                            </div>
                                        })}
                                        { pagedata != null && [
                                                <div className="page-project-list-table-row comingsplit" >
                                                    <div className="page-project-list-table-row-col col-comming">Coming Soon</div>
                                                </div>,
                                                <div className="page-project-list-table-row comingsoon" >
                                                    <div className="font-english page-project-list-table-row-col col-name">
                                                        <img src="https://solfarm.io/solfarm-logo.svg" />SolFarm
                                                    </div>
                                                    <div className="page-project-list-table-row-col col-token">TULIP</div>
                                                    <div className="page-project-list-table-row-col col-tag">AMM</div>
                                                    <div className="font-number page-project-list-table-row-col col-tvl">-</div>
                                                    <div className="font-number page-project-list-table-row-col col-price">-</div>
                                                    <div className="font-number page-project-list-table-row-col col-change">-</div>
                                                    <div className="font-number page-project-list-table-row-col col-volume">-</div>
                                                    <div className="font-number page-project-list-table-row-col col-user">-</div>
                                                </div>,
                                                <div className="page-project-list-table-row comingsoon" >
                                                    <div className="font-english page-project-list-table-row-col col-name">
                                                        <img src={ require("@images/samples/mango.png") } />Mango
                                                    </div>
                                                    <div className="page-project-list-table-row-col col-token">MNGO</div>
                                                    <div className="page-project-list-table-row-col col-tag">DEFI</div>
                                                    <div className="font-number page-project-list-table-row-col col-tvl">-</div>
                                                    <div className="font-number page-project-list-table-row-col col-price">-</div>
                                                    <div className="font-number page-project-list-table-row-col col-change">-</div>
                                                    <div className="font-number page-project-list-table-row-col col-volume">-</div>
                                                    <div className="font-number page-project-list-table-row-col col-user">-</div>
                                                </div>,
                                                <div className="page-project-list-table-row comingsoon" >
                                                    <div className="font-english page-project-list-table-row-col col-name">
                                                        <img src={ require("@images/samples/psyoptions.png") } />PsyOptions
                                                    </div>
                                                    <div className="page-project-list-table-row-col col-token">-</div>
                                                    <div className="page-project-list-table-row-col col-tag">DEFI</div>
                                                    <div className="font-number page-project-list-table-row-col col-tvl">-</div>
                                                    <div className="font-number page-project-list-table-row-col col-price">-</div>
                                                    <div className="font-number page-project-list-table-row-col col-change">-</div>
                                                    <div className="font-number page-project-list-table-row-col col-volume">-</div>
                                                    <div className="font-number page-project-list-table-row-col col-user">-</div>
                                                </div>
                                            ]
                                        }
                                    </div>
                            </div>
                        </div>
                   </div>
                   <PageFooter />
               </div>
    }
}