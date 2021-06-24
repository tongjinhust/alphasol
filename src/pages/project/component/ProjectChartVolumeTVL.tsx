import React from 'react';
import Highcharts from 'highcharts'
import SolanaDateChart from '@component/SolanaDateChart';
import SNBUtils from '@common/SNBUtils';
import { Popover } from 'antd';

export interface ProjectChartVolumeTVLProps {
    projectId: string,
    projectHistory: any | boolean,
    width: number,
    height: number
}

export default class ProjectChartVolumeTVL extends React.Component<ProjectChartVolumeTVLProps> {
    constructor(props: ProjectChartVolumeTVLProps) {
        super(props);
        this.getChartOptions = this.getChartOptions.bind(this);
    }

    async getChartOptions(key: string | number):Promise<Highcharts.Options | null> {
        let projectHistory = this.props.projectHistory;
        while (projectHistory == null) {
            await SNBUtils.sleep(100);
            projectHistory = this.props.projectHistory;
        }
        if (projectHistory === false) return null;

        let datas:any = [];
        let categories: string[] = [];
        for (let i = 0; i <= projectHistory.length - 1; i++) {
            let { time, baseSummary, tradeSummary } = projectHistory[i];
            let record_time = SNBUtils.recordTimeFormat(time, false, "dd. em");
            let tvl = baseSummary.tvl_amount;
            let volume = tradeSummary.trade_volume;
            datas.push({
                x: time,
                y: volume * 100 / tvl
            });
            categories.push(record_time);
        }
        return {
            chart: {
                height: this.props.height,
                width: this.props.width
            },
            xAxis: {
                type: "category",
                categories,
                labels: {
                    formatter: function () {
                        let date:any = this.value;
                        return SNBUtils.recordTimeFormat(date, false, "dd. em");
                    }
                }
            },
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    formatter: function () {
                        return this.value + '%';
                    }
                }
            },
            tooltip: {
                formatter: function() {
                    console.log(this);
                    var html = '<span style="font-size:10px">' + SNBUtils.recordTimeFormat(this.x, false, "ewd, em dd UTC+0") + '</span><br/>';
                    if (this.points != null) {
                        for (let index = 0; index < this.points.length; index++) {
                            let point = this.points[index];
                            html += '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ": <b>" +  SNBUtils.numberFormat(point.y, 2) + '%</b><br/>';
                        }
                    }
                    return html
                },
                shared: true,
                useHTML: true
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                column: {
                    borderWidth: 0
                }
            },
            series: [{
                type: 'line',
                name: 'Volume/TVL',
                data: datas,
                color: '#EAC95A',
                marker: {
                    enabled: false
                }
            }]
        };
    }

    render() {
        return <div className="page-project-detail-chart-row-item">
                <SolanaDateChart
                    tabs = {[{ key: "7D" }, { key: "1M" }, { key: "3M" }]}
                    title = {
                        <div className="page-project-detail-chart-title">
                            Volume/TVL
                            <Popover placement="right" content={
                                <div className="page-project-detail-chart-tip">
                                    <span>Volume:</span>A measure of how much of a cryptocurrency was traded in the last 24 hours.
                                </div> } trigger="hover">
                                <div className="notice" >!</div>
                            </Popover>
                        </div>
                    }
                    chartOptionFetcher = { this.getChartOptions }
                />
            </div>
    }
}