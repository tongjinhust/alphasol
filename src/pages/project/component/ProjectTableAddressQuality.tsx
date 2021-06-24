import React, { ReactNode } from 'react';
import SNBUtils from '@common/SNBUtils';
import "./ProjectTableAddressQuality.scss";
import { Result, Spin } from 'antd';
import TabPickerInline from '@component/TabPickerInline';
import { SelectKeyValue } from '@common/data';
import { SERVER_URL } from '@common/const';

export interface ProjectTableAddressQualityProps {
    projectId: string,
}

export default class ProjectTableAddressQuality extends React.Component<ProjectTableAddressQualityProps> {
    state: {
        loaded: boolean,
        pagedata: any | null
        selectedTypeTab: "active"|"new"
    }

    constructor(props: ProjectTableAddressQualityProps) {
        super(props);
        this.state = {
            loaded: true,
            pagedata: null,
            selectedTypeTab: "active"
        }
        this.fetchBaseInfo();
        this.onTypeSelectChange = this.onTypeSelectChange.bind(this);
    }

    async fetchBaseInfo() {
        let resp = await SNBUtils.fetchJson(SERVER_URL + "/api/project/retention?address=" + this.props.projectId);
        this.setState({
            loaded: false,
            pagedata: resp.data
        })
    }

    onTypeSelectChange(item: SelectKeyValue) {
        this.setState({
            selectedTypeTab: item.key
        })
    }

    getDayList() {
        let tdLen = 7;
        let selectedTypeTab = this.state.selectedTypeTab;
        let dataLen = this.state.pagedata.length;
        let trList:ReactNode[] = [];
        for (let index = Math.max(0, dataLen - tdLen); index < dataLen; index++) {
            let item = this.state.pagedata[index];
            let tdList:ReactNode[] = [];
            let currentCount = selectedTypeTab == "active" ? item.count_active : item.count_new;
            for (let dayIndex = 0; dayIndex < tdLen; dayIndex++) {
                let itemDay = item.keep_active_list[dayIndex];
                let valDay = itemDay == null ? 0 : (selectedTypeTab == "active" ? itemDay.link_active_active : itemDay.link_new_active);
                let percent = SNBUtils.numberFormat(valDay * 100 / (currentCount == 0 ? 1 : currentCount));
                tdList.push(<td key={"line_" + item.time + "_" + dayIndex} style={{ background: "rgba(189, 239, 219, 0." + percent + ")" }}>{ percent } %</td>);
            }
            trList.push(
                    <tr key={ "line_" + item.time }>
                        <td>{SNBUtils.recordTimeFormat(item.time, false, "dd em, yy") }</td>
                        <td>{ SNBUtils.numberFormat(currentCount) }</td>
                        { tdList }
                    </tr>
                )
        }
        return trList;
    }

    render() {
        let { loaded, pagedata, selectedTypeTab } = this.state;
        if (loaded == true) {
            return <div className="m-page-holder"><Spin size="large" /></div>
        } else if (pagedata == null) {
            return <div className="m-page-holder"><Result title="Project Not Found，Server Busy！"/></div>;
        }

        let typeLabel = selectedTypeTab == "active" ? "Activity address" : "New address";
        return <div className="page-project-detail-addressquality">
                    <div className="page-project-detail-addressquality-typeline">
                        <TabPickerInline
                            tabs={
                                [
                                    {key: "new", label: "New address retention"},
                                    {key: "active", label: "Active address retention"},
                                ]}
                            selected={ selectedTypeTab }
                            onChangeSelect={ this.onTypeSelectChange }
                        />
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>{ typeLabel }</th>
                                <th>D1</th>
                                <th>D2</th>
                                <th>D3</th>
                                <th>D4</th>
                                <th>D5</th>
                                <th>D6</th>
                                <th>D7</th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.getDayList() }
                        </tbody>
                    </table>
               </div>
    }
}