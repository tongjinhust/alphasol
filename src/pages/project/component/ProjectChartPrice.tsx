import React from 'react';
import Highcharts from 'highcharts'
import SolanaDateChart from '@component/SolanaDateChart';
import SNBUtils from '@common/SNBUtils';
import { SERVER_URL } from '@common/const';

export interface ProjectChartPriceProps {
    projectId: string,
    width: number,
    height: number
}

export default class ProjectChartPrice extends React.Component<ProjectChartPriceProps> {
    constructor(props: ProjectChartPriceProps) {
        super(props);
        this.getChartOptions = this.getChartOptions.bind(this);
    }

    async getChartOptions(key: string | number):Promise<Highcharts.Options | null> {
        let resp = await SNBUtils.fetchJson(SERVER_URL + "/api/project/priceHistory?address=" + this.props.projectId + "&pageSize=288");
        if (resp.data == null) return null;
        let datas = [];
        for (let i = resp.data.length - 1; i >= 0; i--) {
            let dataItem = resp.data[i];
            let time = SNBUtils.recordTimeToDate(dataItem.record_time, true).getTime();
            if (!(dataItem.tokeninfo.price > 0)) {
                continue;
            }
            datas.push([time, dataItem.tokeninfo.price]);
        }
        return {
            chart: {
                height: this.props.height,
                width: this.props.width
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    formatter: function () {
                        return '$' + this.value;
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
                            let point = this.points[0];
                            html += '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ": <b>$" +  SNBUtils.numberFormat(point.y, point.y > 1 ? 2 : 6) + '</b>';
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
                name: 'Price',
                data: datas,
                color: "#79D7C4",
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
                    title = {"Price"}
                    chartOptionFetcher = { this.getChartOptions }
                />
            </div>
    }
}