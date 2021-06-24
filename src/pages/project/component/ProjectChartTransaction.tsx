import React from 'react';
import Highcharts from 'highcharts'
import SolanaDateChart from '@component/SolanaDateChart';
import SNBUtils from '@common/SNBUtils';
import { Popover } from 'antd';

export interface ProjectChartTransactionProps {
    projectId: string,
    projectHistory: any | boolean,
    width: number,
    height: number
}

export default class ProjectChartTransaction extends React.Component<ProjectChartTransactionProps> {
    constructor(props: ProjectChartTransactionProps) {
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

        let data10k:any = [];
        let data100k:any = [];
        let categories: string[] = [];
        for (let i = projectHistory.length - 1; i >= 0; i--) {
            let { time, tradeSummary } = projectHistory[i];
            let record_time = SNBUtils.recordTimeFormat(time, true, "dd. em");
            data10k.push({
                x: time,
                y: tradeSummary.change_amountusd_count_10k
            });
            data100k.push({
                x: time,
                y: tradeSummary.change_amountusd_count_100k
            });
            categories.push(record_time);
        }
        return {
            chart: {
                height: this.props.height,
                width: this.props.width
            },
            legend: {
                enabled: false
            },
            xAxis: {
                type: "category",
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
                }
            },
            tooltip: {
                formatter: function() {
                    var html = '<span style="font-size:10px">' + SNBUtils.recordTimeFormat(this.x, false, "ewd, em dd UTC+0") + '</span><br/><table>';
                    if (this.points != null) {
                        for (let index = 0; index < this.points.length; index++) {
                            let point = this.points[index];
                            html += '<tr><td><span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': </td>';
                            html += '<td style="text-align:right;"><b>' +  SNBUtils.numberFormat(point.y) + ' txs</b><br/></td></tr>';
                        }
                    }
                    html += '</table>';
                    return html;
                },
                shared: true,
                useHTML: true
            },
            series: [{
                type: "line",
                name: '$10K+',
                data: data10k,
                color: '#FF9C66',
                marker: {
                    enabled: false
                }
            }, {
                type: "line",
                name: '$100K+',
                data: data100k,
                color: '#F45E53',
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
                            Large-sum Transaction
                            <Popover placement="right" content={
                                <div className="page-project-detail-chart-tip">
                                    Transactions Greater than $10K/ $100K.
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