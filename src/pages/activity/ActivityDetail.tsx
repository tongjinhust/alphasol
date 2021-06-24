import React from 'react';

import PageFooter from '@component/PageFooter';
import PageHeader from '@component/PageHeader';
import { ActiveAirDrop } from '../../data/ActivityDateList';

import "./ActivityDetail.scss";
import SNBUtils from '@common/SNBUtils';
import { Result, Spin } from 'antd';
import { SERVER_URL } from '@common/const';

export default class PageActivityDetail extends React.Component<any> {
    state: {
        loaded: boolean,
        activityId: string,
        activityInfo: ActiveAirDrop | null
    }

    constructor(props: any) {
        super(props);
        let params: any = this.props.match.params;
        this.state = {
            activityId: params.activityId,
            loaded: true,
            activityInfo: null
        }
        this.fetchPageInfo();
    }

    async fetchPageInfo() {
        let resp = await SNBUtils.fetchJson(SERVER_URL + "/api/activity/detail?id=" + this.state.activityId);
        this.setState({
            loaded: false,
            activityInfo: resp.data
        })
    }

    render() {
        let { loaded, activityInfo } = this.state;
        return <div className="page">
                   <PageHeader tabkey="Activity" />
                   <div className="m-page-content">
                        <div className="m-page-split"></div>
                        <div className="page-activity-detail">
                            <div className="m-page-container">
                                { loaded == true && <div className="m-page-holder"><Spin size="large" /></div> }
                                { loaded == false && activityInfo == null && <div className="m-page-holder"><Result title="Activity Not Found，Server Busy！"/></div> }
                                {
                                    activityInfo != null &&
                                    <div className="page-activity-detail-panel">
                                        <div className="page-activity-detail-baseinfo">
                                            <img className="page-activity-detail-baseinfo-icon" src={ SERVER_URL + activityInfo.airdrop_info.icon } />
                                            <div className="page-activity-detail-baseinfo-right">
                                                <div className="page-activity-detail-baseinfo-title">{ activityInfo.title }</div>
                                                <div className="page-activity-detail-baseinfo-duration">
                                                    { SNBUtils.recordTimeFormat(activityInfo.airdrop_info.date_start, false, "yy/mm/dd") }
                                                    { activityInfo.airdrop_info.date_end != null && "-" }
                                                    { activityInfo.airdrop_info.date_end != null && SNBUtils.recordTimeFormat(activityInfo.airdrop_info.date_end, false, "yy/mm/dd") }
                                                </div>
                                                <div className="page-activity-detail-baseinfo-amount">
                                                    Total value: <label>{ activityInfo.airdrop_info.amount == null ? "UNKNOWN" : SNBUtils.numberFormat(activityInfo.airdrop_info.amount) } { activityInfo.airdrop_info.symbol }</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="page-activity-detail-brief" dangerouslySetInnerHTML={{__html: activityInfo.airdrop_info.brief }}>
                                        </div>
                                        <div className="page-activity-detail-guide" dangerouslySetInnerHTML={{__html: activityInfo.airdrop_info.guide }}>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                   </div>
                   <PageFooter />
               </div>
    }
}