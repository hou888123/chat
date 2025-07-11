import { ConsumptionRecord } from '../utils/SystemResponse';

// 1. 有線圖消費記錄
export const CHART_CONSUMPTION_RECORD: ConsumptionRecord = {
  period: "2025/01/01 ~ 2025/01/31",
  times: 6,
  amount: 9999999999,
  highestDate: "2025/01/01",
  highestAmount: 8000,
  storeName: "消費總金額",
  hasChart: true,
  details: [
    {
      date: "2025/01/10",
      amount: 5024,
      store: "APPLE.COM/BILL",
      cardLastFour: "3489",
      category: "家電/3C通訊"
    },
    {
      date: "2025/01/08",
      amount: 170,
      store: "做憨飲料科技股份有限公司",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/07",
      amount: 2000,
      store: "7-ELEVEN",
      cardLastFour: "3489",
      category: "超市/量販"
    },
    {
      date: "2025/01/05",
      amount: 9050,
      store: "家樂福",
      cardLastFour: "3489",
      category: "超市/量販"
    },
    {
      date: "2025/01/03",
      amount: 8000,
      store: "昇恆昌免稅店",
      cardLastFour: "3489",
      category: "百貨"
    }
  ]
};

// 指定日期消費記錄
export const DATE_CONSUMPTION_RECORD: ConsumptionRecord = {
  period: "2025/01/01",
  times: 999999999,
  amount: 999999999999999,
  highestDate: "",
  highestAmount: 8000,
  storeName: "如果商家的名稱超過30%",
  hasChart: false,
  details: [
    {
      date: "2025/01/01",
      amount: 8000,
      store: "新光三越",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/01",
      amount: 5000,
      store: "SOGO百貨",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/01",
      amount: 4500,
      store: "遠東百貨",
      cardLastFour: "3489",
      category: "百貨公司"
    }
  ]
};

// 一間店面加一折線圖 - 星巴克
export const ONE_STORES_CHART_CONSUMPTION_RECORD: ConsumptionRecord = {
  period: "2025/01/01 ~ 2025/01/31",
  times: 12,
  amount: 18600,
  highestDate: "2025/01/15",
  highestAmount: 3500,
  storeName: "星巴克",
  hasChart: true,
  multipleStores: false, // 只有一間店家，不是多店家模式
  details: [
    {
      date: "2025/01/02",
      amount: 800,
      store: "星巴克",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/05",
      amount: 1200,
      store: "星巴克",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/08",
      amount: 950,
      store: "星巴克",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/10",
      amount: 1800,
      store: "星巴克",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/12",
      amount: 2200,
      store: "星巴克",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/15",
      amount: 3500,
      store: "星巴克",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/18",
      amount: 1500,
      store: "星巴克",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/20",
      amount: 1200,
      store: "星巴克",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/22",
      amount: 950,
      store: "星巴克",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/25",
      amount: 1800,
      store: "星巴克",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/28",
      amount: 1700,
      store: "星巴克",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/30",
      amount: 1000,
      store: "星巴克",
      cardLastFour: "3489",
      category: "餐飲"
    }
  ]
};

// 特店+有折線消費記錄 - 如果商家的名稱超過30%和SOGO百貨
export const TWO_STORES_CHART_CONSUMPTION_RECORD: ConsumptionRecord = {
  period: "2025/01/01 ~ 2025/01/31",
  times: 16,
  amount: 25100,
  highestDate: "2025/01/05",
  highestAmount: 5000,
  storeName: "SOGO百貨、另一間店",
  hasChart: true,
  multipleStores: true,
  twoStoresInfo: [
    {
      storeName: "SOGO百貨",
      times: 8,
      amount: 15700,
      highestDate: "2025/01/05",
      highestAmount: 5000
    },
    {
      storeName: "另一間店",
      times: 8,
      amount: 9400,
      highestDate: "2025/01/09",
      highestAmount: 2400
    }
  ],
  details: [
    {
      date: "2025/01/01",
      amount: 8000,
      store: "另一間店",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/01",
      amount: 0,
      store: "SOGO百貨",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/02",
      amount: 5200,
      store: "另一間店",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/02",
      amount: 0,
      store: "SOGO百貨",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/03",
      amount: 900,
      store: "另一間店",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/03",
      amount: 0,
      store: "SOGO百貨",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/04",
      amount: 1100,
      store: "另一間店",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/04",
      amount: 1000,
      store: "SOGO百貨",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/05",
      amount: 1000,
      store: "另一間店",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/05",
      amount: 5000,
      store: "SOGO百貨",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/06",
      amount: 0,
      store: "另一間店",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/06",
      amount: 5000,
      store: "SOGO百貨",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/07",
      amount: 2000,
      store: "另一間店",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/07",
      amount: 2200,
      store: "SOGO百貨",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/09",
      amount: 2400,
      store: "另一間店",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/01/09",
      amount: 2400,
      store: "SOGO百貨",
      cardLastFour: "3489",
      category: "餐飲"
    }
  ]
};

// 無線圖兩間店消費記錄
export const TWO_STORES_CONSUMPTION_RECORD: ConsumptionRecord = {
  period: "2025/01/01",
  times: 3,
  amount: 25000,
  highestDate: "2025/01/01",
  highestAmount: 10000,
  storeName: "家樂福、全聯",
  hasChart: false,
  multipleStores: true,
  details: [
    {
      date: "2025/01/01",
      amount: 10000,
      store: "家樂福",
      cardLastFour: "3489",
      category: "超市/量販"
    },
    {
      date: "2025/01/01",
      amount: 10000,
      store: "家樂福",
      cardLastFour: "3489",
      category: "超市/量販"
    },
    {
      date: "2025/01/01",
      amount: 10000,
      store: "家樂福",
      cardLastFour: "3489",
      category: "超市/量販"
    },
    {
      date: "2025/01/01",
      amount: 1000,
      store: "全聯",
      cardLastFour: "3489",
      category: "超市/量販"
    },
    {
      date: "2025/01/01",
      amount: 100,
      store: "全聯",
      cardLastFour: "3489",
      category: "超市/量販"
    }
    ,{
      date: "2025/01/01",
      amount: 100,
      store: "全聯",
      cardLastFour: "3489",
      category: "超市/量販"
    },
  ]
};

// 日期區間消費類別消費記錄
export const CATEGORY_CONSUMPTION_RECORD: ConsumptionRecord = {
  period: "2025/01/01 ~ 2025/01/31",
  times: 32,
  amount: 88500,
  highestDate: "2025/01/10",
  highestAmount: 5800,
  storeName: "",
  isCategory: true,
  details: [
    {
      date: "2025/01/01",
      amount: 2300,
      store: "遠東百貨",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/01",
      amount: 2300,
      store: "遠東百貨",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/02",
      amount: 3400,
      store: "新光三越",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/03",
      amount: 4500,
      store: "SOGO百貨",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/04",
      amount: 2800,
      store: "微風廣場",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/05",
      amount: 3600,
      store: "統一時代百貨",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/06",
      amount: 1800,
      store: "京站時尚廣場",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/07",
      amount: 2500,
      store: "環球購物中心",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/08",
      amount: 4200,
      store: "比漾廣場",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/09",
      amount: 3800,
      store: "台茂購物中心",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/10",
      amount: 5800,
      store: "華泰名品城",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/12",
      amount: 2600,
      store: "誠品生活",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/15",
      amount: 4100,
      store: "大葉高島屋",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/17",
      amount: 3200,
      store: "SOGO百貨復興館",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/19",
      amount: 2900,
      store: "遠東百貨信義店",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/21",
      amount: 3700,
      store: "新光三越台北站前店",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/23",
      amount: 4300,
      store: "微風南山",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/25",
      amount: 2400,
      store: "新光三越台北信義店",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/28",
      amount: 3900,
      store: "統一時代百貨台北店",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/30",
      amount: 3100,
      store: "遠東百貨板橋店",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/02",
      amount: 3000,
      store: "聯邦銀行預借現金",
      cardLastFour: "3489",
      category: "預借現金/貸款"
    },
    {
      date: "2025/01/04",
      amount: 5000,
      store: "台新銀行預借現金",
      cardLastFour: "3489",
      category: "預借現金/貸款"
    },
    {
      date: "2025/01/07",
      amount: 2000,
      store: "國泰世華銀行預借現金",
      cardLastFour: "3489",
      category: "預借現金/貸款"
    },
    {
      date: "2025/01/10",
      amount: 4000,
      store: "玉山銀行預借現金",
      cardLastFour: "3489",
      category: "預借現金/貸款"
    },
    {
      date: "2025/01/12",
      amount: 3500,
      store: "花旗銀行預借現金",
      cardLastFour: "3489",
      category: "預借現金/貸款"
    },
    {
      date: "2025/01/15",
      amount: 2500,
      store: "中國信託預借現金",
      cardLastFour: "3489",
      category: "預借現金/貸款"
    },
    {
      date: "2025/01/18",
      amount: 1500,
      store: "富邦銀行預借現金",
      cardLastFour: "3489",
      category: "預借現金/貸款"
    },
    {
      date: "2025/01/20",
      amount: 3000,
      store: "永豐銀行預借現金",
      cardLastFour: "3489",
      category: "預借現金/貸款"
    },
    {
      date: "2025/01/22",
      amount: 2000,
      store: "星展銀行預借現金",
      cardLastFour: "3489",
      category: "預借現金/貸款"
    },
    {
      date: "2025/01/25",
      amount: 1800,
      store: "第一銀行預借現金",
      cardLastFour: "3489",
      category: "預借現金/貸款"
    },
    {
      date: "2025/01/27",
      amount: 2200,
      store: "滙豐銀行預借現金",
      cardLastFour: "3489",
      category: "預借現金/貸款"
    },
    {
      date: "2025/01/29",
      amount: 3200,
      store: "台北富邦銀行預借現金",
      cardLastFour: "3489",
      category: "預借現金/貸款"
    },
    {
      date: "2025/01/31",
      amount: 2400,
      store: "凱基銀行預借現金",
      cardLastFour: "3489",
      category: "預借現金/貸款"
    }
  ]
};

// 負值餅圖消費記錄
export const NEGATIVE_PIE_CONSUMPTION_RECORD: ConsumptionRecord = {
  period: "2025/01/01 ~ 2025/01/31",
  times: 6,
  amount: -14000,
  highestDate: "2025/01/15",
  highestAmount: -1500,
  storeName: "",
  isCategory: true,
  hasNegativePie: true,  // 標記為負值餅圖
  details: [
    {
      date: "2025/01/15",
      amount: -4000,
      store: "百貨公司退款",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/15",
      amount: -4000,
      store: "百貨公司退款",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/12",
      amount: -2500,
      store: "預借現金/貸款退款",
      cardLastFour: "3489",
      category: "預借現金/貸款"
    },
    {
      date: "2025/01/10",
      amount: -1500,
      store: "分期退款",
      cardLastFour: "3489",
      category: "分期"
    },
    {
      date: "2025/01/08",
      amount: -1200,
      store: "市區停車費退款",
      cardLastFour: "3489",
      category: "市區停車費"
    },
    {
      date: "2025/01/05",
      amount: -800,
      store: "郵購/保險退款",
      cardLastFour: "3489",
      category: "郵購/保險"
    }
  ]
}; 

// 最高消費記錄
export const HIGHEST_CONSUMPTION_RECORD: ConsumptionRecord = {
  period: "2025/01/01 ~ 2025/01/31",
  times: 1,
  amount: 15000,
  highestDate: "2025/01/10",
  highestAmount: 15000,
  storeName: "如果商家的字數真的非常的多的話，在畫面上就會折行顯示",
  isHighest: true,
  details: [
    {
      date: "2025/01/10",
      amount: 15000,
      store: "如果商家的字數真的非常的多的話，在畫面上就會折行顯示",
      cardLastFour: "3489",
      category: "超市/量販"
    }
  ]
};

// 時間區段+金額
export const AMOUNT_COUNT_CONSUMPTION_RECORD: ConsumptionRecord = {
  period: "2025/01/01 ~ 2025/03/31",
  times: 25,
  amount: 135000,
  highestDate: "2025/02/15",
  highestAmount: 9500,
  storeName: "",
  details: [
    {
      date: "2025/02/15",
      amount: 9500,
      store: "全家便利商店",
      cardLastFour: "3489",
      category: "便利商店"
    },
    {
      date: "2025/02/10",
      amount: 7500,
      store: "家樂福",
      cardLastFour: "3489",
      category: "超市/量販"
    },
    {
      date: "2025/01/25",
      amount: 6500,
      store: "好市多",
      cardLastFour: "3489",
      category: "超市/量販"
    },
    {
      date: "2025/01/15",
      amount: 7800,
      store: "新光三越",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/05",
      amount: 5200,
      store: "遠東百貨",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/08",
      amount: 4500,
      store: "微風廣場",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/12",
      amount: 3800,
      store: "SOGO百貨",
      cardLastFour: "3489",
      category: "百貨公司"
    },
    {
      date: "2025/01/18",
      amount: 6200,
      store: "大潤發",
      cardLastFour: "3489",
      category: "超市/量販"
    },
    {
      date: "2025/01/22",
      amount: 4800,
      store: "愛買",
      cardLastFour: "3489",
      category: "超市/量販"
    },
    {
      date: "2025/01/28",
      amount: 5300,
      store: "特力屋",
      cardLastFour: "3489",
      category: "居家用品"
    },
    {
      date: "2025/02/01",
      amount: 7200,
      store: "Apple Store",
      cardLastFour: "3489",
      category: "家電/3C通訊"
    },
    {
      date: "2025/02/05",
      amount: 8700,
      store: "燦坤",
      cardLastFour: "3489",
      category: "家電/3C通訊"
    },
    {
      date: "2025/02/18",
      amount: 4100,
      store: "蝦皮購物",
      cardLastFour: "3489",
      category: "家電/3C通訊"
    },
    {
      date: "2025/02/23",
      amount: 3300,
      store: "UNIQLO",
      cardLastFour: "3489",
      category: "服飾/鞋/精品"
    },
    {
      date: "2025/02/27",
      amount: 5800,
      store: "無印良品",
      cardLastFour: "3489",
      category: "服飾/鞋/精品"
    },
    {
      date: "2025/03/03",
      amount: 6900,
      store: "ZARA",
      cardLastFour: "3489",
      category: "服飾/鞋/精品"
    },
    {
      date: "2025/03/08",
      amount: 7300,
      store: "博客來",
      cardLastFour: "3489",
      category: "書籍/文具"
    },
    {
      date: "2025/03/12",
      amount: 4200,
      store: "星巴克",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/03/16",
      amount: 5500,
      store: "鼎泰豐",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/03/20",
      amount: 6100,
      store: "欣葉日本料理",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/03/23",
      amount: 5700,
      store: "王品牛排",
      cardLastFour: "3489",
      category: "餐飲"
    },
    {
      date: "2025/03/26",
      amount: 4900,
      store: "台灣大哥大",
      cardLastFour: "3489",
      category: "家電/3C通訊"
    },
    {
      date: "2025/03/28",
      amount: 3600,
      store: "金石堂書店",
      cardLastFour: "3489",
      category: "書籍/文具"
    },
    {
      date: "2025/03/30",
      amount: 5100,
      store: "誠品書店",
      cardLastFour: "3489",
      category: "書籍/文具"
    },
    {
      date: "2025/03/31",
      amount: 4700,
      store: "全國電子",
      cardLastFour: "3489",
      category: "家電/3C通訊"
    }
  ]
};

// 查無資訊消費記錄
export const NO_DATA_CONSUMPTION_RECORD: ConsumptionRecord = {
  period: "2025/01/01 ~ 2025/01/31",
  times: 0,
  amount: 0,
  highestDate: "",
  highestAmount: 0,
  storeName: "",
  noData: true,
  details: []
};
