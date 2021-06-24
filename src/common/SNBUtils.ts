import sa from 'superagent';
import { MonthArr, WeekDayFullArr } from './const';

export default class SNBUtils {
    public static async sleep(duration: number) {
        let promise = new Promise<any>(function (resolve: any) {
            setTimeout(function () {
                resolve(null);
            }, duration);
        });
        return promise.then(function (result: any) {
            return result;
        });
    }

    public static async fetchJson(url: string, method?: string, senddata?: any, opt_headers?: any): Promise<any> {
        let result = await SNBUtils.asyncFetch(url, method, senddata, opt_headers);
        if (result.value != null) {
            let resp = null;
            try {
                resp = JSON.parse(result.value);
            } catch (ex) {
                console.log(resp);
            }
            if (resp == null || typeof resp != 'object') {
                return { msg: 'JSON解析错误', data: null };
            }
            return resp;
        }
        return result;
    }

    public static async asyncFetch(url: string, method?: string, senddata?: any, opt_headers?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let endfun = function (err:any, res:any) {
                if (res != null && res.text != null) {
                    resolve({ value: res.text });
                    return;
                }
                resolve({ msg: '网络错误', value: null });
            };
            let fetcher;
            if (method != null && method.toUpperCase() === 'POST') {
                fetcher = sa.post(url);
            } else if (method != null && method.toUpperCase() === 'PATCH') {
                fetcher = sa.patch(url);
            } else if (method != null && method.toUpperCase() === 'PUT') {
                fetcher = sa.put(url);
            } else if (method != null && method.toUpperCase() === 'DELETE') {
                fetcher = sa.delete(url);
            } else {
                fetcher = sa.get(url)
            }
            if (opt_headers != null) {
                for (var key in opt_headers) {
                    fetcher.set(key, opt_headers[key]);
                }
            }
            if (senddata != null) {
                fetcher.send(senddata).end(endfun);
            } else {
                fetcher.end(endfun);
            }
        });
    }

    /**
     * 获取整型时间数字
     * @param timestamp 不传时默认为当前时间
     * @param opt_format 不传时默认yymmddhhiiss,结果如20200912120657
     */
     public static getRecordTime(timestamp?: number | null, opt_format?: string) {
        return parseInt(SNBUtils.dateFormat(timestamp == null ? null : timestamp, opt_format == null ? 'yymmddhhiiss' : opt_format));
    }

    /**
     * 整型时间转date，默认0补全后面的详细数据，如：20200901自动补全为 2020-09-01 00:00:00
     * @param timestamp 传入字符串时间，如202009011208
     */
     public static recordTimeToDate(recordTime: number, addOffset: boolean) {
        let timeStr = recordTime + "";
        let date = new Date();
        if (timeStr.length == 14) {
            date = new Date(timeStr.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6'));
        } else if (timeStr.length == 12) {
            date = new Date(timeStr.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:00'));
        } else if (timeStr.length == 10) {
            date = new Date(timeStr.replace(/(\d{4})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:00:00'));
        } else if (timeStr.length == 8) {
            date = new Date(timeStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3 00:00:00'));
        }
        var localOffset = 0;
        if (addOffset == true) {
            localOffset = 28800000 + date.getTimezoneOffset() * 60000;
        }
        return new Date(date.getTime() - localOffset);
    }

    /**
     * 整型时间转date，默认0补全后面的详细数据，如：20200901自动补全为 2020-09-01 00:00:00
     * @param timestamp 传入字符串时间，如202009011208
     */
     public static recordTimeFormat(recordTime: number, addOffset: boolean, opt_format?: string) {
        return SNBUtils.dateFormat(SNBUtils.recordTimeToDate(recordTime, addOffset).getTime(), opt_format);
    }

    /**
     * 时间格式化
     * @param timestamp 时间戳，单位秒，不传默认认为当前时间
     * @param opt_format 字符串format，替换标识：yy年，mm月，dd日，hh时，ii分，ss秒，ww星期几
     */
    public static dateFormat(timestamp: number | null, opt_format?: string) {
        var rdate: null | Date = null;
        if (timestamp == null) {
            rdate = new Date();
        } else {
            rdate = new Date(timestamp);
        }
        var y, m, d, h, i, s, day, ms;
        y = rdate.getFullYear();
        m = rdate.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        d = rdate.getDate() < 10 ? "0" + rdate.getDate() : rdate.getDate();
        h = rdate.getHours() < 10 ? "0" + rdate.getHours() : rdate.getHours();
        i = rdate.getMinutes() < 10 ? "0" + rdate.getMinutes() : rdate.getMinutes();
        s = rdate.getSeconds() < 10 ? "0" + rdate.getSeconds() : rdate.getSeconds();
        ms = SNBUtils.fillNumStr(rdate.getMilliseconds(), 3);
        day = rdate.getDay();
        var dayarr = ["日", "一", "二", "三", "四", "五", "六"];
        if (opt_format == null) {
            return y + "-" + m + "-" + d + " " + h + ":" + i + ":" + s;
        }
        return opt_format.replace('yy', y + '').replace('mm', m + '').replace('dd', d + '')
            .replace('hh', h + '').replace('ii', i + '').replace('ss', s + '').replace('ww', dayarr[day])
            .replace('ms', ms)
            .replace('em', MonthArr[parseInt(m + "")])
            .replace('ewd', WeekDayFullArr[day]);
    }

    public static fillNumStr(value: number, maxLen: number) {
        let numStr = value + "";
        let valLen = numStr.length;
        for (let i = (maxLen - valLen - 1); i >= 0; i--) {
            numStr = "0" + numStr;
        }
        return numStr;
    }

    public static numberFormat(value: number, decimal: number = 0) {
        let valueStr = value + "";
        let pieces = valueStr.split(".");
        let intValueStr = pieces[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        if (decimal > 0 && pieces[1] != null) {
            return intValueStr + "." + pieces[1].substring(0, decimal);
        }
        return intValueStr;
    }
}