import React from 'react';
import Highcharts from 'highcharts'
import SolanaDateChart from '@component/SolanaDateChart';
import SNBUtils from '@common/SNBUtils';
import { Popover } from 'antd';

export interface ProjectChartAccountProps {
    projectId: string,
    projectHistory: any | boolean,
    width: number,
    height: number
}

export default class ProjectChartAccount extends React.Component<ProjectChartAccountProps> {
    constructor(props: ProjectChartAccountProps) {
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
        // let projectHistoryRes = await SNBUtils.fetchJson("/api/project/history?address=" + this.props.projectId);
        // let projectHistory = projectHistoryRes.data;
        // if (projectHistory == null) return null;

        let count_total:any = [];
        let count_new:any = [];
        let count_active:any = [];
        let account_token_value_100_count:any = [];
        let categories: string[] = [];
        for (let i = 0; i <= projectHistory.length - 1; i++) {
            let { time, accountSummary } = projectHistory[i];
            let record_time = SNBUtils.recordTimeFormat(time, false, "dd. em");
            count_total.push({
                x: time,
                y: accountSummary.count_total
            });
            count_new.push({
                x: time,
                y: accountSummary.count_new
            });
            count_active.push({
                x: time,
                y: accountSummary.count_active
            });
            account_token_value_100_count.push({
                x: time,
                y: accountSummary.account_token_value_100_count
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
                            html += '<td style="text-align:right;"><b>' +  SNBUtils.numberFormat(point.y) + '</b><br/></td></tr>';
                        }
                    }
                    html += '</table>';
                    return html;
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
                name: 'Total Address',
                data: count_total,
                marker: {
                    enabled: false
                }
            }, {
                type: 'line',
                name: 'Contributed Address',
                data: account_token_value_100_count,
                marker: {
                    enabled: false
                }
            }, {
                type: 'line',
                name: 'Activity Address',
                data: count_active,
                marker: {
                    enabled: false
                }
            }, {
                type: 'line',
                name: 'New Address',
                data: count_new,
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
                            Addresses
                            <Popover placement="right" content={
                                <div className="page-project-detail-chart-tip">
                                    <span>Total Addr:</span>Total number of unique addresses in the project.<br />
                                    <span>New Addr:</span>Number of new addresses in the project. <br />
                                    <span>Activity Addr:</span>The number of wallet addresses that generate transactions within 24 hours.<br />
                                    <span>Contributed Addr:</span>The number of wallet addresses with a token balance value greater than or equal to 100 USD. 
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