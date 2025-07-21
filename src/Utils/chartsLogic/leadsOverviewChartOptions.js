export const leadsOverviewChartOptions = {
    dataLabels: {
        enabled: !1
    },
    series: [20, 15, 10, 18],
    labels: ["Facebook", "Instagram", "Twitter", "other",],
    colors: ["#3454d1", "#FACC15", "#EA4D4D", "#1e88e5",],
    stroke: {
        width: 0, lineCap: "round"
    },
    legend: {
        show: !1,
        position: "bottom",
        fontFamily: "Inter",
        fontWeight: 500,
        labels: {
            colors: "#A0ACBB", fontFamily: "Inter"
        },
        markers: {
            width: 10, height: 10
        },
        itemMargin: {
            horizontal: 20, vertical: 5
        }
    },
    plotOptions: {
        pie: {
            donut: {
                size: "85%",
                labels: {
                    show: !1,
                    name: {
                        show: !1, fontSize: "16px", colors: "#A0ACBB", fontFamily: "Inter"
                    },
                    value: {
                        show: !1, fontSize: "30px", fontFamily: "Inter", color: "#A0ACBB", formatter: function (e) {
                            return e
                        }
                    }
                }
            }
        }
    },
    responsive: [{
        breakpoint: 380,
        options: {
            chart: {
                width: 280
            },
            legend: {
                show: !1
            }
        }
    }
    ],
    tooltip: {
        y: {
            formatter: function (e) {
                return +e + "K"
            }
        },
        style: {
            colors: "#A0ACBB", fontFamily: "Inter"
        }
    }
}