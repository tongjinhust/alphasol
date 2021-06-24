import React from 'react';
import { SelectKeyValue } from "@common/data";
import "./TabPickerInline.scss";

export interface TabPickerInlineProps {
    tabs: SelectKeyValue[],
    selected: string | number,
    onChangeSelect: (item: SelectKeyValue) => void
}

export default class TabPickerInline extends React.Component<TabPickerInlineProps> {

    render() {
        let { tabs, selected, onChangeSelect } = this.props;
        return (
            <div className="ui-tab-picker-inline">
                {
                    tabs.map((item: SelectKeyValue) => {
                        return <div className={ "ui-tab-picker-inline-item " + (selected == item.key ? "active" : "")}
                                    key={ item.key }
                                    onClick= { () => { if (item.key == selected) return; onChangeSelect(item) } }
                                >
                                   { item.label == null ? item.key : item.label }
                               </div>
                    })
                }
            </div>
        );
    }
}