import React, { ReactNode } from 'react';
import Highcharts from 'highcharts'
import { RadioChangeEvent } from 'antd';
import { SelectKeyValue } from "@common/data";
import SolanaChart from './SolanaChart';
import "./SolanaDateChart.scss";

export interface SolanaDateChartProps {
    tabs: SelectKeyValue[],
    title: ReactNode,
    desc?: string,
    chartOptionFetcher: (selectedKey: string|number) => Promise<Highcharts.Options | null>;
}

export default class SolanaDateChart extends React.Component<SolanaDateChartProps> {
    state: {
        selectedKey: string|number,
        chartLoaded: boolean,
        chartOptions: Highcharts.Options | null,
    }

    constructor(props: SolanaDateChartProps) {
        super(props);
        this.state = {
            selectedKey: props.tabs[0] == null ? "" : props.tabs[0].key,
            chartLoaded: false,
            chartOptions: null
        }
        this._handleDateChange = this._handleDateChange.bind(this);
        this._refreshChart(this.state.selectedKey);
    }

    _handleDateChange(event: RadioChangeEvent) {
        let selectedKey = event.target.value;
        if (this.state.selectedKey == selectedKey) return;
        this.setState({
            selectedKey,
            chartLoaded: false,
            chartOptions: null
        });
        this._refreshChart(selectedKey);
    }

    async _refreshChart(selectedKey: number|string) {
        let options = await this.props.chartOptionFetcher(selectedKey);
        if (selectedKey != this.state.selectedKey) return;
        this.setState({
            chartLoaded: true,
            chartOptions: options
        })
    }

    render() {
        let { selectedKey, chartLoaded, chartOptions } = this.state;
        let { tabs, title, desc } = this.props;
        return <div className="ui-solanadatechart">
            <div className="ui-solanadatechart-header">
                <div className="ui-solanadatechart-header-left">
                    <div className="ui-solanadatechart-header-title">{ title }</div>
                    { desc != null && <div className="ui-solanadatechart-header-desc">{ desc }</div>}
                </div>
                {/* <div className="ui-solanadatechart-header-right">
                    <Radio.Group value={ selectedKey } onChange={this._handleDateChange}>
                        {
                            tabs.map((tab) => <Radio.Button key={ tab.key } value={ tab.key }>{ tab.label == null ? tab.key : tab.label }</Radio.Button>)
                        }
                    </Radio.Group>
                </div> */}
            </div>
            <div className="ui-solanadatechart-content">
                <SolanaChart loaded={ chartLoaded } options={ chartOptions } />
            </div>
        </div>;
    }
}