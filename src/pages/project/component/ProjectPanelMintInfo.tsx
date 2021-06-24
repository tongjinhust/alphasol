import React from 'react';
import SNBUtils from '@common/SNBUtils';
import "./ProjectPanelMintInfo.scss";

export interface ProjectPanelMintInfoProps {
    projectInfo: any
}

export default class ProjectPanelMintInfo extends React.Component<ProjectPanelMintInfoProps> {
    render() {
        let token_info = this.props.projectInfo.baseSummary.token_info;
        let { decimals,  project_config} = token_info;
        return <div className="page-project-detail-mintinfo">
                    <div className="page-project-detail-mintinfo-content" dangerouslySetInnerHTML={{__html: project_config.detail_info }}></div>
                    <div className="page-project-detail-mintinfo-table">
                        <table>
                            <thead>
                                <tr>
                                    <th className="col-cate">Category</th>
                                    <th className="col-percent">Percentage</th>
                                    <th className="col-plan">Plan</th>
                                    <th className="col-remain">Remaining</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    project_config.program_hoster.map((item: any, index: number) => {
                                        return <tr key={ index}>
                                            <td>{ item.name }</td>
                                            <td className="font-number">{ item.percent }%</td>
                                            <td className="font-number">{ SNBUtils.numberFormat(item.amount / Math.pow(10, decimals)) }</td>
                                            <td className="font-number">{ SNBUtils.numberFormat(item.currentAmount / Math.pow(10, decimals)) }</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
    }
}