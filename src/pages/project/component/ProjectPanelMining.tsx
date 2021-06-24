import SNBUtils from '@common/SNBUtils';
import React from 'react';
import "./ProjectPanelMining.scss";

export interface ProjectPanelMiningProps {
    projectInfo: any
}

export default class ProjectPanelMining extends React.Component<ProjectPanelMiningProps> {
    render() {
        let { token_info } = this.props.projectInfo.baseSummary;
        let { currentToken } = this.props.projectInfo.tokenChange[token_info._id];
        let { decimals } = token_info;
        let current_min_hoster: any = null;
        // let pre_min_hoster: any = null;
        for (let i = 0; i < currentToken.project_config.program_hoster.length; i++) {
            if (currentToken.project_config.program_hoster[i].is_mint == true) {
                current_min_hoster = currentToken.project_config.program_hoster[i];
            }
        }
        // for (let i = 0; i < previewToken.project_config.program_hoster.length; i++) {
        //     if (previewToken.project_config.program_hoster[i].address == current_min_hoster.address) {
        //         pre_min_hoster = previewToken.project_config.program_hoster[i];
        //     }
        // }
        // let day_change = pre_min_hoster.currentAmount - current_min_hoster.currentAmount;
        return <div className="page-project-detail-mining">
                    <div className="page-project-detail-mining-item">
                        <div className="page-project-detail-mining-item-label">Mining pool balance:</div>
                        <div className="page-project-detail-mining-item-value">{ SNBUtils.numberFormat(current_min_hoster.currentAmount / Math.pow(10, decimals)) }</div>
                    </div>
                    {/* <div className="page-project-detail-mining-item">
                        <div className="page-project-detail-mining-item-label">Daily Mining :</div>
                        <div className="page-project-detail-mining-item-value">{ SNBUtils.numberFormat(day_change / Math.pow(10, decimals)) }</div>
                    </div> */}
                    <div className="page-project-detail-mining-item">
                        <div className="page-project-detail-mining-item-label">Mining Time Left :</div>
                        <div className="page-project-detail-mining-item-value">{ currentToken.project_config.mint_end_info }</div>
                    </div>
                    <div className="page-project-detail-mining-links">
                        <a className="page-project-detail-mining-item-value" target="_blank" href={ "https://explorer.solana.com/address/" + current_min_hoster.address }>Mining Address   -&gt;</a>
                        <a className="page-project-detail-mining-item-value" target="_blank" href={ currentToken.project_config.more_mint_href }>More Mining Info -&gt;</a>
                    </div>
                </div>
    }
}