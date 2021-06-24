import React from 'react';

import PageFooter from '@component/PageFooter';
import PageHeader from '@component/PageHeader';

import ProjectHeader from './component/ProjectHeader';
import ProjectChartPrice from './component/ProjectChartPrice';
import ProjectChartTVL from './component/ProjectChartTVL';
import ProjectChartVolumeTVL from './component/ProjectChartVolumeTVL';
import ProjectChartAccount from './component/ProjectChartAccount';

import ProjectPanelMining from './component/ProjectPanelMining';
import ProjectChartTopAddressBalance from './component/ProjectChartTopAddressBalance';
import ProjectChartTransaction from './component/ProjectChartTransaction';

import "./ProjectDetail.scss";
import SNBUtils from '@common/SNBUtils';
import { Result, Spin } from 'antd';
import ProjectTableTopAddress from './component/ProjectTableTopAddress';
import ProjectTableAddressQuality from './component/ProjectTableAddressQuality';
import ProjectPanelMintInfo from './component/ProjectPanelMintInfo';

export default class PageProjectDetail extends React.Component<any> {
    state: {
        projectId: string,
        loaded: boolean,
        pagedata: any | null,
        projectHistory: any | boolean,
        projectHistoryDay: any | boolean,
    }

    constructor(props: any) {
        super(props);
        let params: any = this.props.match.params;
        this.state = {
            projectId: params.projectId,
            loaded: true,
            pagedata: null,
            projectHistory: null,
            projectHistoryDay: null
        }
        this.fetchBaseInfo();
        this.fetchHistoryInfo();
        this.fetchHistoryInfoDay();
    }

    async fetchBaseInfo() {
        let resp = await SNBUtils.fetchJson("/api/project/baseInfo?address=" + this.state.projectId);
        this.setState({
            loaded: false,
            pagedata: resp.data
        })
    }

    async fetchHistoryInfo() {
        let resp = await SNBUtils.fetchJson("/api/project/history?address=" + this.state.projectId + "&pageSize=" + (24 * 7));
        this.setState({
            projectHistory: resp.data == null ? false : resp.data
        })
    }

    async fetchHistoryInfoDay() {
        let resp = await SNBUtils.fetchJson("/api/project/historyByDay?address=" + this.state.projectId + "&pageSize=30");
        this.setState({
            projectHistoryDay: resp.data == null ? false : resp.data
        })
    }

    render () {
        let { projectId, loaded, pagedata, projectHistory, projectHistoryDay } = this.state;
        return <div className="page">
            <PageHeader tabkey="Project" />
            <div className="m-page-content">
                <div className="m-page-container">
                    { loaded == true && <div className="m-page-holder"><Spin size="large" /></div> }
                    { loaded == false && pagedata == null && <div className="m-page-holder"><Result title="Project Not Found，Server Busy！"/></div> }
                    { loaded == false && pagedata != null &&
                        <div className="page-project-detail">
                            <div className="page-project-detail-split"></div>
                            <ProjectHeader projectInfo={ pagedata }/>
                            <div className="page-project-detail-split"></div>

                            <div className="page-project-detail-panel">
                                <div className="page-project-detail-panel-title">Performance</div>
                                <div className="page-project-detail-panel-content">
                                    <div className="page-project-detail-chart-row">
                                        <ProjectChartPrice projectId={ projectId } width={ 500 } height= { 200 }/>
                                        <ProjectChartTVL projectId={ projectId } projectHistory={ projectHistory }  width={ 500 } height= { 200 }/>
                                    </div>
                                    <div className="page-project-detail-chart-row">
                                        <ProjectChartVolumeTVL projectId={ projectId } projectHistory={ projectHistoryDay } width={ 500 } height= { 200 }/>
                                        <ProjectChartAccount projectId={ projectId } projectHistory={ projectHistoryDay } width={ 500 } height= { 200 }/>
                                    </div>
                                </div>
                            </div>
                            <div className="page-project-detail-split"></div>

                            <div className="page-project-detail-panel">
                                <div className="page-project-detail-panel-title">Mining</div>
                                <div className="page-project-detail-panel-content">
                                    <ProjectPanelMining projectInfo={ pagedata }/>
                                </div>
                            </div>
                            <div className="page-project-detail-split"></div>

                            <div className="page-project-detail-panel">
                                <div className="page-project-detail-panel-title">Top Addresses</div>
                                <div className="page-project-detail-panel-content">
                                    <div className="page-project-detail-chart-row">
                                        <ProjectChartTopAddressBalance projectInfo={ pagedata } projectHistory={ projectHistoryDay } projectId={ projectId } width={ 500 } height= { 200 }/>
                                        <ProjectChartTransaction projectId={ projectId } projectHistory={ projectHistoryDay } width={ 500 } height= { 200 }/>
                                    </div>
                                    <ProjectTableTopAddress projectInfo={ pagedata }/>
                                </div>
                            </div>
                            <div className="page-project-detail-split"></div>

                            <div className="page-project-detail-panel">
                                <div className="page-project-detail-panel-title">Addresses Quality</div>
                                <div className="page-project-detail-panel-content">
                                    <ProjectTableAddressQuality projectId={ projectId } />
                                </div>
                            </div>
                            <div className="page-project-detail-split"></div>

                            <div className="page-project-detail-panel">
                                <div className="page-project-detail-panel-title">Project Mining Info</div>
                                <div className="page-project-detail-panel-content">
                                    <ProjectPanelMintInfo projectInfo={ pagedata }/>
                                </div>
                            </div>
                            <div className="page-project-detail-split"></div>
                        </div>
                    }
                </div>
            </div>
            <PageFooter />
        </div>
    }
}