export const topCountryBarChartOptions = () => {
    const chartOptions = {
        chart: { type: "bar", height: 400, fontFamily: "inherit", toolbar: { show: !1 } },
        legend: { show: !1 },
        series: [{ name: "Visitors", data: [87, 82, 68, 49, 41] }],
        colors: ["#4BAA55", "#7ED957", "#35873e", "#B7E5B4", "#283c50"],
        grid: { strokeDashArray: 4, position: "back", xaxis: { lines: { show: !0 } }, yaxis: { lines: { show: !1 } } },
        plotOptions: {
            bar: {
                columnWidth: "15%",
                horizontal: !1,
                distributed: !0,
                borderRadius: 6,
                borderRadiusApplication: "end",
                dataLabels: {
                    position: "top"
                }
            }
        },
        labels: { show: !1 },
        dataLabels: { enabled: !1 },
        stroke: { show: !1 },
        xaxis: { categories: ["Karachi", "Lahore", "Islamabad" , "Faisalabad", "Rawalpindi"], axisTicks: { show: !0 }, axisBorder: { show: !1 } },
        yaxis: { labels: { show: !0 }, axisTicks: { show: !1 }, axisBorder: { show: !1 } },
        tooltip: {
            y: {
                formatter: function (e) {
                    return e + "k";
                },
            },
        },
    }
    return chartOptions
}