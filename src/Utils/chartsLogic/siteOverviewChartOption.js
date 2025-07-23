export const siteOverviewChartOption = (colors, series) => {
    const chartOptions = {
        chart: {
            type: "area",
            height: 80,
            sparkline: {
                enabled: !0
            }
        },
        series: [series],
        stroke: {
            width: 1,
            curve: "smooth"
        },
        fill: {
            opacity: [0.85, 0.25, 1, 1],
            gradient: {
                inverseColors: !1,
                shade: "light",
                type: "vertical",
                opacityFrom: 0.5,
                opacityTo: 0.1,
                stops: [0, 100, 100, 100]
            }
        },
        xaxis: {
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false },
        },
        yaxis: {
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
        },
        grid: {
        show: false,
        padding: { left: 0, right: 0, top: 0, bottom: 0 },
        },
        colors
    }
    return chartOptions
}
