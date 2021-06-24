export interface ActiveAirDrop {
    _id: number,
    type: "NEWS",
    date_time: number,
    title: string,
    airdrop_info: {
        icon: string,
        symbol: string | null,
        date_start: number,
        date_end: number | null,
        amount: number | null,
        brief: string,
        guide: string
    }
}

export interface ActiveNews {
    _id: number,
    type: "NEWS",
    date_time: number,
    title: string,
    href: string
}

export type ActivityItem = ActiveAirDrop | ActiveNews;