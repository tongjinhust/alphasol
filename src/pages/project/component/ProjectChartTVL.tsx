import React from 'react';
import Highcharts from 'highcharts'
import SolanaDateChart from '@component/SolanaDateChart';
import SNBUtils from '@common/SNBUtils';
import { Popover } from 'antd';

export interface ProjectChartTVLProps {
    projectId: string,
    projectHistory: any | boolean,
    width: number,
    height: number
}

export default class ProjectChartTVL extends React.Component<ProjectChartTVLProps> {
    constructor(props: ProjectChartTVLProps) {
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
        for (let i = projectHistory.length - 1; i >= 0; i--) {
            let { time, baseSummary } = projectHistory[i];
            let record_time = SNBUtils.recordTimeToDate(time, true).getTime();
            let tvl = baseSummary.tvl_amount * baseSummary.token_info.price / Math.pow(10, baseSummary.token_info.decimals);
            datas.push([ record_time, tvl / 1000 ]);
        }
        return {
            chart: {
                height: this.props.height,
                width: this.props.width
            },
            xAxis: {
                type: 'datetime',
            },
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    formatter: function () {
                        return '$' + this.value + 'k';
                    }
                }
            },
            tooltip: {
                shared: true,
                useHTML: true,
                formatter: function() {
                    var html = '<span style="font-size:10px">' + SNBUtils.dateFormat(this.x, "ewd, em dd, hh:ii") + '</span><br/>';
                    if (this.points != null) {
                        for (let index = 0; index < this.points.length; index++) {
                            let point = this.points[index];
                            html += '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ": <b>$" +  SNBUtils.numberFormat(point.y, 0) + 'k</b><br/>';
                        }
                    }
                    return html;
                }
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
                name: 'TVL',
                color: '#72AFFF',
                data: datas,
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
                            TVL
                            <Popover placement="right" content={
                                <div className="page-project-detail-chart-tip">
                                    <span>TVL:</span>Total assets value currently staked or locked in the protocol.
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