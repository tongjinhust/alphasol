import React from 'react';
import Highcharts from 'highcharts'
import SolanaDateChart from '@component/SolanaDateChart';
import SNBUtils from '@common/SNBUtils';
import { Popover } from 'antd';

export interface ProjectChartTopAddressBalanceProps {
    projectInfo: any,
    projectHistory: any | boolean,
    projectId: string,
    width: number,
    height: number
}

export default class ProjectChartTopAddressBalance extends React.Component<ProjectChartTopAddressBalanceProps> {
    constructor(props: ProjectChartTopAddressBalanceProps) {
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

        let datas10 = [];
        let datas20 = [];
        let datas50 = [];
        let categories: string[] = [];
        for (let i = 0; i <= projectHistory.length - 1; i++) {
            let { baseSummary, accountSummary, time } = projectHistory[i];
            let record_time = SNBUtils.recordTimeFormat(time, false, "dd. em");
            let supply_circulating = baseSummary.supply_circulating;
            datas10.push({
                x: time,
                y: accountSummary.account_top_amount_10 * 100 / supply_circulating
            });
            datas20.push({
                x: time,
                y: accountSummary.account_top_amount_20 * 100 / supply_circulating
            });
            datas50.push({
                x: time,
                y: accountSummary.account_top_amount_50 * 100 / supply_circulating
            });
            categories.push(record_time);
        }

        let minPercentStart = 100;
        for (let i = 0; i < datas10.length; i++) {
            minPercentStart = Math.min(minPercentStart, datas10[i].y);
        }
        minPercentStart = Math.floor(minPercentStart);
        minPercentStart = minPercentStart - minPercentStart % 10;
        return {
            chart: {
                height: this.props.height,
                width: this.props.width,
                type: 'area'
            },
            legend: {
                enabled: false
            },
            xAxis: {
                type: 'category',
                categories,
                labels: {
                    formatter: function () {
                        let date:any = this.value;
                        return  SNBUtils.recordTimeFormat(date, false, "dd. em");
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
                },
                min: minPercentStart
            },
            tooltip: {
                formatter: function() {
                    var html = '<span style="font-size:10px">' + SNBUtils.recordTimeFormat(this.x, false, "ewd, em dd UTC+0") + '</span><br/><table>';
                    if (this.points != null) {
                        for (let index = 0; index < this.points.length; index++) {
                            let point = this.points[index];
                            html += '<tr><td><span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': </td>';
                            html += '<td style="text-align:right;"><b>' +  SNBUtils.numberFormat(point.y, 2) + '%</b><br/></td></tr>';
                        }
                    }
                    html += '</table>';
                    return html;
                },
                shared: true,
                useHTML: true
            },
            series: [{
                type: 'area',
                name: 'Top50',
                data: datas50,
                marker: {
                    enabled: false
                },
                color: 'rgb(138, 135, 255)',
                lineWidth: 1,
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, "rgba(138, 135, 255, 0.3)"],
                        [1, "rgba(138, 135, 255, 0)"]
                    ]
                },
            }, {
                type: 'area',
                name: 'Top20',
                data: datas20,
                marker: {
                    enabled: false
                },
                color: 'rgb(234, 201, 90)',
                lineWidth: 1,
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, "rgba(234, 201, 90, 0.3)"],
                        [1, "rgba(234, 201, 90, 0)"]
                    ]
                },
            }, {
                type: 'area',
                name: 'Top10',
                data: datas10,
                marker: {
                    enabled: false
                },
                color: 'rgb(85, 212, 101)',
                lineWidth: 1,
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, "rgba(85, 212, 101, 0.3)"],
                        [1, "rgba(85, 212, 101, 0)"]
                    ]
                },
            }]
        };
    }

    render() {
        return <div className="page-project-detail-chart-row-item">
            <SolanaDateChart
                tabs = {[{ key: "7D" }, { key: "1M" }, { key: "3M" }]}
                title = {
                    <div className="page-project-detail-chart-title">
                        Top Addressses by balance
                        <Popover placement="right" content={
                            <div className="page-project-detail-chart-tip">
                                Addresses with the highest amount of token holdings.
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