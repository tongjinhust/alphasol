import React from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official';
import { Button, Result, Spin } from "antd";

let globalOptions: any = {
    useUTC: false
};

//初始化chart的基本信息
Highcharts.setOptions({
    global: globalOptions,
    chart: {
        backgroundColor: "transparent"
    },
    credits: {
        enabled: false
    },
    title: {
        text: ""
    },
    colors: ["#729AE8", "#F8CB49", "#B8D0DF", "#EF8A46", "#E35857", "#7B80EC", "#7FB800", "#4E8BAE", "#6C8CA2", "#40A176"],
    xAxis: {
        tickLength: 0,
        labels: {
            style: {
                color: "#FFFFFF"
            }
        },
        lineColor: "rgb(19, 55, 82)"
    },
    yAxis: {
        gridLineColor: "rgb(19, 55, 82)",
        gridLineWidth: 1,
        labels: {
            style: {
                color: "#FFFFFF"
            }
        }
    }
});

export interface SolanaChartProps {
    loaded: boolean;
    options: Highcharts.Options | null
}

export default class SolanaChart extends React.Component<SolanaChartProps> {
    render() {
        let { options, loaded } = this.props;
        if (loaded != true) {
            return <Spin tip="Loading..."></Spin>;
        }
        if (loaded == true && options == null) {
            return <Result
                        status="warning"
                        title="There are some problems with your operation."
                        extra={
                            <Button type="primary">Reload</Button>
                        }
                    />;
        }
        return (
            <HighchartsReact 
                highcharts={Highcharts}
                options={options}
            />
        );
    }
}