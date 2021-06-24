import React from 'react';
import SNBUtils from '@common/SNBUtils';
import "./ProjectHeader.scss";
import { SymbolToken } from '@common/const';

export interface ProjectHeaderProps {
    projectInfo: any
}

export default class ProjectHeader extends React.Component<ProjectHeaderProps> {
    render() {
        let { token_info, tvl_amount, supply_circulating, supply_total } = this.props.projectInfo.baseSummary;
        let tokenChange =this.props.projectInfo.tokenChange;
        let { currentToken, previewToken } = tokenChange[token_info._id];
        let { symbol, logoURI, name, decimals } = currentToken;
        let change_amountusd_amount = this.props.projectInfo.tradeSummary.change_amountusd_amount;

        let tokenCurrentPrice = tokenChange[token_info._id].currentToken.price;
        let tokenOldPrice = tokenChange[token_info._id].previewToken.price;
        let btcCurrentPrice = tokenChange[SymbolToken.BTC].currentToken.price;
        let btcOldPrice = tokenChange[SymbolToken.BTC].previewToken.price;
        let solCurrentPrice = tokenChange[SymbolToken.SOL].currentToken.price;
        let solOldPrice = tokenChange[SymbolToken.SOL].previewToken.price;

        let solOld = tokenOldPrice / solOldPrice;
        let solNew = tokenCurrentPrice / solCurrentPrice;
        let btcOld = tokenOldPrice / btcOldPrice;
        let btcNew = tokenCurrentPrice / btcCurrentPrice;

        return <div className="page-project-detail-header">
                <div className="page-project-detail-header-line1">
                    <div className="page-project-detail-header-line1-left">
                        <img className="page-project-detail-header-line1-icon" src={ logoURI } />
                        <div className="page-project-detail-header-line1-title">{ name }</div>
                        <div className="page-project-detail-header-line1-token">{ symbol }</div>
                    </div>
                    <div className="page-project-detail-header-line1-right">
                        <div className="page-project-detail-header-line1-price">${ SNBUtils.numberFormat(tokenCurrentPrice, 6) }</div>
                        <div className="page-project-detail-header-line1-change">
                        {
                            previewToken == null || previewToken.price == 0 ? "-" :
                            <label className={ "change-color-" + (tokenOldPrice <= tokenCurrentPrice ? "good" : "bad") }>
                               { tokenOldPrice <= tokenCurrentPrice ? "+" : ""}{ SNBUtils.numberFormat((tokenCurrentPrice - tokenOldPrice) * 100 / tokenOldPrice, 2) }%
                            </label>
                        }
                        </div>
                    </div>
                </div>
                <div className="page-project-detail-header-line2">
                    <div className="page-project-detail-header-line2-left">
                        <div className="page-project-detail-header-line2-item">
                            <div className="page-project-detail-header-line2-item-label">Total Value Locked</div>
                            <div className="page-project-detail-header-line2-item-value">
                                ${ SNBUtils.numberFormat(tvl_amount * tokenCurrentPrice / Math.pow(10, decimals)) }
                            </div>
                        </div>
                        <div className="page-project-detail-header-line2-item">
                            <div className="page-project-detail-header-line2-item-label">Trading Volume(24H)</div>
                            <div className="page-project-detail-header-line2-item-value">
                                ${ SNBUtils.numberFormat(change_amountusd_amount) }
                            </div>
                        </div>
                        <div className="page-project-detail-header-line2-item">
                            <div className="page-project-detail-header-line2-item-label">Circulating Supply</div>
                            <div className="page-project-detail-header-line2-item-value">
                                { SNBUtils.numberFormat(supply_circulating / Math.pow(10, decimals)) }
                                ({ SNBUtils.numberFormat(supply_circulating * 100 / supply_total, 2) }%)
                            </div>
                        </div>
                        <div className="page-project-detail-header-line2-item">
                            <div className="page-project-detail-header-line2-item-label">Max Supply</div>
                            <div className="page-project-detail-header-line2-item-value">
                                { SNBUtils.numberFormat(supply_total / Math.pow(10, decimals)) }
                            </div>
                        </div>
                    </div>
                    <div className="page-project-detail-header-line2-item">
                        <div className="page-project-detail-header-line2-item-pricechange">
                            <span className="font-number">{ SNBUtils.numberFormat(btcNew, 6) }</span>
                            <span className="font-number pricesymbol">BTC</span>
                            <label className={ "font-number change-color-" + (btcOld <= btcNew ? "good" : "bad") }>
                                { btcOld <= btcNew ? "+" : "-"}{ SNBUtils.numberFormat(Math.abs(btcNew - btcOld) * 100 / btcOld, 2) }%
                            </label>
                        </div>
                        <div className="page-project-detail-header-line2-item-pricechange">
                            <span className="font-number">{ SNBUtils.numberFormat(solNew, 6) }</span>
                            <span className="font-number pricesymbol">SOL</span>
                            <label className={ "font-number change-color-" + (solOld <= solNew ? "good" : "bad") }>
                                { solOld <= solNew ? "+" : "-"}{ SNBUtils.numberFormat(Math.abs(solNew - solOld) * 100 / solOld, 2) }%
                            </label>
                        </div>
                    </div>
                </div>
        </div>
    }
}