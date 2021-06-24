import React, { ReactNode } from 'react';

import PageFooter from '@component/PageFooter';
import PageHeader from '@component/PageHeader';
import { history } from '@common/history';
import { ActiveAirDrop, ActiveNews } from '../../data/ActivityDateList';

import "./ActivityList.scss";
import SNBUtils from '@common/SNBUtils';
import { MonthArr, SERVER_URL, WeekDayArr } from '@common/const';
import { Result, Spin } from 'antd';

export default class PageActivityList extends React.Component {
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
        let resp = await SNBUtils.fetchJson(SERVER_URL + "/api/activity/list");
        this.setState({
            loaded: false,
            pagedata: resp.data
        })
    }

    onClickProjectItem(event: any) {
        event.preventDefault();
        history.push(event.target.getAttribute("href"));
    }

    getDaiInfo(coldate: number):ReactNode[] {
        let pagedata = this.state.pagedata;
        let info: {
            news: ActiveNews[],
            airdrop: ActiveAirDrop[]
        } = {
            news: [],
            airdrop: []
        }
        for (let i = 0; i < pagedata.length; i++) {
            let activityItem = pagedata[i];
            if (activityItem.date_time == coldate) {
                if (activityItem.type == "NEWS") {
                    info.news.push(activityItem);
                } else if (activityItem.type == "AIRDROP") {
                    info.airdrop.push(activityItem);
                }
            }
        }

        let nodeList: ReactNode[] = [];
        if (info.airdrop.length > 0) {
            nodeList.push(<div key={ coldate + "_air" } className="page-activity-list-dailyview-dayitem-groupline group-airdrop">AirDrop</div>);
            for (let i = 0; i < info.airdrop.length; i++) {
                nodeList.push(<div key={ coldate + "_air_" + info.airdrop[i]._id } className="page-activity-list-dailyview-dayitem-groupitem" onClick={ () => { history.push("/activity/" + info.airdrop[i]._id); } }>{ info.airdrop[i].title }</div>);
            }
        }
        if (info.news.length > 0) {
            nodeList.push(<div key={ coldate + "_new" } className="page-activity-list-dailyview-dayitem-groupline group-news">News</div>);
            for (let i = 0; i < info.news.length; i++) {
                nodeList.push(<a key={ coldate + "__new_" + info.news[i]._id } className="page-activity-list-dailyview-dayitem-groupitem" target="_blank" href={ info.news[i].href }>{ info.news[i].title }</a>);
            }
        }
        return nodeList;
    }

    getNodeList() {
        let nowDate = new Date();
        let todayDateNum = SNBUtils.getRecordTime(nowDate.getTime(), "yymmdd");
        let weekDay = nowDate.getDay();
        let dayStart = nowDate.getTime() - weekDay * 3600 * 24 * 1000;
        let nodeList1: ReactNode[] = [];
        let nodeList2: ReactNode[] = [];
        for (let i = 0; i < 14; i++) {
            let dateItem = new Date(dayStart + i * 3600 * 24 * 1000);
            let dateStr = dateItem.getDate();
            let weekdayStr = WeekDayArr[dateItem.getDay()];
            let dateNum = SNBUtils.getRecordTime(dateItem.getTime(), "yymmdd");
            let node = <div key={ dateNum } className={"page-activity-list-dailyview-dayitem " + (todayDateNum == dateNum ? "istoday" : "")}>
                    <div className="page-activity-list-dailyview-dayitem-datetime">
                        <div className="page-activity-list-dailyview-dayitem-datetime-day">{ weekdayStr }.</div>
                        <div className="page-activity-list-dailyview-dayitem-datetime-date">{ dateStr }</div>
                    </div>
                    <div className="page-activity-list-dailyview-dayitem-content">
                        { this.getDaiInfo(dateNum) }
                    </div>
                </div>;
            if (i < 7) {
                nodeList1.push(node);
            } else {
                nodeList2.push(node);
            }
        }
        return [
            <div className="page-activity-list-dailyview-daylist">{ nodeList1 }</div>,
            <div className="page-activity-list-dailyview-daylist">{ nodeList2 }</div>
        ]
    }

    render() {
        let nowDate = new Date();

        let endDate = new Date(nowDate.getTime() + 13 * 3600 * 24 * 1000);
        let monStart = nowDate.getMonth();
        let yearStart = nowDate.getFullYear();
        let monEnd = endDate.getMonth();
        let yearEnd = endDate.getFullYear();

        let { loaded, pagedata } = this.state;
        return <div className="page">
                   <PageHeader tabkey="Activity" />
                   <div className="m-page-content">
                        <div className="m-page-split"></div>
                        <div className="page-activity-list">
                            <div className="m-page-container">
                                { loaded == true && <div className="m-page-holder"><Spin size="large" /></div> }
                                { loaded == false && pagedata == null && <div className="m-page-holder"><Result title="Activity Not Found，Server Busy！"/></div> }
                                { pagedata != null &&
                                    <div className="page-activity-list-dailyview">
                                        <div className="page-activity-list-dailyview-title">
                                            { monStart == monEnd ? "" : ((MonthArr[monStart]) + ( yearStart == yearEnd ? "" : (" " + yearStart)) + " - ") }
                                            { MonthArr[monEnd] } { yearEnd }</div>
                                        { this.getNodeList() }
                                    </div>
                                }
                            </div>
                        </div>
                   </div>
                   <PageFooter />
               </div>
    }
}