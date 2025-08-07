import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
import axios from "axios";

const ApexChart4 = () => {
	const [state, setState] = React.useState({
		series: [{
			name: 'IMPP (A)',
			data: []
		}],
		options: {
			chart: {
				id: 'area-datetime4',
				type: 'area',
				height: 350,
				zoom: {
					autoScaleYaxis: true
				}
			},
			colors: ['#FF6B6B'],
			annotations: {
				yaxis: [{
					y: 8,
					borderColor: '#999',
					label: {
						show: true,
						text: 'Support',
						style: {
							color: "#fff",
							background: '#00E396'
						}
					}
				}],
				xaxis: [{
					x: new Date('14 Nov 2012').getTime(),
					borderColor: '#999',
					yAxisIndex: 0,
					label: {
						show: true,
						text: 'Rally',
						style: {
							color: "#fff",
							background: '#775DD0'
						}
					}
				}]
			},
			dataLabels: {
				enabled: false
			},
			markers: {
				size: 0,
				style: 'hollow',
			},
			xaxis: {
				type: 'datetime',
				min: new Date('05 May 2024').getTime(),
				tickAmount: 6,
			},
			yaxis: {
				labels: {
					formatter: function (value) {
						return value.toFixed(0);
					}
				}
			},
						tooltip: {
			x: {
				format: 'dd MMM yyyy HH:MM'
			},
			y: {
				formatter: function (value) {
					return value.toFixed(1) + ' A';
				}
			},
			style: {
				fontSize: '16px'
			}
			},
			fill: {
				type: 'gradient',
				gradient: {
					shadeIntensity: 1,
					opacityFrom: 0.7,
					opacityTo: 0.9,
					stops: [0, 100]
				}
			},
		},
		selection: 'one_day',
	});

	useEffect(() => {
		axios.get("http://0.0.0.0:8000/")
			.then((response) => {
				const fetchedData = response.data;
				const [Isc_mod, Voc_mod, Vmpp_vec, Impp_vec, mpp_vec, T_K] = fetchedData;
				setState(prev => ({
					...prev,
					series: [{
						name: 'IMPP (A)',
						data: Impp_vec
					}]
				}));
				
				// Apply initial zoom to 1D view after data is loaded
				setTimeout(() => {
					ApexCharts.exec(
						'area-datetime4',
						'zoomX',
						new Date('03 May 2024').getTime(),
						new Date('04 May 2024').getTime()
					);
				}, 100);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	}, []);

	const updateData = (timeline) => {
		setState(prev => ({
			...prev,
			selection: timeline
		}));

		const chartId = 'area-datetime4';
		
		switch (timeline) {
			case 'one_day':
				ApexCharts.exec(
					chartId,
					'zoomX',
					new Date('03 May 2024').getTime(),
					new Date('04 May 2024').getTime()
				);
				break;
			case 'one_month':
				ApexCharts.exec(
					chartId,
					'zoomX',
					new Date('01 Jan 2024').getTime(),
					new Date('01 Feb 2024').getTime()
				);
				break;
			case 'six_months':
				ApexCharts.exec(
					chartId,
					'zoomX',
					new Date('01 Jul 2024').getTime(),
					new Date('01 Jan 2025').getTime()
				);
				break;
			case 'one_year':
				ApexCharts.exec(
					chartId,
					'zoomX',
					new Date('01 Jan 2024').getTime(),
					new Date('01 Jan 2025').getTime()
				);
				break;
			case 'ytd':
				ApexCharts.exec(
					chartId,
					'zoomX',
					new Date('01 Jan 2024').getTime(),
					new Date('31 Dec 2024').getTime()
				);
				break;
			case 'all':
				ApexCharts.exec(
					chartId,
					'zoomX',
					new Date('01 Jan 2024').getTime(),
					new Date('31 Dec 2024').getTime()
				);
				break;
			default:
		}
	};

	return (
		<div>
			<div id="chart4">
				<div className="toolbar">
					<button id="one_day4"
						onClick={() => updateData('one_day')} 
						className={(state.selection === 'one_day' ? 'active' : '')}>
						1D
					</button>
					
					<button id="one_month4"
						onClick={() => updateData('one_month')} 
						className={(state.selection === 'one_month' ? 'active' : '')}>
						1M
					</button>
					
					<button id="six_months4"
						onClick={() => updateData('six_months')} 
						className={(state.selection === 'six_months' ? 'active' : '')}>
						6M
					</button>
					
					<button id="one_year4"
						onClick={() => updateData('one_year')} 
						className={(state.selection === 'one_year' ? 'active' : '')}>
						1Y
					</button>
					
					<button id="ytd4"
						onClick={() => updateData('ytd')} 
						className={(state.selection === 'ytd' ? 'active' : '')}>
						YTD
					</button>
					
					<button id="all4"
						onClick={() => updateData('all')} 
						className={(state.selection === 'all' ? 'active' : '')}>
						ALL
					</button>
				</div>
				
				<div id="chart-timeline4">
					<ReactApexChart 
						options={state.options} 
						series={state.series} 
						type="area" 
						height={350} 
					/>
				</div>
			</div>
			<div id="html-dist4"></div>
		</div>
	);
};

export default ApexChart4; 