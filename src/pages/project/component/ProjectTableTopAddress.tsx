import React, { ReactNode } from 'react';
import SNBUtils from '@common/SNBUtils';
import { Popover } from 'antd';
import "./ProjectTableTopAddress.scss";

export interface ProjectTableTopAddressProps {
    projectInfo: any
}

export default class ProjectTableTopAddress extends React.Component<ProjectTableTopAddressProps> {
    private getAccountSummary(owner: string): ReactNode {
        let { accountSummary, baseSummary, tokenChange } = this.props.projectInfo;
        let projectMint = baseSummary.token_info._id;
        for (let index = 0; index < accountSummary.account_top.length; index++) {
            let account = accountSummary.account_top[index];
            if (account.owner == owner) {
                let { decimals, symbol, name } = baseSummary.token_info;
                let { balance, liquitily, farm } = account.asset_info;

                let balanceAmount = 0;
                for (let key in balance) {
                    balanceAmount += balance[key].amount;
                }

                let showLiquitily = false;
                for (let key in liquitily) {
                    showLiquitily = true;
                    break;
                }
                let showFarm = false;
                for (let key in farm) {
                    showFarm = true;
                    break;
                }

                return <div className="page-project-detail-topaddress-popup">
                        <div className="page-project-detail-topaddress-popup-table">
                            <div className="page-project-detail-topaddress-popup-row">
                                <div className="page-project-detail-topaddress-popup-col-categroy">Category</div>
                                <div className="page-project-detail-topaddress-popup-col-asset">
                                    <div className="assetitem">
                                        <div className="assetitem-symbol">Assets</div>
                                        <div className="assetitem-platform">Platform</div>
                                        <div className="assetitem-amount"><div className="assetitem-balance">Amount</div></div>
                                    </div>
                                </div>
                            </div>
                            <div className="page-project-detail-topaddress-popup-row">
                                <div className="page-project-detail-topaddress-popup-col-categroy">Balance</div>
                                <div className="page-project-detail-topaddress-popup-col-asset">
                                    <div className="assetitem">
                                        <div className="assetitem-symbol boldtxt">{ symbol }</div>
                                        <div className="assetitem-platform">{ name.toLowerCase() }</div>
                                        <div className="assetitem-amount">
                                            <div className="assetitem-balance boldtxt">{ SNBUtils.numberFormat(balanceAmount / Math.pow(10, decimals)) } { symbol }</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                showLiquitily &&
                                <div className="page-project-detail-topaddress-popup-row">
                                    <div className="page-project-detail-topaddress-popup-col-categroy">Liquitily</div>
                                    <div className="page-project-detail-topaddress-popup-col-asset">
                                        {
                                            liquitily.map((assetInfo: any) => {
                                                return <div key={ "asset-" + assetInfo.address } className="assetitem">
                                                    <div className="assetitem-symbol boldtxt">{ assetInfo.symbol }</div>
                                                    <div className="assetitem-platform">{ assetInfo.platform.toLowerCase() }</div>
                                                    <div className="assetitem-amount">
                                                        { assetInfo.asset_list.map((subasset: any, index: number) => {
                                                            let submintInfo = tokenChange[subasset.mint];
                                                            if (submintInfo == null) {
                                                                return <div key={"subasset_" + index} className="assetitem-balance"> - </div>
                                                            }
                                                            return <div key={"subasset_" + index} className={"assetitem-balance " + (subasset.mint == projectMint ? "boldtxt" : "")}>
                                                                { SNBUtils.numberFormat(subasset.amount / Math.pow(10, submintInfo.currentToken.decimals)) } { submintInfo.currentToken.symbol }
                                                            </div>
                                                        }) }
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            }
                            {
                                showFarm &&
                                <div className="page-project-detail-topaddress-popup-row">
                                    <div className="page-project-detail-topaddress-popup-col-categroy">Farm</div>
                                    <div className="page-project-detail-topaddress-popup-col-asset">
                                        {
                                            farm.map((assetInfo: any) => {
                                                return <div key={ "asset-" + assetInfo.address } className="assetitem">
                                                    <div className="assetitem-symbol boldtxt">{ assetInfo.symbol }</div>
                                                    <div className="assetitem-platform">{ assetInfo.platform.toLowerCase() }</div>
                                                    <div className="assetitem-amount">
                                                        { assetInfo.asset_list.map((subasset: any, index: number) => {
                                                            let submintInfo = tokenChange[subasset.mint];
                                                            if (submintInfo == null) {
                                                                return <div key={"subasset_" + index} className="assetitem-balance"> - </div>
                                                            }
                                                            return <div key={"subasset_" + index} className={"assetitem-balance " + (subasset.mint == projectMint ? "boldtxt" : "")}>
                                                                { SNBUtils.numberFormat(subasset.amount / Math.pow(10, submintInfo.currentToken.decimals)) } { submintInfo.currentToken.symbol }
                                                            </div>
                                                        }) }
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
            }
        }
        return null;
    }

    private getTopAccounts():ReactNode[] {
        let { accountSummary, baseSummary } = this.props.projectInfo;
        let { decimals, supply_circulating, token_info } = baseSummary;
        let listNode: ReactNode[] = [];
        let maxCount = 0;

        let hosterMap: any = {};
        for (let index = 0; index < token_info.project_config.program_hoster.length; index++) {
            hosterMap[token_info.project_config.program_hoster[index].owner] = true;
        }
        for (let index = 0; index < accountSummary.account_top.length; index++) {
            let account = accountSummary.account_top[index];
            if (hosterMap[account.owner] == true) continue;
            maxCount++;
            listNode.push(
                <Popover placement="right" key={ account.owner } content={ this.getAccountSummary.bind(this, account.owner) } trigger="hover">
                    <div className="page-project-detail-topaddress-table-row">
                        <div className="page-project-detail-topaddress-table-row-col1">{ maxCount }</div>
                        <div className="page-project-detail-topaddress-table-row-col2">
                        <a href={"https://explorer.solana.com/address/" + account.owner}target="_blank">{ account.owner }</a>
                        </div>
                        <div className="page-project-detail-topaddress-table-row-col3 font-number">{ SNBUtils.numberFormat(account.amount / Math.pow(10, decimals), 0) }</div>
                        <div className="page-project-detail-topaddress-table-row-col4 font-number">{ SNBUtils.numberFormat((account.amount / supply_circulating) * 100, 2) } %</div>
                    </div>
                </Popover>
            )
            if (maxCount >= 20) {
                break;
            }
        }
        return listNode;
    }

    render() {
        return <div className="page-project-detail-topaddress">
            <div className="page-project-detail-topaddress-title">Top Addresses By Balance</div>
            <div className="page-project-detail-topaddress-table">
                <div className="page-project-detail-topaddress-table-row">
                    <div className="page-project-detail-topaddress-table-row-col1">#</div>
                    <div className="page-project-detail-topaddress-table-row-col2">Address</div>
                    <div className="page-project-detail-topaddress-table-row-col3">Amount</div>
                    <div className="page-project-detail-topaddress-table-row-col4">%</div>
                </div>
                { this.getTopAccounts() }
            </div>
        </div>
    }
}